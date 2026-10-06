# Content authority and integration

The editor state and JSON interchange are the upstream SiteDocument v1. The source snapshots in packages/site-contracts are unchanged. Canonical main was rechecked at 68550931a28106ec0b4807e5c0c82f6ff911a0d4; the site-document blob remains 9d332f17d2cc72e8e3f91dda8d88a6cd6cd9cfcd.

## Browser implementation

app/studio/drafts.ts validates the complete document then writes an immutable copy with revision ID and creation time to localStorage. Forty snapshots are retained. Preview opens the accepted saved snapshot; edits return to the draft. Failed validation or quota failure reports failure and does not report a save. Import/export retain unknown fields. Media mappings are tenant/site-like session namespaces indexed by document ID; they are delivery context, not additional persisted content fields. Device originals are not altered. No media upload, customer ownership validation, synchronization, authentication or publication is claimed.

## Local SQLite proof

scripts/canonical_store.py implements a real transactional lossless snapshot store. Operational tables are prefixed studio_; they do not redefine content or change the existing cms-runtime schema. The authoritative snapshot retains header, footer, preset, settings, data, blocks, design tokens and future fields. Page/section/block indexes expose order and exact preset for queries. Reads require tenant ID, site ID and revision ID. A failed index insertion rolls back the whole transaction. Tenant IDs must be derived by the authenticated host, never accepted as authorization from this UI.

Tests use disk-backed SQLite and verify all five fixture documents plus nested unknown future content, immutable older revisions, wrong-tenant/site lookup denial and atomic rollback. This proof is not wired to the hosted browser and does not create an HTTP CRUD service.

## Host adapter still required

1. Authenticate caller; derive tenant/site scope and authorize edits.
2. Validate canonical document and exact installed preset fields, URLs, media ownership and provider capabilities.
3. Append a complete immutable snapshot transactionally; normalize indexes for queries without replacing the snapshot authority.
4. Issue a short-lived scoped preview address tied to the revision.
5. Require approval and promotion of an accepted immutable revision.
6. Route the customer domain to that publication and preserve audit records.

D1/SQLite, Postgres or other storage can implement this lifecycle. R2 or other delivery stores resolve logical media identities. Host-specific bindings and account IDs never enter section content. Publishing the Studio application does not publish any customer fixture.
