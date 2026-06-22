-- 012_advisor_security_hardening.sql
-- Fix Supabase Advisor security findings without changing application data.

DO $$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'expenses',
    'recurring_expenses',
    'marketing_campaigns',
    'visitor_sessions',
    'visitor_events',
    'sales_service_prices',
    'sales_service_price_addons'
  ]
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      policy_name := table_name || '_owner_full';
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL)',
        policy_name,
        table_name
      );
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  view_name text;
BEGIN
  FOREACH view_name IN ARRAY ARRAY[
    'v_channel_revenue',
    'v_monthly_revenue',
    'v_category_revenue',
    'v_utm_revenue',
    'v_daily_traffic',
    'v_channel_funnel',
    'v_category_interest',
    'tasks_active',
    'shared_knowledge_curated'
  ]
  LOOP
    IF to_regclass(format('public.%I', view_name)) IS NOT NULL THEN
      EXECUTE format('ALTER VIEW public.%I SET (security_invoker = true)', view_name);
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regprocedure('public.trg_set_updated_at()') IS NOT NULL THEN
    ALTER FUNCTION public.trg_set_updated_at() SET search_path = public;
  END IF;

  IF to_regprocedure('public.set_task_completed_at()') IS NOT NULL THEN
    ALTER FUNCTION public.set_task_completed_at() SET search_path = public;
  END IF;

  IF to_regprocedure('public.set_updated_at_timestamp()') IS NOT NULL THEN
    ALTER FUNCTION public.set_updated_at_timestamp() SET search_path = public;
  END IF;
END $$;
