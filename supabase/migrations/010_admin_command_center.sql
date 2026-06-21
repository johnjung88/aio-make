-- 010_admin_command_center.sql
-- AIO Admin ERP Command Center support tables.
-- This migration prepares persisted approval, audit, permission, evidence, and health records.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key    TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT UNIQUE,
  display_name TEXT,
  role_key     TEXT REFERENCES admin_roles(role_key),
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key    TEXT REFERENCES admin_roles(role_key),
  permission  TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_key, permission)
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  approval_type  TEXT NOT NULL CHECK (approval_type IN (
    'customer_message',
    'price_due_date',
    'contract_payment',
    'refund_settlement',
    'portfolio_publish',
    'tracking_live',
    'risk_escalation'
  )),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'on_hold')),
  priority       TEXT NOT NULL DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2')),
  requested_by   TEXT NOT NULL DEFAULT 'admin',
  reviewed_by    TEXT,
  target_type    TEXT,
  target_id      UUID,
  summary        TEXT,
  decision_note  TEXT,
  due_at         TIMESTAMPTZ,
  decided_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_evidence (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type    TEXT NOT NULL,
  target_id      UUID,
  workcard_path  TEXT,
  evidence_path  TEXT,
  reality_gate   TEXT CHECK (reality_gate IN ('READY', 'READY_INTERNAL', 'WARN', 'NEEDS_WORK', 'BLOCKED')),
  owner_profile  TEXT,
  summary        TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor       TEXT NOT NULL DEFAULT 'admin',
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   UUID,
  before_json JSONB,
  after_json  JSONB,
  summary     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_system_health_checks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_key   TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('ok', 'warn', 'fail', 'unknown')),
  summary     TEXT,
  checked_at  TIMESTAMPTZ DEFAULT now(),
  metadata    JSONB
);

CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approval_requests_type ON approval_requests(approval_type, status);
CREATE INDEX IF NOT EXISTS idx_work_evidence_target ON work_evidence(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON admin_audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_system_health_checks_key ON admin_system_health_checks(check_key, checked_at DESC);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_system_health_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_roles_owner_full ON admin_roles;
DROP POLICY IF EXISTS admin_users_owner_full ON admin_users;
DROP POLICY IF EXISTS admin_role_permissions_owner_full ON admin_role_permissions;
DROP POLICY IF EXISTS approval_requests_owner_full ON approval_requests;
DROP POLICY IF EXISTS work_evidence_owner_full ON work_evidence;
DROP POLICY IF EXISTS admin_audit_logs_owner_full ON admin_audit_logs;
DROP POLICY IF EXISTS admin_system_health_checks_owner_full ON admin_system_health_checks;

CREATE POLICY admin_roles_owner_full ON admin_roles FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY admin_users_owner_full ON admin_users FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY admin_role_permissions_owner_full ON admin_role_permissions FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY approval_requests_owner_full ON approval_requests FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY work_evidence_owner_full ON work_evidence FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY admin_audit_logs_owner_full ON admin_audit_logs FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY admin_system_health_checks_owner_full ON admin_system_health_checks FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO admin_roles (role_key, label, description)
VALUES
  ('admin', '통합 관리자', '전체 admin read/write 관리'),
  ('insales', '자사몰 PM', '문의, 상담, PM handoff, 승인 큐 관리'),
  ('finance', '재무이사', '재무 조회와 제한적 재무 운영 DML'),
  ('marketing', '마케팅 이사', '캠페인, UTM, 분석 관리'),
  ('dev', '개발 총괄', 'DB/API/RBAC/audit/system health 관리')
ON CONFLICT (role_key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description;

INSERT INTO admin_role_permissions (role_key, permission)
VALUES
  ('admin', 'admin:*'),
  ('insales', 'inquiries:read'),
  ('insales', 'approvals:request'),
  ('finance', 'finance:read'),
  ('marketing', 'marketing:read'),
  ('dev', 'system:read')
ON CONFLICT (role_key, permission) DO NOTHING;
