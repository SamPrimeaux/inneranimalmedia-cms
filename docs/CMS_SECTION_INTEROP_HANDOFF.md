# CMS Section Interoperability Contract — Agent/Project Handoff

**Repository:** https://github.com/SamPrimeaux/inneranimalmedia-cms
**Source baseline inspected:** `main`, `4ee7355` (2026-10-06)
**Purpose:** Let a separate CMS/editor/theme project contribute real, editable, reusable sections and page layouts to the existing library, rather than becoming another isolated demonstration.
**Contract status:** The cited code paths exist. Any item explicitly labeled **PROPOSED** is an integration target, not an already-deployed API or schema.

> **Instruction to receiving agent:** Remaster your own CMS UI and visual sections freely. Do **not** invent a parallel persisted site/section schema. Keep your design system distinctive, produce a canonical `SiteDocument` adapter and source-backed preview catalog, and prove portability with at least two unrelated customer identities.

## 1. Architectural rule

**Application/site = identity + content + data authorities.**
**Theme = presentation tokens, styling and default compositions.**
**Section = independently mountable structure/behavior.**
**Preset = a registered section configuration/variant.**
**Page = an ordered sequence of sections.**
**Header/footer = global site blocks, not embedded into every page.**
**Backend = persistence, revisions, media identity, authorization, preview and publish; never owned by a section.**

A visual section must not be tied to FORM / 26, FNF, a particular Git repository, specific R2 bucket, an account ID, a localhost port, or a fixed product catalog. A consumer should be able to reuse the **same** section with different brand identity, text, media, typography, product data and destination links. **No copy-paste fork per brand.**

Do not unify visual appearance across brands. Unify data and lifecycle contracts while retaining individual theme aesthetics.

## 2. Source authority and where to integrate

| Responsibility | Current canonical implementation | Notes |
|---|---|---|
| CMS portable site document | `packages/site-contracts/src/site-document.ts` | `SiteDocument` v1, page/section/blocks/global header/footer, optional visual tokens |
| Typed edit projection | `packages/site-contracts/src/section-fields.ts` | `editableSectionFields` and `applySectionFieldEdit`; intentionally limited to approved fields |
| General layout/preset contract | `packages/site-contracts/src/index.ts` | `SectionInstance`, `SectionPreset`, `PagePreset`, layout/responsive/touch/motion policies |
| HTML renderer/registry | `packages/section-library/src/registry.ts`, `render.ts`, `site.ts` | `registerSection` / `getSection`, `presetLibraryFrom`, `renderSiteSection` |
| A distinct theme implementation | `packages/revise-theme/` | Preserve styling as an independent package |
| Editable HTML CMS example | `examples/revise-foundation/src/site-main.ts` and `site-data.ts` | Page routing, editor, blocks, surfaces and local draft updates |
| Existing React visual donors | `apps/editorial-commons/` | 39 inspectable original scenes; only four currently accept canonical `SiteSection` content |
| React authoring proof | `apps/editorial-commons/src/portable/SectionWorkbench.tsx` | Multi-page, local draft, JSON import/export; **not a publisher** |
| Cross-brand fixture | `apps/editorial-commons/src/portable/fieldwork-site.ts` | Same React scene rendered with alternate brand and media keys |
| Visual catalog / source evidence | `examples/revise-foundation/src/editorial-atlas.ts`, `library-main.ts` | Source links, maturity indicators, isolated preview URLs |
| Portable local database schema | `schemas/sqlite/cms-local-runtime.v1.sql` | Operational SQLite tables, separate from the front-end `SiteDocument` JSON type |
| Runtime CLI | `bin/cms-runtime.mjs` | Initializes project-local SQLite/content directories and introspects tools; not a full CMS CRUD HTTP server |
| CMS package capability envelope | `schemas/cms-package.v2.schema.json` | Installation/capability/adapters declaration; **not** the page/section content schema |
| Host HTTP integration | `docs/HOST_INTEGRATION.md` | Routes host **must implement or supply**, not proof they are implemented by this repo |
| Optional Python AI/HTML pipeline | `services/cms-pipeline-service/` | Extraction/proposals/injection; should not own published content authority |

