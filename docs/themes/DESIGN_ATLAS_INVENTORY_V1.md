# Design Atlas v1 — review actual design history before remastering

Status: **source-backed visual discovery implemented locally**, no provider or live customer write integration. This document is deliberately separate from the Revise multipage-site document contract.

## What is visible

Review on `http://127.0.0.1:4319/library/` while the worktree server is running.

| Collection | Count | What a preview actually proves |
| --- | ---: | --- |
| Packaged sites | 8 | Historical standalone SDK theme builds, not screenshots or synthetic redesigns |
| Standalone HTML page mounts | 35 | Existing `.html` sources within those themes; some legacy internal links still need normalization |
| Revise section presets | 24 | Rendered live through `@inneranimalmedia/section-library` and `@inneranimalmedia/revise-theme` |
| Legacy CMS HTML sections | 5 | Source fragments inside an explicit neutral inspection harness; **not** a portable section contract yet |
| CMS palette token studies | 7 | Original CSS variables applied to a consistent neutral comparison surface; **not** complete site themes |
| UI/interaction labs | 5 | Historical self-contained UI experiments, including the AgentSam BrowserShell promo site |
| Page templates | 2 | Older bare HTML CMS starter pages, not commerce templates |

Total index entries: **86** (8 + 35 + 24 + 5 + 7 + 5 + 2). Atlas filtering, deep links, preview-viewport switcher, search, source provenance, and real browser navigation are implemented.

## Donors / provenance

- `SamPrimeaux/agentsam-sdk`: Cypress, Violet, Grove, Ember, Forge, Harbor, Summit, Resolve historical packaged sites. Canonical sources live under `packages/theme-<slug>/site/`. Do not fork domain/theme logic into the CMS runtime.
- `SamPrimeaux/inneranimalmedia`: `cms/themes` (CSS token palette history), `cms/sections` (five HTML experiments), `cms/templates` (two starters), `static/templates/ui` (four UI labs).
- `SamPrimeaux/AgentSam-BrowserShell`: packaged AgentSam Browser promo under `apps/agentsam-browser-site/dist`.
- `inneranimalmedia-cms`: Revise's own `site-contracts`, `section-library`, `revise-theme`, and multipage FNF example. These are rendered in-place, not copied.

Each imported record includes original repo, relative source path, source commit, snapshot URL, provenance category, preview maturity, and (where actually present) HTML page paths. Build artefacts under `examples/revise-foundation/public/library/evidence` are **review snapshots**, not new canonical packages.

## Entry points

- `/library/` — entire visual inventory; all types, search and filters.
- `/library/themes/cypress/` — one site's detailed desktop/mobile preview, source and HTML page mounts.
- `/library/pages/cypress-0/` — physical source page preview (only generated from a real HTML file).
- `/library/sections/revise-sticky-curtain/` — detail for a live Revise section.
- `/library/presets/revise-sticky-curtain/embed/` — actual renderer with the current FNF content fixture.
- `/library/palettes/iam-ghost-tactical/` — a historical CSS token preview.
- `/library/labs/scroll-fx/` — scroll effects study.
- `/library/labs/browser-promo/` — AgentSam BrowserShell promo build.
- `/library/templates/starter-page/` — earlier CMS starter.
- `/library/evidence/.../index.html` — full imported raw review document (URL must include `index.html`; the local Vite SPA fallback captures directory-only URLs).

These are different maturity classes. In particular, a source fragment viewed through a harness must not be marketed as a ready-to-install section.

## Regenerate snapshots deliberately

From the CMS repository:

```bash
python3 scripts/import-design-atlas.py \
  --sdk-root /Users/samprimeaux/agentsam-sdk \
  --parent-root /Users/samprimeaux/inneranimalmedia \
  --browser-root /Users/samprimeaux/AgentSam-BrowserShell
npm run verify:atlas
```

Paths are **CLI inputs only**, not build or runtime requirements; point them to whichever checked-out donor repositories you authorize. The current snapshots are checked into the feature branch, so ordinary frontend builds do not require any of the donor checkouts. Do not automatically resync snapshots on every build, reinstall, or deployment.

The importer deliberately adjusts *derived copies only* for nested preview mounts (root-relative source links), suppresses Forge service-worker registration in the archive, and fixes an invalid string apostrophe in Summit's older inline JavaScript. It does **not** modify the source repos or claim those themes have been normalized.

## Browser isolation

On a local loopback preview, the atlas main UI and embedded historical sites use **different loopback hostnames** (`127.0.0.1` and `localhost`) to keep iframe origins apart. Previews use limited iframe capabilities (scripts; **no form submissions or parent navigation**). This allows older JavaScript modules and local storage while keeping separate origins.

**Do not launch this archive publicly on the same origin as authenticated CMS/customer tooling.** Before deploying a public gallery, move the snapshots to a separate preview origin, set appropriate CORS/CSP/security policy, and verify behavior. Other hostnames deliberately default to opaque sandboxed frames until that isolation exists.

## Known gaps / review labels

- Summit still attempts to load original portfolio data from a JSON path that is not in this static snapshot. This is a historical runtime-data dependency, not a missing gallery item.
- Some older theme pages contain relative links to routes that need file-path normalization or a source-aware router.
- Several legacy HTML sections depend on classes or services outside their snippets; the neutral harness makes them **inspectable**, not pixel-identical.
- The local section previews are rooted in the FNF concept fixture. Public SDK packages remain FNF-neutral; replace example data through the existing `resolveMedia` contract before using a section for another customer.
- A green Vite build is not proof of content, commerce, authentication, form handling, or portability readiness.

## Verification and quality gates

```bash
npm run verify:atlas
PLAYWRIGHT_PACKAGE=/path/to/node_modules/playwright \
REVISE_CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
npm run smoke:atlas
```

The browser smoke covers gallery entries and filters, a real packaged-site iframe, live Revise section rendering, FNF multipage sections, and gallery horizontal overflow at 390/768/1440/1920px. Future passes must add mobile/tablet screenshots for representative page variations, a complete accessibility audit, and real conversion testing.

## Incremental remaster workflow

1. **Inspect and tag:** Use the gallery to select promising specific page/section examples. Preserve their source paths and screenshots.
2. **Decide ownership:** Determine whether each belongs to a generic section/preset, a unique named theme, a header/footer block, an application-specific workflow, or an archived non-product experiment.
3. **Normalize one source at a time:** Typed inputs, schema, media logical keys, surface rules, actions, responsive layouts, reduced-motion behavior and tests.
4. **Mount into a second site:** Prove the same independently renderable section on another theme/brand without copying the customer data or theme CSS.
5. **Promote with evidence:** Only after visual/interaction/adapter checks, register in the actual theme section catalog. Never treat a gallery import alone as publishing an installable product.

This makes the visual archive a triage and selection system rather than another parallel CMS.
