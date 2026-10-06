"""Lossless local snapshot adapter. CLI/library proof, not an HTTP publisher.

Content authority is the whole canonical JSON, never the query indexes.
Tenant IDs must come from an authenticated host when integrated remotely.
"""
import json
import sqlite3
import uuid
from datetime import datetime, timezone

DDL = """
CREATE TABLE IF NOT EXISTS studio_document_revisions(
 tenant_id TEXT NOT NULL, site_id TEXT NOT NULL, revision_id TEXT NOT NULL,
 schema_version INTEGER NOT NULL, created_at TEXT NOT NULL, document_json TEXT NOT NULL,
 PRIMARY KEY(tenant_id,site_id,revision_id));
CREATE TABLE IF NOT EXISTS studio_page_index(
 tenant_id TEXT,site_id TEXT,revision_id TEXT,page_id TEXT,path TEXT,title TEXT,sort_order INTEGER,
 PRIMARY KEY(tenant_id,site_id,revision_id,page_id));
CREATE TABLE IF NOT EXISTS studio_section_index(
 tenant_id TEXT,site_id TEXT,revision_id TEXT,page_id TEXT,section_id TEXT,type TEXT,preset TEXT,sort_order INTEGER,
 PRIMARY KEY(tenant_id,site_id,revision_id,page_id,section_id));
CREATE TABLE IF NOT EXISTS studio_block_index(
 tenant_id TEXT,site_id TEXT,revision_id TEXT,page_id TEXT,section_id TEXT,block_id TEXT,type TEXT,sort_order INTEGER,
 PRIMARY KEY(tenant_id,site_id,revision_id,page_id,section_id,block_id));
"""

class CanonicalStore:
    def __init__(self, path):
        self.connection = sqlite3.connect(path)
        self.connection.executescript(DDL)

    def save_draft(self, tenant_id, document):
        if not tenant_id or document.get("schemaVersion") != 1 or not document.get("id"):
            raise ValueError("Tenant, site identity and schemaVersion 1 required")
        # The host must run validateBoundary and authorize before invoking this adapter.
        snapshot = json.dumps(document, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
        revision = str(uuid.uuid4())
        site = document["id"]
        with self.connection:
            self.connection.execute("INSERT INTO studio_document_revisions VALUES(?,?,?,?,?,?)",
                (tenant_id,site,revision,1,datetime.now(timezone.utc).isoformat(),snapshot))
            for pi,page in enumerate(document["pages"]):
                self.connection.execute("INSERT INTO studio_page_index VALUES(?,?,?,?,?,?,?)",
                    (tenant_id,site,revision,page["id"],page["path"],page["title"],pi))
                for si,section in enumerate(page["sections"]):
                    self.connection.execute("INSERT INTO studio_section_index VALUES(?,?,?,?,?,?,?,?)",
                        (tenant_id,site,revision,page["id"],section["id"],section["type"],section["preset"],si))
                    for bi,block in enumerate(section.get("blocks",[])):
                        self.connection.execute("INSERT INTO studio_block_index VALUES(?,?,?,?,?,?,?,?)",
                            (tenant_id,site,revision,page["id"],section["id"],block["id"],block["type"],bi))
        return revision

    def read_revision(self, tenant_id, site_id, revision_id):
        row = self.connection.execute(
            "SELECT document_json FROM studio_document_revisions WHERE tenant_id=? AND site_id=? AND revision_id=?",
            (tenant_id,site_id,revision_id)).fetchone()
        if row is None:
            raise KeyError("Revision unavailable in this tenant/site scope")
        return json.loads(row[0])

    def close(self):
        self.connection.close()
