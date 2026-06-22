-- 011_service_price_overrides.sql
-- Manual admin overrides for service pricing rows.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS service_price_overrides (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id     TEXT NOT NULL,
  item_type      TEXT NOT NULL CHECK (item_type IN ('tier', 'addon')),
  item_index     INT NOT NULL CHECK (item_index >= 0),
  item_name      TEXT NOT NULL,
  event_price    TEXT,
  regular_price  TEXT,
  duration       TEXT,
  addon_price    TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  updated_by     TEXT NOT NULL DEFAULT 'admin',
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_id, item_type, item_index)
);

CREATE INDEX IF NOT EXISTS idx_service_price_overrides_service ON service_price_overrides(service_id, item_type, item_index);

ALTER TABLE service_price_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_price_overrides_owner_full ON service_price_overrides;
CREATE POLICY service_price_overrides_owner_full
ON service_price_overrides
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
