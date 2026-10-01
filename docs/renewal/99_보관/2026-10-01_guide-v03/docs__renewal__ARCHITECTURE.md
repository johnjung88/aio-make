# AIO MAKE renewal v01
- `app/(public)`: main, marketing/lab/video, 13 service detail pages, contact, public entries and company/policy pages.
- `app/admin`: dedicated login and protected management dashboard. All APIs check the signed 8-hour HttpOnly cookie. No default production account.
- `lib/content.ts`: one Korean service taxonomy, shared by routing, public copy, form validation and admin editing.
- `lib/domain.ts`: Zod input validation, media allowlist, status mapping and JSON-LD escaping.
- `lib/session.ts`: pure credentials/session validation. `lib/auth.ts`: server cookie/navigation adapter.
- `lib/db.ts`: server-only service-role access. Existing leads, quote_requests and conversations are reused.
- `lib/ga.ts`: OAuth service-account authentication and read-only GA4 reports. Missing authentication is a disconnected state, not zero statistics.
- `components`: public shell, contact form, functional development demos, entry presentation and admin views.
- `supabase/migrations/20260930174544_website_renewal.sql`: additive CMS/storage/rate limiting and transaction RPCs; removes anonymous legacy inquiry-write policies to prevent bypass.
- `legacy/2026-10-01`: original implementation and configs retained, excluded from active routes and checks.
- `public/renewal`: 7 optimized conceptual brand/service images. Original PNGs and prompt/hash manifest in docs/renewal.
- Chatbot: HOLD per user. No active chatbot API, widget or AI service key.

The new and previous worktrees do not share node_modules. Development uses .next-dev; production build uses .next.
