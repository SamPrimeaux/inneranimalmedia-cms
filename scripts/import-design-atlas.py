#!/usr/bin/env python3
"""Import owned, historical design *evidence* into a review atlas.

Opt-in operation. The SDK and inneranimalmedia remain canonical sources;
this script makes review snapshots, NEVER packages or production writes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path
from html import escape

THEMES = ("cypress", "violet", "grove", "ember", "forge", "harbor", "summit", "resolve")
LABS = {
    "loading-states": "agent-sam-loading-states-lab",
    "loading-clean": "agent-sam-loading-states-clean-lab",
    "offline-runner": "iam-offline-runner",
    "scroll-fx": "iam-scroll-fx/demo",
}
TEMPLATES = ("starter-page", "blank-canvas")
SAMPLE_SECTIONS = (
    ("games", "feature_row"),
    ("games", "interactive_systems_hero"),
    ("games", "london_dream_railway"),
    ("games", "meauxchess_hero"),
    ("homepage", "agentsam_platform_services"),
)
def sha(root: Path) -> str:
    return subprocess.check_output(("git", "rev-parse", "HEAD"), cwd=root, text=True).strip()
def route(path: Path) -> str:
    return "/library/evidence/" + path.as_posix().strip("/") + "/"
def normalized_links(text: str, slug: str) -> str:
    prefix = f"/library/evidence/themes/{slug}/"
    # Only rewrite root-relative local site links; do not modify absolute HTTP URLs.
    text = re.sub(r'(?i)(href|src|poster|action|srcset)=(["\x27])/(?!/)', lambda m: m.group(1) + "=" + m.group(2) + prefix, text)
    text = re.sub(r'(?i)url\(\s*(["\x27]?)/(?!/)', lambda m: "url(" + m.group(1) + prefix, text)
    return text
def mount_site(source: Path, dest: Path, slug: str) -> None:
    if not source.is_dir(): raise RuntimeError("Missing donor site: " + str(source))
    shutil.copytree(source, dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns(".DS_Store", "node_modules", "*.map"))
    for file in dest.rglob("*"):
        if file.suffix.lower() not in {".html", ".css", ".js", ".mjs"} or not file.is_file():
            continue
        # Byte copying except targeted root-absolute paths; snapshots remain derived review evidence.
        try: original = file.read_text(encoding="utf-8")
        except UnicodeDecodeError: continue
        updated = normalized_links(original, slug)
        # Source bugs/side effects are corrected only in the derived preview
        # copies, never in the canonical SDK package.
        if slug == "summit" and file.name == "index.html":
            updated = updated.replace(
                "Summit team's",
                "Summit team’s",
            )
        if slug == "forge" and file.suffix == ".js":
            updated = updated.replace(
                "if(`serviceWorker`in navigator)",
                "if(false&&`serviceWorker`in navigator)",
            )
        if updated != original: file.write_text(updated, encoding="utf-8")

def standalone_pages(folder: Path, base: str) -> list[dict[str, str]]:
    out = []
    for file in sorted(folder.rglob("*.html")):
        if any(part in {"global", "partials", "components", "help"} for part in file.relative_to(folder).parts):
            continue
        text = file.read_text(errors="replace")[:2000].lower()
        if "<html" not in text and "<!doctype" not in text: continue
        path = file.relative_to(folder).as_posix()
        label = path.removesuffix(".html").replace("pages/", "").replace("/", " / ").replace("-", " ").title()
        if label in {"Index", "Pages / Index"}: label = "Home"
        out.append({"name":label, "path":base + path})
    return out

def make_section_page(fragment: str, title: str, identifier: str) -> str:
    # Some legacy sections require Tailwind, custom assets or template substitution.
    # This neutral harness makes source markup browsable; it does not claim fidelity.
    notice = ('<div class="provenance"><strong>Legacy section · inspection harness</strong>'
      '<span>Layout dependencies, live data, and media are not normalized. Source preserved as evidence.</span></div>')
    css = """*{box-sizing:border-box}body{margin:0;background:#ebe8e2;color:#151a1c;font:16px system-ui,sans-serif}
      .provenance{padding:12px 18px;display:flex;gap:15px;flex-wrap:wrap;align-items:center;background:#161b1d;color:#fff;font-size:12px}
      .provenance span{opacity:.68}.preview{overflow:hidden}
      section{min-height:180px;padding:clamp(24px,5vw,64px)}h1,h2{line-height:1.07;letter-spacing:-.04em}
      h1{font-size:clamp(2.8rem,7vw,5.5rem)}h2{font-size:clamp(2rem,4vw,4.3rem)}
      a,button{cursor:pointer}img{max-width:100%;height:auto}p{line-height:1.6}
      .mx-auto{margin-left:auto;margin-right:auto}.w-full{width:100%}.max-w-screen-xl-tight{max-width:1180px}
      .px-6{padding-left:24px;padding-right:24px}.text-center{text-align:center}.bg-white{background:#fff}
      .flex{display:flex}.flex-col{flex-direction:column}.grid{display:grid}.items-center{align-items:center}
      .justify-center{justify-content:center}.gap-12{gap:48px}.relative{position:relative}
      .absolute{position:absolute}.inset-0{inset:0}.rounded-\\[32px\\]{border-radius:32px}
      .overflow-hidden{overflow:hidden}.font-bold{font-weight:800}.mb-4{margin-bottom:16px}
      .text-brand-navy{color:#172d39}.text-brand-muted{color:#6a7176}.bg-brand-dark{background:#182934}
      .py-24{padding-top:96px;padding-bottom:96px}.text-4xl{font-size:2.25rem}.text-lg{font-size:1.125rem}
      @media(min-width:768px){.md\\:flex-row{flex-direction:row}.md\\:text-5xl{font-size:3rem}}"""
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
      escape(title) + ' — archived section</title><style>' + css + '</style></head><body>' + notice +
      '<main class="preview">' + fragment + '</main></body></html>')

def make_palette_page(name: str, theme_css: str) -> str:
    label = name.replace("-", " ").title()
    css = """*{box-sizing:border-box}body{margin:0;background:var(--bg-canvas,#121b20);color:var(--text-primary,#f4f1eb);font:16px system-ui,sans-serif}
       header,section,footer{padding:clamp(18px,5vw,64px)}header{border-bottom:1px solid var(--border-default,#525b5f)}
       .eyebrow{letter-spacing:.16em;text-transform:uppercase;font-size:12px;opacity:.65}
       h1{font-size:clamp(3rem,8vw,7rem);line-height:.94;letter-spacing:-.07em;max-width:10ch;margin:24px 0}
       p{max-width:58ch;line-height:1.65;opacity:.75}.layout{display:grid;grid-template-columns:1.2fr 1fr;gap:22px;align-items:center}
       .tile{background:var(--bg-card,var(--bg-elevated,#273238));border:1px solid var(--border-default,#56636e);padding:30px;border-radius:20px}
       button{padding:14px 22px;border-radius:999px;background:var(--accent-primary,var(--accent,#57b8b9));color:var(--bg-canvas,#111);border:0;font-weight:750}
       .secondary{background:var(--bg-elevated,#283238);color:inherit;border:1px solid var(--border-default,#56636e)}
       .palette{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:30px}
       .swatch{min-height:120px;border-radius:12px;padding:15px;font-size:12px;font-weight:700;display:flex;align-items:end;word-break:break-word}
       .swatch:nth-child(1){background:var(--bg-canvas,#111);border:1px solid currentColor}.swatch:nth-child(2){background:var(--bg-card,#333)}
       .swatch:nth-child(3){background:var(--accent-primary,var(--accent,#67bbbd));color:#101114}
       .swatch:nth-child(4){background:var(--bg-elevated,#555)}@media(max-width:650px){.layout{grid-template-columns:1fr}.palette{grid-template-columns:1fr 1fr}}"""
    return ('<!doctype html><html lang="en" data-cms-theme="' + escape(name) +
      '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
      escape(label) + ' palette study</title><style>' + theme_css + "\n" + css +
      '</style></head><body><header><b>ARCHIVE / CMS COLOR SYSTEM</b><span style="float:right">' + escape(label) +
      '</span></header><section class="layout"><div><div class="eyebrow">Theme tokens · original palette</div><h1>' +
      escape(label) + '</h1><p>A historical CSS token experiment, shown here in a neutral component layout. This is not a complete storefront theme.</p>' +
      '<button>Primary action ↗</button> <button class="secondary">Secondary</button></div>' +
      '<div class="tile"><div class="eyebrow">Surface / component preview</div><h2>A reusable building block.</h2>' +
      '<p>Text, interactive elements and surfaces inherit the source theme variables.</p>' +
      '<div class="palette"><div class="swatch">Canvas</div><div class="swatch">Card</div><div class="swatch">Accent</div>' +
      '<div class="swatch">Elevated</div></div></div></section><footer>Archived appearance only · production integration not asserted.</footer></body></html>')

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sdk-root", required=True, type=Path)
    parser.add_argument("--parent-root", required=True, type=Path)
    parser.add_argument("--browser-root", type=Path, help="Optional AgentSam BrowserShell promo donor")
    parser.add_argument("--destination", default="examples/revise-foundation/public/library/evidence", type=Path)
    parser.add_argument("--catalog", default="examples/revise-foundation/src/design-atlas.json", type=Path)
    args = parser.parse_args()
    sdk = args.sdk_root.expanduser().resolve()
    parent = args.parent_root.expanduser().resolve()
    target = args.destination.resolve()
    target.mkdir(parents=True, exist_ok=True)
    theme_info = {item["slug"]:item for item in json.loads(
        (sdk/"apps/theme-gallery-preview/data/catalog.json").read_text())["themes"]}
    items: list[dict] = []
    sdk_rev, parent_rev = sha(sdk), sha(parent)
    browser = args.browser_root.expanduser().resolve() if args.browser_root else None
    browser_rev = sha(browser) if browser else None
    for slug in THEMES:
        base = Path("themes")/slug
        original = sdk/"packages"/("theme-"+slug)/"site"
        folder = target/base
        mount_site(original, folder, slug)
        info = theme_info[slug]
        pages = standalone_pages(folder, route(base))
        items.append({
          "id": "theme-"+slug,"kind":"theme","title":info["name"],"family":info["category"],
          "description":info.get("cardBlurb") or info.get("tagline") or "",
          "previewUrl":route(base) + "index.html", "pages":pages,
          "sourceRepo":"SamPrimeaux/agentsam-sdk","sourcePath":f"packages/theme-{slug}/site",
          "sourceCommit":sdk_rev, "maturity":"packaged preview", "importMethod":"derived snapshot",
        })
    for id_, original_name in LABS.items():
        base = Path("labs")/id_
        original = parent/"static/templates/ui"/original_name
        folder = target/base
        shutil.copytree(original, folder, dirs_exist_ok=True, ignore=shutil.ignore_patterns(".DS_Store", "*.map"))
        for markdown in folder.rglob("*.md"):
            markdown.write_text(chr(10).join(line.rstrip() for line in markdown.read_text().splitlines()) + chr(10))
        if not (folder/"index.html").exists(): raise RuntimeError("Missing lab index: "+str(folder))
        items.append({
          "id":"lab-"+id_, "kind":"lab","title":id_.replace("-"," ").title(),
          "family":"UI and interaction study","description":"Original UI/interaction experiment, preserved for refinement.",
          "previewUrl":route(base) + "index.html", "pages":standalone_pages(folder, route(base)),
          "sourceRepo":"SamPrimeaux/inneranimalmedia","sourcePath":f"static/templates/ui/{original_name}",
          "sourceCommit":parent_rev, "maturity":"historical experiment", "importMethod":"derived snapshot",
        })
    if browser:
        base = Path("labs")/"browser-promo"
        source = browser/"apps/agentsam-browser-site/dist"
        if not (source/"index.html").exists(): raise RuntimeError("Missing BrowserShell built site: "+str(source))
        folder = target/base
        shutil.copytree(source, folder, dirs_exist_ok=True, ignore=shutil.ignore_patterns(".DS_Store", "*.map"))
        items.append({
          "id":"lab-browser-promo","kind":"lab","title":"AgentSam Browser Promo",
          "family":"Experimental browser product","description":"Original multi-section BrowserShell promo site, with its own styling and assets.",
          "previewUrl":route(base)+"index.html", "pages":standalone_pages(folder, route(base)),
          "sourceRepo":"SamPrimeaux/AgentSam-BrowserShell","sourcePath":"apps/agentsam-browser-site/dist",
          "sourceCommit":browser_rev, "maturity":"built promo experiment", "importMethod":"derived build snapshot",
        })
    for name in TEMPLATES:
        base = Path("templates")/name
        folder = target/base
        shutil.copytree(parent/"cms/templates"/name, folder, dirs_exist_ok=True)
        items.append({
          "id":"template-"+name,"kind":"template","title":name.replace("-"," ").title(),
          "family":"CMS page template","description":"Original simple HTML starting point.",
          "previewUrl":route(base) + "index.html", "pages":standalone_pages(folder, route(base)),
          "sourceRepo":"SamPrimeaux/inneranimalmedia","sourcePath":f"cms/templates/{name}",
          "sourceCommit":parent_rev,"maturity":"legacy starter", "importMethod":"derived snapshot",
        })
    for group, name in SAMPLE_SECTIONS:
        original = parent/"cms/sections"/group/(name+".html")
        if not original.exists(): raise RuntimeError("Missing section: "+str(original))
        base = Path("sections")/name
        folder = target/base
        folder.mkdir(parents=True, exist_ok=True)
        snippet = original.read_text()
        (folder/"source.html").write_text(snippet)
        (folder/"index.html").write_text(make_section_page(snippet, name.replace("_"," ").title(), name))
        items.append({
          "id":"section-"+name,"kind":"section","title":name.replace("_"," ").title(),
          "family":"Legacy HTML section","description":"Historical section in a neutral harness; original runtime dependencies may be missing.",
          "previewUrl":route(base) + "index.html", "pages":[],
          "sourceRepo":"SamPrimeaux/inneranimalmedia","sourcePath":f"cms/sections/{group}/{name}.html",
          "sourceCommit":parent_rev, "maturity":"needs normalization", "importMethod":"source + neutral harness",
        })
    for folder in sorted((parent/"cms/themes").iterdir()):
        if not folder.is_dir() or not (folder/"theme.css").exists(): continue
        base = Path("palettes")/folder.name
        out = target/base
        out.mkdir(parents=True, exist_ok=True)
        css = (folder/"theme.css").read_text()
        (out/"theme.css").write_text(css)
        (out/"index.html").write_text(make_palette_page(folder.name, css))
        items.append({
          "id":"palette-"+folder.name,"kind":"palette","title":folder.name.replace("-"," ").title(),
          "family":"CMS token palette","description":"Legacy CSS variable set on a common UI surface; not a complete theme site.",
          "previewUrl":route(base) + "index.html", "pages":[],
          "sourceRepo":"SamPrimeaux/inneranimalmedia","sourcePath":f"cms/themes/{folder.name}",
          "sourceCommit":parent_rev, "maturity":"token study", "importMethod":"tokens + comparison harness",
        })
    output = {
      "schemaVersion": 1,
      "purpose": "review-only historical design evidence; not an installable registry",
      "sourceCommits": {"agentsam-sdk": sdk_rev, "inneranimalmedia":parent_rev, **({"AgentSam-BrowserShell":browser_rev} if browser else {})},
      "items": items,
    }
    args.catalog.parent.mkdir(parents=True, exist_ok=True)
    args.catalog.write_text(json.dumps(output,indent=2,ensure_ascii=False)+"\n")
    counts = {k: sum(i["kind"] == k for i in items) for k in {i["kind"] for i in items}}
    print(f"Imported {len(items)} records: "+", ".join(f"{k}={v}" for k,v in sorted(counts.items())))
    print("Snapshots:", target)
    print("Catalog:", args.catalog)

if __name__ == "__main__":
    main()
