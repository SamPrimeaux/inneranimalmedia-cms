from __future__ import annotations

import json
import sqlite3
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "bin" / "cms-runtime.mjs"


class PackageCliTests(unittest.TestCase):
    def run_cli(self, root: Path, *args: str):
        proc = subprocess.run(
            ["node", str(CLI), *args, "--root", str(root), "--json"],
            cwd=root,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        return json.loads(proc.stdout)

    def test_init_and_doctor_are_project_relative(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "newuser123-site"
            root.mkdir()
            init = self.run_cli(root, "init", "--project", "newuser123-site")
            self.assertEqual(init["database"], ".agentsam/cms.sqlite")
            self.assertNotIn(str(ROOT), json.dumps(init))

            db_path = root / ".agentsam" / "cms.sqlite"
            self.assertTrue(db_path.exists())
            self.assertTrue((root / ".agentsam" / "cms-content").is_dir())
            receipt = json.loads((root / ".agentsam" / "cms" / "runtime.json").read_text())
            self.assertEqual(receipt["schemaRef"], "package:@inneranimalmedia/cms-runtime/sqlite-schema")
            self.assertNotIn(str(ROOT), json.dumps(receipt))

            doctor = self.run_cli(root, "doctor")
            self.assertTrue(doctor["ok"])
            self.assertEqual(doctor["project"], "newuser123-site")
            self.assertGreaterEqual(doctor["tools"], 15)
            self.assertGreaterEqual(doctor["skills"], 5)

            db = sqlite3.connect(db_path)
            source = db.execute(
                "SELECT value FROM cms_runtime_info WHERE key='schema_source'"
            ).fetchone()[0]
            db.close()
            self.assertEqual(source, "package:@inneranimalmedia/cms-runtime/sqlite-schema")


    def test_v1_install_upgrades_without_losing_site_content(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "legacy-site"
            root.mkdir()
            state = root / ".agentsam"
            state.mkdir()
            db_path = state / "cms.sqlite"
            db = sqlite3.connect(db_path)
            db.executescript((ROOT / "schemas/sqlite/cms-local-runtime.v1.sql").read_text())
            db.execute("INSERT INTO cms_sites(id,name,initials) VALUES ('s1','Original','OR')")
            db.execute("INSERT INTO cms_pages(id,site_id,title,slug) VALUES ('p1','s1','Home','home')")
            db.execute("INSERT INTO cms_sections(id,page_id,name,type) VALUES ('sec1','p1','Hero','hero')")
            db.execute("INSERT INTO cms_blocks(id,section_id,type) VALUES ('block1','sec1','text')")
            db.commit()
            db.close()

            self.run_cli(root, "init", "--project", "legacy-site")
            self.assertTrue((state / "cms.sqlite.pre-v2.sqlite").exists())
            db = sqlite3.connect(db_path)
            self.assertEqual(db.execute("SELECT name FROM cms_sites WHERE id='s1'").fetchone(), ("Original",))
            self.assertEqual(db.execute("SELECT site_id FROM cms_pages WHERE id='p1'").fetchone(), ("s1",))
            self.assertEqual(db.execute("SELECT page_id FROM cms_page_sections WHERE id='sec1'").fetchone(), ("p1",))
            self.assertEqual(db.execute("SELECT section_id FROM cms_section_blocks WHERE id='block1'").fetchone(), ("sec1",))
            self.assertEqual(db.execute("PRAGMA foreign_key_check").fetchall(), [])
            self.assertIsNone(db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cms_sections'").fetchone())
            db.close()
            self.run_cli(root, "init", "--project", "legacy-site")
            db = sqlite3.connect(db_path)
            self.assertEqual(db.execute("SELECT count(*) FROM cms_pages").fetchone()[0], 1)
            db.close()


if __name__ == "__main__":
    unittest.main()