The older `SamPrimeaux/editorial-commons` repository is an archived donor. Continue development in `inneranimalmedia-cms`.

## 3. The actual portable content schema: SiteDocument v1

The **content interchange artifact** is a JSON-serializable `SiteDocument` from the TypeScript contract, not an HTML screenshot or a database dump.

`SiteDocument`:
- `schemaVersion: 1` — required and versioned.
- `id` — stable site identifier.
- `theme` — design selection, not a hard dependency on section content.
- `brand: { name, home, description }` — site identity.
- `design?` — optional hex `#RRGGBB` tokens: `accent`, `accentSoft`, `canvas`, `paper`, `ink`.
- `header` — `settings: { sticky, pill }`; `announcement: { enabled, messages[] }`; ordered `blocks[]`.
- `footer` — `settings: { background, copyright }`; ordered `blocks[]`.
- `pages[]` — ordered independent pages.

`SitePage`:
- `id`, `path`, `title`, `description`, ordered `sections[]`.
- Paths start with `/`; page paths must be unique within a document.

`SiteSection`:
- `id` — unique within its page.
- `type` — broad semantic renderer class such as `media-hero`, `showcase` or `statement`.
- `preset` — exact registered implementation ID, e.g. `commons/wardrobe-gallery`.
- `settings` — optional `surface` (`canvas|paper|muted|inverse|image`), `backgroundMediaKey`, `minHeight` (`auto|screen`), `spacing` (`none|sm|md|lg`).
- `data: Record<string, unknown>` — serializable content/options for that renderer.
- `blocks?: SiteContentBlock[]` — independently editable ordered child items.

`SiteContentBlock`:
- `id` — stable ID; `type` one of `item|text|media|product|link`; `data` — serializable values.
- A simple media tile can hold `title`, `caption`, `mediaKey`, `alt` and `href`. A diptych panel can additionally hold `eyebrow`, `body` and `ctaLabel`.
- More complex product selectors, galleries and nested tab sets need an **explicit field schema**, not unchecked arbitrary JSON editing.

Global header block types: `link|brand|action` (actions `menu|search|discover|bag`). Global footer block types: `menu|newsletter|social|legal`. They must remain global and independently editable.

The current `validateSiteDocument` checks required identity, supported schema version, high-level header/footer/pages, unique page paths and section IDs, type/preset presence, and optional hex design tokens. **It is not yet an exhaustive deep JSON schema or security validator.** Receiving projects must validate section-specific fields, block types, media references, URL safety and permissions at their respective boundaries.

### Valid minimal cross-brand example

```json
{
  "schemaVersion": 1,
  "id": "sample-independent-brand",
  "theme": "custom-editorial",
  "design": {
    "accent": "#476758",
    "accentSoft": "#B3C9B8",
    "paper": "#FFFFFF",
    "canvas": "#ECEFE8",
    "ink": "#19251F"
  },
  "brand": {
    "name": "Example Field Studio",
    "home": "/",
    "description": "Independent sample brand, not production content"
  },
  "header": {
    "settings": { "sticky": true, "pill": true },
    "announcement": { "enabled": false, "messages": [] },
    "blocks": [
      { "id": "site-brand", "type": "brand", "label": "Example Field Studio", "href": "/" },
      { "id": "journal-nav", "type": "link", "label": "Journal", "href": "/journal/" }
    ]
  },
  "footer": {
    "settings": { "background": "inverse", "copyright": "Example Field Studio" },
    "blocks": [
      { "id": "legal", "type": "legal", "title": "Policies", "links": [
        { "id": "privacy", "label": "Privacy", "href": "/privacy/" }
      ] }
    ]
  },
  "pages": [{
    "id": "home",
    "path": "/",
    "title": "Home",
    "description": "Sample landing page",
    "sections": [{
      "id": "home-hero",
      "type": "media-hero",
      "preset": "commons/curtain-hero",
      "settings": {
        "surface": "image",
        "backgroundMediaKey": "example.hero",
        "minHeight": "screen",
        "spacing": "lg"
      },
      "data": {
        "eyebrow": "THE OPEN ROAD",
        "heading": "Follow the interesting route.",
        "body": "A brand-owned editorial introduction.",
        "mediaKey": "example.hero",
        "ctaLabel": "Read the journal",
        "ctaHref": "/journal/"
      }
    }, {
      "id": "home-collections",
      "type": "showcase",
      "preset": "commons/wardrobe-gallery",
      "settings": { "surface": "paper", "spacing": "md", "minHeight": "auto" },
      "data": { "eyebrow": "THE EDIT", "heading": "Choose a collection" },
      "blocks": [{
        "id": "category-one",
        "type": "item",
        "data": {
          "title": "Stories",
          "caption": "Field notes",
          "mediaKey": "example.stories",
          "alt": "Editorial scene",
          "href": "/journal/"
        }
      }]
    }]
  }]
}
```

