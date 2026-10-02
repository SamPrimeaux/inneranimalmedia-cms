from __future__ import annotations

import asyncio
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PIPELINE_SRC = ROOT / "services" / "cms-pipeline-service" / "src"
sys.path.insert(0, str(PIPELINE_SRC))

from pipeline.canonical_bootstrap import build_canonical_bootstrap


class _Result:
    def __init__(self, results):
        self.results = results


class _Statement:
    def __init__(self, db, sql):
        self.db = db
        self.sql = " ".join(sql.split()).lower()
        self.args = ()

    def bind(self, *args):
        self.args = args
        return self

    async def first(self):
        if "from cms_sites" in self.sql:
            return self.db.site if self.args and self.args[0] == self.db.site["id"] else None
        raise AssertionError(f"unexpected first() query: {self.sql}")

    async def all(self):
        if "from cms_pages" in self.sql:
            return _Result(self.db.pages)
        if "from cms_sections" in self.sql:
            page_id = self.args[0]
            return _Result([row for row in self.db.sections if row["page_id"] == page_id])
        if "from cms_blocks" in self.sql:
            section_id = self.args[0]
            return _Result([row for row in self.db.blocks if row["section_id"] == section_id])
        raise AssertionError(f"unexpected all() query: {self.sql}")


class _FakeDb:
    def __init__(self):
        self.site = {
            "id": "site_demo",
            "name": "Demo",
            "initials": "DM",
            "domain": "demo.example",
            "color": "#111115",
            "theme_json": '{"cssVars":{"--brand":"#111115"}}',
            "schemas_json": '{"protocol_version":1,"sections":[],"blocks":[]}',
        }
        self.pages = [
            {
                "id": "page_home",
                "site_id": "site_demo",
                "title": "Home",
                "slug": "/",
                "status": "draft",
                "type": "Interior",
                "parent": None,
                "meta_title": "",
                "meta_description": "",
                "sort_order": 0,
            }
        ]
        self.sections = [
            {
                "id": "section_hero",
                "page_id": "page_home",
                "name": "Hero",
                "type": "hero",
                "zone": "BODY",
                "visible": 1,
                "color": "#111115",
                "fields_json": '{"headline":"Portable CMS"}',
                "css_json": '{"padding":"4rem"}',
                "sort_order": 10,
            }
        ]
        self.blocks = [
            {
                "id": "block_cta",
                "section_id": "section_hero",
                "type": "button",
                "visible": 1,
                "data_json": '{"label":"Start"}',
                "sort_order": 10,
            }
        ]

    def prepare(self, sql):
        return _Statement(self, sql)


class CanonicalBootstrapTests(unittest.TestCase):
    def test_bootstrap_hydrates_canonical_site_page_section_block_tree(self):
        data = asyncio.run(build_canonical_bootstrap(_FakeDb(), "site_demo"))
        self.assertEqual(data["schema"], "inneranimalmedia.cms.bootstrap.v2")
        self.assertEqual(data["site"]["id"], "site_demo")
        self.assertEqual(data["site"]["theme"]["cssVars"]["--brand"], "#111115")
        self.assertEqual(data["pages"][0]["id"], "page_home")
        section = data["pages"][0]["sections"][0]
        self.assertEqual(section["fields"]["headline"], "Portable CMS")
        self.assertTrue(section["visible"])
        self.assertEqual(section["blocks"][0]["data"]["label"], "Start")

    def test_unknown_site_fails_closed_to_empty_bootstrap(self):
        data = asyncio.run(build_canonical_bootstrap(_FakeDb(), "missing"))
        self.assertIsNone(data["site"])
        self.assertEqual(data["pages"], [])


if __name__ == "__main__":
    unittest.main()
