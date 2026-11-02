# W-RW2 marketing renewal

Canonical brief: `43_명세_W-RW2_RW3.MD` change 1 and `45_기획_서비스상세.MD` sections 0–5, including the final Opus confirmation, in `C:/AIO-PC2/30-handoff/15_메인_리뉴얼/`.

The marketing home and four service details now share content-studio spacing, a centered section heading, result screens, pricing, a four-step process, FAQ, and a single dark inquiry section. Each detail has a different browser-only interaction, with a summary carried into the editable inquiry form. The existing InquiryBridge persists submissions and owns conversion tracking.

- `lib/marketing-renewal.ts`: canonical service copy, consultation URLs, twelve persona topic sets
- `components/marketing/`: scoped shell, shared blocks, page composition, interactive tools
- `styles/detail-tokens.css`: additive values copied from the content studio; content and lab code is unchanged
- `assets.json`: 58 WebP files, dimensions, hashes, and asset provenance

Asset rebuild (one browser, no web server):

```powershell
node scripts/marketing-photos.mjs <persona-sheet.png> <material-sheet.png>
node scripts/marketing-feed.mjs <cafe-sheet.png>
node scripts/marketing-preview-assets.mjs
node scripts/marketing-assets.mjs
```

The three source sheets and exact generation prompts are preserved in the handoff `captures_RW2/sources/`. The renderer uses HTML for all text-bearing screens. Photographs are fictional AI-generated material. Cafe Leaf / 카페 리프 is a fictional brand, and no customer performance metrics are represented.

Validation requires an independently started local server on 3117. `scripts/marketing-qa.mjs` captures 1440/390 screens, checks 360/375/768/1024/1280 widths, and exercises all tools, keyboard navigation, no-JS defaults, FAQ, prefill, a simulated HTTP failure, then one **actual local** persisted submission. Run it only with `LOCAL_ADMIN_ENABLED=true`, an isolated `LOCAL_DATA_DIR`, and no notification credentials. `marketing-local-readback.mjs` checks that local receipt after the server has stopped. The QA script blocks external browser requests.

For PC2's memory limit, use one build or one server at a time:

```powershell
$env:CIRCLE_NODE_TOTAL='2' # Next 15 derives one static worker
$env:NODE_OPTIONS='--max-old-space-size=2048'
npm.cmd run build
npm.cmd run typecheck
```

Validation and screenshots are recorded in `47_보고_W-RW2.MD` and `captures_RW2/`. Local implementation validation does not constitute user design approval or production verification. No push, PR, or deployment is part of W-RW2.
