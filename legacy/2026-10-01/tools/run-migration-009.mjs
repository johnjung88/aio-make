// tools/run-migration-009.mjs — 009_revenue_and_attribution 뷰 생성
// 실행: node tools/run-migration-009.mjs

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// .env.local 파일에서 환경변수 로드
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY || !SUPABASE_URL) {
  console.error('SUPABASE 환경변수가 없습니다. .env.local 확인하세요.');
  process.exit(1);
}

const views = [
  {
    name: 'v_channel_revenue',
    sql: `CREATE OR REPLACE VIEW v_channel_revenue AS
SELECT l.channel,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT p.id) AS projects,
  COALESCE(SUM(DISTINCT p.contracted_amount),0) AS contracted_amount,
  COALESCE(SUM(i.paid_amount) FILTER (WHERE i.id IS NOT NULL),0) AS paid_amount,
  COALESCE(SUM(i.outstanding_amount) FILTER (WHERE i.id IS NOT NULL),0) AS outstanding_amount,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status='completed') AS completed_projects
FROM leads l
LEFT JOIN projects p ON p.lead_id=l.id
LEFT JOIN invoices i ON i.project_id=p.id
GROUP BY l.channel ORDER BY paid_amount DESC`,
  },
  {
    name: 'v_monthly_revenue',
    sql: `CREATE OR REPLACE VIEW v_monthly_revenue AS
WITH monthly_paid AS (
  SELECT DATE_TRUNC('month',i.paid_at)::DATE AS month, SUM(i.paid_amount) AS revenue
  FROM invoices i WHERE i.paid_at IS NOT NULL GROUP BY 1
),
monthly_expense AS (
  SELECT DATE_TRUNC('month',e.date)::DATE AS month, SUM(e.amount) AS expense
  FROM expenses e GROUP BY 1
),
months AS (SELECT month FROM monthly_paid UNION SELECT month FROM monthly_expense)
SELECT m.month,
  COALESCE(p.revenue,0) AS revenue,
  COALESCE(e.expense,0) AS expense,
  COALESCE(p.revenue,0)-COALESCE(e.expense,0) AS profit
FROM months m
LEFT JOIN monthly_paid p ON p.month=m.month
LEFT JOIN monthly_expense e ON e.month=m.month
ORDER BY m.month DESC`,
  },
  {
    name: 'v_category_revenue',
    sql: `CREATE OR REPLACE VIEW v_category_revenue AS
SELECT p.category,
  COUNT(DISTINCT p.id) AS projects,
  COALESCE(SUM(p.contracted_amount),0) AS contracted_amount,
  COALESCE(SUM(i.paid_amount) FILTER (WHERE i.id IS NOT NULL),0) AS paid_amount,
  COALESCE(SUM(i.outstanding_amount) FILTER (WHERE i.id IS NOT NULL),0) AS outstanding_amount
FROM projects p
LEFT JOIN invoices i ON i.project_id=p.id
WHERE p.category IS NOT NULL
GROUP BY p.category ORDER BY paid_amount DESC`,
  },
  {
    name: 'v_utm_revenue',
    sql: `CREATE OR REPLACE VIEW v_utm_revenue AS
SELECT vs.first_utm_source AS utm_source, vs.first_utm_campaign AS utm_campaign,
  COUNT(DISTINCT vs.id) AS sessions,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT p.id) AS projects,
  COALESCE(SUM(i.paid_amount) FILTER (WHERE i.id IS NOT NULL),0) AS paid_amount
FROM visitor_sessions vs
LEFT JOIN leads l ON l.id=vs.lead_id
LEFT JOIN projects p ON p.lead_id=l.id
LEFT JOIN invoices i ON i.project_id=p.id
WHERE vs.first_utm_source IS NOT NULL
GROUP BY 1,2 ORDER BY paid_amount DESC, leads DESC`,
  },
];

async function runQuery(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  }).catch(() => null);

  // pg-meta 방식 시도
  const res2 = await fetch(`${SUPABASE_URL}/pg-meta/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res2;
}

for (const view of views) {
  process.stdout.write(`Creating ${view.name}... `);
  try {
    const res = await runQuery(view.sql);
    const body = await res.text();
    if (res.ok) {
      console.log('✅ 성공');
    } else {
      console.log(`❌ 실패 (${res.status}): ${body.slice(0,200)}`);
    }
  } catch (e) {
    console.log(`❌ 오류: ${e.message}`);
  }
}
console.log('\n완료!');
