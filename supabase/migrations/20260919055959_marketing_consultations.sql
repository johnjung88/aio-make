-- Additive: legacy leads / quote_requests / ada_inquiries are untouched.
begin;
create table public.marketing_consultations (
 id uuid primary key default gen_random_uuid(), idempotency_key uuid not null unique,
 payload jsonb not null, status text not null default 'new' check(status in ('new','reviewing','awaiting_info','proposed','contracted','on_hold','closed')),
 revision integer not null default 0, reply_revision integer not null default 0,
 summary text not null default '', notes text not null default '', next_action text not null default '',
 slack_thread text, created_at timestamptz not null default now()
);
create table public.marketing_drafts (
 id uuid primary key default gen_random_uuid(), consultation_id uuid not null references public.marketing_consultations(id),
 version integer not null, reply_revision integer not null, recipient text not null, subject text not null, body text not null,
 author text not null, state text not null default 'draft' check(state in ('draft','approved','sending','sent','unknown','invalidated','failed')),
 approved_by text, approved_at timestamptz, provider_id text unique, created_at timestamptz not null default now(),
 unique(consultation_id,version)
);
create table public.marketing_events (
 id uuid primary key default gen_random_uuid(),consultation_id uuid not null references public.marketing_consultations(id),
 kind text not null,event_key text unique, payload jsonb not null default '{}',created_at timestamptz not null default now()
);
create table public.marketing_outbox (
 id uuid primary key default gen_random_uuid(),consultation_id uuid not null references public.marketing_consultations(id),
 kind text not null check(kind in ('slack','grok','email')), dedup_key text not null unique,payload jsonb not null default '{}',
 state text not null default 'pending' check(state in ('pending','processing','done','unknown','failed','cancelled')),
 claimed_at timestamptz,created_at timestamptz not null default now()
);
create table public.marketing_content (
 id uuid primary key default gen_random_uuid(),slug text not null,version integer not null,
 title text not null,body text not null,state text not null default 'draft' check(state in ('draft','published','retired')),
 created_at timestamptz not null default now(),published_at timestamptz,unique(slug,version)
);
create unique index marketing_one_published on public.marketing_content(slug) where state='published';
create index marketing_outbox_pending on public.marketing_outbox(state,created_at);
create index marketing_events_consultation on public.marketing_events(consultation_id,created_at);
create index marketing_drafts_consultation on public.marketing_drafts(consultation_id,version);
-- Only server service_role can access customer data or execute workflow RPCs.
alter table public.marketing_consultations enable row level security;
alter table public.marketing_drafts enable row level security;
alter table public.marketing_events enable row level security;
alter table public.marketing_outbox enable row level security;
alter table public.marketing_content enable row level security;
revoke all on public.marketing_consultations, public.marketing_drafts, public.marketing_events, public.marketing_outbox, public.marketing_content from public,anon,authenticated;
grant select,insert,update,delete on public.marketing_consultations, public.marketing_drafts, public.marketing_events, public.marketing_outbox, public.marketing_content to service_role;

