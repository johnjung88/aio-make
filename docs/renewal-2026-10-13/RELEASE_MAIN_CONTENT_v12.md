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

## Next conversation

Continue with the existing webtoon v09 design and actual source documents, then extend the other five service detail pages. Preserve the approved home layouts, black service backgrounds, prices and hero v02. The current service routes still use the prior implementation: the newer detailed case journeys and case-management expansion have not been integrated yet. Read the versioned local service-detail resume prompt before changing those pages; do not restart planning or call the previews deployed implementation.
