# Acceptance and readiness — 2026-10-06

Implemented:

- Canonical SiteDocument v1 from the upstream source contract, no second content schema.
- Six independently mountable React sections, source-backed gallery and two page composition fixtures.
- Approved scalar/nested-CTA edits using the existing field contract; settings, ordered block controls, duplication/reordering/removal and independent pages.
- Global header/footer settings and blocks, announcements, footer links and design tokens.
- Five canonical fixture sites. Example Field Studio and Example Harbor Rescue render the same hero and diptych source with unrelated identity, routes, content and media keys.
- Missing-media, unknown-preset, empty-block, missing-inquiry-provider and disconnected header-action states.
- Scoped CSS modules; container-responsive section layouts; shell panel controls for phones; reduced-motion rules.
- Local draft snapshots, immutable revision preview, JSON import/export and strict defensive import boundary.
- Source preservation and complete donor inventory.
- Real transactional SQLite snapshot proof, separate from hosted runtime.

Executed and passing:

- Eight tests in tests/contracts.test.mjs: fixtures, presets, safe boundaries, typed edits, order/future fields, unknown presets, compiled React cross-brand rendering/global uniqueness, empty/provider states.
- Two SQLite tests (five fixture subtests): lossless canonical persistence and rollback.
- TypeScript check for the changed Studio and section packages.
- ESLint.
- Worker build and artifact validation; rendered Worker metadata response.
- Canonical repository verify:universal passed: site-contracts (13), section-library (9), Revise theme (6), Atlas (7) and universal checks (9).
- Portable React/Vite app type check, production build and compiled source evidence passed.

Limits:

- Local Chrome/Playwright checks now pass at nine sizes (360–1920px), including portrait and landscape: editing retains focus and updates the preview, panels never overlap, expand/close/panel switching preserve the canvas, reduced motion and horizontal overflow checks pass. VisualViewport keyboard-height reduction is simulated; physical iOS keyboard and touch-device QA remain outstanding. Run tests/mobile-layout.mjs with PLAYWRIGHT_PACKAGE and REVISE_CHROME configured after building Studio evidence.
- Overall starter tsc reports existing Cloudflare ambient types missing; the changed Studio has its own passing tsconfig.studio.json check.
- Media context is session-only. Originals are never materialized into derivatives.
- Customer publish is disabled. Inquiry, newsletter, commerce and header actions require authorized host adapters.
- Original donor CRM contacts, media colors, template wireframes, collaborator count, mock history, successful upload notices and publish notices were demonstration data; they are preserved as candidate source and are not represented as real backend functionality.
- Rechecked current canonical repository portability audit: 47 blocking findings remain (26 critical, 21 high), with none attributed to this contribution.
- GitHub contribution is pushed through the local device terminal on feat/canonical-cms-studio-20261006. No PR or merge is claimed.

Readiness remains SiteDocument-bound with tested content portability, not publish-ready.
