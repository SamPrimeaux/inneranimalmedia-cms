#!/usr/bin/env python3
"""Approved single-donor design extraction: source SHA pinned; never ingest donor content."""
import argparse, json, hashlib, re
from pathlib import Path

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--source',type=Path,required=True)
    p.add_argument('--out',type=Path,default=Path('packages/section-library/src/sections/gallery-filterable-style.ts'))
    p.add_argument('--source-sha256',required=True)
    a=p.parse_args()
    source=a.source.read_text(encoding='utf-8')
    observed=hashlib.sha256(source.encode()).hexdigest()
    if observed!=a.source_sha256:
        raise RuntimeError('Original gallery changed; manual design review required')
    found=re.findall(r'<style\b[^>]*>(.*?)</style\s*>',source,re.I|re.S)
    if len(found)!=1: raise RuntimeError('Expected exactly one original style block')
    css=found[0]
    orig_hash=hashlib.sha256(css.encode()).hexdigest()
    # Shadow DOM preserves all gallery classes, geometry and breakpoints while
    # moving the document-global tokens/body selector to the component host.
    scoped=re.sub(r'(?m)^(\s*):root(\s*\{)',r'\1:host\2',css)
    scoped=re.sub(r'(?m)^(\s*)body(\s*\{)',r'\1:host\2',scoped)
    # All original tag selectors now execute solely inside the ShadowRoot.
    export = ("// Generated from an approved historical source; do not hand-edit.\n"
              "export const GALLERY_ORIGINAL_SOURCE_SHA256 = "+json.dumps(observed)+";\n"
              "export const GALLERY_ORIGINAL_CSS_SHA256 = "+json.dumps(orig_hash)+";\n"
              "export const GALLERY_FILTERABLE_CSS = "+json.dumps(scoped)+";\n")
    a.out.parent.mkdir(parents=True,exist_ok=True)
    a.out.write_text(export)
    print(json.dumps({'original_source_sha256':observed,'original_css_sha256':orig_hash,
                      'css_bytes':len(scoped.encode()),'scope_transformations':2,
                      'output':str(a.out)}))

if __name__=='__main__': main()
