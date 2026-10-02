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

## Product relationship

Revise is a reusable theme package for @inneranimalmedia/ecommerce-cms-agentsam
and other compatible hosts. It is not a Fuel & Free Time theme fork.

Fuel & Free Time is the first paying customer installation of
@inneranimalmedia/ecommerce-cms-agentsam. Its brand, products, campaigns,
content, media, provider configuration and customer-specific page composition
remain customer-owned application data/configuration. The F&FT installation is
used as a production proving ground for package compatibility, but it is not a
"donor" from which Revise inherits customer identity.

The intended relationship is:

    @inneranimalmedia/ecommerce-cms-agentsam
      + @inneranimalmedia/site-contracts
      + @inneranimalmedia/section-library
      + one or more theme packages
          - existing customer theme(s)
          - @inneranimalmedia/revise-theme
      + customer brand/content/data

A host may install Revise beside an existing theme. Installing Revise must not
replace or mutate another theme package. Theme selection and page composition
belong to the host application/CMS.

## Public surface

Use the theme CSS with the shared section-library layout CSS, then call
enhanceRevise after the host has rendered the semantic document.

The package also exports reviseShowcaseHome and reviseShowcasePresets as a
neutral acceptance composition. No customer names, products, URLs, provider
runtime, or customer deployment assumptions are required by the package.
