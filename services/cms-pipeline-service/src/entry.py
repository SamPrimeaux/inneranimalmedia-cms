"""
IAM CMS Pipeline — Python Worker (Pyodide / workers-py).

Agentic HTML parsing, D1 bootstrap, R2 reads, Workers AI prototyping.
Called from Agent Sam tools or via service binding from inneranimalmedia Worker.
"""

from __future__ import annotations

import json
from urllib.parse import urlparse

from workers import WorkerEntrypoint, Response

from pipeline.agent_prototype import propose_sections
from pipeline.canonical_bootstrap import build_canonical_bootstrap, fetch_sections
from pipeline.html_sections import (
    default_sections_from_template,
    extract_body_inner,
    inject_section_html,
    list_section_slots,
    section_names_from_html,
)
from pipeline.preview import inject_bootstrap_script, studio_bootstrap_payload
from pipeline.runtime_contract import resolve_object_store, verify_bridge_key


def _json_response(payload, status=200):
    return Response.from_json(payload, status=status)


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        url = urlparse(request.url)
        path = url.path.rstrip("/") or "/"
        method = request.method.upper()

        if path == "/health":
            return _json_response({"ok": True, "service": "iam-cms-pipeline", "runtime": "python"})

        if not verify_bridge_key(request, self.env):
            return _json_response({"error": "unauthorized"}, status=401)

        if path == "/pipeline/extract-sections" and method == "POST":
            body = await request.json()
            html = str(body.get("html") or body.get("content") or "")
            slots = list_section_slots(html)
            return _json_response(
                {
                    "section_names": section_names_from_html(html),
                    "slots": [{"name": s.name, "tag": s.tag} for s in slots],
                    "default_sections": default_sections_from_template(html),
                    "body_inner": extract_body_inner(html),
                }
            )

        if path == "/pipeline/inject" and method == "POST":
            body = await request.json()
            out = inject_section_html(
                str(body.get("shell_html") or body.get("html") or ""),
                str(body.get("section_name") or ""),
                str(body.get("fragment_html") or body.get("fragment") or ""),
                position=str(body.get("position") or "replace"),
            )
            return _json_response({"html": out})

        if path == "/pipeline/bootstrap" and method in ("GET", "POST"):
            site_id = ""
            if method == "GET":
                from urllib.parse import parse_qs

                params = parse_qs(url.query)
                site_id = (params.get("site_id") or params.get("project_id") or [""])[0]
            else:
                body = await request.json()
                site_id = str(body.get("site_id") or body.get("project_id") or "")
            if not site_id:
                return _json_response({"error": "site_id required"}, status=400)
            if not self.env.DB:
                return _json_response({"error": "database capability unavailable"}, status=503)
            data = await build_canonical_bootstrap(self.env.DB, site_id)
            return _json_response(data)

        if path in ("/pipeline/object-text", "/pipeline/r2-text") and method == "POST":
            body = await request.json()
            key = str(body.get("object_key") or body.get("key") or body.get("r2_key") or "").strip()
            storage_role = str(body.get("storage_role") or "cms_content").strip()
            if not key:
                return _json_response({"error": "object_key required"}, status=400)
            store = resolve_object_store(self.env, storage_role)
            if not store:
                return _json_response(
                    {"error": "object storage capability unavailable", "storage_role": storage_role},
                    status=503,
                )
            obj = await store.get(key)
            if not obj:
                return _json_response(
                    {"error": "not_found", "object_key": key, "storage_role": storage_role},
                    status=404,
                )
            text = await obj.text()
            return _json_response(
                {"object_key": key, "storage_role": storage_role, "text": text}
            )

        if path == "/agent/prototype" and method == "POST":
            if not self.env.AI:
                return _json_response({"error": "AI binding missing"}, status=503)
            body = await request.json()
            goal = str(body.get("goal") or body.get("prompt") or "").strip()
            page_id = str(body.get("page_id") or "").strip()
            site_id = str(body.get("site_id") or body.get("project_id") or "").strip()
            if not goal:
                return _json_response({"error": "goal required"}, status=400)
            page = body.get("page") or {}
            sections = body.get("sections")
            if sections is None and page_id and self.env.DB:
                sections = await fetch_sections(self.env.DB, page_id)
            if sections is None:
                sections = []
            if not page and page_id and self.env.DB:
                page = (
                    await self.env.DB.prepare(
                        "SELECT id, site_id, slug, title, status, type, parent, meta_title, meta_description, sort_order FROM cms_pages WHERE id = ? LIMIT 1"
                    )
                    .bind(page_id)
                    .first()
                    or {}
                )
            proposal = await propose_sections(
                self.env.AI,
                goal=goal,
                page=dict(page) if page else {"site_id": site_id},
                sections=list(sections),
            )
            return _json_response(proposal)

        if path == "/pipeline/studio-bootstrap-html" and method == "POST":
            body = await request.json()
            shell = str(body.get("shell_html") or "")
            site_id = str(body.get("site_id") or body.get("project_id") or "")
            page_id = str(body.get("page_id") or "") or None
            bootstrap = body.get("bootstrap")
            if bootstrap is None and site_id and self.env.DB:
                bootstrap = await build_canonical_bootstrap(self.env.DB, site_id)
            payload = studio_bootstrap_payload(
                project_id=site_id,
                page_id=page_id,
                bootstrap=bootstrap or {},
                preview_urls=body.get("preview_urls") or {},
            )
            html = inject_bootstrap_script(shell, payload)
            return Response(html, headers={"Content-Type": "text/html; charset=utf-8"})

        return _json_response({"error": "not_found", "path": path}, status=404)
