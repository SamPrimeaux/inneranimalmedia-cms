# @inneranimalmedia/revise-theme

Revise is a framework-independent visual and experiential theme system.

This first 0.1.x foundation intentionally ships the durable base before the full
showcase composition: semantic tokens, layout mapping, manifest/compatibility
metadata, reduced-motion behavior, and initial media-hero / statement variants.

## Boundaries

- @inneranimalmedia/site-contracts owns shared machine-readable contracts.
- @inneranimalmedia/section-library owns semantic renderers and geometry.
- Revise owns character: tokens, surfaces, type treatment, motion, shell styling,
  section variants and presets.
- Applications own routes, customer content and actual asset/provider resolution.

## Use

Import @inneranimalmedia/section-library/layout.css and
@inneranimalmedia/revise-theme/theme.css in the host.

The host renders semantic sections with data-theme="revise" and resolves logical
media keys such as home.hero.primary.

## Foundation preset

@inneranimalmedia/revise-theme/presets/foundation is the acceptance preset for
this initial token/layout slice. It is intentionally not the final seven-act
Revise showcase homepage.
