# Revise foundation audit

## Decision

The canonical implementation home is this repository: inneranimalmedia-cms.

Revise is not being developed inside the extracted Arena workspace and is not being added to agentsam-sdk.

The initial package surface is:

- @inneranimalmedia/site-contracts
- @inneranimalmedia/section-library
- @inneranimalmedia/revise-theme
- examples/revise-foundation

## Evidence audited

The extracted inneranimalmedia-site-packages proof at commit 81e6e48 contains useful first-pass site-contracts, section-library, FNF and MSX theme work. Its shared build passed and its section-library suite passed 17 tests.

That proof is retained as provenance/evidence, not copied wholesale. It still contains donor-era guardrails and provider-specific assumptions that do not belong in the canonical shared contract.

The existing inneranimalmedia-cms/sections directory contains useful customer and application section evidence, but those HTML files are not the new shared section-library authority.

agentsam-sdk/packages/theme-scenes remains a candidate source for the later scene/runtime convergence phase. It is intentionally not pulled into the token/layout foundation before that audit happens.

## Ownership established

@inneranimalmedia/site-contracts owns machine-readable framework-independent contracts for layout, themes, sections, page presets and logical media references.

@inneranimalmedia/section-library owns semantic section renderers plus geometry/layout CSS. It does not own theme colors, customer content, commerce authority or provider URLs.

@inneranimalmedia/revise-theme owns Revise character: semantic tokens, CSS treatment, motion language, shell treatment, variants, manifests and presets.

The application/host owns routes, actual content, logical-media resolution, provider adapters and deployment configuration.

## Foundation acceptance status

The first slice proves:

- mobile-first width roles: full / max / wide / content / reading;
- 1440 / 1320 / 1200 / 760 layout bounds;
- fluid gutters;
- safe-area utilities;
- 44px touch floor;
- iOS form text floor;
- semantic Revise color, typography, spacing, radius, motion and layer tokens;
- reduced-motion CSS;
- host-resolved logical media keys;
- page preset -> section preset -> shared renderer -> Revise styling;
- ESM registration and machine-readable manifests;
- production Vite build;
- npm pack surface;
- installation into a separate packed consumer.

The foundation preset is intentionally not the final seven-act showcase page.

## Repository portability note

The repository-wide portability audit still reports pre-existing blockers in the legacy Studio and Cloudflare deployment surfaces. The reported findings do not point at the new packages or the Revise demo. Those findings remain a separate CMS portability closeout lane and should not be hidden by the theme work.

## Next convergence gates

1. Audit and normalize the shared scene vocabulary before Revise adds sticky or scroll-controlled behavior.
2. Promote additional semantic sections only when their generic data contract is clear.
3. Build one overlay lifecycle before menu, cart, search and quick-view variants.
4. Add the full Revise showcase preset only after the first section groups are proven at mobile, tablet and wide desktop sizes.
5. Keep donor/provenance material outside public npm tarballs.


## 0.2 showcase correction

The first foundation commit proved package boundaries but materially underused
the captured Radian evidence. The 0.2 correction adds the actual experiential
system: directed short/tall rhythm, sticky and pinned desktop compositions,
mobile de-pinning/stacking, horizontal rails, hotspots, tabbed discovery,
multi-act commerce/editorial pacing, adaptive header state, and the shared
overlay choreography.

The showcase now uses roughly the same seven-act shape as the reference evidence
without carrying donor identity or provider authority into Revise.

## Completeful-backed merchandising fixture

The Revise demo now includes a commerce-offers / merch-lab acceptance slice.

Source evidence was read from the Fuel & Free Time remote D1
completeful_catalog_products mirror on 2026-10-02, limited to currently
available catalog rows. The demo fixture keeps provider-specific product IDs,
source names, fulfillment baselines and catalog image URLs in the example only.

The publishable @inneranimalmedia/revise-theme and
@inneranimalmedia/section-library packages receive normalized records and contain
no Completeful, F&FT, Supabase catalog URL or other provider authority.

The initial demo fixture uses safe, broadly reusable catalog families such as
DTG apparel, mugs/drinkware, engraved accessories, pet personalization, small
decor and bookmarks. Alcohol/cigar-oriented catalog items were intentionally not
used.

Demo retail and bundle prices are merchandising proposals, not Completeful
pricing. Displayed estimated gross margin is calculated only against the
mirrored fulfillment baseline and intentionally excludes shipping, payment
fees, tax, discounts and returns.

The reusable bundle-offer surface supports product role, compare-at total,
bundle price, savings, optional fulfillment economics and an actionable
data-commerce-offer hook. The demo uses that hook to preview the chosen bundle
inside the shared bag overlay.