`example.hero` and `example.stories` are **logical media identities**. The consumer registers real customer assets for them. A section never substitutes unrelated default photography when a key cannot be resolved.

## 4. Two related section contracts — do not confuse them

**Content editing shape:** `SiteDocument > SitePage > SiteSection > blocks` is the canonical current cross-editor interchange.

**Generic renderer/preset shape:** `SectionInstance` / `SectionPreset` / `PagePreset` in `packages/site-contracts/src/index.ts` adds `layout.width`, `layout.bleed`, gutters, responsive policy, touch target, safe areas, reduced-motion policy and preset configuration. This is consumed by `packages/section-library`.

The current HTML `renderSiteSection(section, { context, presets })` adapts a `SiteSection` to the older `PagePreset`/`SectionInstance` renderer, mapping `section.blocks[].data` to `data.items`. It resolves `backgroundMediaKey` through the provided context. The preset library must contain the requested pair `type + preset` or rendering will fail.

The current React `EditorialScene` renders a named source-backed React scene, optionally receiving `section: SiteSection`, `brand`, `tokens` and `resolveMedia`. Four scene IDs are currently `site-document-bound`: `curtain-hero`, `wardrobe-gallery`, `split-media` and `editorial-statement`. The other 35 entries are **preview candidates**, not yet uniformly editable CMS sections.

**PROPOSED adapter rule:** Every donor renderer should expose one conversion:

```ts
type MountedSection = {
  section: SiteSection;
  site: Pick<SiteDocument, "brand" | "design">;
  resolveMedia: (key: string) => string | null;
  // Host supplies optional authorized commerce/content actions separately.
};
```

The HTML, React, or future runtime-specific renderer may vary; the content shape must not. If a foreign scene depends on additional runtime context, expose it as an optional **capability adapter**, never require a specific shop, account or backend.

## 5. Current persistence and backend reality

### 5.1 Portable SQLite runtime — implemented schema, not yet one universal adapter

`@inneranimalmedia/cms-runtime` CLI `init` creates project-relative:
- `.agentsam/cms.sqlite` — local SQLite database.
- `.agentsam/cms-content/` — local content/object directory.
- `.agentsam/cms/runtime.json` — schema/authority receipt.

The SQLite schema exists at `schemas/sqlite/cms-local-runtime.v1.sql`. Its implemented tables include:

| Table | Current columns relevant to integration |
|---|---|
| `cms_sites` | `id`, `name`, `domain`, `theme_json`, `schemas_json` and other display metadata |
| `cms_pages` | `id`, `site_id`, `title`, `slug`, `status`, `type`, `parent`, `meta_title`, `meta_description`, `sort_order` |
| `cms_sections` | `id`, `page_id`, `name`, `type`, `zone`, `visible`, `fields_json`, `css_json`, `sort_order` |
| `cms_blocks` | `id`, `section_id`, `type`, `visible`, `data_json`, `sort_order` |
| `cms_revisions` | `id`, `page_id`, `kind`, `created_at`, `label`, `snapshot_json` |
| `cms_publications` | `page_id`, `publication_id`, `route`, `revision_num`, `theme`, `sections_json`, `published_at`, `metadata_json` |
| `cms_assets` | `id`, `site_id`, `name`, `mime_type`, `size`, `url`, `asset_key`, `created_at`, `metadata_json` |

