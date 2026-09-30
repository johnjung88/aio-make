-- Candidate only. Back up and compare live schema before approval and application.
-- Keep existing leads, inquiries, conversations and portfolios intact.
BEGIN;
CREATE TABLE IF NOT EXISTS public.website_entries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 type text NOT NULL CHECK (type IN ('reference','insight')),
 division text NOT NULL CHECK (division IN ('marketing','development','video')),
 service text NOT NULL, slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text NOT NULL, summary text NOT NULL DEFAULT '', body text NOT NULL DEFAULT '',
 cover_url text NOT NULL DEFAULT '', video_url text NOT NULL DEFAULT '',
 kind text NOT NULL DEFAULT 'example' CHECK (kind IN ('case','example')),
 rights_confirmed boolean NOT NULL DEFAULT false,
 is_published boolean NOT NULL DEFAULT false, is_featured boolean NOT NULL DEFAULT false,
 display_order integer NOT NULL DEFAULT 0 CHECK (display_order BETWEEN 0 AND 9999),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(type,division,slug), CHECK (NOT is_published OR rights_confirmed)
);
CREATE INDEX IF NOT EXISTS website_entries_public ON public.website_entries(type,division,display_order,created_at DESC) WHERE is_published AND rights_confirmed;
ALTER TABLE public.website_entries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.website_entries FROM anon,authenticated;
GRANT SELECT ON public.website_entries TO anon,authenticated;
DROP POLICY IF EXISTS website_entries_read ON public.website_entries;
CREATE POLICY website_entries_read ON public.website_entries FOR SELECT TO anon,authenticated USING (is_published AND rights_confirmed);
GRANT ALL ON public.website_entries TO service_role;
CREATE TABLE IF NOT EXISTS public.website_rate_limits (
 key text PRIMARY KEY, hits integer NOT NULL, resets_at timestamptz NOT NULL
);
ALTER TABLE public.website_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.website_rate_limits FROM anon,authenticated;
GRANT ALL ON public.website_rate_limits TO service_role;
CREATE OR REPLACE FUNCTION public.website_rate_limit(p_key text,p_limit integer,p_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE v_hits integer;
BEGIN
 IF p_limit<1 OR p_seconds<1 OR p_seconds>86400 THEN RETURN false; END IF;
 INSERT INTO public.website_rate_limits(key,hits,resets_at) VALUES(p_key,1,now()+make_interval(secs=>p_seconds))
 ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN website_rate_limits.resets_at<=now() THEN 1 ELSE website_rate_limits.hits+1 END,
 resets_at=CASE WHEN website_rate_limits.resets_at<=now() THEN now()+make_interval(secs=>p_seconds) ELSE website_rate_limits.resets_at END
 RETURNING hits INTO v_hits;
 DELETE FROM public.website_rate_limits WHERE resets_at<now()-interval '1 day';
 RETURN v_hits<=p_limit;
END $$;
REVOKE ALL ON FUNCTION public.website_rate_limit(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.website_rate_limit(text,integer,integer) TO service_role;
-- Anonymous legacy insert policies would bypass validation, consent and rate limits.
DROP POLICY IF EXISTS anon_insert_leads ON public.leads;
DROP POLICY IF EXISTS anon_insert_quote_requests ON public.quote_requests;
DROP POLICY IF EXISTS anon_insert_conversations ON public.conversations;
CREATE UNIQUE INDEX IF NOT EXISTS leads_website_idempotency ON public.leads ((source_meta->>'idempotency_key')) WHERE source_meta ? 'idempotency_key';
CREATE OR REPLACE FUNCTION public.submit_website_inquiry(p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE v_lead uuid;v_inquiry uuid;v_key text;v_category text;
BEGIN
 v_key=p_payload->>'idempotencyKey';
 IF v_key IS NULL OR (p_payload->>'consent') IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Invalid inquiry'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('website-inquiry:'||v_key,0));
 SELECT q.id INTO v_inquiry FROM public.leads l JOIN public.quote_requests q ON q.lead_id=l.id WHERE l.source_meta->>'idempotency_key'=v_key LIMIT 1;
 IF v_inquiry IS NOT NULL THEN RETURN jsonb_build_object('inquiryId',v_inquiry,'duplicate',true); END IF;
 INSERT INTO public.leads(channel,customer_name,company_name,email,phone,source_meta)
 VALUES('website',p_payload->>'name',p_payload->>'company',NULLIF(p_payload->>'email',''),NULLIF(p_payload->>'phone',''),
 jsonb_build_object('version','website-renewal-v1','division',p_payload->>'division','service',p_payload->>'service','consent_at',now(),'idempotency_key',v_key,'attribution',p_payload->'attribution')) RETURNING id INTO v_lead;
 v_category=CASE WHEN p_payload->>'division'='video' THEN 'video' WHEN p_payload->>'division'='marketing' THEN 'other' WHEN p_payload->>'service'='shopping-mall' THEN 'shop' WHEN p_payload->>'service'='automation' THEN 'automation' WHEN p_payload->>'service'='website' THEN 'website' ELSE 'other' END;
 INSERT INTO public.quote_requests(lead_id,channel,raw_text,category,customer_summary,status)
 VALUES(v_lead,'website',p_payload->>'message',v_category,p_payload->>'company','new') RETURNING id INTO v_inquiry;
 INSERT INTO public.conversations(lead_id,channel,role,content,metadata)
 VALUES(v_lead,'website','customer',p_payload->>'message',jsonb_build_object('request_id',v_inquiry,'source','website-renewal'));
 RETURN jsonb_build_object('inquiryId',v_inquiry,'duplicate',false);
END $$;
REVOKE ALL ON FUNCTION public.submit_website_inquiry(jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.submit_website_inquiry(jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.update_website_inquiry(p_id uuid,p_status text,p_note text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE v_lead uuid;v_old text;
BEGIN
 IF p_status NOT IN ('new','replied','draft','contracted','archived','rejected') THEN RAISE EXCEPTION 'Invalid status'; END IF;
 SELECT lead_id,status INTO v_lead,v_old FROM public.quote_requests WHERE id=p_id AND channel='website' FOR UPDATE;
 IF NOT FOUND THEN RETURN false; END IF;
 UPDATE public.quote_requests SET status=p_status WHERE id=p_id;
 IF v_old IS DISTINCT FROM p_status THEN
 INSERT INTO public.conversations(lead_id,channel,role,content,metadata) VALUES(v_lead,'website','system','문의 상태 변경',jsonb_build_object('request_id',p_id,'from',v_old,'to',p_status));
 END IF;
 IF length(trim(coalesce(p_note,'')))>0 THEN
 INSERT INTO public.conversations(lead_id,channel,role,content,metadata) VALUES(v_lead,'website','agent',trim(p_note),jsonb_build_object('request_id',p_id,'source','admin'));
 END IF;
 UPDATE public.leads SET last_contact_at=now() WHERE id=v_lead;
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.update_website_inquiry(uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.update_website_inquiry(uuid,text,text) TO service_role;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('website-media','website-media',true,5242880,ARRAY['image/webp']) ON CONFLICT(id) DO NOTHING;
COMMIT;
