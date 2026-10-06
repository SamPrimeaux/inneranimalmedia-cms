import copy
import json
import pathlib
import sys
import tempfile
import unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "scripts"))
from canonical_store import CanonicalStore

ROOT = pathlib.Path(__file__).resolve().parents[1]
class StoreTest(unittest.TestCase):
    def test_lossless_future_fields_and_immutable_revisions(self):
        for file in (ROOT / "fixtures").glob("*.site-document.json"):
            with self.subTest(file=file.name), tempfile.TemporaryDirectory() as directory:
                store = CanonicalStore(str(pathlib.Path(directory) / "cms.sqlite"))
                document = json.loads(file.read_text())
                document["futureSiteData"] = {"nested": [1, False, {"title": "é"}]}
                document["pages"][0]["sections"][0]["data"]["customNested"] = {"items": [{"x": 5}]}
                expected = copy.deepcopy(document)
                revision = store.save_draft("tenant-a", document)
                document["brand"]["name"] = "Changed later"
                store.save_draft("tenant-a", document)
                self.assertEqual(store.read_revision("tenant-a", document["id"], revision), expected)
                with self.assertRaises(KeyError):
                    store.read_revision("tenant-b", document["id"], revision)
                with self.assertRaises(KeyError):
                    store.read_revision("tenant-a", "other-site", revision)
                self.assertEqual(store.connection.execute("SELECT preset FROM studio_section_index ORDER BY sort_order LIMIT 1").fetchone()[0], expected["pages"][0]["sections"][0]["preset"])
                store.close()

    def test_failed_index_write_rolls_back_snapshot(self):
        store=CanonicalStore(":memory:")
        document=json.loads((ROOT/"fixtures/field-studio.site-document.json").read_text())
        document["pages"].append(copy.deepcopy(document["pages"][0]))
        with self.assertRaises(Exception):
            store.save_draft("tenant-a",document)
        self.assertEqual(store.connection.execute("SELECT count(*) FROM studio_document_revisions").fetchone()[0],0)

if __name__ == "__main__":
    unittest.main()
