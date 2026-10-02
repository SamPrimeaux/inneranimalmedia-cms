from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PIPELINE_SRC = ROOT / "services" / "cms-pipeline-service" / "src"
sys.path.insert(0, str(PIPELINE_SRC))

from pipeline.preview import inject_bootstrap_script, studio_bootstrap_payload


class PreviewContractTests(unittest.TestCase):
    def test_studio_payload_uses_v2_project_identity(self):
        payload = studio_bootstrap_payload(
            project_id="site_demo",
            page_id="page_home",
            bootstrap={"schema": "inneranimalmedia.cms.bootstrap.v2"},
            preview_urls={"published": "/"},
        )
        self.assertEqual(payload["schema"], "inneranimalmedia.cms.studio-bootstrap.v2")
        self.assertEqual(payload["project"], {"id": "site_demo"})
        self.assertEqual(payload["page"], {"id": "page_home"})
        self.assertNotIn("project_slug", payload)
        self.assertNotIn("lane", payload)

    def test_bootstrap_script_is_inserted_before_body_close(self):
        html = "<html><body><main>Demo</main></body></html>"
        out = inject_bootstrap_script(html, {"ok": True})
        self.assertIn("__CMS_BOOTSTRAP__", out)
        self.assertLess(out.index("__CMS_BOOTSTRAP__"), out.index("</body>"))
