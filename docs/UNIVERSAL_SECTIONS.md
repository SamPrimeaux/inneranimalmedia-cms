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

## React cross-brand acceptance

The original Editorial Commons HeroCurtain component accepts a SiteSection from EditorialScene/EditorialHostProvider. Supported content: eyebrow, heading, body, mediaKey, CTA label and CTA destination. It also uses backgroundMediaKey as a media fallback and a host-supplied media resolver. No other customer's photo is substituted for a missing media key. When a customer SiteDocument is passed, donor shopping hotspots and fake bundled checkout controls are excluded. Without a SiteDocument, the original donor preview remains intact.

FIELDWORK / STUDIO is an unrelated illustrative brand fixture, supplied using a complete SiteDocument v1. The same HeroCurtain component renders a different heading, body, CTA, and media without a copied component.

Original scene:
    /library/evidence/editorial-commons/index.html?scene=curtain-hero

Different customer document:
    /library/evidence/editorial-commons/index.html?scene=curtain-hero&fixture=fieldwork

The Design Atlas exposes all 39 original scene IDs, a complete independent gallery and this cross-brand fixture. Review visibility is not a claim that every donor component is already a production-grade CMS section.

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

For optional browser acceptance, set PLAYWRIGHT_PACKAGE and REVISE_CHROME then run npm run smoke:universal. Use CMS_UNIVERSAL_URL to target a nondefault test server.

## Remaining promotion criteria

For each remaining donor scene: declare actual SiteSection data and blocks; remove fixture dependencies and fake commerce actions; resolve real media keys from the host; enforce accessible keyboard/touch semantics, responsive layout and reduced motion; expose configurable tokens; and verify live editing and rendering against two genuinely distinct customer documents. Cross-framework mounting for the HTML renderer and storage/production publishing adapters are still to be completed. An iframe is only for isolated review, never the reusable production section.

## Pre-existing portability audit debt

The repository-wide portability audit currently reports 47 blockers (26 critical and 21 high) in existing CMS/studio/runtime/deployment files. This is the same blocker count on the previous main checkout and the integrated branch. The new section-contract and Editorial Commons sources were not flagged, but the overall CMS repository does not yet meet its portability audit gate. Do not publish it as universally production-safe on the strength of visual/source integration alone.
