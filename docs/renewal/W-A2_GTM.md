# W-A2 GTM migration candidate

갱신일: 2026-10-28 · 개정번호: 2 · 상태: PC2 Codex W-A2b · noscript 제거·정적 렌더링 복구, 운영 반영 전

Specification: `AIO_SHARED/00_CONTROL/02_기준 변경/30_주제담당_261028/20_SNS_A01/20_GTM이관/00_명세.MD` revision 1. Privacy wording follows `20_SNS_A01/10_처리방침/01_초안.MD` revision 2. Base: `renewal/2610-finish`, merge `28524431f4d21e160eef50a5c7f8d5308ec70532`. Work branch: `work/a001-gtm-261028`.

## Behavior

- A valid `NEXT_PUBLIC_GTM_ID` selects the standard GTM head loader and the original `dataLayer`. There is no direct gtag configuration, script load, page view or lead dispatch in this mode. GTM must map `aio_page_view` to GA4 `page_view` and `aio_lead` to `generate_lead`.
- Without that variable, the existing gtag loader, `send_page_view:false`, manual page views and direct lead events remain available. Both inquiry forms use the same mode gate.
- Tag loading is limited to the canonical production hostname. Admin and development visits are excluded. `NEXT_PUBLIC_TRACKING_LOCAL_TEST` enables loopback testing only; do not configure it in production.
- Per the owner's W-A2b correction, the GTM container uses JS-only tags and has no noscript iframe. The synchronous root layout, middleware and Next configuration match base `2852443`; no request header or metadata-streaming override is needed for GTM. The existing head loader and client hostname/admin/development gates are unchanged. The base and corrected GTM production-build route classifications are compared in the W-A2b evidence attached to the canonical report.
- Privacy wording is collected in three entries at the top of the privacy page: effective date, officer and processor rows. The officer currently reads 대표; the name and final publication wording remain for the owner to confirm. All four tables wrap within a 390px viewport.
- Meta CAPI is scheduled through Next `after()` only after a successful, nonduplicate save. Both server configuration values and an existing `_fbp` cookie are required. A single request uses the inquiry ID, query-free submission URL, first forwarded IP, user agent, Meta cookies and service category. No form name, contact details, company, message or hashed form information is included. `_fbc` takes precedence over a fallback built from the stored `fbclid` cookie. The request has a three-second timeout, no retries, and fixed error logs without payloads or credentials.
- Database schema, inquiry storage and the eight-event dictionary are unchanged.

## Validation

| Check | Result |
|---|---|
| GTM and gtag production builds | pass |
| Separate TypeScript checks | pass |
| Lint of changed source and test files | pass |
| Full lint | existing 1 error and 1 warning, identical before and after |
| Existing suite before | 232 total: 228 pass, 2 fail, 2 skip |
| W-A2b suite, including the noscript regression guard | 241 total: 237 pass, same 2 fail, 2 skip |
| GTM/Meta unit tests including the W-A2b regression guard | 9/9 pass |
| Local GTM browser | pass: GTM request 1, direct gtag request 0, one page event on entry, navigation and back |
| Local gtag rollback browser, previous W-A2 validation | pass: GTM request 0, direct gtag request 1, config and one direct page event per path change |
| Privacy copy, desktop/390px, consent wording, admin exclusion | pass |
| Actual contact submissions | 0; browser blocks the contact API |
| Real GA4/Meta reception and deduplication | not run; requires separately approved integration validation |
| W-A2b base vs corrected GTM build | pass: all 44 displayed route classifications match; 10 static groups, 1 SSG group, 33 existing dynamic groups. `/about`, `/about/team`, `/contact`, `/content`, `/privacy`, `/terms` stay static; content service details stay SSG. `/` and `/content/contact` were already dynamic in the base and remain so |

The unchanged full-suite failures concern the YouTube logo evidence hash and unavailable ffprobe. The unchanged lint error is the `module` variable in `tests/service-case-library.test.mjs`; the warning is an unused parameter in `tests/local-admin.test.mjs`.

Run unit tests with `npm test` and build/type checks separately with `npm run build` then `npm run typecheck`. For a local GTM build, use the dummy container and loopback override specified in W-A2. `tests/gtm-browser.mjs` starts and stops a loopback production server, stubs external tracking scripts, blocks contact requests and saves evidence in `.w-a2-evidence/browser-gtm`. Set `PLAYWRIGHT_MODULE` to an installed Playwright module if it is not locally available. Set `AIO_PRIVACY_DRAFT` to the approved draft Markdown to enable full-text comparison. For the rollback browser check, rebuild without the GTM variable and with a dummy GA ID, then set `AIO_ANALYTICS_MODE=gtag`.

## Handoff

The canonical result is the specification folder's `01_보고.MD`. Do not merge, deploy, alter Vercel environment variables or submit to the production inquiry database as part of this task. PC1 coordinates owner approval, final privacy wording, GTM event mappings and subsequent operational validation.

Environment names for later configuration: `NEXT_PUBLIC_GTM_ID`, existing `NEXT_PUBLIC_GA_ID`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, and optional `META_TEST_EVENT_CODE` for an approved Meta test session. Remove the test-event setting before normal use. Never put the local tracking override in production. Keep server credentials out of client variables, commits and reports.

Rollback: delete the GTM environment variable and rebuild/redeploy, or roll back to the previous deployment. The GA configuration must remain available for gtag fallback. GTM removal does not disable server-side Meta delivery; remove either Meta server variable to turn it off as well. No rollback or environment mutation was executed here.

Official implementation references: [Google container installation](https://support.google.com/tagmanager/answer/14847097), [Meta parameter placement](https://github.com/facebook/capi-param-builder/blob/main/nodejs/README.md), [Meta SDK API version](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/apiconfig.py), [Next metadata streaming](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata).

교훈 후보: JS 전용 GTM 태그에는 불필요한 noscript 서버 분기를 추가하지 않는다. 공통 layout 수정은 기준 빌드와 정적·동적 경로 분류를 비교해 성능 회귀를 확인한다. 공유 지식 등록은 PC1 정리 담당에게 인계한다.
