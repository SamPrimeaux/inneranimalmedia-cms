# Meaux reusable specimens — existing CMS section-library

This is working, compiled source code in the existing `@inneranimalmedia/section-library`, **not** a chat-only ZIP. No `theme-scenes` or `agentsam-brand` preset ownership is introduced.

```sh
cd packages/section-library
npm run build
node --test scripts/specimens-check.mjs
# from repository root: python3 -m http.server 4477
# open http://127.0.0.1:4477/examples/meaux-specimens/
```

## Exports

- `renderSpecimenCards({ title, cards, tokens, columns, entrance })`: partner cards with lift/glow, sheen, centered underline, optional responsive entrance, safe host-supplied target URLs and images
- `renderSpecimenLinks({ title, accentTitle, links, tokens })`: Montserrat-inspired inverse link stack; links and actions are real host-owned destinations
- `renderBrandSystemPresentation({ id, name, variant, palette, tokens, typeSamples })`: original or Enhanced Teal Steel brand-book presentation in reusable HTML, not a brand intelligence tool
- `MEAUX_ORIGINAL_DESIGN`, `MEAUX_ENHANCED_DESIGN`: *optional starting values*, never a whitelist for merchants or the selected theme
- `MEAUX_SOURCE_SPECIMENS`: source candidate IDs; **not** stock/SKU registrations

`specimens.css` scopes all visual rules to `.iam-specimens`. Independent motion classes:
`.iam-motion-lift`, `.iam-motion-underline`, `.iam-motion-sheen`, `.iam-motion-metallic-text`.
`specimens-motion.js` optionally activates entrance reveal via IntersectionObserver; no-JS/reduced-motion fallbacks remain visible.

## Merchant freedom

No font-family dropdown enum, no fixed radius slots, no locked palette or theme. Any valid font stack, CSS length, and supported color string can be supplied through tokens. For webfonts, the consuming app owns the font source and license; a theme may supply defaults, not restrictions.

The browser preview has live controls for font, card radius, accent and brand-book variant. The source cards and brand layout are both data-driven, not Meauxbility content hardcoded into commerce code. No donation, signup, checkout or form submission is simulated.

## Next system boundary

`cms-candidate-manifest.json` describes the authoring surface needed to install these as definitions in existing D1. An installer or normal Add Section resolution to `cms_definitions`/`cms_artifacts` is **not yet wired**; do not label the candidates merchant-available until that implementation, test, publish/restore and second-site verification are complete.

The original uploaded HTML is archived with SHA-256 in the `agentsam-theme-tools` branch. Preserve its original CSS, semantics, typography and animations. Refinements live in new renderers and never overwrite donor files.