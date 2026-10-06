#!/usr/bin/env python3
"""Read-only Shopify donor architecture / curated-source evidence audit."""
import argparse
import hashlib
import json
import re
import sqlite3
from collections import Counter
from pathlib import Path

SCHEMA = re.compile(r'{%\s*schema\s*%}(.*?){%\s*endschema\s*%}', re.S)

def digest(s):
    return hashlib.sha256(s.encode('utf8')).hexdigest()

def extract(section):
    settings = section.get('settings', {})
    if not isinstance(settings, dict):
        return ''
    for key in ('custom_liquid', 'liquid', 'custom_liquid_code'):
        val = settings.get(key)
        if isinstance(val, str) and val.strip():
            return val
    return ''

def evidence(text):
    css = '\n'.join(re.findall(r'<style\b[^>]*>(.*?)</style\s*>', text, re.I|re.S))
    js = '\n'.join(re.findall(r'<script\b[^>]*>(.*?)</script\s*>', text, re.I|re.S))
    html = re.sub(r'<(?:style|script)\b[^>]*>.*?</(?:style|script)\s*>', '', text, flags=re.I|re.S)
    return {
        'source_hash':digest(text),'css_hash':digest(css),'script_hash':digest(js),'markup_hash':digest(html),
        'bytes':len(text.encode()),'article_tags':len(re.findall(r'<article\b',text,re.I)),
        'images':len(re.findall(r'<img\b',text,re.I)),'videos':len(re.findall(r'<video\b',text,re.I)),
        'scripts':len(re.findall(r'<script\b',text,re.I)),'style_blocks':len(re.findall(r'<style\b',text,re.I)),
        'has_global_css':bool(re.search(r'(?:^|})\s*(?:body|html|:root)\s*[{,]',css,re.I)),
        'media_queries':len(re.findall(r'@media\b',text,re.I)),
        'liquid_tags':len(re.findall(r'\{\{|\{%',text)),
    }

def scan(root):
    templates = sorted(p for p in (root/'templates').rglob('*.json') if not p.name.startswith('._'))
    instances = 0
    embedded = 0
    custom = 0
    section_types = Counter()
    sources = {}
    issues = []
    for p in templates:
        data=json.loads(p.read_text(encoding='utf-8-sig'))
        parts=data.get('sections',{})
        if not isinstance(parts,dict):
            issues.append(str(p.relative_to(root))+': no section map')
            continue
        order=data.get('order',[])
        if order and (not isinstance(order,list) or any(k not in parts for k in order)):
            issues.append(str(p.relative_to(root))+': invalid order')
        for sid,section in parts.items():
            if not isinstance(section,dict):
                continue
            instances+=1
            typ=section.get('type','(unknown)')
            section_types[typ]+=1
            if typ!='custom-liquid': continue
            code=extract(section)
            if not code: continue
            custom+=1
            embedded+=len(code)
            key=digest(code)
            item=sources.setdefault(key, {'evidence':evidence(code),'occurrences':[]})
            item['occurrences'].append({'template':str(p.relative_to(root)),'section_id':sid})
    section_defs=[]
    for p in sorted(x for x in (root/'sections').glob('*.liquid') if not x.name.startswith('._')):
        source=p.read_text(errors='replace')
        match=SCHEMA.search(source)
        parsed={}
        if match:
            try: parsed=json.loads(match.group(1))
            except json.JSONDecodeError: issues.append(str(p.relative_to(root))+': invalid schema')
        section_defs.append({'file':str(p.relative_to(root)),'name':parsed.get('name',''),
                             'settings':len(parsed.get('settings',[]) or []),
                             'blocks':len(parsed.get('blocks',[]) or []),'empty':not bool(source.strip())})
    groups=[str(p.relative_to(root)) for p in (root/'sections').glob('*-group.json') if not p.name.startswith('._')]
    theme=next((v for v in json.loads((root/'config/settings_schema.json').read_text())
                if v.get('name')=='theme_info'),{})
    return {'theme':{k:theme.get(k) for k in ('theme_name','theme_version','theme_author')},
            'templates':len(templates),'sections':section_defs,'section_groups':groups,
            'section_instances':instances,'section_types':dict(section_types),
            'custom_instances':custom,'unique_designs':len(sources),'custom_characters':embedded,
            'issues':issues,'sources':sources}

