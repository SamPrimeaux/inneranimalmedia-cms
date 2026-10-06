# Inner Animal CMS — Shopify architecture compatibility audit
Date: 2026-10-06 | Status: experimental proofs, NOT CMS v2 schema approval

## Decision
The system must have five logical, interoperable authorities within ONE CMS product:
typed content, resource/template/page composition, presentation implementations,
typed binding/extension, and merchant authoring/publication.

Shopify reference concepts (official):
- Metaobject definitions and entries: https://shopify.dev/docs/apps/build/custom-data/metaobjects
- Metafields: https://shopify.dev/docs/apps/build/custom-data/metafields
- JSON templates: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- Section groups: https://shopify.dev/docs/storefronts/themes/architecture/section-groups
- Reusable theme blocks: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks
- Dynamic sources: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources
- Theme settings: https://shopify.dev/docs/storefronts/themes/architecture/settings

The objective is Shopify-level separation, structured relations and merchant
usability, NOT to clone Liquid or introduce four new CMS/editor apps.

## Actual repository authority map

| Capability | Existing authority | Audit status and gap |
|---|---|---|
| Typed standalone content | SDK packages/cms-runtime/schemas/sqlite/cms-local-runtime.v1.sql | ABSENT: sites/pages/sections/blocks exist, but no independent typed entries/definition validators shown |
| Resource extensions | FNF db/schema.sql product/media tables | INCOMPLETE: typed metafield-like extension contracts missing |
| Media library | FNF media_assets/media_albums; SDK media kit | EXISTS: requires stable AssetRefs/focal/crop/version adapters |
| Resource template assignment | packages/site-contracts/src/site-document.ts | INCOMPLETE: pages/sections stored, not resource type templates and assignments |
| Section renderers | packages/section-library and authentic theme packages | EXISTS / DUPLICATED: pin design CSS/JS/responsiveness/dependencies |
| Reusable nested blocks | SiteContentBlock flat list; SDK cms_blocks | INCOMPLETE: no typed compatible nesting and presets |
| Section groups | SiteDocument header/footer | INCOMPLETE: global reusable versioned groups missing |
| Dynamic source bindings | sceneMedia helper; new experimental content-bindings.ts | INCOMPLETE: pure resolver proved, no persisted adapter/UI |
| Theme settings | SiteDocument design tokens; SDK theme packages | FRAGMENTED: isolate sections from host visual reinterpretation |
| Authoring UX | SDK client-cms-editor; agentsam-content-studio; CMS Studio; FNF admin | DUPLICATED: reconcile one merchant product |
| Draft/version/revision | SDK cms_revisions/cms_publications and adapters | PARTIAL: needs typed-entry versioning and end-to-end acceptance |
| Immutable publication | integration/host-adapters/cms-editorial-publisher.js | ABSENT: currently overwrites mutable R2 route key |
| Donor curation | external Dawn and ~/.agentsam/curation/meaux-theme-curation.sqlite | EXPERIMENTAL: useful prototype, /tmp board is not durable product |

Current CMS main at e105cd4 ALREADY installs and publishes bound React editorial
sections. We must extend/reconcile those contracts, not create a new editor.
SDK also has a separate CMS runtime, local adapter and many theme packages.

## What the current architecture gets wrong

- Section instance defaults often embed content that should be a reusable
  typed resource record.
- Pages/templates are not consistently assignments of resource types to
  instances of separately defined renderers.
- Existing block models flatten nested reusable blocks to data arrays.
- A renderer package alone does NOT guarantee the original geometry, motion,
  media placement, typography, scoped CSS or interactions travel unchanged.
- The editor may expose its registry rather than the real published site.
- Production publisher directly calls bucket.put on project/page/index.html.
  An R2 write plus a D1 write is NOT an atomic multi-service transaction.
- Overlapping package/editor code means a quick local success can drift from
  desktop/hosted CMS and live FNF.

## Three acceptance gates

A. CONTENT INDEPENDENCE: A single typed restoration-project entry references
milestones and managed media and can populate three completely different
renderer designs. Editing once updates all projections. The new
packages/site-contracts/src/content-bindings.ts does this as a pure immutable
projection and validates content types. Unit tests pass, but this is NOT yet
wired through merchant UI or persistence.

