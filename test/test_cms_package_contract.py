from __future__ import annotations

import copy
import importlib.util
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "validate-cms-package.py"

spec = importlib.util.spec_from_file_location("cms_package_validator", SCRIPT)
assert spec and spec.loader
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


def load_example(name: str) -> dict:
    return json.loads((ROOT / "manifests" / name).read_text())


class CmsPackageContractTests(unittest.TestCase):
    def test_local_example_validates_and_compiles(self):
        resolved = validator.validate_manifest(load_example("cms-package.v2.local.example.json"))
        self.assertEqual(resolved["capabilities"]["database"]["provider"], "sqlite")
        self.assertEqual(resolved["capabilities"]["objectStorage"]["provider"], "filesystem")

    def test_cloudflare_example_uses_bindings_not_resource_ids(self):
        resolved = validator.validate_manifest(load_example("cms-package.v2.cloudflare.example.json"))
        self.assertEqual(resolved["adapters"]["cloudflare"]["databaseBinding"], "DB")
        self.assertEqual(
            resolved["adapters"]["cloudflare"]["objectStorageBinding"],
            "CMS_BUCKET",
        )

    def test_missing_project_identity_fails_closed(self):
        manifest = load_example("cms-package.v2.local.example.json")
        del manifest["runtime"]["project"]["id"]
        with self.assertRaisesRegex(validator.ManifestError, "runtime.project.id"):
            validator.validate_manifest(manifest)

    def test_d1_requires_binding_contract(self):
        manifest = load_example("cms-package.v2.cloudflare.example.json")
        del manifest["adapters"]["cloudflare"]["databaseBinding"]
        with self.assertRaisesRegex(validator.ManifestError, "databaseBinding"):
            validator.validate_manifest(manifest)

    def test_physical_cloud_resource_ids_are_rejected(self):
        manifest = load_example("cms-package.v2.cloudflare.example.json")
        manifest["adapters"]["cloudflare"]["databaseId"] = "deadbeef"
        with self.assertRaises(validator.ManifestError):
            validator.validate_manifest(manifest)

    def test_unknown_top_level_fields_are_rejected(self):
        manifest = load_example("cms-package.v2.local.example.json")
        manifest["tenant"] = {"id": "sam-specific"}
        with self.assertRaisesRegex(validator.ManifestError, "unknown fields"):
            validator.validate_manifest(manifest)

    def test_compilation_is_deterministic(self):
        manifest = load_example("cms-package.v2.local.example.json")
        first = validator.validate_manifest(copy.deepcopy(manifest))
        second = validator.validate_manifest(copy.deepcopy(manifest))
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
