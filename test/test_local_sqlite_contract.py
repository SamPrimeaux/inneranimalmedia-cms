from __future__ import annotations

import sqlite3
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "schemas" / "sqlite" / "cms-local-runtime.v1.sql"

CORE_TABLES = {
    "cms_sites",
    "cms_pages",
    "cms_sections",
    "cms_blocks",
    "cms_revisions",
    "cms_publications",
    "cms_assets",
}

CATALOG_TABLES = {
    "cms_runtime_info",
    "cms_table_catalog",
    "cms_capability_catalog",
    "cms_tool_catalog",
    "cms_skill_catalog",
    "cms_usage_guides",
    "cms_schema_migrations",
}


class LocalSqliteContractTests(unittest.TestCase):
    def open_db(self):
        tmp = tempfile.TemporaryDirectory()
        db_path = Path(tmp.name) / "cms.sqlite"
        db = sqlite3.connect(db_path)
        db.executescript(SCHEMA.read_text())
        return tmp, db

    def test_schema_contains_core_and_self_describing_catalogs(self):
        tmp, db = self.open_db()
        self.addCleanup(tmp.cleanup)
        rows = {
            row[0]
            for row in db.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        self.assertTrue(CORE_TABLES.issubset(rows))
        self.assertTrue(CATALOG_TABLES.issubset(rows))

    def test_runtime_explains_authority_and_first_queries(self):
        tmp, db = self.open_db()
        self.addCleanup(tmp.cleanup)
        info = dict(
            db.execute("SELECT key,value FROM cms_runtime_info").fetchall()
        )
        self.assertEqual(info["cms_contract"], "cms-core.v1")
        self.assertEqual(info["provider"], "sqlite")
        self.assertEqual(info["mode"], "local_authority")
        self.assertIn("cms_runtime_help", info["start_agent"])

    def test_tools_distinguish_safe_sql_from_adapter_mutations(self):
        tmp, db = self.open_db()
        self.addCleanup(tmp.cleanup)
        inspect = db.execute(
            "SELECT availability,mutates,risk_level FROM cms_tool_catalog "
            "WHERE tool_key='cms.runtime.inspect'"
        ).fetchone()
        publish = db.execute(
            "SELECT availability,mutates,requires_approval,risk_level "
            "FROM cms_tool_catalog WHERE tool_key='cms.publish'"
        ).fetchone()
        self.assertEqual(inspect, ("sql", 0, "low"))
        self.assertEqual(publish, ("adapter_required", 1, 1, "high"))

    def test_skills_reference_discoverable_tools(self):
        tmp, db = self.open_db()
        self.addCleanup(tmp.cleanup)
        skill_count = db.execute(
            "SELECT count(*) FROM cms_skill_catalog"
        ).fetchone()[0]
        tool_count = db.execute(
            "SELECT count(*) FROM cms_tool_catalog"
        ).fetchone()[0]
        self.assertGreaterEqual(skill_count, 5)
        self.assertGreaterEqual(tool_count, 10)

    def test_help_views_are_queryable(self):
        tmp, db = self.open_db()
        self.addCleanup(tmp.cleanup)
        self.assertGreater(
            db.execute("SELECT count(*) FROM cms_runtime_help").fetchone()[0], 0
        )
        self.assertGreater(
            db.execute("SELECT count(*) FROM cms_runtime_tools").fetchone()[0], 0
        )
        self.assertGreater(
            db.execute("SELECT count(*) FROM cms_runtime_tables").fetchone()[0], 0
        )


if __name__ == "__main__":
    unittest.main()
