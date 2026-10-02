from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PIPELINE_SRC = ROOT / "services" / "cms-pipeline-service" / "src"
sys.path.insert(0, str(PIPELINE_SRC))

from pipeline.runtime_contract import resolve_object_store, verify_bridge_key


class _Headers(dict):
    def get(self, key, default=None):
        return super().get(key, default)


class _Request:
    def __init__(self, headers=None):
        self.headers = _Headers(headers or {})


class _Env:
    AGENTSAM_BRIDGE_KEY = "bridge-secret"
    CMS_BUCKET = object()
    ASSETS = object()


class RuntimeContractTests(unittest.TestCase):
    def test_bearer_auth_uses_single_canonical_secret(self):
        self.assertTrue(
            verify_bridge_key(
                _Request({"Authorization": "Bearer bridge-secret"}),
                _Env(),
            )
        )

    def test_explicit_bridge_header_is_supported(self):
        self.assertTrue(
            verify_bridge_key(
                _Request({"X-AgentSam-Bridge-Key": "bridge-secret"}),
                _Env(),
            )
        )

    def test_legacy_secret_headers_are_not_authority(self):
        self.assertFalse(
            verify_bridge_key(
                _Request({"X-Internal-Secret": "bridge-secret"}),
                _Env(),
            )
        )

    def test_storage_roles_resolve_provider_bindings(self):
        env = _Env()
        self.assertIs(resolve_object_store(env, "cms_content"), env.CMS_BUCKET)
        self.assertIs(resolve_object_store(env, "package_assets"), env.ASSETS)
        self.assertIsNone(resolve_object_store(env, "unknown"))
