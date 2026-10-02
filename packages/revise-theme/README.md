# @inneranimalmedia/revise-theme

Revise is a framework-independent cinematic editorial commerce theme.

Version 0.2 is the first full showcase composition. It turns the shared semantic
section library into a directed page with deliberate rhythm instead of a flat
stack of components.

## What ships

- semantic layout, color, type, spacing, radius, shadow, motion, overlay,
  commerce, media and layer tokens;
- adaptive hero-to-floating-pill header treatment;
- one shared overlay lifecycle with left sheet, right sheet, wide right sheet,
  top sheet and anchored card presentations;
- sticky-curtain entrance treatment;
- wardrobe swipe rail;
- editorial promo grid;
- story rings;
- tabbed horizontal product discovery;
- immersive media/product scene;
- split-media diptych;
- hotspot lookbook;
- reusable commerce-offer / merchandising lab presentation with optional economics;
- sticky bundle summary;
- pinned product-detail composition;
- ambient marquee;
- pinned media collection split;
- brand-film and campaign beats;
- logo rail;
- before/after comparison;
- testimonials;
- sticky editorial-card composition;
- newsletter, social gallery, FAQ, trust row and footer styling;
- explicit mobile transformations and reduced-motion fallbacks.

## Boundaries

@inneranimalmedia/site-contracts owns the machine-readable contracts.

@inneranimalmedia/section-library owns semantic renderers and shared geometry.

Revise owns visual character, composition presets, shell treatment and small
presentation controllers.

Applications still own real customer content, routes, commerce authority and
provider/media resolution.

## Public surface

Use the theme CSS with the shared section-library layout CSS, then call
enhanceRevise after the host has rendered the semantic document.

The package also exports reviseShowcaseHome and reviseShowcasePresets as a
neutral acceptance composition. No donor names, products, URLs, Shopify runtime,
or customer deployment assumptions are required by the package.