The schema also declares self-description catalogs (`cms_runtime_info`, `cms_table_catalog`, `cms_capability_catalog`, `cms_tool_catalog`, `cms_skill_catalog`, `cms_usage_guides`, migration catalog). The CLI currently provides `init`, `doctor`, `tools` and `skills`: do not mistake those for completed remote CRUD, transactions, cross-device sync or a publishing service.

**The mapping from a full SiteDocument to SQLite is not yet finished.** Notably `cms_sections` does not have an explicit `preset` column, and the global `header`/`footer` model is not represented as dedicated site tables. Another agent must not assume a lossless adapter already exists.

**PROPOSED minimal persistence adapter:**
1. Store/retrieve the whole `SiteDocument` **losslessly** in a versioned canonical JSON snapshot, scoped by tenant/site; expose normalized page/section/block indexes for queries.
2. Map site ID and brand to `cms_sites`, routes/titles/order to `cms_pages`, section ID/type/order to `cms_sections`, and ordered content items to `cms_blocks`.
3. Preserve the exact `section.preset`, all `section.settings`, `section.data`, global header/footer, and all optional future fields. Do not drop these while flattening into `fields_json` or `css_json`. Either use a rigorously specified JSON envelope or migrate schema with explicit columns/records.
4. Save drafts as revisions; preview a specific draft revision. Publication points to an immutable accepted revision, never implicitly publishes on editor keystrokes.
5. Implement deterministic `SiteDocument -> storage -> SiteDocument` round-trip tests before using a new database adapter.

This is a **design requirement**, not an assertion about current `cms-runtime` behavior.

### 5.2 Hosted HTTP / Cloudflare — host integration contract

`docs/HOST_INTEGRATION.md` lists routes that a host Worker **implements or licenses**, including:
- `GET/POST /api/cms/pages` — page CRUD.
- `GET/PUT/DELETE /api/cms/sections/:id` — section operations.
- `POST /api/cms/sections/save-injected` — injected HTML persistence.
- `POST /api/cms/pages/:id/publish` — publication/promotion gates.
- `GET /api/cms/pages/:id/preview-urls` — draft/live preview addresses.

`studio/dashboard/PageEditor.tsx` uses host CMS endpoints, but these are **not proof that this standalone repository serves them end-to-end**. Host responsibilities include authentication/tenant scope, authorization, durable D1/R2 or equivalent storage, preview tokens, revisions, publish gates and domain routing.

The architecture document suggests D1 metadata, R2 shells/assets, KV hot cache, and optional collaboration DO. They are deployment adapters, **not hardcoded requirements of `SiteDocument`**. `CMS_PIPELINE` is an optional service binding for Python HTML extraction/prototyping, not page content authority.

### 5.3 Browser-local authoring state

The FNF CMS example and `SectionWorkbench` can keep local drafts. `SectionWorkbench` uses browser `localStorage` plus JSON import/export. It has **no remote write, synchronized revision log, customer authentication, shipping/inventory authority or publish action**. Preserve the distinction between a working preview and a delivered backend.

## 6. Media portability

Section data references **logical keys** (`mediaKey`, `backgroundMediaKey`); never raw Cloudflare account/bucket IDs or paths into a developer's home directory.

Renderer host supplies:

```ts
interface MediaResolver {
  resolveMedia(key: string): string | null;
}
```

Requirements:
- Resolve against the importing site's own media library/tenant.
- Preserve originals and alt/caption/focal metadata as applicable.
- Show an honest empty/missing-media state when unresolved; do not silently replace with donor imagery.
- Validate authorized asset ownership and media type before persistence or publication.
- Distinguish browser-only responsive preview crops from materialized media derivatives.
- Stable keys survive migration across local filesystem, R2, other object stores and CDN origins.

Current `RenderContext` includes `theme` and `resolveMedia(key)`. React scene adapters receive the same resolver as a prop. **PROPOSED:** a future shared media adapter should also carry asset metadata/version and signed delivery URLs as needed; that metadata is not yet part of `SiteDocument` v1.

## 7. How another project should contribute real sections

**Do not submit only screenshots, one big HTML page or a framework-specific demo as the integration output.** Keep that visual evidence, but attach portable source and data bindings.

### A. Inventory and source-preserve

