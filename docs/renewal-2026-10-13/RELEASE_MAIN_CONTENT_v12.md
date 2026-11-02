# Company main and content home release v12

2026-10-19. The user approved deployment, commit and push of the reviewed v11 result. This release changes the company main and content home; the next task is the content service detail pages.

## Included

- Company main: the approved DR’s Secret home design v03 PC/mobile pair, a same-scene webtoon production explanation, and six actual content examples. Unrelated private catalog entries remain gated.
- Content home: the approved layout, actual project media, revised copy, centered process/contact sections, and the user-selected hero v02. The hero is 1920×1080, 59.066667 seconds and 14,097,604 bytes.
- Hero controls: native seeking/fullscreen, explicit play/pause and sound, muted by default; offscreen, hidden-tab and reduced-motion behavior is preserved.
- The portable inventory is `content/approved-main-assets-20261019.json`. It records public URLs, exact sizes and SHA-256 without local customer source paths. Original provenance and captured reviews are retained locally.

## Validation

The reviewed v11 source passed a production build, 184 tests with one review-only local-media check skipped, and 97 browser checks across CSS widths 1440/390/320/768/1024. Twelve PC/mobile captures were also read by a separate worker using the same model. These are distinct from physical-device testing and independent external review.

Release preparation makes regression tests portable by reading the public-safe inventory. Hash checks on all shipped assets remain mandatory. Historical customer originals are audited when available locally; a clean checkout does not require the operator's source filesystem.

## Release controls

Use the existing `aio-make-src` Vercel project and the current renewal branch. Build with reference review disabled. Preserve production environment variables and the existing inquiry/admin behavior. Verify the staged production deployment before assigning the live domains. Keep the previous production deployment available for rollback.

Local prototypes, capture/build logs, original-path ledgers and task scripts are excluded from the public commit and CLI upload. No credentials, account permissions or database migrations are part of this release.

## Production result

- Deployed code: `301c2ea5939cc2305cc63d87c36bc7ebef2f6db3`, pushed to `codex/WRK-20261013-AIO-CONTENT-RENEWAL`.
- Vercel project: `john-jungs-projects-eef5c147/aio-make-src`. Production deployment `dpl_EJWzEMZfSAsBz9vraCSD5P6YHZZn` is Ready and serves [company main](https://aio-make.com) and [content home](https://aio-make.com/content).
- Previous production `dpl_Axkn6zWPEjyAHDYeXpc6BzU2X22Z` remains available for rollback. The protected preview was checked using authenticated GETs before promotion; the production environment was rebuilt and then checked at the live domain.
- A clean source export passed 183 tests, with zero failures and two checks skipped because private review media is excluded. All 24 shipped assets retain mandatory size and SHA-256 validation.
- Live HTTP validation passed 45 checks: canonical/indexing configuration, analytics tag configuration, all 24 exact asset hashes, hero range responses, service/contact destinations and two private-ledger exclusion checks.
- Live browser validation passed 90 layout/content checks at widths 1440/390/320/768/1024 and 16 focused media checks. A later repeated whole-page image wait in the first browser script timed out; the remaining media checks were completed separately without changing application code. Playback, pause, explicit mute/unmute, seeking, offscreen pause, reduced motion and fullscreen-control presence passed. This does not claim physical-device fullscreen or speaker-audio verification.

Inquiry submission, database writes, email receipt, analytics event receipt, physical devices and external independent review were not exercised during this release. Later documentation-only commits do not change the deployed application or assets.

The apex domain serves both released pages. The `www` alias is assigned in Vercel but its public DNS lookup currently returns no record; DNS settings were not changed by this release.

## Next conversation

Continue with the existing webtoon v09 design and actual source documents, then extend the other five service detail pages. Preserve the approved home layouts, black service backgrounds, prices and hero v02. The current service routes still use the prior implementation: the newer detailed case journeys and case-management expansion have not been integrated yet. Read the versioned local service-detail resume prompt before changing those pages; do not restart planning or call the previews deployed implementation.