def intake(root,dbfile,collection,scanned,out,materialize):
    root = root.resolve()  # macOS /var -> /private/var and other symlink mounts
    db=sqlite3.connect(dbfile.as_uri()+'?mode=ro',uri=True)
    db.row_factory=sqlite3.Row
    try:
        rows=db.execute("""
        SELECT ci.ordinal,a.id,a.title,a.source_template,a.source_section_id,a.source_hash,
               pc.canonical_id,pc.target_kind,pc.status
        FROM collection_items ci
        JOIN collections co ON co.id=ci.collection_id
        JOIN artifacts a ON a.id=ci.artifact_id
        LEFT JOIN promotion_candidates pc ON pc.artifact_id=a.id
        WHERE co.name=? ORDER BY ci.ordinal
        """,(collection,)).fetchall()
    finally: db.close()
    if not rows: raise ValueError('Curation collection missing')
    chosen=[]
    for row in rows:
        rel=Path(row['source_template'])
        if rel.is_absolute() or '..' in rel.parts: raise ValueError('Unsafe source path')
        p=(root/rel).resolve()
        if not p.is_relative_to(root) or not p.is_file(): raise ValueError('Source escaped donor')
        section=json.loads(p.read_text())['sections'][row['source_section_id']]
        text=extract(section)
        key=digest(text)
        if key!=row['source_hash'] or not key.startswith(row['id']): raise ValueError('Source hash drift: '+row['id'])
        if key not in scanned['sources']: raise ValueError('Not in indexed donor: '+row['id'])
        chosen.append({
          'ordinal':row['ordinal'],'id':row['id'],'title':row['title'],
          'candidate_id':row['canonical_id'],'target_kind':row['target_kind'],'status':row['status'],
          'provenance':{'template':str(rel),'section':row['source_section_id'],
                        'occurrences':scanned['sources'][key]['occurrences']},
          'design_evidence':scanned['sources'][key]['evidence'],
          'portable':False,
          'missing_proofs':['typed independent content','dynamic bindings','fidelity-tested renderer',
                            'no-donor fresh consumer','merchant publication and rollback'],
        })
        if materialize:
            directory=out/'selected-source-reference'
            directory.mkdir(parents=True,exist_ok=True)
            (directory/('%02d-%s.html'%(row['ordinal'],row['id']))).write_text(text)
    return chosen

def run():
    parser=argparse.ArgumentParser()
    parser.add_argument('--donor',type=Path,required=True)
    parser.add_argument('--curation-db',type=Path,required=True)
    parser.add_argument('--out',type=Path,required=True)
    parser.add_argument('--collection',default='pipeline-v1')
    parser.add_argument('--materialize-selected',action='store_true')
    opt=parser.parse_args()
    root=opt.donor.resolve(); out=opt.out.resolve()
    if out.is_relative_to(root): parser.error('Output cannot live inside donor')
    scanned=scan(root)
    selected=intake(root,opt.curation_db.resolve(),opt.collection,scanned,out,opt.materialize_selected)
    out.mkdir(parents=True,exist_ok=True)
    summary={key:val for key,val in scanned.items() if key!='sources'}
    report={'schema':'iam.cms.donor-shopify-audit.v1','donor':str(root),'summary':summary,
            'selection':selected,'source_mutated':False,'production_modified':False}
    (out/'shopify-architecture-audit.json').write_text(json.dumps(report,indent=2)+'\n')
    lines=['# Shopify donor evidence audit','', 'Donor: '+str(root),'',
           '## Inventory','',
           '- Templates: '+str(scanned['templates']),
           '- Section definitions: '+str(len(scanned['sections'])),
           '- Section groups: '+str(len(scanned['section_groups'])),
           '- Section instances: '+str(scanned['section_instances']),
           '- Custom Liquid instances: '+str(scanned['custom_instances']),
           '- Unique embedded designs: '+str(scanned['unique_designs']),
           '- Embedded chars: '+str(scanned['custom_characters']),'',
           '## Curated queue','']
    for c in selected:
        lines.append(str(c['ordinal'])+'. '+c['title']+' -> '+str(c['candidate_id'])+
                     ' ('+str(c['target_kind'])+', '+str(c['status'])+')')
    lines+=['','## Required promotion proofs','',
            '1. Independent typed content record feeding multiple presentations.',
            '2. Source design integrity and exact versioned renderer dependencies.',
            '3. Editable typed dynamic sources without hardcoded donor content.',
            '4. Fresh unrelated consumer without donor paths.',
            '5. Draft, preview, publish, rollback, recovery under partial failure.',
            '','This audit is source preservation, NOT a portable theme release.']
    (out/'shopify-architecture-audit.md').write_text('\n'.join(lines)+'\n')
    print(json.dumps({'ok':True,'templates':scanned['templates'],
                      'sections':len(scanned['sections']),'custom_instances':scanned['custom_instances'],
                      'unique_designs':scanned['unique_designs'],'selected':len(selected),
                      'hashes_match':True,'out':str(out),'production_mutated':False},indent=2))

if __name__=='__main__': run()
