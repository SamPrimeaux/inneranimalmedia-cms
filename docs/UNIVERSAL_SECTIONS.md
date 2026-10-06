# Universal sections: one canonical repository

The canonical repository is SamPrimeaux/inneranimalmedia-cms. The source and Git history from the previous editorial-commons repository were imported as an unsquashed subtree at apps/editorial-commons/. The older repository is historical provenance and must not become a second evolving section system.

## Ownership

- packages/site-contracts owns the framework-neutral SiteDocument v1, SiteSection, content blocks, background settings, and typed-field editing contract.
- packages/section-library owns registered, independently renderable HTML sections.
- packages/revise-theme owns one visual design language, not any customer's content.
- apps/editorial-commons preserves all 39 React scenes, routes and interactions as the source-backed visual reference. Its Vite 8/React dependencies remain isolated from the root Vite 7 workspace.
- examples/revise-foundation owns the FNF editable site and the combined Design Atlas.

Rule: the customer supplies content, identity and real media; the renderer owns layout; the theme supplies appearance. Do not clone component code for each site.

## Generic SiteDocument editor

The existing FNF editor is now based on the shared exports editableSectionFields and applySectionFieldEdit. These enumerate permitted first-level content fields and validate edits to strings, multiline copy, booleans, numbers, media references, and links. Blocks support their own fields. Unknown keys, arbitrary nested data, invalid media keys and unsafe links are not silently accepted.

Edits update actual SiteSection.data and SiteSection.blocks data, persist in the local draft, and re-render the page. Header, footer, page arrangement, background surfaces and section order remain separate controls. Complex nested tabs and product variants require explicit schemas in a later pass.

## React cross-brand acceptance: seven independently configurable scenes

Seven original React components now consume canonical SiteSection records, and
none copies a component just to change the brand:

| Scene | Content and editing boundary |
| --- | --- |
| Curtain hero | Eyebrow, heading, body, CTA label/destination, media key and fallback background-media key |
| Category wardrobe | Section eyebrow/heading; variable category blocks with title, caption, media, alt and per-card link |
| Media diptych | Variable panel blocks with title, eyebrow, body, media, alt, CTA label and link |
| Editorial statement | Body, CTA label and destination (without inherited donor product quick-view) |
| Collection carousel | Section heading/eyebrow/body; variable item blocks with groups, title, label, badge, host-owned media, destination and optional descriptive price label; no synthetic purchase actions |
| Interactive lookbook | Section imagery, heading/copy, repeatable positioned hotspot blocks with story details and links; no inherited buy buttons, catalog or discounts |
| FAQ and answers | Section heading/intro/contact link; repeatable accessible disclosure blocks from customer-owned questions and answers; no inherited service promises |

Each section can be added, reordered, customized or removed independently.
The host resolves media keys; an unresolved image displays a neutral missing-media
surface instead of another brand's photography. Links are validated in the
shared CMS editing contract and sanitized again before rendering.
Customer-bound scenes do not inherit demo merchandising, add-to-bag actions or
donor product hotspots.

SiteDocument v1 also supports an optional design-token record (accent, accentSoft,
canvas, paper, ink) with six-digit hexadecimal validation. Migrated scenes use
these CSS variables and honor per-section surface settings. This is a
nonbreaking, optional contract addition, not a new competing theme system.

FIELDWORK / STUDIO is an illustrative SiteDocument fixture with its own brand,
color tokens, media registry and seven section records. COVE / PAPER is a
second, independently defined SiteDocument with different content, media keys,
routes, layout surfaces and visual tokens for collection, lookbook and FAQ.
The source-backed browser suite verifies both consumers without cloning the
original React components. The original FORM / 26 gallery remains preserved.

