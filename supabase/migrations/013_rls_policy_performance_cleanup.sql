-- 013_rls_policy_performance_cleanup.sql
-- Optimize owner RLS policies flagged by Supabase Advisor.

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'leads',
    'quote_requests',
    'quote_responses',
    'projects',
    'invoices',
    'v6_price_table',
    'v6_templates',
    'daily_kpi',
    'conversations',
    'reviews',
    'daily_briefings'
  ]
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS owner_full ON public.%I', table_name);
      EXECUTE format(
        'CREATE POLICY owner_full ON public.%I FOR ALL TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL)',
        table_name
      );
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('admin_roles', 'admin_roles_owner_full'),
      ('admin_users', 'admin_users_owner_full'),
      ('admin_role_permissions', 'admin_role_permissions_owner_full'),
      ('approval_requests', 'approval_requests_owner_full'),
      ('work_evidence', 'work_evidence_owner_full'),
      ('admin_audit_logs', 'admin_audit_logs_owner_full'),
      ('admin_system_health_checks', 'admin_system_health_checks_owner_full'),
      ('service_price_overrides', 'service_price_overrides_owner_full')
    ) AS policies(table_name, policy_name)
  LOOP
    IF to_regclass(format('public.%I', item.table_name)) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', item.policy_name, item.table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING ((select auth.uid()) IS NOT NULL) WITH CHECK ((select auth.uid()) IS NOT NULL)',
        item.policy_name,
        item.table_name
      );
    END IF;
  END LOOP;
END $$;
