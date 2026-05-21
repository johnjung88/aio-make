-- 008_shared_knowledge.sql
-- 이사 간 공유 학습 인사이트 (자사·외주 분리하되 좋은 데이터 공유)
-- AIO_INFRASTRUCTURE_V1.md §4 참조

CREATE TABLE IF NOT EXISTS shared_knowledge (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category        TEXT NOT NULL CHECK (category IN (
    'design_trends',
    'sns_patterns',
    'client_types',
    'conversion_patterns',
    'copy_templates',
    'tool_tips',
    'platform_quirks',
    'korean_industry',
    'pricing_insights',
    'objection_responses',
    'other'
  )),
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  source_director TEXT NOT NULL CHECK (source_director IN (
    'aio-ceo', 'aio-sales', 'aio-website', 'aio-dev', 'aio-design',
    'aio-biz', 'aio-marketing', 'aio-finance', 'aio-rnd', 'manual'
  )),
  source_session  TEXT,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  upvotes         INT NOT NULL DEFAULT 0,
  applied_count   INT NOT NULL DEFAULT 0,
  is_validated    BOOLEAN NOT NULL DEFAULT FALSE,
  validated_by    TEXT,
  validated_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_knowledge_category
  ON shared_knowledge(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_knowledge_tags
  ON shared_knowledge USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_shared_knowledge_director
  ON shared_knowledge(source_director, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_knowledge_validated
  ON shared_knowledge(is_validated, upvotes DESC);

DROP TRIGGER IF EXISTS trg_shared_knowledge_updated_at ON shared_knowledge;
CREATE TRIGGER trg_shared_knowledge_updated_at
  BEFORE UPDATE ON shared_knowledge
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

ALTER TABLE shared_knowledge ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shared_knowledge_service_role_all ON shared_knowledge;
CREATE POLICY shared_knowledge_service_role_all ON shared_knowledge
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE VIEW shared_knowledge_curated AS
SELECT
  category, title, body, tags,
  upvotes, applied_count, source_director, validated_at
FROM shared_knowledge
WHERE is_validated = TRUE
ORDER BY upvotes DESC, applied_count DESC, validated_at DESC;

-- 시드 데이터는 운영 DB에 별도 적용 완료 (apply_migration 008)
