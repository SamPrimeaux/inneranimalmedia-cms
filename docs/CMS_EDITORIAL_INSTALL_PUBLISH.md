# Editorial React installation and publication adapter

**Status:** implemented and browser-tested locally. The hosted CMS Worker still needs to import and register the host route; no production deployment is implied.

## CMS installation

Seven source-backed React sections use canonical SiteSection content and are installed in the main CMS PageEditor through the existing POST /api/cms/sections endpoint. Each row stores:

- section_type = editorial-react
- section_data.schema_id = inneranimalmedia.cms-editorial-section.v1
- section_data.renderer = editorial-react
- section_data.section = canonical SiteSection (settings, data and blocks)

The editor includes a preset selector, typed fields from @inneranimalmedia/site-contracts, draft preview, JSON inspector and existing save/visibility controls. This is not a second site schema.

The React publication entry lives at apps/editorial-commons/src/portable/publish-entry.tsx. It compiles **only the seven bound components** and excludes donor commerce/catalogue fixtures. Each section mounts inside a Shadow DOM with isolated CSS.

Build the version-matched assets:

    npm run build:editorial-runtime

The script writes compiled runtime assets to the host adapter bundle, studio/public/cms/editorial and examples/revise-foundation/public/cms/editorial. The runtime bundle is included in the @inneranimalmedia/cms-runtime npm package.

## Local publishing — operational

The portable CLI reads existing cms_sites, cms_pages, cms_sections, cms_assets, cms_publications and cms_revisions tables.

    npx cms-runtime init --project my-site
    # After creating a site and page through the CMS editor:
    npx cms-runtime install-editorial --page PAGE_ID --preset commons/collection-carousel
    npx cms-runtime publish-editorial --page PAGE_ID --json

It writes:

    .agentsam/cms-content/publications/SITE_ID/PAGE_SLUG/index.html
    .agentsam/cms-content/publications/SITE_ID/assets/editorial/

It records a versioned revision/publication after HTML and assets are written. Serve the publications folder as the HTTP root for local preview. This is a **local publication**, not a Cloudflare deployment.

Standalone publishing supports editorial-only pages. Mixed-section pages fail closed; the host must embed renderCmsEditorialSection in its existing page composer and append cmsEditorialRuntimeScript once.

## Hosted publishing — host adapter

The CMS PageEditor calls POST /api/cms/editorial/publish when an editorial section is present and will not falsely report success through the legacy HTML publisher.

The host Worker must register this endpoint and use the exported handleCmsEditorialPublishRequest function from @inneranimalmedia/cms-runtime/editorial-publisher. It requires host-provided authorize(request), loadPage({pageId,projectSlug,actor}), an authorized CMS R2 bucket, compiled runtime JS/CSS bytes, HTTPS asset origin and scoped asset prefix.

The host must enforce tenant membership, load canonical page/section rows, resolve logical media keys to customer-owned asset URLs, route public requests to R2 and record its own hosted publication metadata. These host integrations are **not yet deployed** in this repository.

The adapter validates before writing, installs runtime assets, writes HTML to a scoped R2 key, and returns a receipt only after the write. It rejects unauthorized requests, unsupported/mixed pages, unsafe keys and URLs. Do not enable the host route without tenant-aware authorization.

## Acceptance

    npm run build:editorial-runtime
    npm run smoke:editorial:publishing
    npm run smoke:editorial:bound
    npm run smoke:editorial:workbench
    npm run verify:universal

The publishing smoke initializes SQLite, installs seven sections, publishes twice, checks revision history, tests R2 and HTTP host adapter behavior, and opens published HTML in Chromium at phone and desktop widths.

Remaining before production: register host Worker endpoint; confirm CMS API accepts editorial-react section rows; publish versioned assets; connect real media registry and mixed-section composer; verify customer-tenant preview and publication; resolve existing repository-wide portability audit blockers.
