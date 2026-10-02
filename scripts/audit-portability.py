#!/usr/bin/env python3
"""Audit a repository for global-package portability failures.

The audit is intentionally dependency-free. It answers one question:

    Could a stranger clone/install this package and trust it to resolve its own
    runtime/configuration requirements without inheriting the original author's
    machine, domains, Cloudflare resources, customer slugs, or host monolith?

It is a static preflight, not a proof of correctness. Findings are evidence-backed
and machine-readable so they can become CI gates later.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

SEVERITY_ORDER = {"info": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}
SKIP_DIRS = {
    ".git", ".agentsam", "node_modules", "python_modules", "__pycache__",
    ".venv", "venv", "dist", "build", ".wrangler", ".cache",
}
SKIP_PATH_PARTS = {("studio", "public", "vendor")}
TEXT_SUFFIXES = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".json", ".jsonc", ".toml",
    ".yaml", ".yml", ".md", ".html", ".css", ".sh", ".sql", ".txt",
}
MAX_FILE_BYTES = 1_500_000


@dataclass(frozen=True)
class Finding:
    rule_id: str
    severity: str
    category: str
    path: str
    line: int
    message: str
    evidence: str
    remediation: str


@dataclass(frozen=True)
class Rule:
    rule_id: str
    severity: str
    category: str
    pattern: re.Pattern[str]
    message: str
    remediation: str
    scopes: tuple[str, ...] = ("runtime", "config", "docs", "example")


def compile_rule(rule_id: str, severity: str, category: str, pattern: str,
                 message: str, remediation: str,
                 scopes: tuple[str, ...] = ("runtime", "config", "docs", "example")) -> Rule:
    return Rule(rule_id, severity, category, re.compile(pattern, re.I), message, remediation, scopes)


RULES: tuple[Rule, ...] = (
    compile_rule(
        "PORT001", "high", "machine-path",
        r"(?:/Users/[A-Za-z0-9._-]+/|/home/[A-Za-z0-9._-]+/|[A-Za-z]:\\\\Users\\\\[^\\\\]+\\\\)",
        "Developer-specific absolute filesystem path.",
        "Resolve paths from the repository root, XDG/user config, cwd, or an explicit CLI option.",
    ),
    compile_rule(
        "PORT002", "high", "deployment-origin",
        r"https?://(?:studio\.)?inneranimalmedia\.com|https?://cms\.inneranimalmedia\.com|https?://assets\.inneranimalmedia\.com",
        "Inner Animal Media deployment origin is embedded as a concrete runtime/config value.",
        "Inject origins through a deployment manifest/runtime adapter; branded docs may show examples, runtime code may not depend on them.",
    ),
    compile_rule(
        "PORT003", "critical", "customer-routing",
        r"(?:fuelnfreetime\.com|meauxbility\.org|newiberiachurchofchrist\.com|\.meauxbility\.workers\.dev)",
        "Customer/account-specific hostname is embedded in package source.",
        "Resolve storefront origins from site metadata or deployment config; never ship a customer/domain lookup table in reusable runtime code.",
        ("runtime", "config"),
    ),
    compile_rule(
        "PORT004", "critical", "project-default",
        r"(?:project(?:_slug)?|site(?:slug)?)[^\\n]{0,140}(?:\\|\\||\\?\\?|:)\\s*['\\\"]inneranimalmedia['\\\"]",
        "Package silently falls back to the author's project slug.",
        "Fail closed when project identity is absent, or resolve it from the manifest/site context; do not guess a tenant/project.",
        ("runtime", "config"),
    ),
    compile_rule(
        "PORT005", "critical", "cloud-resource-id",
        r"(?:database_id|\"id\"|id)\s*[:=]\s*['\"]?[0-9a-f]{24,36}['\"]?",
        "Concrete Cloudflare resource identifier is committed in deployable config.",
        "Keep reusable config ID-free. Generate environment-specific Wrangler config from a manifest or setup command.",
        ("config",),
    ),
    compile_rule(
        "PORT006", "high", "deployment-name",
        r"(?:bucket_name|service|zone_name|pattern)\s*[:=]\s*['\"](?:cms|inneranimalmedia|iam-cms-pipeline|[^'\"]*inneranimalmedia\.com[^'\"]*)['\"]",
        "Deployable config assumes the original bucket/service/zone naming.",
        "Move deployment names into installation-time config; keep package code bound to logical capabilities, not account resource names.",
        ("config", "example"),
    ),
    compile_rule(
        "PORT007", "high", "static-route",
        r"['\"]/static/dashboard/app/cms/",
        "Studio assets assume a host-specific static asset mount path.",
        "Use an injected assetBaseUrl/basePath or bundle/import assets through the consuming application.",
        ("runtime",),
    ),
    compile_rule(
        "PORT008", "high", "api-base",
        r"fetch\(\s*['\"]/api/cms/|cmsApi\(\s*['\"]/api/cms/",
        "Studio API requests are hardwired to same-origin /api/cms.",
        "Introduce a CmsRuntimeConfig/apiBaseUrl adapter. Same-origin may be a default only when explicitly selected by the host.",
        ("runtime",),
    ),
    compile_rule(
        "PORT009", "medium", "binding-name",
        r"(?:self\.)?env\.(?:DB|CMS_BUCKET|ASSETS|SESSION_CACHE|IAM_COLLAB|MY_QUEUE|AI)\b",
        "Runtime directly depends on a concrete host binding name.",
        "Resolve logical capabilities through one adapter/config object and validate required bindings at startup.",
        ("runtime",),
    ),
    compile_rule(
        "PORT010", "high", "bucket-routing",
        r"bucket\s*(?:==|in)\s*.*['\"]inneranimalmedia['\"]|form\.append\(\s*['\"]bucket['\"]\s*,\s*['\"]inneranimalmedia['\"]",
        "Runtime branches on the original host's physical R2 bucket name.",
        "Use logical storage roles (cms_assets, published_site, imports) mapped to provider bindings by the deployment adapter.",
        ("runtime",),
    ),
    compile_rule(
        "PORT011", "medium", "service-name",
        r"['\"]iam-cms-pipeline['\"]",
        "Runtime/config assumes one globally fixed Worker service name.",
        "Treat service name as deployment metadata; code should depend on the CMS_PIPELINE capability/binding only.",
        ("runtime", "config", "example"),
    ),
)


def should_skip(path: Path, root: Path) -> bool:
    rel = path.relative_to(root)
    if any(part in SKIP_DIRS or part.startswith('.venv') for part in rel.parts):
        return True
    for parts in SKIP_PATH_PARTS:
        if tuple(rel.parts[: len(parts)]) == parts:
            return True
    if path.name.endswith((".min.js", ".map")) or path.name in {"uv.lock", "pylock.toml"}:
        return True
    return False


def iter_text_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file() or should_skip(path, root):
            continue
        if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in {".env.example", "README.md"}:
            continue
        try:
            if path.stat().st_size > MAX_FILE_BYTES:
                continue
        except OSError:
            continue
        yield path


def classify(path: Path, root: Path) -> str:
    rel = path.relative_to(root).as_posix()
    if rel.startswith("docs/") or rel == "README.md":
        return "docs"
    if rel.startswith("integration/") or rel.startswith("manifests/") or ".example." in rel or rel.endswith(".example"):
        return "example"
    if path.suffix.lower() in {".json", ".jsonc", ".toml", ".yaml", ".yml"} or path.name.startswith(".env"):
        return "config"
    return "runtime"


def adjusted_severity(severity: str, scope: str) -> str:
    # Docs/examples are still useful evidence, but they should not fail a package
    # as aggressively as executable/config source unless the structural checks do.
    if scope not in {"docs", "example"}:
        return severity
    order = ["info", "low", "medium", "high", "critical"]
    return order[max(0, order.index(severity) - 2)]


def scan_rules(root: Path) -> tuple[list[Finding], dict[str, str]]:
    findings: list[Finding] = []
    texts: dict[str, str] = {}
    for path in iter_text_files(root):
        rel = path.relative_to(root).as_posix()
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        texts[rel] = text
        scope = classify(path, root)
        for lineno, line in enumerate(text.splitlines(), 1):
            compact = line.strip()
            if not compact:
                continue
            for rule in RULES:
                if scope not in rule.scopes or not rule.pattern.search(line):
                    continue
                findings.append(Finding(
                    rule.rule_id,
                    adjusted_severity(rule.severity, scope),
                    rule.category,
                    rel,
                    lineno,
                    rule.message,
                    compact[:240],
                    rule.remediation,
                ))
    return findings, texts


def add_structural(findings: list[Finding], root: Path, texts: dict[str, str]) -> None:
    def add(rule_id: str, severity: str, category: str, path: str, message: str, remediation: str, evidence: str = "") -> None:
        findings.append(Finding(rule_id, severity, category, path, 0, message, evidence, remediation))

    if not (root / "package.json").exists():
        add(
            "STRUCT001", "critical", "distribution", "package.json",
            "Repository claims a reusable Studio product but has no root JS package/build contract.",
            "Create a real package boundary with name/version/exports/peerDependencies/build/test/files. Do not distribute TSX by copy-paste.",
            "root package.json missing",
        )

    if not any((root / p).exists() for p in ("vite.config.ts", "vite.config.js", "tsconfig.json", "rollup.config.js")):
        add(
            "STRUCT002", "high", "build-reproducibility", "studio/",
            "Studio TS/TSX source has no repository-owned reproducible build entrypoint.",
            "Own the Studio build in this repo and generate browser artifacts from source in CI/release; do not maintain hand-copied parallel bundles.",
            "no root TS/Vite/Rollup build config found",
        )

    workflow_dir = root / ".github" / "workflows"
    if not workflow_dir.exists() or not any(workflow_dir.glob("*.y*ml")):
        add(
            "STRUCT003", "medium", "ci", ".github/workflows",
            "No CI workflow proves portability on a clean machine.",
            "Add clean-install/build/test/audit jobs and run them on supported Node/Python versions before release.",
            "no workflow files found",
        )

    test_candidates = [p for p in root.rglob("*") if p.is_file() and ("test" in p.name.lower() or "spec" in p.name.lower()) and not should_skip(p, root)]
    if not test_candidates:
        add(
            "STRUCT004", "high", "tests", "test/",
            "No package-owned automated test suite was found.",
            "Add contract tests for project resolution, API base, asset base, bindings, manifest validation, draft/publish flow, and clean-room install.",
            "no test/spec files found",
        )

    schema_candidates = list(root.rglob("*schema*.json")) + list(root.rglob("*schema*.yaml")) + list(root.rglob("*schema*.yml"))
    if not schema_candidates:
        add(
            "STRUCT005", "critical", "manifest-schema", "manifests/",
            "The Prototype Manifest is documentation/example data, not a validated schema contract.",
            "Publish a versioned JSON Schema (or equivalent) plus validate/compile commands. Reject unknown/missing capabilities before deploy.",
            "no machine-readable manifest schema found",
        )

    compiler_markers = ("compile_manifest", "compileManifest", "manifest compile", "validate_manifest", "validateManifest")
    executable_texts = [text for rel, text in texts.items() if rel.startswith(('scripts/', 'services/', 'src/', 'studio/'))]
    if not any(marker in text for marker in compiler_markers for text in executable_texts):
        add(
            "STRUCT006", "critical", "manifest-compiler", "manifests/",
            "Docs say hosts compile the manifest into bindings/tools/gates, but this repo contains no manifest compiler/validator implementation.",
            "Move compilation into this package: manifest -> resolved capability graph -> provider config/receipts. Hosts supply values, not custom compiler logic.",
            "manifest compiler markers not found",
        )

    required_tables = {"cms_pages", "cms_page_sections"}
    created_tables: set[str] = set()
    table_re = re.compile(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`\"']?([A-Za-z0-9_]+)", re.I)
    for rel, text in texts.items():
        if rel.endswith(".sql"):
            created_tables.update(m.group(1) for m in table_re.finditer(text))
    missing = sorted(required_tables - created_tables)
    if missing:
        add(
            "STRUCT007", "critical", "data-contract", "services/cms-pipeline-service/src/pipeline/bootstrap.py",
            "Runtime queries CMS tables that this product repo does not provision.",
            "Ship portable migrations/schema for the minimum CMS data contract, or define a required external adapter with an executable conformance test.",
            "missing CREATE TABLE for: " + ", ".join(missing),
        )

    studio_calls_api = any("/api/cms/" in text for rel, text in texts.items() if rel.startswith("studio/"))
    api_implementation = any(
        "/api/cms/" in text and ("router" in text.lower() or "pathname" in text.lower() or "request.method" in text.lower())
        for rel, text in texts.items()
        if rel.startswith(("services/", "src/", "server/", "backend/"))
    )
    if studio_calls_api and not api_implementation:
        add(
            "STRUCT008", "critical", "host-api", "studio/",
            "Studio consumes /api/cms/* but this repository does not implement the required host CMS API surface.",
            "Either package the API implementation, or make a versioned CmsHostAdapter interface mandatory and ship a conformance test harness. Do not call the product standalone until one path works end-to-end.",
            "client API calls found; host API implementation not found",
        )

    primetech = root / "studio" / "dashboard" / "PrimeTechCmsLite.tsx"
    static_core = root / "studio" / "public" / "cms-editor-core.js"
    studio_jsx = root / "studio" / "public" / "studio.jsx"
    if primetech.exists() and static_core.exists() and studio_jsx.exists():
        add(
            "STRUCT009", "high", "source-authority", "studio/",
            "Multiple large editor implementations exist without an explicit generated/source-of-truth contract.",
            "Choose one source authority, generate distributable artifacts, stamp them with source revision, and fail CI when generated output drifts.",
            "PrimeTechCmsLite.tsx + cms-editor-core.js + studio.jsx all present",
        )

    entry = texts.get("services/cms-pipeline-service/src/entry.py", "")
    secret_names = re.findall(r'"(AGENTSAM_BRIDGE_KEY|INTERNAL_API_SECRET|INGEST_SECRET|IAM_SERVICE_KEY|EXECOS_KEY)"', entry)
    if len(set(secret_names)) >= 4:
        add(
            "STRUCT010", "high", "trust-boundary", "services/cms-pipeline-service/src/entry.py",
            "Pipeline accepts several unrelated legacy secret names as equivalent authority.",
            "Define one package authentication contract (or explicit auth adapter) and record which credential class authorized the request; remove compatibility aliases from the global package core.",
            "accepted secret aliases: " + ", ".join(sorted(set(secret_names))),
        )

    wrangler = texts.get("services/cms-pipeline-service/wrangler.jsonc", "")
    if re.search(r'"database_id"\s*:', wrangler) and re.search(r'"kv_namespaces"\s*:', wrangler):
        add(
            "STRUCT011", "critical", "deploy-template", "services/cms-pipeline-service/wrangler.jsonc",
            "The checked-in Wrangler file is a live Inner Animal Media deployment, not a globally reusable deployment template.",
            "Rename production config out of the package template. Generate account-specific Wrangler config from resolved installation state and keep an ID-free example in source control.",
            "wrangler.jsonc contains account resource IDs/routes/origins",
        )

    # A branded schema namespace is allowed; distinguish schema ownership from deployment coupling.
    manifest_text = texts.get("manifests/cms-studio.v1.example.yaml", "")
    if "apiVersion: inneranimalmedia.com/v1" in manifest_text:
        add(
            "NOTE001", "info", "schema-identity", "manifests/cms-studio.v1.example.yaml",
            "The branded apiVersion namespace identifies the schema owner; that alone is not a portability defect.",
            "Keep the namespace if desired, but ensure every deployment-specific value is supplied through validated manifest fields/adapters.",
            "apiVersion: inneranimalmedia.com/v1",
        )


def dedupe(findings: list[Finding]) -> list[Finding]:
    seen: set[tuple[str, str, int, str]] = set()
    out: list[Finding] = []
    for f in findings:
        key = (f.rule_id, f.path, f.line, f.evidence)
        if key not in seen:
            seen.add(key)
            out.append(f)
    return sorted(out, key=lambda f: (-SEVERITY_ORDER[f.severity], f.path, f.line, f.rule_id))


def summary(findings: list[Finding]) -> dict[str, object]:
    sev = Counter(f.severity for f in findings)
    cats = Counter(f.category for f in findings)
    blocking = sev["critical"] + sev["high"]
    return {
        "trust_ready": blocking == 0,
        "blocking_findings": blocking,
        "by_severity": {k: sev[k] for k in ("critical", "high", "medium", "low", "info")},
        "by_category": dict(sorted(cats.items())),
    }


def render_markdown(root: Path, findings: list[Finding]) -> str:
    s = summary(findings)
    lines = [
        "# Global package portability audit",
        "",
        f"Repository: `{root}`",
        "",
        f"**Trust-ready:** {'yes' if s['trust_ready'] else 'no'}  ",
        f"**Blocking findings (critical/high):** {s['blocking_findings']}",
        "",
        "## Severity summary",
        "",
    ]
    for sev, count in s["by_severity"].items():
        lines.append(f"- {sev}: {count}")
    lines += ["", "## Findings", ""]
    for f in findings:
        where = f"{f.path}:{f.line}" if f.line else f.path
        lines += [
            f"### {f.severity.upper()} {f.rule_id} — {f.category}",
            "",
            f"**Where:** `{where}`",
            "",
            f"{f.message}",
            "",
            f"Evidence: `{f.evidence}`" if f.evidence else "",
            "",
            f"Remediation: {f.remediation}",
            "",
        ]
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="Audit repository portability/global-package trust failures.")
    ap.add_argument("root", nargs="?", default=".", help="repository root")
    ap.add_argument("--json-out", help="write machine-readable report")
    ap.add_argument("--markdown-out", help="write human report")
    ap.add_argument("--fail-on", choices=tuple(SEVERITY_ORDER), default=None,
                    help="exit 2 when this severity or higher is present")
    args = ap.parse_args()

    root = Path(args.root).expanduser().resolve()
    findings, texts = scan_rules(root)
    add_structural(findings, root, texts)
    findings = dedupe(findings)
    report = {
        "schema": "agentsam.portability-audit.v1",
        "root": str(root),
        "summary": summary(findings),
        "findings": [asdict(f) for f in findings],
    }

    if args.json_out:
        Path(args.json_out).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    if args.markdown_out:
        Path(args.markdown_out).write_text(render_markdown(root, findings), encoding="utf-8")

    print(json.dumps(report["summary"], indent=2))
    for f in findings:
        if SEVERITY_ORDER[f.severity] >= SEVERITY_ORDER["high"]:
            where = f"{f.path}:{f.line}" if f.line else f.path
            print(f"{f.severity.upper():8} {f.rule_id:9} {where} — {f.message}")

    if args.fail_on:
        threshold = SEVERITY_ORDER[args.fail_on]
        if any(SEVERITY_ORDER[f.severity] >= threshold for f in findings):
            return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
