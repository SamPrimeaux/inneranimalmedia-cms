# Portable blueprint intake and SKU normalization

This is a **source-controlled starter** for the existing InnerAnimalMedia CMS, not a parallel page editor, registry, or publishing system. It is deliberately generic: no Clay logos, names, customer text, external media, or third-party code.

## Authority
- Git owns reviewable blueprint source, definitions, presets, and normalization rules.
- The dedicated `CMS` R2 bucket should host immutable compiled releases, previews, and manifests. Configure the binding `CMS_BLUEPRINTS` explicitly for each installation; **do not silently fall back** to an SDK/chat attachment bucket.
- Existing `cms_component_templates` is the intake/inventory register; keep unique SKUs, provenance, source paths and validation state.
- `cms_definitions` owns **promoted** semantic section/block contracts. It should never be populated from merely discovered code.
- `cms_page_sections` and `cms_section_blocks` own installed page instances, not library intake.
- `cms_assets` (or installation's canonical media provider) owns media metadata/keys; do not insert empty image placeholders as actual media records.
- `agentsam_artifacts` owns AgentSam outputs/provenance; promotion pins immutable, validated implementation versions.
- Drafts/history/publication remain with existing CMS revision authority; no auto-publish.

## Compile
```bash
node blueprints/editorial-case-study/compile-blueprint.mjs IAM blueprints/editorial-case-study/tokens.example.json /tmp/iam-blueprint
```

Produces `manifest.json`, `inventory.csv`, and `tokens.css` without network/database writes. The importer must reconcile by stable semantic key **and** version, then check SKU collisions against D1 before proposing any upserts.

## Safety/quality gates
Preserve original discovered files and their exact hashes. Record source repository/bucket/key/commit, permission, measured/inferred confidence, and dependencies. Classify structure before SKU assignment; visual theme/mirror/slide counts are settings, not separate structural SKUs. Propose rather than auto-activate. Validate schemas and allowed children, scoped CSS, isolated duplicated instances, responsive layout, keyboard and reduced-motion behavior, and draft/reload/publish before approval.

Source inspiration is user-supplied page-layout research. Measurements and original external implementation rights have **not** been verified. Don't repackage third-party branding, media, or source code.

## Current limits
This commit provides a deterministic registry/skin contract and a starter compiler. It does **not** claim the D1 ingestion API, R2 uploader, inspector, browser rendering tests, or end-to-end CMS installation are implemented.
