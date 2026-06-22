-- 014_exclude_canceled_contracts_from_revenue.sql
-- Cancelled contracts/invoices must not contribute to revenue or outstanding balances.

CREATE OR REPLACE VIEW v_channel_revenue AS
SELECT
  l.channel,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT p.id) FILTER (WHERE COALESCE(p.status, '') <> 'canceled') AS projects,
  COALESCE(
    SUM(DISTINCT p.contracted_amount) FILTER (WHERE COALESCE(p.status, '') <> 'canceled'),
    0
  ) AS contracted_amount,
  COALESCE(
    SUM(i.paid_amount) FILTER (
      WHERE i.id IS NOT NULL
        AND COALESCE(i.payment_status, '') <> 'canceled'
        AND COALESCE(p.status, '') <> 'canceled'
    ),
    0
  ) AS paid_amount,
  COALESCE(
    SUM(i.outstanding_amount) FILTER (
      WHERE i.id IS NOT NULL
        AND COALESCE(i.payment_status, '') <> 'canceled'
        AND COALESCE(p.status, '') <> 'canceled'
    ),
    0
  ) AS outstanding_amount,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'completed') AS completed_projects
FROM leads l
LEFT JOIN projects p ON p.lead_id = l.id
LEFT JOIN invoices i ON i.project_id = p.id
GROUP BY l.channel
ORDER BY paid_amount DESC;

CREATE OR REPLACE VIEW v_monthly_revenue AS
WITH monthly_paid AS (
  SELECT
    DATE_TRUNC('month', i.paid_at)::DATE AS month,
    SUM(i.paid_amount) AS revenue
  FROM invoices i
  LEFT JOIN projects p ON p.id = i.project_id
  WHERE i.paid_at IS NOT NULL
    AND COALESCE(i.payment_status, '') <> 'canceled'
    AND COALESCE(p.status, '') <> 'canceled'
  GROUP BY 1
),
monthly_expense AS (
  SELECT
    DATE_TRUNC('month', e.date)::DATE AS month,
    SUM(e.amount) AS expense
  FROM expenses e
  GROUP BY 1
),
months AS (
  SELECT month FROM monthly_paid
  UNION
  SELECT month FROM monthly_expense
)
SELECT
  m.month,
  COALESCE(p.revenue, 0) AS revenue,
  COALESCE(e.expense, 0) AS expense,
  COALESCE(p.revenue, 0) - COALESCE(e.expense, 0) AS profit
FROM months m
LEFT JOIN monthly_paid p ON p.month = m.month
LEFT JOIN monthly_expense e ON e.month = m.month
ORDER BY m.month DESC;

CREATE OR REPLACE VIEW v_category_revenue AS
SELECT
  p.category,
  COUNT(DISTINCT p.id) AS projects,
  COALESCE(SUM(p.contracted_amount), 0) AS contracted_amount,
  COALESCE(
    SUM(i.paid_amount) FILTER (
      WHERE i.id IS NOT NULL
        AND COALESCE(i.payment_status, '') <> 'canceled'
    ),
    0
  ) AS paid_amount,
  COALESCE(
    SUM(i.outstanding_amount) FILTER (
      WHERE i.id IS NOT NULL
        AND COALESCE(i.payment_status, '') <> 'canceled'
    ),
    0
  ) AS outstanding_amount
FROM projects p
LEFT JOIN invoices i ON i.project_id = p.id
WHERE p.category IS NOT NULL
  AND COALESCE(p.status, '') <> 'canceled'
GROUP BY p.category
ORDER BY paid_amount DESC;

CREATE OR REPLACE VIEW v_utm_revenue AS
SELECT
  vs.first_utm_source AS utm_source,
  vs.first_utm_campaign AS utm_campaign,
  COUNT(DISTINCT vs.id) AS sessions,
  COUNT(DISTINCT l.id) AS leads,
  COUNT(DISTINCT p.id) FILTER (WHERE COALESCE(p.status, '') <> 'canceled') AS projects,
  COALESCE(
    SUM(i.paid_amount) FILTER (
      WHERE i.id IS NOT NULL
        AND COALESCE(i.payment_status, '') <> 'canceled'
        AND COALESCE(p.status, '') <> 'canceled'
    ),
    0
  ) AS paid_amount
FROM visitor_sessions vs
LEFT JOIN leads l ON l.id = vs.lead_id
LEFT JOIN projects p ON p.lead_id = l.id
LEFT JOIN invoices i ON i.project_id = p.id
WHERE vs.first_utm_source IS NOT NULL
GROUP BY 1, 2
ORDER BY paid_amount DESC, leads DESC;

UPDATE invoices i
SET
  outstanding_amount = 0,
  payment_status = 'canceled',
  paid_at = NULL
FROM projects p
WHERE p.id = i.project_id
  AND p.status = 'canceled'
  AND (
    i.payment_status IS DISTINCT FROM 'canceled'
    OR COALESCE(i.outstanding_amount, 0) <> 0
    OR i.paid_at IS NOT NULL
  );
