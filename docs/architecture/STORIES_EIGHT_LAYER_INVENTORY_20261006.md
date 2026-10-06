# Project Stories — eight visible layers, source fidelity and rehab acceptance

**Source of truth:** localhost 4319, examples/revise-foundation/pages at /stories/, screenshot set from October 6; canonical source in inneranimalmedia-cms.  
**Status:** design/contract inventory, NOT a claim that all eight layers have working cloud authoring.

| Layer | Visible design / owner | Required merchant control | Where it belongs |
|---|---|---|---|
| 1 Announcement strip | Black marquee with short editorial phrases; SiteDocument.header.announcement | Messages, show/hide, motion/reduced-motion, timing, per-site groups | Global announcement section group |
| 2 Navigation/header | Frosted white compact pill, menu/search/discover/bag, floating/sticky | Nav links from menu objects, brand mark/size, surfaces, actions and responsive states | Global header section group |
| 3 Editorial page masthead | Cream canvas, massive Project Stories title, page counter, intro copy and scroll cue | Page title/summary, kicker, spacing, surface, page metadata and route | Reusable page-heading renderer in template chrome (currently hardcoded by pageContent) |
| 4 Project Stories feature | Black/inverse cinematic split, helicopter image; currently Revise campaign teaser | Content-entry binding, project hero media, caption, CTA, crop/focal, background, accessible contrast | Revise campaign teaser with content bindings |
| 5 Story card deck | “Every machine has a story” section, overlapping/moving cards for dirt bike + helicopter + related | Repeatable story references, number/order, scroll physics presets, media selection | Revise sticky-card-deck; no flattened hardcoded card1 |
| 6 Editorial gallery | “Moments in between” full-bleed 3×2 editorial photo mosaic | Media album/individual asset references, captions, order, crops, accessibility | Revise full-bleed-grid, real blocks + media |
| 7 Cinematic video | Brand film / fullscreen red nighttime car footage, big display type and play/pause | Video file reference + poster, heading, overlays, autoplay and mute policies, reduced motion | Revise brand-film renderer |
| 8 Shared footer | Black brand/footer groups with Explore/Studio links | Menu references, newsletter provider state, legal links, brand/contact | Global footer section group |

**Actual Page Section rows:** four catalog instances (campaign-teaser, sticky-card-deck, full-bleed-grid, brand-film). Announcement, header, page masthead and footer are distinct visible composition layers even though not page-section instances. Future inventory MUST display both layers and actual stored instances; never report “only four sections” as whole page count.

## Existing file ownership

- Donor document/fixture: examples/revise-foundation/src/site-data.ts
- Donor page chrome and (rejected) local drawer: examples/revise-foundation/src/site-main.ts
- Donor layout: examples/revise-foundation/src/site.css, site-polish.css, demo.css
- Reusable markup/interaction: packages/section-library, packages/revise-theme
- Portable content contract: packages/site-contracts/src/site-document.ts
- Existing cloud consumer: fuelnfreetime/apps/ecommerce-cms-agentsam with Revise Atlas
- Canonical editor (no fifth editor): apps/cms-studio-portable + existing FNF Theme Editor

## Source and visual issues found

1. The black cinematic feature currently allows too-dark foreground text in screenshots, making Project Stories heading and body nearly invisible. Fix inherited text token at the correct scoped surface rather than altering the original layout or converting the section to light styling.
2. The public Revise preview still mounts “Edit Site”, a right overlay drawer and localStorage draft handlers. **Rejected authoring surface**: remove from public preview. The canonical editor owns edit/save/publish.
3. Page masthead is generated from page metadata in pageContent rather than a renderer-backed reusable template slot. Keep its exact typography and spatial treatment while extracting a section definition in a future compatible change.
4. Header/footer and announcement are real global layers; do not fake them as untracked one-off HTML or count them as nonexistent.
5. Stories images/video are real existing customer assets and must not be replaced by generated stock, placeholder cards or abstract gradients.
6. Scroll effects (sticky-card-deck, film, media transitions) need scroll-position and reduced-motion acceptance, not a screenshot-only test.
7. Do not replace the stage/carousel/gallery structures with generic cards and CSS grid, or pass video through a static image-only component.

## Safe initial rehab

- Remove the demo's rejected overlay authoring control while preserving its source site composition and interaction enhancement.
- Repair the source-scope inverse foreground contrast without broad global CSS changes.
- Introduce explicit, versioned representation of all eight layers for section inventory/tooling; keep independent global and page ownership.
- Validate page links, media, scroll scene and reduced-motion at 390/744/desktop.
- Compare before/after snapshots; any layout/property change outside contrast and rejected editor controls is a regression.

## Explicitly NOT finished by this document

There is not yet a complete server-backed Stories content collection, resource-bound gallery/picker, merchant template assignment and publication lifecycle. The existing FNF Revise Atlas can edit section content into drafts, but imported fixture data is not synonymous with metaobjects. No production media/content migration should happen until stable resource IDs and rollback are verified.

## Merchant test, once binding work is ready

Create a Project with helicopter media album and milestones → select Story template → modify title in Content → two different pages update predictably → change template without losing project data → media picker resolves current R2 asset by ID → save/reopen across browser → publish → confirm original footage/motion/contrast on public route → roll back. No GitHub, script, filesystem or raw JSON necessary.
