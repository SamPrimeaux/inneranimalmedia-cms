"""Portable runtime boundary helpers for the CMS pipeline."""

from __future__ import annotations

from typing import Any

STORAGE_ROLE_BINDINGS = {
    "cms_content": "CMS_BUCKET",
    "package_assets": "ASSETS",
}


def configured_bridge_key(env: Any) -> str:
    value = getattr(env, "AGENTSAM_BRIDGE_KEY", None)
    return str(value or "").strip()


def presented_bridge_key(request: Any) -> str:
    auth = request.headers.get("Authorization") or ""
    if auth.startswith("Bearer "):
        bearer = auth[7:].strip()
        if bearer:
            return bearer
    return str(request.headers.get("X-AgentSam-Bridge-Key") or "").strip()


def verify_bridge_key(request: Any, env: Any) -> bool:
    expected = configured_bridge_key(env)
    if not expected:
        return False
    presented = presented_bridge_key(request)
    return bool(presented) and presented == expected


def resolve_object_store(env: Any, role: str):
    """Resolve a logical storage role to a provider binding."""
    binding_name = STORAGE_ROLE_BINDINGS.get(str(role or "").strip())
    if not binding_name:
        return None
    return getattr(env, binding_name, None)
