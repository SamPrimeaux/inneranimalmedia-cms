# Revise multipage site · document v1

Status: **implemented in feature worktree, not deployed**. The `4319` server is a local review surface. This does not change F&FT production, Cloudflare D1, Completeful, campaigns, or the original `4318` concept server.

## Source of truth

- `packages/site-contracts/src/site-document.ts`: portable `SiteDocument` with independently editable global header, page instances, footer and nested section blocks.
- `packages/section-library/src/site.ts`: `renderSiteSection(section, { context, presets })`. Any host can supply a theme, a preset library, logical media resolver, and a `SiteSection` without importing F&FT.
- `packages/section-library/css/layout.css`: generic per-section geometry and surface ownership, controlled with `--iam-site-surface-*` and `--iam-site-text-inverse`.
- `packages/revise-theme/src/tokens/color.css`: maps neutral surface roles to the Revise palette.
- `examples/revise-foundation/src/site-data.ts`: F&FT-specific installation fixture, actual media keys, section selections, navigation, footer and demo/catalog distinctions.
- `examples/revise-foundation/src/site-main.ts`: host-side router, navigation, search, shared Revise overlays and browser-local editing.
- `examples/revise-foundation/src/site.css`: application shell, page intro, visual polish and editor styling. It must not become the universal section contract.

## Page document

```
SiteDocument v1
  brand
  header
    settings
    announcement
    blocks[] -> link | brand | action
  pages[]
    path, title, description
    sections[]
      id, type, preset
      settings -> surface, optional backgroundMediaKey, spacing, minHeight
      blocks[] -> type + data (for list-based renderer, data.items)
      data -> semantic preset fields
  footer
    settings -> background, copyright
    blocks[] -> menu | newsletter | social | legal
      links[]
```

A consuming site must provide its own content and media resolver and may use any theme's preset registry. Route, content, product authority and save/deploy remain application concerns. F&FT content MUST NOT be moved into the npm package layer.

## Review routes

- `http://127.0.0.1:4319/` — Earned Hours home, separate hero and subsequent section surfaces
- `http://127.0.0.1:4319/products/` — products/merchandising
- `http://127.0.0.1:4319/stories/` — editorial/project media
- `http://127.0.0.1:4319/campaigns/` — campaign directions
- `http://127.0.0.1:4319/ideas/` — candidate products, labeled as such
- `http://127.0.0.1:4319/?fixture=fnf` — previous F&FT concept, preserved
- `http://127.0.0.1:4319/?fixture=neutral` — previous neutral Revise proof, preserved

## Authoring boundary — updated October 6

The standalone Revise site is **read-only source/design preview**, not the merchant editor. The rejected **Edit Site** slide-in drawer and browser-local authoring path have been removed. Do not reinstate them or use localStorage to impersonate persisted customer drafts.

- The canonical CMS Studio and FNF's existing ecommerce theme editor own authenticated authoring through real persistence adapters.
- SiteDocument v1 and the real Revise renderer packages remain usable source and composition contracts; they do not imply a completed Metaobject/content model, route publisher, or server-backed Stories template.
- Shared announcement/header/footer exist as distinct visual/global layers, outside the four body section instances.
- Menu, Search, Discover, Bag and browser history remain read-only storefront interactions backed by existing accessible overlay management.
- For Shopify-backed research, versioned model boundaries and acceptance gates, see [Shopify architecture audit](../architecture/SHOPIFY_METAOBJECTS_TEMPLATES_SECTION_ARCHITECTURE_20261006.md) and [Stories eight-layer inventory](../architecture/STORIES_EIGHT_LAYER_INVENTORY_20261006.md).

## Background ownership fix

Previously the sticky hero could visually remain behind subsequent transparent sections. The site host now wraps each section in `.iam-site-section` with its own themed surface. The hero's sticky state is confined/disabled on this multipage host; isolated editorial effects remain per section. Image backgrounds are opt-in and resolved through logical media keys, never implied from the preceding section.

## Release constraints / follow-up

1. **Not commerce-ready:** cart/checkout and subscription writes are intentionally unavailable in this review, with explicit UI labels rather than simulated success. Campaign/product source distinctions remain in the source fixture.
2. **Not yet a server-backed CMS:** localStorage + JSON export are the first editable document checkpoint. A real persistence/approval adapter and editor integration into the ecommerce CMS are still required.
3. **Static hosting requires SPA route fallback** (or pre-rendered route pages) for direct `/products/`, `/stories/`, etc. Vite dev handles these locally; this is not a deployment claim.
4. **Browser-level visual and responsive QA required** across narrow/mobile/tablet/desktop/wide screens, including image loading, focus, tab order, contrast, and overflow. Build/tests alone do not prove this.
5. Future themes must reuse the document and section contract without adopting Revise's visual identity.

## Checks

```sh
npm run build:site
npm run test:site
npx vitest run examples/revise-foundation/tests/site-data.test.ts
npx tsc --noEmit --target es2022 --lib dom,dom.iterable,es2022 \
  --module esnext --moduleResolution bundler --skipLibCheck \
  examples/revise-foundation/src/site-main.ts \
  examples/revise-foundation/src/site-data.ts
```

Keep `4318` untouched while reviewing `4319`. Do not merge this branch or publish packages solely because a build succeeded.
