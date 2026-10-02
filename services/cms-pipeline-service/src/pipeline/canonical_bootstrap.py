"""Canonical CmsPackage v2 bootstrap reader.

This module targets the same logical CMS model owned by client-cms-editor:
cms_sites -> cms_pages -> cms_sections -> cms_blocks.

The database object only needs the Cloudflare D1-style prepare/bind/all/first
surface, so the query contract is explicit and easy to fake in tests.
"""

from __future__ import annotations

import json
from typing import Any


def _rows(result: Any) -> list[dict[str, Any]]:
    values = result.results if hasattr(result, "results") else result
    return [dict(row) for row in (values or [])]


def _json_object(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return dict(value)
    if not isinstance(value, str) or not value.strip():
        return {}
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError:
        return {}
    return dict(parsed) if isinstance(parsed, dict) else {}


async def fetch_site(db: Any, site_id: str) -> dict[str, Any] | None:
    site = (site_id or "").strip()
    if not site:
        return None
    row = await (
        db.prepare(
            """
            SELECT id, name, initials, domain, color, theme_json, schemas_json
            FROM cms_sites
            WHERE id = ?
            LIMIT 1
            """
        )
        .bind(site)
        .first()
    )
    if not row:
        return None
    item = dict(row)
    item["theme"] = _json_object(item.pop("theme_json", None))
    item["schemas"] = _json_object(item.pop("schemas_json", None))
    return item


async def fetch_pages(db: Any, site_id: str, *, limit: int = 100) -> list[dict[str, Any]]:
    site = (site_id or "").strip()
    if not site:
        return []
    result = await (
        db.prepare(
            """
            SELECT id, site_id, title, slug, status, type, parent,
                   meta_title, meta_description, sort_order
            FROM cms_pages
            WHERE site_id = ?
            ORDER BY sort_order ASC, slug ASC
            LIMIT ?
            """
        )
        .bind(site, limit)
        .all()
    )
    return _rows(result)


async def fetch_blocks(db: Any, section_id: str) -> list[dict[str, Any]]:
    section = (section_id or "").strip()
    if not section:
        return []
    result = await (
        db.prepare(
            """
            SELECT id, section_id, type, visible, data_json, sort_order
            FROM cms_blocks
            WHERE section_id = ?
            ORDER BY sort_order ASC, id ASC
            """
        )
        .bind(section)
        .all()
    )
    out: list[dict[str, Any]] = []
    for row in _rows(result):
        row["visible"] = bool(row.get("visible", 1))
        row["data"] = _json_object(row.pop("data_json", None))
        out.append(row)
    return out


async def fetch_sections(db: Any, page_id: str) -> list[dict[str, Any]]:
    page = (page_id or "").strip()
    if not page:
        return []
    result = await (
        db.prepare(
            """
            SELECT id, page_id, name, type, zone, visible, color,
                   fields_json, css_json, sort_order
            FROM cms_sections
            WHERE page_id = ?
            ORDER BY sort_order ASC, name ASC
            """
        )
        .bind(page)
        .all()
    )
    out: list[dict[str, Any]] = []
    for row in _rows(result):
        row["visible"] = bool(row.get("visible", 1))
        row["fields"] = _json_object(row.pop("fields_json", None))
        row["css"] = _json_object(row.pop("css_json", None))
        row["blocks"] = await fetch_blocks(db, str(row.get("id") or ""))
        out.append(row)
    return out


async def build_canonical_bootstrap(db: Any, site_id: str) -> dict[str, Any]:
    site = await fetch_site(db, site_id)
    if site is None:
        return {
            "schema": "inneranimalmedia.cms.bootstrap.v2",
            "site": None,
            "pages": [],
        }

    pages = await fetch_pages(db, site_id)
    hydrated: list[dict[str, Any]] = []
    for page in pages:
        page = dict(page)
        page["sections"] = await fetch_sections(db, str(page.get("id") or ""))
        hydrated.append(page)

    return {
        "schema": "inneranimalmedia.cms.bootstrap.v2",
        "site": site,
        "pages": hydrated,
    }
