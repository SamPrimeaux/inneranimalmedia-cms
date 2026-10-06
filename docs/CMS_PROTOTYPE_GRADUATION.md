# Recovered designs: reusable promotion policy

Do NOT move whole donor archives into SDK or call copied HTML portable.
Original Dawn remains on Expansion; current SQLite keeps 168 designs'
provenance, 11 chosen candidates and source hashes. Curation UI source
still lives under /tmp/meaux-curation-board and needs durable installation.

Pipeline states and required proofs:
- Discovered: donor path, hash, source evidence, deduplicated occurrences.
- Curated: selected human Keep/Maybe/Reject, annotations and target kind.
- Proposed: typed fields, design fidelity fingerprint, deps/behaviors.
- Normalized: standalone content entries, typed dynamic bindings,
  design-preserving renderer and media ref resolution.
- Packaged: install into unrelated fresh consumer without donor files.
- Fidelity-approved: source/target screenshots at original breakpoints,
  interaction and accessibility tests; approved supported overrides.
- Publishable: pinned release, immutable artifacts, D1 pointer, rollback.
- Promoted: all receipts and human approval present.

The existing 11 candidate IDs/order must remain unchanged in SQLite;
they remain PLANNED until full acceptance:
1 collaboration-feature (section)
2 editorial-motion CTA (section)
3 interactive-controls (pattern)
4 values-showcase (section)
5 filterable-grid gallery (section)
6 media-metrics-showcase (layout)
7 editorial-news-index (template)
8 dashboard-command-center (template)
9 featured-marquee (section)
10 portfolio-project-index (template)
11 values-compass (section)

Implementation slice in this branch:
- scripts/audit-shopify-architecture.py: read-only original provenance
  and selected-only source capsule (outputs outside donor/repo).
- scripts/extract-gallery-style.py: SHA-pinned original authored CSS.
- packages/site-contracts/src/content-bindings.ts: typed defs/entries/ref
  validation, immutable multiple-template projections.
- packages/section-library/src/sections/gallery-filterable.ts:
  independent data input, scoped original CSS, filters, safe media URLs.
- examples/portability-gallery-consumer/consumer.mjs:
  Northline consumer with its own content and media; not a CMS fork.
- scripts/smoke-gallery-fresh-consumer.mjs: install real tarballs in /tmp.

To rerun:
python3 scripts/audit-shopify-architecture.py --donor /Volumes/Expansion/WEBSITES/theme_export__dmmane-vd- --curation-db "$HOME/.agentsam/curation/meaux-theme-curation.sqlite" --out /tmp/iam-cms-shopify-audit --materialize-selected
npm run build -w @inneranimalmedia/site-contracts
npm run test -w @inneranimalmedia/site-contracts
npm run build -w @inneranimalmedia/section-library
npm run test -w @inneranimalmedia/section-library
node scripts/smoke-gallery-fresh-consumer.mjs /tmp/iam-cms-gallery-fresh-consumer

Inspect at http://127.0.0.1:4333/ after serving the fresh-consumer folder.

The gallery initializes and category-filters in Chrome, but is NOT yet pixel-fidelity
verified and does not have a safe production publication protocol. Never
silently upgrade curation status because an intake or unit test passes.