- Original visual reference: /library/evidence/editorial-commons/index.html?gallery=1
- Cross-brand hero: /library/evidence/editorial-commons/index.html?scene=curtain-hero&fixture=fieldwork
- Cross-brand categories: /library/evidence/editorial-commons/index.html?scene=wardrobe-gallery&fixture=fieldwork
- Cross-brand split media: /library/evidence/editorial-commons/index.html?scene=split-media&fixture=fieldwork
- Cross-brand statement: /library/evidence/editorial-commons/index.html?scene=editorial-statement&fixture=fieldwork
- Cross-brand collection: /library/evidence/editorial-commons/index.html?scene=collection-carousel&fixture=fieldwork
- Cross-brand lookbook: /library/evidence/editorial-commons/index.html?scene=lookbook-hotspots&fixture=fieldwork
- Cross-brand FAQ: /library/evidence/editorial-commons/index.html?scene=faq-trust&fixture=fieldwork
- Independent Cove collection: /library/evidence/editorial-commons/index.html?scene=collection-carousel&fixture=cove
- Independent Cove lookbook: /library/evidence/editorial-commons/index.html?scene=lookbook-hotspots&fixture=cove
- Independent Cove FAQ: /library/evidence/editorial-commons/index.html?scene=faq-trust&fixture=cove

## Editable multipage SiteDocument workbench

Open /library/evidence/editorial-commons/index.html?workbench=1

This is an authoring *study* driven by the **same SiteDocument and the same
shared applySectionFieldEdit implementation** as the CMS editor; there is
no second persistent schema. It offers:

- Site branding, validated palette inputs and independent section background surfaces
- Editable section text/CTA/media and individual collection/panel blocks
- Add, reorder and delete sections or blocks; choose a section to preview or compose the whole page
- Add/select pages, edit their titles and unique local routes, import and export valid SiteDocument JSON
- Browser-local draft persistence; no remote CMS write, checkout, booking or publish claims

The workbench uses a bundled demonstration media registry. Importing
unrelated customer JSON will preserve unrecognized media keys, but the preview
will not silently replace them with donor assets. A real CMS installation must
supply the customer's media resolver and persistence adapter.

The combined Design Atlas now contains 39 donor scenes, their full gallery,
seven FIELDWORK examples, three independent COVE examples and this workbench,
all source-backed. **Only the seven labeled SiteDocument-bound scenes have this
direct React editing adapter.** The HTML site renderer's installed Revise
sections remain separate; broader framework-independent mounting has
not yet been completed.

## Development workflow

Install root dependencies, compile contracts and verify the original Revise renderer:

    npm install --ignore-scripts
    npm run verify:atlas

Build the isolated editorial application into source-backed Atlas evidence:

    npm ci --prefix apps/editorial-commons --ignore-scripts
    npm --prefix apps/editorial-commons run lint
    npm run build:editorial-evidence
    npm run test:universal

Run the combined CMS preview:

    npm run dev -w @inneranimalmedia/revise-foundation-demo -- --host 127.0.0.1 --port 4319

The combined Design Atlas is at /library/. The Editorial Commons gallery is at /library/evidence/editorial-commons/index.html?gallery=1 on the same server. No second dev server is required to review the built source-backed scenes.

For browser acceptance, set PLAYWRIGHT_PACKAGE and REVISE_CHROME, and run:

    npm run smoke:universal
    npm run smoke:editorial:workbench
    npm run smoke:editorial:bound

To check all 39 original scenes, the standalone React smoke can target the
embedded source-backed build instead of requiring another dev server:

    EDITORIAL_PREVIEW_URL=http://127.0.0.1:4319/library/evidence/editorial-commons/index.html \
      npm --prefix apps/editorial-commons run smoke:editorial

Use CMS_UNIVERSAL_URL and REVISE_PREVIEW_URL to target a nondefault CMS server.
The original CMS still has pre-existing portability audit blockers; successful
React section QA does not constitute production CMS certification.

## Remaining promotion criteria

For each remaining donor scene: declare actual SiteSection data and blocks; remove fixture dependencies and fake commerce actions; resolve real media keys from the host; enforce accessible keyboard/touch semantics, responsive layout and reduced motion; expose configurable tokens; and verify live editing and rendering against two genuinely distinct customer documents. Cross-framework mounting for the HTML renderer and storage/production publishing adapters are still to be completed. An iframe is only for isolated review, never the reusable production section.

## Pre-existing portability audit debt

The repository-wide portability audit currently reports 47 blockers (26 critical and 21 high) in existing CMS/studio/runtime/deployment files. This is the same blocker count on the previous main checkout and the integrated branch. The new section-contract and Editorial Commons sources were not flagged, but the overall CMS repository does not yet meet its portability audit gate. Do not publish it as universally production-safe on the strength of visual/source integration alone.