create function public.marketing_submit(p_payload jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid; v_existing jsonb;
begin
 if p_payload->>'locale'<>'ko' or p_payload->>'category'<>'marketing' or p_payload->>'consent_privacy'<>'true' then raise exception 'invalid intake'; end if;
 insert into marketing_consultations(idempotency_key,payload) values ((p_payload->>'idempotencyKey')::uuid,p_payload) on conflict(idempotency_key) do nothing returning id into v_id;
 if v_id is null then
  select id,payload into v_id,v_existing from marketing_consultations where idempotency_key=(p_payload->>'idempotencyKey')::uuid;
  if v_existing<>p_payload then raise exception 'idempotency conflict';end if;
  return v_id;
 end if;
 insert into marketing_events(consultation_id,kind,payload) values(v_id,'intake',jsonb_build_object('consent_version',p_payload->>'consent_version'));
 insert into marketing_outbox(consultation_id,kind,dedup_key) values(v_id,'slack',v_id||':intake:slack'),(v_id,'grok',v_id||':intake:grok');
 return v_id;
end $$;

create function public.marketing_action(p_id uuid,p_action text,p_data jsonb) returns jsonb language plpgsql security invoker set search_path=public as $$
declare c marketing_consultations; d marketing_drafts; v_id uuid; v_version integer; e marketing_events;
begin
 select * into c from marketing_consultations where id=p_id for update;
 if not found then raise exception 'not found';end if;
 if p_action='draft' then
  if exists(select 1 from marketing_drafts where consultation_id=p_id and state in ('sending','unknown')) then raise exception 'reconciliation required';end if;
  if (p_data->>'reply_revision')::integer<>c.reply_revision then raise exception 'stale reply';end if;
  v_version=c.revision+1;
  update marketing_drafts set state='invalidated',approved_by=null,approved_at=null where consultation_id=p_id and state in ('draft','approved');
  update marketing_outbox set state='cancelled' where consultation_id=p_id and kind='email' and state='pending';
  insert into marketing_drafts(consultation_id,version,reply_revision,recipient,subject,body,author) values(p_id,v_version,c.reply_revision,c.payload->>'email',p_data->>'subject',p_data->>'body',p_data->>'author') returning id into v_id;
  update marketing_consultations set revision=v_version,summary=coalesce(p_data->>'summary',summary) where id=p_id;
  insert into marketing_outbox(consultation_id,kind,dedup_key,payload) values(p_id,'slack',v_id||':draft',jsonb_build_object('draft_id',v_id));
 elsif p_action='approve' then
  select * into d from marketing_drafts where id=(p_data->>'draft_id')::uuid and consultation_id=p_id for update;
  if not found then raise exception 'draft not found';end if;
  if d.version<>c.revision or d.reply_revision<>c.reply_revision then raise exception 'stale approval';end if;
  if d.state in ('approved','sending','sent','unknown') then return to_jsonb(d);end if;
  if d.state<>'draft' or coalesce(p_data->>'actor','')='' then raise exception 'invalid approval';end if;
  update marketing_drafts set state='approved',approved_by=p_data->>'actor',approved_at=now() where id=d.id;
  insert into marketing_outbox(consultation_id,kind,dedup_key,payload) values(p_id,'email',d.id||':email',jsonb_build_object('draft_id',d.id)) on conflict(dedup_key) do nothing;
  v_id=d.id;
 elsif p_action='reply' then
  select * into e from marketing_events where event_key=p_data->>'event_key';
  if found then
   if e.consultation_id<>p_id then raise exception 'event conflict';end if;
   return to_jsonb(e);
  end if;
  insert into marketing_events(consultation_id,kind,event_key,payload) values(p_id,'reply',p_data->>'event_key',p_data);
  update marketing_consultations set reply_revision=reply_revision+1,status='reviewing' where id=p_id;
  update marketing_drafts set state='invalidated',approved_by=null,approved_at=null where consultation_id=p_id and state in ('draft','approved');
  update marketing_outbox set state='cancelled' where consultation_id=p_id and kind='email' and state='pending';
  insert into marketing_outbox(consultation_id,kind,dedup_key) values(p_id,'slack',(p_data->>'event_key')||':reply:slack'),(p_id,'grok',(p_data->>'event_key')||':reply:grok');
 elsif p_action='update' then
  update marketing_consultations set status=coalesce(p_data->>'status',status),notes=coalesce(p_data->>'notes',notes),next_action=coalesce(p_data->>'next_action',next_action) where id=p_id;
 else raise exception 'unsupported action';end if;
 insert into marketing_events(consultation_id,kind,payload) values(p_id,p_action,case when p_action='reply' then '{}'::jsonb else p_data end);
 return jsonb_build_object('id',coalesce(v_id,p_id));
end $$;

create function public.marketing_claim(p_kind text) returns jsonb language plpgsql security invoker set search_path=public as $$
declare o marketing_outbox; c marketing_consultations; d marketing_drafts;
begin
 -- Never automatically reclaim processing/unknown delivery after a crash.
 select queued.* into o from marketing_outbox queued where queued.kind=p_kind and queued.state='pending' and not exists(select 1 from marketing_outbox active where active.consultation_id=queued.consultation_id and active.kind=p_kind and active.state in ('processing','unknown')) order by queued.created_at limit 1;
 if not found then return null;end if;
 select * into c from marketing_consultations where id=o.consultation_id for update;
 select * into o from marketing_outbox where id=o.id and state='pending' for update;
 if not found then return null;end if;
 if exists(select 1 from marketing_outbox where consultation_id=o.consultation_id and kind=p_kind and state in ('processing','unknown')) then return null;end if;
 if p_kind='email' then
  select * into d from marketing_drafts where id=(o.payload->>'draft_id')::uuid for update;
  if d.state<>'approved' or d.version<>c.revision or d.reply_revision<>c.reply_revision then
   update marketing_outbox set state='cancelled' where id=o.id;return null;
  end if;
  update marketing_drafts set state='sending' where id=d.id;
 end if;
 update marketing_outbox set state='processing',claimed_at=now() where id=o.id;
 return jsonb_build_object('outbox',o,'consultation',c,'draft',d);
end $$;

create function public.marketing_finish(p_outbox uuid,p_state text,p_result jsonb) returns void language plpgsql security invoker set search_path=public as $$
declare o marketing_outbox;
begin
 select * into o from marketing_outbox where id=p_outbox;
 perform 1 from marketing_consultations where id=o.consultation_id for update;
 select * into o from marketing_outbox where id=p_outbox for update;
 if not found or o.state<>'processing' or p_state not in ('done','unknown','failed') then raise exception 'invalid completion';end if;
 update marketing_outbox set state=p_state,payload=payload||jsonb_build_object('result',p_result) where id=p_outbox;
 if o.kind='email' then
  update marketing_drafts set state=case p_state when 'done' then 'sent' else p_state end,provider_id=p_result->>'provider_id' where id=(o.payload->>'draft_id')::uuid;
 end if;
 if o.kind='slack' and p_result->>'thread_ts' is not null then update marketing_consultations set slack_thread=p_result->>'thread_ts' where id=o.consultation_id;end if;
 insert into marketing_events(consultation_id,kind,payload) values(o.consultation_id,o.kind||':'||p_state,p_result);
end $$;

create function public.marketing_save_content(p_slug text,p_title text,p_body text,p_publish boolean,p_version uuid default null) returns uuid language plpgsql security invoker set search_path=public as $$
declare v_id uuid;
begin
 perform pg_advisory_xact_lock(hashtext('marketing-content:'||p_slug));
 if p_slug not in ('home','marketing','pricing','projects','resources') then raise exception 'invalid slug';end if;
 if p_publish then
  if not exists(select 1 from marketing_content where id=p_version and slug=p_slug and state='draft') then raise exception 'draft not found';end if;
  update marketing_content set state='retired' where slug=p_slug and state='published';
  update marketing_content set state='published',published_at=now() where id=p_version;
  return p_version;
 end if;
 insert into marketing_content(slug,version,title,body) select p_slug,coalesce(max(version),0)+1,p_title,p_body from marketing_content where slug=p_slug returning id into v_id;
 return v_id;
end $$;
revoke all on function public.marketing_submit(jsonb),public.marketing_action(uuid,text,jsonb),public.marketing_claim(text),public.marketing_finish(uuid,text,jsonb),public.marketing_save_content(text,text,text,boolean,uuid) from public,anon,authenticated;
grant execute on function public.marketing_submit(jsonb),public.marketing_action(uuid,text,jsonb),public.marketing_claim(text),public.marketing_finish(uuid,text,jsonb),public.marketing_save_content(text,text,text,boolean,uuid) to service_role;

create function public.marketing_grok_result(p_job uuid,p_data jsonb) returns jsonb language plpgsql security invoker set search_path=public as $$
declare o marketing_outbox;r jsonb;
begin
 select * into o from marketing_outbox where id=p_job;
 perform 1 from marketing_consultations where id=o.consultation_id for update;
 select * into o from marketing_outbox where id=p_job for update;
 if o.kind<>'grok' then raise exception 'invalid job';end if;
 if o.state='done' then return jsonb_build_object('duplicate',true);end if;
 if o.state<>'processing' then raise exception 'invalid job state';end if;
 r=marketing_action(o.consultation_id,'draft',p_data);
 perform marketing_finish(p_job,'done',r);
 return r;
end $$;
revoke all on function public.marketing_grok_result(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.marketing_grok_result(uuid,jsonb) to service_role;

create function public.marketing_reconcile(p_job uuid,p_state text,p_evidence text,p_provider_id text,p_thread text) returns void language plpgsql security invoker set search_path=public as $$
declare o marketing_outbox;
begin
 select * into o from marketing_outbox where id=p_job;
 perform 1 from marketing_consultations where id=o.consultation_id for update;
 select * into o from marketing_outbox where id=p_job for update;
 if not found or o.state not in ('processing','unknown') or p_state not in ('done','failed') or length(trim(p_evidence))<10 then raise exception 'reconciliation evidence required';end if;
 if p_state='done' and ((o.kind='email' and coalesce(p_provider_id,'')='') or (o.kind='slack' and coalesce(p_thread,'')='')) then raise exception 'provider evidence required';end if;
 update marketing_outbox set state='processing' where id=p_job;
 perform marketing_finish(p_job,p_state,jsonb_build_object('provider_id',nullif(p_provider_id,''),'thread_ts',nullif(p_thread,''),'evidence',p_evidence,'actor','human-admin-reconciliation'));
end $$;
revoke all on function public.marketing_reconcile(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.marketing_reconcile(uuid,text,text,text,text) to service_role;
commit;
