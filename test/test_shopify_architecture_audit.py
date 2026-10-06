"""The donor intake script must preserve curated source fidelity and never write into donors."""
import importlib.util
import hashlib
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "audit-shopify-architecture.py"
spec = importlib.util.spec_from_file_location("shopify_audit", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class ShopifyDonorAuditTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.base = Path(self.tmp.name)
        self.donor = self.base / "shopify"
        for name in ("templates", "sections", "config"):
            (self.donor / name).mkdir(parents=True)
        self.source = '<div><style>.gallery{display:grid}</style><h1>Example</h1></div>'
        self.digest = hashlib.sha256(self.source.encode()).hexdigest()
        self.artifact = self.digest[:16]
        template = {"sections":{"a":{"type":"custom-liquid","settings":{"custom_liquid":self.source}}},
                    "order":["a"]}
        (self.donor/"templates"/"index.json").write_text(json.dumps(template))
        (self.donor/"sections"/"hero.liquid").write_text(
            '{% schema %}{"name":"Hero","settings":[{"id":"title","type":"text"}]}{% endschema %}')
        (self.donor/"config"/"settings_schema.json").write_text(
            '[{"name":"theme_info","theme_name":"Dawn","theme_version":"15.4.0"}]')
        self.dbfile = self.base / "curation.sqlite"
        db=sqlite3.connect(self.dbfile)
        db.executescript("""
        CREATE TABLE collections (id INTEGER PRIMARY KEY,name TEXT);
        CREATE TABLE collection_items(collection_id INTEGER,artifact_id TEXT,ordinal INTEGER);
        CREATE TABLE artifacts(id TEXT,title TEXT,source_template TEXT,source_section_id TEXT,source_hash TEXT);
        CREATE TABLE promotion_candidates(artifact_id TEXT,canonical_id TEXT,target_kind TEXT,status TEXT);
        """)
        db.execute("INSERT INTO collections VALUES(1,'pipeline-v1')")
        db.execute("INSERT INTO artifacts VALUES(?,?,?,?,?)",
            (self.artifact,"Example","templates/index.json","a",self.digest))
        db.execute("INSERT INTO collection_items VALUES(1,?,1)",(self.artifact,))
        db.execute("INSERT INTO promotion_candidates VALUES(?,?,?,?)",
            (self.artifact,"gallery.filterable-grid","section","planned"))
        db.commit(); db.close()

    def test_hash_preservation_and_selected_only_capsule(self):
        before = (self.donor/"templates"/"index.json").read_bytes()
        scan = mod.scan(self.donor)
        self.assertEqual(scan["templates"],1)
        self.assertEqual(scan["unique_designs"],1)
        self.assertEqual(scan["custom_instances"],1)
        dest = self.base / "out"
        chosen=mod.intake(self.donor,self.dbfile,"pipeline-v1",scan,dest,True)
        self.assertEqual(len(chosen),1)
        self.assertEqual(chosen[0]["provenance"]["occurrences"][0]["section_id"],"a")
        self.assertFalse(chosen[0]["portable"])
        self.assertEqual((self.donor/"templates"/"index.json").read_bytes(),before)
        self.assertEqual(next((dest/"selected-source-reference").glob("*.html")).read_text(),self.source)

    def test_hash_drift_is_a_hard_failure(self):
        altered={"sections":{"a":{"type":"custom-liquid",
                "settings":{"custom_liquid":self.source + "DIFFERENT"}}},"order":["a"]}
        (self.donor/"templates"/"index.json").write_text(json.dumps(altered))
        scan=mod.scan(self.donor)
        with self.assertRaisesRegex(ValueError,"Source hash drift"):
            mod.intake(self.donor,self.dbfile,"pipeline-v1",scan,self.base/"out",False)


if __name__ == "__main__":
    unittest.main()
