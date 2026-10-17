from __future__ import annotations

import sqlite3
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "schemas" / "sqlite" / "cms-local-runtime.v2.sql"

CORE_TABLES = {
    "cms_sites",
    "cms_pages",
    "cms_page_sections",
    "cms_section_blocks",
    "cms_revisions",
    "cms_publications",
    "cms_assets",
}

RETIRED_TABLES = {'cms_runtime_info','cms_table_catalog','cms_capability_catalog',
    'cms_tool_catalog','cms_skill_catalog','cms_usage_guides','cms_schema_migrations'}
RETIRED_VIEWS = {'cms_runtime_help','cms_runtime_tools','cms_runtime_tables'}


class LocalSqliteContractTests(unittest.TestCase):
    def open_db(self):
        tmp = tempfile.TemporaryDirectory()
        db_path = Path(tmp.name) / "cms.sqlite"
        db = sqlite3.connect(db_path)
        db.executescript(SCHEMA.read_text())
        return tmp, db

    def test_site_tables_without_shadow_registries(self):
        tmp, db = self.open_db(); self.addCleanup(tmp.cleanup)
        tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        views = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='view'")}
        self.assertTrue(CORE_TABLES <= tables)
        self.assertFalse(RETIRED_TABLES & tables)
        self.assertFalse(RETIRED_VIEWS & views)
        self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0], 2)

    def test_no_cms_shadow_catalog_after_new_install(self):
        tmp, db = self.open_db(); self.addCleanup(tmp.cleanup)
        tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        self.assertEqual(len([x for x in tables if x.startswith('cms_')]), 16)


if __name__ == "__main__":
    unittest.main()
