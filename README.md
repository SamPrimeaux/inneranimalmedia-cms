# Inner Animal Media CMS

Standalone, resellable CMS product — studio editor, section templates, Python agentic pipeline, and host integration contracts. Designed to deploy as its own Workers/R2 stack or bind into a platform host (e.g. Inner Animal Media monolith) via thin adapters.

## Product boundaries

| In this repo | Stays in host platform |
|--------------|------------------------|
| Studio UI (`studio/`) | Auth, sessions, tenant routing |
| Section HTML templates (`sections/`) | Customer billing / workspace admin |
| Python pipeline worker (`services/cms-pipeline-service/`) | Generic Agent Sam orchestration |
| Prototype manifests + ops docs (`manifests/`, `docs/`) | Non-CMS product surfaces |
| Integration snippets (`integration/`) | Full `src/index.js` dispatch |

**Goal:** end-to-end CMS you can white-label without bloating the host monolith.

## Three lanes

1. **Studio** — `{host}/studio/editor?project=…` — auth-gated authoring
2. **Draft preview** — `{domain}/{route}?preview=draft&cms=1` — real route, draft merge
3. **Live** — published HTML on project domain

## Quick start

### Portable local runtime

Consumers do **not** need this repository checkout. The SQLite schema and runtime
catalog ship inside `@inneranimalmedia/cms-runtime`.

```bash
mkdir my-site
cd my-site
npm install -D @inneranimalmedia/cms-runtime

npx cms-runtime init --project my-site
npx cms-runtime doctor
npx cms-runtime tools
npx cms-runtime skills
```

Initialization creates only project-relative runtime state:

```text
.agentsam/cms.sqlite
.agentsam/cms-content/
.agentsam/cms/runtime.json
```

The SQLite database describes its own schema authority, capabilities, tools,
skills, mutation boundaries, and human/agent operating guides. No developer
filesystem path is persisted.

### Python pipeline development

The Python pipeline is an optional provider capability for HTML transforms and
AI-assisted proposals. Local CMS CRUD does not require it.

```bash
./scripts/setup-pipeline.sh
cd services/cms-pipeline-service
uv run pywrangler dev --port 8788
curl -s http://127.0.0.1:8788/health
```

## Canonical section library and Editorial Commons

All 39 original Editorial Commons React scenes and the newer multipage work now
live under apps/editorial-commons in this one CMS repository, with donor Git
history preserved. The combined Design Atlas shows these real previews alongside
Revise, with one additional FIELDWORK cross-brand section demonstration.

The shared SiteDocument editor exposes typed text, media, CTA and card fields
instead of only headings. Seven original React scenes now consume that same
SiteDocument contract: curtain hero, category wardrobe, split media, editorial
statement, collection carousel, interactive lookbook, and FAQ. A local
multipage workbench edits actual section data, repeatable blocks, collection
groups, hotspot positions, brand color tokens and backgrounds. Other donor
scenes remain visual candidates pending adapter and provider integration.
The collection, lookbook and FAQ are also browser-verified with two independent
customer SiteDocuments (FIELDWORK and COVE), not just the original donor sample.

Browse the editable workbench at /library/evidence/editorial-commons/index.html?workbench=1.

See docs/UNIVERSAL_SECTIONS.md for ownership, acceptance and next steps.

Build the integrated preview:

    npm ci --prefix apps/editorial-commons --ignore-scripts
    npm run build:editorial-evidence
    npm run verify:universal

## Visual design atlas (review and remaster lane)

The Revise example is a real, locally editable five-page F&FT concept site with an
independent **Design Atlas** of historical themes, their actual HTML pages,
section presets, palette studies, and UI experiments. It does **not** provision
a customer website or commit production commerce changes.

```bash
npm install --ignore-scripts
npm run verify:atlas
npm run dev -w @inneranimalmedia/revise-foundation-demo -- --host 127.0.0.1 --port 4319
```

Open:

- [Site](http://127.0.0.1:4319/)
- [Design Atlas](http://127.0.0.1:4319/library/)
- [Example archived theme](http://127.0.0.1:4319/library/themes/cypress/)
- [Example reusable section](http://127.0.0.1:4319/library/sections/revise-sticky-curtain/)

Source origins, review maturity, import commands, and acceptance gates:
[Design Atlas inventory](docs/themes/DESIGN_ATLAS_INVENTORY_V1.md).
Preview source snapshots are checked into this repo for deterministic viewing;
their original packages remain authoritative in their respective repos.

## Docs

- [Python agentic pipeline](docs/PYTHON_CMS_AGENTIC.md)
- [PrimeTech studio](docs/PRIMETECH_STUDIO.md)
- [Prototype manifest (IPM)](docs/PROTOTYPE_MANIFEST.md)
- [Operations plane (Agent Sam)](docs/OPERATIONS_PLANE.md)
- [Host integration](docs/HOST_INTEGRATION.md)

## Related repos

- **Host platform:** [inneranimalmedia](https://github.com/SamPrimeaux/inneranimalmedia) — optional thin binding layer
- **Legacy editor shell:** [agentsam-cms-editor](https://github.com/SamPrimeaux/agentsam-cms-editor)

## License

Proprietary — Inner Animals LLC / Inner Animal Media. Contact for reseller terms.
