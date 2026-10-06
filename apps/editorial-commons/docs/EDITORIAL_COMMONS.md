# Editorial Commons / FORM / 26

Status: Source-backed React component study and working multipage preview, not a production commerce or brand recovery service. The original RADIAN15 repository name and the multipage PR remain preserved in Git history; the UI uses a replacement demonstration brand.

## Run

    npm install --ignore-scripts
    npm run lint
    npm run build
    npm run dev -- --host 127.0.0.1 --port 4331

Open the main storefront at http://127.0.0.1:4331/ and the 39 individually inspectable sections, overlays, PDPs and pages at http://127.0.0.1:4331/?gallery=1.

Full site routes: #/, #/collections, #/lookbook, #/maison, #/reserve, #/studio, #/product/leather-tee.

## Portable React boundary

- src/portable/EditorialHost.tsx owns consumer brand, catalog, and optional commerce callbacks; all original shared catalog imports now resolve from this host.
- src/portable/EditorialScene.tsx can render one named scene with props for a custom brand, product catalog, and provider-specific commerce actions.
- src/portable/scene-manifest.ts declares 39 real source-backed components/pages with stable IDs, source paths, and honest review status.
- src/portable/EditorialSceneGallery.tsx exposes independent desktop/mobile previews.
- src/context/CartContext.tsx keeps the UI cart initially empty and supports all new browser hash routes.
- src/components/pages contains the five additional pages from the multipage PR.
- src/data/catalog.ts and src/data/brandStreamData.ts are demonstration content only; they are not customer authorities.

## Implementation boundaries

The original 34 components remain present, including sticky curtain, category rail, dark promos, story rings/viewer, collection carousel, full-screen editorial, diptych, product hotspots, bundle, featured PDP, ticker, film, before/after, testimonials, stories, newsletter, social, global header/footer, menu, search, bag, quick view, and AgentSam studio. All five new pages are preserved.

This is currently a reusable React host interface, not a cross-framework, theme-CMS section package or published npm artifact. The animations and several styling rules still contain donor-specific assumptions; an adapter and isolation tests are needed for vanilla HTML/CMS consumers.

## Important demonstration disclosures

- Merchandise, currency exchange, availability, VIP allocations, store locations, customer reviews and editorial content are fixtures, not verified customer data.
- The cart operates locally; no checkout is available unless a host explicitly supplies a checkout callback. Promotions require a host validation callback.
- Brand Stream file counts, hashes, recovery steps and receipts are illustrative. No files were inspected, no canonical brand was approved and no recovery worker ran.
- VIP passes, countdowns and code unlocks are sample experiences. No entitlement is issued.
- Maison showroom addresses and booking form are conceptual; no appointment is scheduled.
- The AgentSam assistant status lists are mock demonstrations, not measured health reports.

## Acceptance

    npm run lint
    npm run build
    PLAYWRIGHT_PACKAGE=/path/to/playwright EDITORIAL_CHROME=/path/to/chrome npm run smoke:editorial

Browser QA covers 39 individual scene mounts, seven multipage hash routes, custom client branding, initially empty cart, the studio/booking/reserve disclaimers, and 360/390/744/1440/1920px viewport widths across representative pages.

Promote a scene into the shared site section registry only after typed content contracts, logical media keys, configurable tokens, keyboard/touch accessibility, real backend adapters where applicable, and second-customer integration tests pass.
