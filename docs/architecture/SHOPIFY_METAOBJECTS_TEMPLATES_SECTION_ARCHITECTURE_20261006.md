# Inner Animal CMS — Shopify architecture research and non-drift contract

**Date:** 2026-10-06  
**Status:** research + architecture acceptance contract. **Not a declaration that any missing capability is implemented.**  
**Target:** the canonical CMS Studio, SiteDocument/section-library, real Cloudflare D1/R2/FNF storefronts, and portable SDK consumers. Do **not** create a fifth editor.

## The contract is not “Liquid in TypeScript”

Shopify has independent model, content-entry, template, section, block, merchant-settings, dynamic-source, and delivery concepts. Our renderer can stay TS/React/HTML/Rust, but those **boundaries** must be real. Liquid is Shopify's presentation templating language; Shopify itself is not merely Liquid. Do not mechanically rename CMS rows as “metaobjects” without typed relationships and management workflows.

### Verified Shopify platform behaviors (official primary documentation)

| Actual Shopify feature | Concrete behavior | Implication for Inner Animal |
|---|---|---|
| Metaobject **definition** | Versionable custom type name, typed fields, validations, access and capabilities | Definition is a merchant-usable content schema, not a CSS/section manifest. |
| Metaobject **entry** | Reusable structured content record; publishable status, renderable SEO and optional online store capability | Helicopter restoration, build milestone, collaborator and project story are entries, not hardcoded section defaults. |
| Metafield | Typed extension of a product, collection or other first-class resource, including references | Preserve product commerce authority; attach typed extension data rather than copying product JSON into sections. |
| Metaobject web page | OnlineStore-enabled entry can be routed using a metaobject template; default + alternate templates | Project Story detail pages should be generated through resource/template assignment, not repeated static HTML. |
| JSON template | Object of section instances + explicit order, settings, blocks, block_order, disabled flags | One template may have multiple instances of one renderer; preserve instance IDs and ordering. |
| Section | Reusable renderer plus schema, settings, blocks, presets and eligibility | Portability requires runtime semantics, CSS, media and interactions, not a rename or a screenshot. |
| Theme block | Independently reusable component that may nest and accept compatible blocks | Distinguish nested/static/merchant reorderable types. Never flatten all content into card1/card2/card3. |
| Static block | Customizable but cannot be removed/reordered by merchant; deterministic ID | Protect structural chrome/controls while keeping merchant configuration. |
| Section group | Reusable, ordered shared region, including header and footer; contextual overrides | Announcement, navigation and footer belong to proper global layout groups. |
| Dynamic sources | Merchant connects section or block settings to compatible resource attributes, metafields and metaobjects | Field editor must support typed source pickers and explicit bindings, not only direct literal strings. |
| Theme settings | Schema and stored settings kept separate | Source design tokens retain theme identity; merchant-selected overrides are explicit and scoped. |
| App blocks | Integrations registered by apps, not copied snippets | Plugin capabilities need declared permissions, safe rendering and lifecycle. |

**Shopify facts / references:**  
- Metaobjects and entry/definition rules: https://shopify.dev/docs/apps/build/metaobjects  
- Definition capabilities (publishable, translatable, renderable, onlineStore): https://shopify.dev/docs/apps/build/metaobjects/use-metaobject-capabilities  
- Metaobject pages and template assignments: https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject  
- Metafield / reference types: https://shopify.dev/docs/apps/build/metafields/list-of-data-types  
- Templates: https://shopify.dev/docs/storefronts/themes/architecture/templates  
- JSON section instance/order/blocks: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates  
- Section schema, presets and eligibility: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema  
- Shared section groups: https://shopify.dev/docs/storefronts/themes/architecture/section-groups  
- Nested, static and dynamic theme blocks: https://shopify.dev/docs/storefronts/themes/architecture/blocks and https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks  
- Dynamic sources and context: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources  
- Schema vs values of theme settings: https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json and https://shopify.dev/docs/storefronts/themes/architecture/config/settings-data-json  
- Shopify's numerical resource limits are *its* limits, not constraints we should automatically copy: https://shopify.dev/docs/storefronts/themes/architecture/limits

## Existing project reality: preserve, do not restart

This repository currently has a SiteDocument v1 in **packages/site-contracts/src/site-document.ts** with brand/header/footer/pages/ordered sections; a set of semantic renderers in **packages/section-library**; Revise's visually distinctive renderer + motion in **packages/revise-theme**; and the 4319 five-page live design in **examples/revise-foundation**. SiteDocument v1 is a usable **composition/donor compatibility format**. It is **not** a general typed object database, template assignment registry, immutable publication or media rights catalog.

FNF's existing **apps/ecommerce-cms-agentsam** includes a production-admin GUI, Cloudflare D1/R2/KV paths, media, and a 24-renderer Revise Atlas adapter (on top of legacy renderer contracts). The six public layers in a screenshot can greatly exceed the four page-section rows; don't conflate presentation regions, renderer types, instances and D1 rows.

The canonical CMS Studio work in **apps/cms-studio-portable** and the FNF theme editor must converge through contracts and capabilities, not by introducing another layout editor. The local Revise “Edit Site” drawer is **rejected** and must not be restored.

## The five independent authorities