Audit every donor `hero`, grid, gallery, PDP, search overlay, drawer, form, page shell, global header/footer, newsletter, story viewer and transition. Keep unique component source and Git provenance. Catalog each source item with:
- Stable namespaced ID (`donor/scene-name`), title and component source path.
- Kind (`section|header|footer|overlay|page|product-page|studio`).
- Runtime (`react`, HTML, etc.) and capabilities required.
- Real preview URL plus desktop/mobile evidence.
- Maturity status: source-backed candidate / `SiteDocument`-bound / tested cross-site / publish-ready.
- Dependencies, external actions, missing backend, and known defects.

Gallery registration is not production certification. An iframe is fine for isolated inspection but **not** an acceptable general production mounting strategy.

### B. Separate data and renderers

For every candidate, produce a repeatable `SiteSection` fixture with fields, settings, and ordered `blocks`. Move fixed labels, images, CTA URLs, product names/prices, merchant info, brand-specific colors and stories out of the renderer. Register a stable preset ID. The same component should render:
1. Original donor style/data as a legacy preview.
2. A completely different site with different copy, media keys, palette and routes.
3. A missing/empty-data state without reading donor defaults.
4. A smaller phone viewport and a wide desktop viewport.

Do not force every design to use Revise's CSS. Instead use section-scoped CSS and optional theme tokens. Enforce no global styles clobbering the host.

### C. Publish a section manifest — **PROPOSED interchange envelope**

`SiteDocument` is already implemented; the **cross-repository distribution bundle** below is a recommended next contract and must be versioned/implemented before being treated as a runtime API:

```json
{
  "bundleVersion": "inneranimalmedia.section-bundle/v1-proposal",
  "namespace": "example-donor",
  "version": "0.1.0",
  "sections": [{
    "preset": "example-donor/media-diptych",
    "type": "showcase",
    "source": "src/sections/MediaDiptych.tsx",
    "runtime": "react",
    "fixture": "fixtures/media-diptych.site-document.json",
    "preview": "previews/media-diptych/index.html",
    "requiredCapabilities": ["media-resolver"],
    "status": "site-document-bound"
  }]
}
```

A donor contribution should contain:
- `manifest` + stable preset namespaced IDs.
- Portable content fixture(s), not hardcoded brand values.
- Source component and scoped styles/tokens.
- Real preview build and routes.
- Compatible adapter to the canonical `SiteSection` interface.
- Media placeholder policy and declaration of external capabilities (auth, commerce, newsletter, AI).
- Tests demonstrating imports, author edits, persistence round trip, keyboard/touch, mobile/wide layout and missing data.
- License/source provenance and clear readiness status.

The proposed `section-bundle` envelope is **not** the existing `cms-package.v2.schema.json`. The latter describes **runtime deployment capabilities**. Keep these two package concepts separate.

### D. Integration destination

1. Open a branch/PR against `SamPrimeaux/inneranimalmedia-cms`.
2. Import original donor source while preserving traceable commit history.
3. Add a neutral `SiteSection` adapter and fixtures; prefer `packages/section-library` or a named reusable React section package as appropriate, rather than embedding in FNF pages.
4. Register source-backed preview entries in the Design Atlas. Candidates must remain tagged as candidates until verified.
5. Make the section selectable in **Add section**, editable through the shared field contract, reorderable with its blocks, and renderable independently and inside a page.
6. Ensure the generated document exports/round-trips as canonical `SiteDocument` JSON.
7. Require a genuine alternate-brand integration test before declaring it portable.
8. Only after host auth, storage adapter, preview revision and publication gates exist, permit a real publish action.

## 8. Contract-based editor UI

A receiving agent may redesign the editing experience radically, but the editor must maintain:

```text
GLOBAL SITE
  brand / design tokens / media references
  header: settings, announcement, ordered navigation/action blocks
  footer: settings, ordered menus, newsletter, legal/social blocks

PAGE TEMPLATE (many pages per site)
  route / title / description
  ordered sections[]
    preset + type
    section settings (surface, spacing, background key, height)
    typed content fields
    ordered content blocks[]
      typed fields and media keys
  + Add section (from installed, compatible catalog)
  + Duplicate / reorder / remove

LIFECYCLE
  edit draft -> validate -> revision snapshot -> preview -> approve/publish
```

