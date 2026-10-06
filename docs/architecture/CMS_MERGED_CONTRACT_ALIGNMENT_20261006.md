# CMS contract reconciliation after merged PRs #2 and #3

**2026-10-06 · Scope: actual code, not a new CMS application.**

## Decision: one domain contract, existing adapters

PR #2 added accurate eight-layer Stories composition and source-faithful Revise renderer tests. PR #3 introduced \`ContentDefinition\`, \`ContentEntry\`, typed reference validation, \`SiteBindingPlan\` and renderer locks. Their responsibilities did **not** yet include template definition/version/assignment. This change adds \`CmsPageTemplate\`, \`CmsTemplateRegistry\` and \`CmsTemplateAssignment\` **in the same \`@inneranimalmedia/site-contracts\` package**. No duplicate content model, editor, D1 migration or renderer is introduced.

| Concern | Exactly one current authority | Contract/conversion |
|---|---|---|
| Site identity/route/brand/global chrome | \`SiteDocument\` v1 | Keep read/write format intact, no version bump |
| Metaobject-like definition | \`ContentDefinition\` from PR #3 | Typed fields/validation, distinct from CSS renderer schema |
| Metaobject-like entry | \`ContentEntry\` from PR #3 | Independent content, optional existing-fixture \`siteId\` (required by future tenant storage adapter) |
| Product/collection commerce | FNF commerce source | Typed references/adapter, NOT copied into pages or generic “entry” records |
| Asset reference | \`AssetRef.key\` | Stable provider-neutral asset identifier, never raw R2 URL, external URL or browser key |
| Template definition | \`CmsPageTemplate\` here | Versioned source theme, actual section structure, slot-to-field bindings and global-group references |
| Template assignment | \`CmsTemplateAssignment\` here | Page ID + exact template ID/version + typed contextual entry ID |
| Actual sections/blocks | \`SiteSection\`, \`SiteContentBlock\` and renderer package | Stable instance/preset IDs; no section migration during content edits |
| Renderer implementation | \`@inneranimalmedia/section-library\`, \`revise-theme\` | Owns markup, CSS, scroll, responsive and media behavior; explicitly pinned cross-theme |
| Dynamic source resolver | \`bindSiteDocument\` → \`bindAssignedTemplates\` | Pure projection; never persists into source template defaults or rewrites original entry |
| Site/global groups | Existing SiteDocument header/announcement/footer | Referenced by template, not repeated as fake four additional page sections |
| Merchant GUI | Current \`apps/cms-studio-portable\` + FNF existing admin editor | Requires actual backend adapter; no slide-in drawer, no fifth editor |
| Durable storage | FNF D1/R2 (SQLite local adapter planned) | Tenant/typed entry/template/version storage **not implemented by this PR** |
| Publish | Existing FNF publishing API pending full revision acceptance | Template validation is NOT transactional publishing or production readiness |

### Why the models are separate

Shopify's metaobject definition/entry, metafields, resource templates, sections/theme blocks, section groups, settings and dynamic sources are separate concepts. Liquid is Shopify's renderer language; ours may remain semantic TS/React/HTML. See \`docs/architecture/SHOPIFY_METAOBJECTS_TEMPLATES_SECTION_ARCHITECTURE_20261006.md\` and https://shopify.dev/docs/storefronts/themes/architecture/templates / https://shopify.dev/docs/apps/build/metaobjects .

A \`CmsPageTemplate\` is **presentation composition** with explicit reference bindings. Its section \`data\` retains authored design defaults/fallbacks from the existing SiteDocument v1; it is **not authoritative customer content**. The \`ContentEntry\` is independently maintained and projects values at view time. An assignment pinpoints one installed template version and contextual entry. Updating one entry affects all its bound section views, without creating new pages, resetting styles, or overwriting other content.

### FNF adapter rules (integration still required)

FNF's \`apps/ecommerce-cms-agentsam\` stores \`page_sections\` and R2 JSON objects; \`__editor.templateKey\` is a host editor schema key, \`__editor.themePreset\` is the host/Atlas catalog ID, and \`__editor.sourcePreset\` records the **real renderer ID**. Never equate those fields.

For Revise sections:

- Source renderer identity is \`revise/campaign-teaser\`, \`revise/sticky-card-deck\`, etc.
- FNF's imported catalog may call those \`revise-atlas/campaign-teaser\`, etc. This is an adapter/catalog ID, **not a different renderer implementation**. Its \`sourcePreset\` maps back to the actual renderer.
- \`CmsPageTemplate.sections[].preset\` refers to the actual renderer, while FNF resolves its existing section R2 object using the stable host section key and package adapter.
- \`TemplateSourceBinding.slot\` is an actual top-level renderer data field; \`field\` is a real \`ContentDefinition\` field; \`resource\` points to a specific site-scoped entry. Media is projected with \`asset-key\` into the existing \`resolveMedia\` adapter.
- \`rendererLocks\` pin exact package versions/integrity when Revise sections are assigned to a Heuristic host. A lock is not proof that the CSS or interaction bundle has been installed; both must be verified in that consuming site.
- FNF database \`pages.status\`, section rows, and published snapshots remain current separate authorities until an approved migration. Do not infer that saving a template registry causes a D1 write or new public route.

### Canonical Studio adapter rules (integration still required)

The existing portable CMS Studio can use this type/schema in its page inspector, but is still local/fixture-based unless its host adapter has authenticated server writes. Required GUI operations are: manage typed content definitions; create/edit entries with field validation; choose a template version for an existing/new page; select a contextual entry; bind compatible fields to renderer slots; select media via the media library; save/read back revision; preview, publish and restore. Do not use the rejected public Edit Site drawer or require merchants to run Git.

### Safety and compatibility guarantees now covered by tests

1. Original five Revise pages and **four Stories section instances** keep IDs, order and renderers; announcement/header/masthead/footer are still separate visible layers.
2. A helicopter entry drives two authentic different renderer designs (Home Wardrobe Rail and Stories Campaign Teaser) using their unchanged production renderer functions.
3. A source entry update changes both projections, not the content of \`SiteDocument\` v1 or the source \`ContentEntry\`.
4. Changed section/order/block identities, duplicate slots, wrong version, unknown source, invalid resource type, wrong tenant, and unpinned cross-theme assignment fail explicitly.
5. Raw URLs are rejected as \`AssetRef\` IDs, and existing media key resolution remains the host's responsibility.
6. Instantiating a route is an **explicit pure operation**, not an implicit mutation of a live page or an automatic publish.

## Next implementation, without drift

**A — Hosted admin adapter:** design D1 schema additions only after verifying existing FNF production rows, route authority, tenant guards, media IDs, and draft/published history. Persist \`ContentDefinition\`, \`ContentEntry\`, \`CmsPageTemplate\`, \`CmsTemplateAssignment\`, \`rendererLocks\` and \`SiteBindingPlan\` as versioned separate entities or their existing equivalents. Build atomic content read-back and migration/rollback tests in a staging tenant. Avoid speculative renamed tables.

**B — Single merchant inspector:** add typed definition/entry pickers and dynamic source selectors to the existing CMS Studio + FNF adapter. Reuse \`section-library\` renderer schemas, not a JSON textbox and not a new editor.

**C — Project Stories end-to-end:** choose the actual FNF Helicopter Project entry and current media album, assign the original eight-layer template, bind at least two distinct original sections, check original scroll/card/gallery/video behavior, save/reload in another browser, publish an approved revision, roll back. Compare real storefront screenshots on mobile/tablet/desktop. Until this passes: **contract-aligned, not customer-ready**.

**D — SDK independence:** install the same pinned renderer/content contract in a second consuming site without importing the donor checkout. No hardcoded FNF product/media URLs.

No D1/R2/KV production writes or Worker deployments were carried out by this alignment change.