1. **Structured resource definitions + records:** site-scoped content models (e.g. Project, Vehicle, Milestone, Collaborator, Story, Campaign), typed field validators, stable record IDs, localized fields, access/state. Products remain owned by commerce adapter. Project imagery is a media reference, never a copy of R2 URL embedded in all pages.
2. **Templates + routes:** template type, template ID/version, default/alternative assignment, page/resource association, ordered section instance IDs, global groups and policy for contextual overrides. Creating an article or Project record does not automatically publish a website route.
3. **Renderer manifests:** versioned runtime package ID, compatible field/blocks types, script/CSS dependency manifest, responsive modes, motion behavior, provenance, visual regression fixtures. A theme may host another theme's scoped renderer without silently changing its appearance.
4. **Typed bindings:** explicit literal or resource selection or reference path with type checking, fallback behavior and permission; predictable nearest-resource context. A “dynamic” label is not a typed binding.
5. **Versioned authoring/publishing:** authenticated draft editing, concurrent edit detection, inspectable diff, immutable render snapshot or snapshot references, preflight assets/links/capabilities, atomic published-pointer switch, rollback, audit. D1/R2 don't share one transaction: stage immutable R2 first, verify, then D1 switch with recoverable journal/outbox; KV/CDN only cache committed revisions.

## Normative logical contract (proposed; not already deployed)

~~~json
{
  "schemaVersion": "iam.cms/2",
  "siteId": "site_fnf",
  "resource": {
    "type": "restoration_project",
    "id": "project_helicopter",
    "revision": "content_000004",
    "fields": {
      "title": "Helicopter restoration",
      "milestones": {
        "kind": "references",
        "type": "project_milestone",
        "ids": ["milestone_disassembly", "milestone_airframe"]
      },
      "cover": { "kind": "media", "assetId": "media_existing_helicopter" }
    }
  },
  "template": {
    "id": "fnf.project-story",
    "version": 1,
    "resourceType": "restoration_project",
    "sections": {
      "opening": {
        "renderer": "@inneranimalmedia/revise-theme/campaign-teaser",
        "rendererVersion": "pinned-version",
        "settings": { "surface": "inverse" },
        "bindings": {
          "heading": { "kind": "resource", "path": "title" },
          "mediaKey": { "kind": "resource", "path": "cover" }
        },
        "blocks": {}
      }
    },
    "order": ["opening"]
  },
  "globalGroups": ["fnf.announcement", "fnf.header", "fnf.footer"]
}
~~~

**Illustrative structure only:** IDs and version string are examples, not live database rows. Renderer source remains code, merchant content remains an entry, and a template owns section composition. Field schemas must know whether the actual renderer expects string/media ID/resource instead of guessing from property names.

## Drift-prevention laws

- Never silently replace original source renderers with stylistic approximations; retain scoped original CSS, fonts, spacing, responsive geometry, media positions, scroll and motion behavior, and block semantics.
- Preserve stable section and block instance IDs through add/move/duplicate/save/publish/rollback; round-trip must not synthesize or lose blocks.
- Never use fixture copy as live customer content. A source donor fixture is a migration input, not the D1/R2 authority or a published page.
- The page preview and live storefront must run the SAME renderer and pinned package versions. A screenshot-sized iframe is not render parity.
- No one-off script as a required step for merchant edits. Commands may migrate/verify once, but GUI must use versioned server APIs, read back persisted resources, and enforce tenancy/capabilities.
- No secret raw API keys in browser. No standalone authoring drawer in the public site.
- Separate data validation from style and from publication. Do not claim a published endpoint works just because local tests pass.
- A missing section or media reference is an explicit error, never Home as an implicit fallback, a placeholder image, or invented content.
- No automatic promotion of drafts, staged product concepts, or media to production.
- Check visual equality at desktop, tablet, phone and reduced-motion, and preserve previous known-good screenshot/artifact baselines.
- Package updates require explicit compatibility proof or version pin; upgrades must not change old published sites by default.

## FNF target demonstration — actual customer use

A merchant creates a “Helicopter Restoration” content entry in Content > Projects; attaches the existing album via cloud picker; adds milestones; selects Project Stories template. A real story teaser, card deck, six-image gallery and film bind to those resources. Merchant can reorder allowed sections and change presentation settings. Announcement/header/footer remain shared global groups; the same project may appear on homepage cards, a project-detail template and campaigns without copied title/media. On Save, D1/R2 revision is read back from server. On Publish, selected version becomes visible; on Rollback, the previous URL and content work unchanged.

## Release gates

G0 — Inventory actual visual/page layers and existing package owners; establish screenshot + DOM + CSS/motion baseline.
G1 — Run existing Stories page without its rejected Edit Site drawer. No changes to public navigation, media, order or layout; check dark section text contrast and scroll containment.
G2 — Import **resource references**, not hardcoded final URLs, into editable source sections; demonstrate metadata + bindings in one page with server persistence.
G3 — Template instantiation from GUI creates a true route and page without scripts, preserving originals and respecting global groups.
G4 — D1/R2 revision and publish rollback tested on a staging tenant + concurrent edit/cached delivery faults.
G5 — Same page renders equivalent visuals and behavior in FNF, hosted CMS Studio and independent SDK consumer. No temporary donor checkout required.
G6 — Only after G0–G5: consented production cutover, monitoring and rollback instructions.

**Authoritative decision:** Do NOT draft another speculative CMS migration based only on section counts. First map current and desired schema capabilities to actual D1, R2, SDK and editor code with tests proving a migration is needed.
