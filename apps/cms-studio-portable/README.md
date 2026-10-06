# Canonical CMS Studio contribution

This portable React/Vite authoring app imports the existing root site-contracts source; it does not copy or evolve another schema. Six shared renderers live at packages/studio-sections. All draft JSON is SiteDocument v1. Design Atlas source entries are registered in examples/revise-foundation/src/studio-atlas.ts.

From repository root:

```bash
npm ci --prefix apps/cms-studio-portable --ignore-scripts
npm --prefix apps/cms-studio-portable test
npm run build:studio-evidence
npm run build:site
```

Preview URLs: /library/evidence/cms-studio/index.html?gallery=1; ?preset=studio/editorial-hero&fixture=field-studio; ?preset=studio/editorial-hero&fixture=harbor-rescue; add &empty=1 for empty input. The UI mounts React sections directly; Atlas inspection frames are review-only. docs/INVENTORY.md, PERSISTENCE.md and ACCEPTANCE.md distinguish implemented local features from host integration work.

The original Site source commit d4a55bd755fe4ea12a6c24c4113ff46c9ad84f71 is preserved in donors. License remains UNLICENSED/user-owned; no third-party grant is inferred.
