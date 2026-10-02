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
