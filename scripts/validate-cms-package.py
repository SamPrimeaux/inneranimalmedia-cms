#!/usr/bin/env python3
"""Validate and compile the portable CmsPackage v2 contract.

Dependency-free on purpose: this command must be usable during scaffold,
clean-install, and CI preflight before provider SDKs are installed.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

API_VERSION = "inneranimalmedia.com/cms/v2"
KIND = "CmsPackage"
ALLOWED_TOP = {
    "apiVersion",
    "kind",
    "metadata",
    "runtime",
    "capabilities",
    "adapters",
    "distribution",
    "gates",
}
ALLOWED_GATES = {
    "schema_valid",
    "capabilities_resolved",
    "database_migrated",
    "api_conformance",
    "studio_build",
    "preview_smoke",
    "publish_smoke",
}
FORBIDDEN_PHYSICAL_KEYS = {
    "accountId",
    "databaseId",
    "namespaceId",
    "bucketId",
    "bucketName",
    "zoneId",
    "tenantId",
    "workspaceId",
}
NAME_RE = re.compile(r"^[a-zA-Z0-9][a-zA-Z0-9._-]*$")


class ManifestError(ValueError):
    pass


def _require_object(value: Any, path: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ManifestError(f"{path} must be an object")
    return value


def _require_string(value: Any, path: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ManifestError(f"{path} must be a non-empty string")
    return value.strip()


def _reject_unknown(obj: dict[str, Any], allowed: set[str], path: str) -> None:
    unknown = sorted(set(obj) - allowed)
    if unknown:
        raise ManifestError(f"{path} has unknown fields: {', '.join(unknown)}")


def _walk_forbidden_physical_keys(value: Any, path: str = "$") -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key in FORBIDDEN_PHYSICAL_KEYS:
                raise ManifestError(
                    f"{path}.{key} is a physical/account resource field and is not portable"
                )
            _walk_forbidden_physical_keys(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _walk_forbidden_physical_keys(child, f"{path}[{index}]")


def validate_manifest(manifest: dict[str, Any]) -> dict[str, Any]:
    """Validate CmsPackage v2 and return a deterministic resolved capability graph."""

    _reject_unknown(manifest, ALLOWED_TOP, "$")
    if manifest.get("apiVersion") != API_VERSION:
        raise ManifestError(f"apiVersion must be {API_VERSION}")
    if manifest.get("kind") != KIND:
        raise ManifestError(f"kind must be {KIND}")

    metadata = _require_object(manifest.get("metadata"), "metadata")
    _reject_unknown(metadata, {"name", "displayName", "version"}, "metadata")
    name = _require_string(metadata.get("name"), "metadata.name")
    if not NAME_RE.match(name):
        raise ManifestError("metadata.name must use portable slug characters")

    runtime = _require_object(manifest.get("runtime"), "runtime")
    _reject_unknown(runtime, {"project", "endpoints"}, "runtime")
    project = _require_object(runtime.get("project"), "runtime.project")
    _reject_unknown(project, {"id"}, "runtime.project")
    project_id = _require_string(project.get("id"), "runtime.project.id")
    if not NAME_RE.match(project_id):
        raise ManifestError("runtime.project.id must use portable identifier characters")

    endpoints = _require_object(runtime.get("endpoints"), "runtime.endpoints")
    _reject_unknown(endpoints, {"apiBaseUrl", "assetBaseUrl"}, "runtime.endpoints")
    api_base = _require_string(endpoints.get("apiBaseUrl"), "runtime.endpoints.apiBaseUrl")
    asset_base = _require_string(endpoints.get("assetBaseUrl"), "runtime.endpoints.assetBaseUrl")

    capabilities = _require_object(manifest.get("capabilities"), "capabilities")
    _reject_unknown(
        capabilities,
        {"database", "objectStorage", "cache", "queue", "collaboration", "ai"},
        "capabilities",
    )

    resolved_caps: dict[str, dict[str, Any]] = {}
    for required_name in ("database", "objectStorage"):
        cap = _require_object(capabilities.get(required_name), f"capabilities.{required_name}")
        _reject_unknown(cap, {"role", "provider", "publicOrigin"}, f"capabilities.{required_name}")
        resolved_caps[required_name] = {
            "required": True,
            "role": _require_string(cap.get("role"), f"capabilities.{required_name}.role"),
            "provider": _require_string(cap.get("provider"), f"capabilities.{required_name}.provider"),
        }
        if "publicOrigin" in cap:
            resolved_caps[required_name]["publicOrigin"] = _require_string(
                cap["publicOrigin"], f"capabilities.{required_name}.publicOrigin"
            )

    for optional_name in ("cache", "queue", "collaboration", "ai"):
        if optional_name not in capabilities:
            resolved_caps[optional_name] = {"required": False, "provider": None}
            continue
        cap = _require_object(capabilities[optional_name], f"capabilities.{optional_name}")
        _reject_unknown(cap, {"required", "role", "provider"}, f"capabilities.{optional_name}")
        required = cap.get("required")
        if not isinstance(required, bool):
            raise ManifestError(f"capabilities.{optional_name}.required must be boolean")
        provider = cap.get("provider")
        if required and not provider:
            raise ManifestError(
                f"capabilities.{optional_name}.provider is required when capability is required"
            )
        resolved_caps[optional_name] = {
            "required": required,
            "role": cap.get("role"),
            "provider": provider,
        }

    adapters = manifest.get("adapters", {})
    adapters = _require_object(adapters, "adapters")
    _reject_unknown(adapters, {"local", "cloudflare", "postgres", "s3"}, "adapters")

    db_provider = resolved_caps["database"]["provider"]
    object_provider = resolved_caps["objectStorage"]["provider"]

    if db_provider == "sqlite":
        local = _require_object(adapters.get("local"), "adapters.local")
        _reject_unknown(
            local,
            {"sqlitePath", "contentPath", "mode", "schemaPath"},
            "adapters.local",
        )
        _require_string(local.get("sqlitePath"), "adapters.local.sqlitePath")
        mode = _require_string(local.get("mode"), "adapters.local.mode")
        if mode not in {"local_authority", "local_working_copy"}:
            raise ManifestError(
                "adapters.local.mode must be local_authority or local_working_copy"
            )
        _require_string(local.get("schemaPath"), "adapters.local.schemaPath")
    elif db_provider == "d1":
        cloudflare = _require_object(adapters.get("cloudflare"), "adapters.cloudflare")
        _require_string(cloudflare.get("databaseBinding"), "adapters.cloudflare.databaseBinding")
    elif db_provider == "postgres":
        postgres = _require_object(adapters.get("postgres"), "adapters.postgres")
        _require_string(postgres.get("connectionEnv"), "adapters.postgres.connectionEnv")

    if object_provider == "filesystem":
        local = _require_object(adapters.get("local"), "adapters.local")
        _require_string(local.get("contentPath"), "adapters.local.contentPath")
    elif object_provider == "r2":
        cloudflare = _require_object(adapters.get("cloudflare"), "adapters.cloudflare")
        _require_string(
            cloudflare.get("objectStorageBinding"),
            "adapters.cloudflare.objectStorageBinding",
        )
    elif object_provider == "s3":
        s3 = _require_object(adapters.get("s3"), "adapters.s3")
        _require_string(s3.get("endpointEnv"), "adapters.s3.endpointEnv")
        _require_string(s3.get("bucketEnv"), "adapters.s3.bucketEnv")

    distribution = _require_object(manifest.get("distribution"), "distribution")
    _reject_unknown(distribution, {"studio", "pipeline"}, "distribution")
    for key in ("studio", "pipeline"):
        entry = _require_object(distribution.get(key), f"distribution.{key}")
        _reject_unknown(entry, {"source", "entry"}, f"distribution.{key}")
        if entry.get("source") not in {"package", "external"}:
            raise ManifestError(f"distribution.{key}.source must be package or external")
        _require_string(entry.get("entry"), f"distribution.{key}.entry")

    gates = manifest.get("gates")
    if not isinstance(gates, list) or not gates:
        raise ManifestError("gates must be a non-empty array")
    if len(set(gates)) != len(gates):
        raise ManifestError("gates must not contain duplicates")
    unknown_gates = sorted(set(gates) - ALLOWED_GATES)
    if unknown_gates:
        raise ManifestError(f"unknown gates: {', '.join(unknown_gates)}")

    _walk_forbidden_physical_keys(manifest)

    return {
        "schema": "inneranimalmedia.cms.resolved-capabilities.v1",
        "apiVersion": API_VERSION,
        "package": name,
        "project": {"id": project_id},
        "endpoints": {
            "apiBaseUrl": api_base,
            "assetBaseUrl": asset_base,
        },
        "capabilities": resolved_caps,
        "adapters": adapters,
        "distribution": distribution,
        "gates": gates,
    }


def load_manifest(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text())
    except FileNotFoundError as exc:
        raise ManifestError(f"manifest not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ManifestError(f"manifest is not valid JSON: {exc}") from exc
    return _require_object(value, "$")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate/compile CmsPackage v2")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--json", action="store_true", help="Emit machine-readable result")
    parser.add_argument(
        "--compile",
        action="store_true",
        help="Emit the resolved capability graph after validation",
    )
    args = parser.parse_args()

    try:
        manifest = load_manifest(args.manifest)
        resolved = validate_manifest(manifest)
    except ManifestError as exc:
        payload = {"ok": False, "error": str(exc), "manifest": str(args.manifest)}
        if args.json:
            print(json.dumps(payload, indent=2, sort_keys=True))
        else:
            print(f"invalid CmsPackage: {exc}", file=sys.stderr)
        return 2

    payload: dict[str, Any] = {
        "ok": True,
        "manifest": str(args.manifest),
        "apiVersion": API_VERSION,
        "kind": KIND,
    }
    if args.compile:
        payload["resolved"] = resolved

    if args.json or args.compile:
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        print(f"valid CmsPackage v2: {args.manifest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
