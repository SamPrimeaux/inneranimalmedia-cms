# Shopify parity map — actual repository implementation gaps

**Audit date:** 2026-10-06. **Classification:** source-backed implementation audit, NOT a declaration of readiness. Read [Shopify architecture research](./SHOPIFY_METAOBJECTS_TEMPLATES_SECTION_ARCHITECTURE_20261006.md) for official API/architecture citations.

| Shopify capability | Actual existing owner | Verified state | Blocking capability |
|---|---|---|---|
| Metaobject definition | SiteDocument v1 under packages/site-contracts; FNF-specific domain models | Site layout contract, not user-definable schema | Typed merchant-defined content types, constraints, access, locale |
| Reusable entries | FNF domain product/media/campaign tables, Revise donor fixture | Domain records exist; generic entry editing not demonstrated | Project/Story/Milestone data independent of page design |
| Metafield/resource extension | FNF commerce/media adapters | App-specific extension patterns | Typed extensions with reference checks |
| Alternate template assignment | SiteDocument pages and FNF Revise Atlas | Source layouts render | Template types, resource assignment and route CRUD |
| Metaobject web pages | Hardcoded /stories and fixture | Existing public source routes | Per-entry URL/SEO/preview/publish through GUI |
| Global section groups | SiteDocument header/announcement/footer | Actual chrome renders | Revisions, permissions, GUI, shared group updates |
| Renderer/section schema | section-library, revise-theme, FNF Revise Atlas | Authentic renderer semantics, tested at four widths | Versioned renderer dependencies and independent consumer tests |
| Theme and static/nested blocks | SiteSection.blocks, existing FNF block editor | Basic repeatable content | Nested/static blocks, compatibility, stable block order |
| Dynamic source selection | FNF DOM bindings and section content fields | Mostly literal fields | Typed picker, referenced entry/asset, binding context and fallbacks |
| Theme settings | Revise tokens and FNF theme configuration | Theme-owned character | Explicit stored overrides, compatibility and migration |
| Media usage | R2 + media D1 index | Real managed assets exist | Usage graph, focal/alt/crop, immutable media refs |
| Draft/publish | FNF CMS D1/R2/KV, canonical Studio packages | Host-specific APIs implemented | Page-level immutable commit, rollback and failure recovery |
| Source-to-live fidelity | Real Revise runtime | Chrome checked Stories at 390/744/1180/1920 | SDK and FNF visual parity with renderer version pin |
| Desktop/local | CMS-runtime SQLite / AgentSam desktop | Tooling exists | Tenant cloud sync and conflict-proof changes |

## Owner boundaries and binding law

- Domain entries are independent of page composition; an FNF aircraft restoration is one record, not copies of copy embedded into four sections.
- Template instance IDs and block IDs must remain stable through edits and rearrangement; sections define visual behavior and valid inputs.
- A theme provides styles and motion with pinned packages. A host may offer explicit overrides; it must not silently approximate another theme.
- Global announcement/header/footer and page masthead are *visible layers*, even though only four Stories body sections have instance IDs.
- D1 owns site/tenant, route and revision pointers. R2 owns immutable content/media objects. KV/CDN is delivery only. Do not attempt cross-store “atomic” writes without staged immutable R2 and recoverable D1 pointer switch.
- Content authoring occurs in the established CMS Studio/Theme Editor via server API. The read-only Revise donor site no longer has a browser-local Edit Site drawer.

## What we can actually claim after this branch

**Proven:** Shopify research, eight-layer inventory, read-only source cleanup, real comparison/card/gallery/film section continuity, contrast and media coverage, source renderers still working; no layout-wide rebuild.

**Not proven:** generic structured content entries, server-side Stories template/route assignment, typed media/resource binding pickers, publish/rollback on independent merchant tenant, global-group GUI CRUD, FNF/live consumer package promotion. These are not “nearly finished” because a demo renders.

## Next implementation gate (not a separate editor)

Bind one actual FNF Project entry into two *existing* renderer instances with different styling, using the current Studio and cloud adapters. Verify content edit → both previews update → draft persists after reload → publish approved snapshot → rollback, while the original Stories and live Shop continue rendering unchanged. No GitHub or command line interaction for the merchant.
