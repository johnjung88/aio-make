# Service detail and copy release v18

The user requested commit, push and a site update after reviewing the six content service pages and the complete public-page copy and alignment changes

## Resulting behavior

- Every content service starts with an actual-media banner and continues through its case, production process, pricing, FAQ and inquiry
- The header exposes all six services directly and links to the shared reference library
- The reference library collects 14 canonical cases with service filters and media viewing
- Webtoon pricing uses 12P and 24P with a 1P standard of 1,024px by 1,536px while preserving all monetary amounts
- The webtoon and motion-comic bundles are emphasized with plan-specific inquiry links
- Character selections keep a stable layout and show the corresponding animation in the large preview
- Motion-graphics card actions align at the bottom and the brand-film page includes the selected MAXTECH concept video
- Public sentence-ending full stops are removed and standalone section introductions are centered across all public pages
- Decimal prices, URLs, email addresses and filenames are preserved
- The shared return-to-top control displays scroll progress

## Content and operating boundaries

The 99 selected media files are pinned by public-safe SHA inventories in `content/service-detail-assets-v14.json` and `content/service-detail-assets-v15.json`
The approved home hero and existing price amounts are unchanged
Historical private catalog gates remain intact
The existing entry structure can store structured service cases, merge revisions by canonical case ID and publish only with publication and rights flags
No database migration, record mutation, credential change or actual inquiry submission is part of this release
Local source ledgers, screenshots, server logs, environment files and unrelated handoff edits are excluded from the commit and deployment source

## Validation before release

- Production build succeeded
- Application tests passed 222 with zero failures and one existing local-media skip
- All 49 public pages were checked at widths 1440, 1024, 768, 390 and 320
- Browser checks passed 598 with zero page or HTTP errors
- Offline review images and final local routes passed 122 delivery checks
- All 99 media hashes, the designated hero, monetary amounts and existing user documents were preserved
- Current application sources matched the tested frozen build

These are implementation self-checks with file-owner CSS checks and a read-only public audit
Physical devices and external independent review were not exercised

## Release method

Use the existing renewal branch and `aio-make-src` Vercel project
Export the committed tree for portable tests and deployment
Keep the existing production environment settings and reference-review flag disabled
Create a production deployment without assigning the live domains, verify it, then promote it and check the public domain
Keep the previous production deployment available for rollback
