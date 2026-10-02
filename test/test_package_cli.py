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


if __name__ == "__main__":
    unittest.main()