Today the shared `editableSectionFields` allows known, first-level primitive fields plus specific nested CTA label/href fields; `applySectionFieldEdit` validates URL/media/number edits. It is **not** a universal schema-form engine. Define new typed schemas for custom repeaters, variants, product selectors, configuration and capability-backed behavior. Never expose an arbitrary nested object as an unvalidated freeform editor just to make a demo work.

Product data, checkout, inventory, subscriptions, newsletter dispatch and booking must be backed by provider adapters and explicit authority; preview UI must not assert any transaction took place.

## 9. Acceptance checklist for importing a donor section

A section is **ready for the reusable catalog** only when all applicable checks pass:

- [ ] Stable `namespace/preset` and source path; donor attribution/license recorded.
- [ ] Renders directly from `SiteSection` data/settings/blocks without hardcoded donor content.
- [ ] Works in two unrelated `SiteDocument` brands **without copying the renderer**.
- [ ] Missing image, empty blocks, invalid URL and missing capabilities have honest safe states.
- [ ] Editor can change text, CTA, media, design tokens, per-section background and block order.
- [ ] Responsive and keyboard/touch checks pass; reduced-motion accommodation is tested.
- [ ] Header/footer do not duplicate page-owned sections and styling does not leak globally.
- [ ] JSON import/export preserves document identity, routes, section IDs/order, settings and blocks.
- [ ] Real database adapter round-trips without losing `preset`, global blocks or future data.
- [ ] Draft/publish are separate, authenticated, authorized, revisioned operations.
- [ ] Visual catalog previews use real compiled source and declare maturity honestly.
- [ ] Cross-repo integration does not add app-specific hardcoded API origins, credentials, bindings or production claims.

Existing checks (from repo root):

```bash
npm run build:site
npm run test:site
npm run verify:universal
npm ci --prefix apps/editorial-commons --ignore-scripts
npm --prefix apps/editorial-commons run lint
npm run build:editorial-evidence
# With a running CMS demo and Chrome/Playwright paths configured:
npm run smoke:universal
npm run smoke:editorial:workbench
# For the donor's original 39-scene acceptance:
EDITORIAL_PREVIEW_URL=http://127.0.0.1:4319/library/evidence/editorial-commons/index.html npm --prefix apps/editorial-commons run smoke:editorial
```

As inspected, `npm run audit:portability` reports **47 existing blocking findings** (26 critical, 21 high). These are unresolved repo-wide audit debts, not evidence that the imported React scenes are all publish-ready. Recheck against current `main` before drawing new conclusions.

## 10. Exact requested deliverables for the receiving agent

Produce one PR/work branch with:

1. **Inventory:** every donor theme/section/page/overlay listed with source, screenshots or working preview, maturity and missing functionality.
2. **Canonical fixtures:** valid `SiteDocument` v1 sample sites with real blocks, settings, pages and logical media keys.
3. **Shared adapters:** each selected high-value visual section consumes canonical content and host-owned media/providers; no per-brand clones.
4. **Editor UX:** working field/block controls, page addition/reorder, global header/footer and design token editing where supported.
5. **Registered gallery:** each real section/page has a discoverable source-backed preview, rather than screenshots masquerading as implementations.
6. **Cross-brand demonstrations:** at least two unrelated site identities rendering the same section source.
7. **Persistence plan:** explicit lossless mapping to local SQLite or host database, with real test evidence if implemented.
8. **Acceptance and readiness report:** state what was actually wired, tested and deployed; never claim a simulated publish is live.

**Do not create an independently evolving second CMS schema.** If the existing contracts are insufficient, propose a small backwards-compatible versioned extension in `packages/site-contracts` and test both the original Revise site and the new donor renderer before merging.

---
**Canonical review location:** `apps/editorial-commons` and `/library/` within `inneranimalmedia-cms`.
**Reference docs:** `docs/UNIVERSAL_SECTIONS.md`, `docs/HOST_INTEGRATION.md`, `docs/OPERATIONS_PLANE.md`, `schemas/sqlite/cms-local-runtime.v1.sql`, `schemas/cms-package.v2.schema.json`.
