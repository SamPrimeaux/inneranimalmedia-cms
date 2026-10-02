"""HTMLRewriter-style bootstrap injection for SPA / studio shells (Python-side helpers)."""

from __future__ import annotations

import json
from typing import Any


def inject_bootstrap_script(html: str, data: dict[str, Any], *, global_name: str = "__CMS_BOOTSTRAP__") -> str:
    """Prepend a JSON bootstrap blob before </body> (Worker should prefer HTMLRewriter in production)."""
    payload = json.dumps(data, separators=(",", ":"))
    script = f'<script>{global_name}={payload};</script>'
    lower = (html or "").lower()
    idx = lower.rfind("</body>")
    if idx >= 0:
        return html[:idx] + script + html[idx:]
    return (html or "") + script


def studio_bootstrap_payload(
    *,
    project_id: str,
    page_id: str | None,
    bootstrap: dict[str, Any],
    preview_urls: dict[str, str] | None = None,
) -> dict[str, Any]:
    return {
        "schema": "inneranimalmedia.cms.studio-bootstrap.v2",
        "project": {"id": project_id},
        "page": {"id": page_id} if page_id else None,
        "bootstrap": bootstrap,
        "preview_urls": preview_urls or {},
    }
