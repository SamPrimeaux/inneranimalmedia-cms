from __future__ import annotations

import importlib.util
import tempfile
import unittest
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "audit-portability.py"

spec = importlib.util.spec_from_file_location("audit_portability", SCRIPT)
assert spec and spec.loader
audit = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = audit
spec.loader.exec_module(audit)


class AuditPortabilityTests(unittest.TestCase):
    def test_schema_id_namespace_is_not_a_deployment_origin(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "schemas").mkdir()
            (root / "schemas" / "cms-package.v2.schema.json").write_text(
                '{"$id":"https://inneranimalmedia.com/schemas/cms-package.v2.schema.json"}\n'
            )
            findings, _ = audit.scan_rules(root)
            self.assertFalse(any(f.rule_id == "PORT002" for f in findings))

    def test_runtime_origin_is_still_flagged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "src" / "runtime.ts").write_text(
                'export const api = "https://inneranimalmedia.com/api/cms";\n'
            )
            findings, _ = audit.scan_rules(root)
            self.assertTrue(any(f.rule_id == "PORT002" for f in findings))


if __name__ == "__main__":
    unittest.main()