B. PRESENTATION INTEGRITY: Preserve selected donor style, exact template
geometry, animation and responsive behavior. The first implementation is
gallery.filterable-grid@1 from curated source 95c026640d9c4949. Its complete
original CSS is SHA-256 99a848f16d4bde662b9e2ea95ba6fec0c285415dd4aa0bf45a5b2440015b4ac2.
Two selectors (:root/body) become :host for Shadow DOM isolation; donor
classes/breakpoints survive. Filter behavior is newly component-scoped and
accessible, not a blind copy of donor inline script. New unrelated consumer
Northline Journal installs real package tarballs and renders own records.
Chrome headless verified that the packaged custom element initializes and
clicking the Urban filter hides one nonmatching item (three to two visible)
and sets aria-pressed=true. The Chrome probe yielded the expected DOM result,
although Chrome did not terminate within the process timeout.
Pixel-equivalence and the full interaction matrix are NOT yet tested.

C. PUBLICATION INTEGRITY: Merchant edits/preview/save, uploads immutable versioned
assets/renderer + content manifest to R2, validates checksums and references,
switches D1 site publication pointer by compare-and-swap only after staging
completes. Rollback changes pointer to prior manifest; orphaned stages can
be reconciled. Cloudflare CDN/KV are derived and may cache prior content.
Full workflow and failure injection NOT implemented. Do not declare done.

## Recommended portable CMS authority boundary

- SDK cms-runtime + client-cms-editor: persistence/CRUD/revisions/adapters.
- Site-contracts: resource, template and binding shapes; no runtime dependency
  on FNF/Revise content.
- Theme renderer packages/section-library: owned semantic markup, scoped styles,
  animations, media slots and exact versions; explicit supported overrides.
- Existing CMS Studio and Content Studio: one coherent merchant UI over adapters,
  not separate editors.
- FNF: primary production content/media/publishing acceptance consumer.
- AgentSam Machine + donor library: read-only evidence and human selection,
  NOT publication/content ownership.
- All site/resource mutations must validate owner/tenant permissions.

## Dawn donor archaeology evidence

Raw donor: /Volumes/Expansion/WEBSITES/theme_export__dmmane-vd-
Curation: ~/.agentsam/curation/meaux-theme-curation.sqlite

Read-only audit command:
python3 scripts/audit-shopify-architecture.py --donor PATH --curation-db DB
--collection pipeline-v1 --out OUT --materialize-selected

Oct 6 outcome: 88 JSON templates; 56 Liquid section implementations;
197 nonempty custom-Liquid instances; 168 distinct embedded designs;
11 preselected source SHA matches; only 264KB selected source/evidence
materialized outside repo. Earlier higher counts included empty custom
instances and section-group JSON files. No source or SQLite changes.
All 11 remain status=planned; NOT automatically promoted.

## Hard requirements before schema migration

1. Typed definitions/entries with validation, access, versioned migrations.
2. Typed refs to entries/media, missing references and strict tenant checks.
3. Page templates store assignments, instances, order and binding maps, not
   duplicated content data.
4. Renderer manifests pin exact package/version/hash and allowed overrides,
   preserve source styling/JS/scroll positioning/motion/media focal points.
5. Nested compatible blocks and shared global section groups.
6. One actual merchant editor; local desktop and hosted parity.
7. Immutable release staging, D1 pointer, rollback and recovery. No mutable
   route write before approval or false R2/D1 distributed transaction.
8. Acceptance tests across original, FNF and fresh SDK consumer.

## Implementation gates / status

1. Repo/package authority reconciliation: initial audit completed, duplication
   remains unresolved.
2. Pure typed resource/binding contract + 3 designs: tested. Persistence/UI pending.
3. Gallery CSS/renderer + new consumer from tarballs: tested. Visual-diff pending.
4. Reliable cloud publication and rollback: NOT implemented.
5. Product-library promotional receipts: NOT implemented; keep the 11 planned.

This is not yet a resellable CMS v2 release. No live sites, D1 databases or
R2 published assets were changed.
