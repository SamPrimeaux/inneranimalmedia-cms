-- Data-preserving import from renamed v1 tables into canonical v2.
-- Caller has already renamed v1 tables, created v2 schema, and started a transaction.
INSERT INTO cms_sites(id,name,slug,primary_domain,settings_json,status)
SELECT id,name,id,NULLIF(domain,''),
json_object('legacy',json_object('initials',initials,'edited',edited,'color',color,
'theme',CASE WHEN json_valid(theme_json) THEN json(theme_json) ELSE theme_json END,
'schemas',CASE WHEN json_valid(schemas_json) THEN json(schemas_json) ELSE schemas_json END)),
'active' FROM cms_legacy_sites;
INSERT INTO cms_pages(id,site_id,title,slug,route_path,page_type,status,meta_title,meta_description,sort_order,metadata_json)
SELECT id,site_id,title,slug,
CASE WHEN slug='home' OR slug='' THEN '/' ELSE '/'||trim(slug,'/') END,
'custom',CASE WHEN status IN ('draft','published','archived','scheduled') THEN status ELSE 'draft' END,
meta_title,meta_description,sort_order,json_object('v1',json_object('type',type,'parent',parent))
FROM cms_legacy_pages;
INSERT INTO cms_assets(id,site_id,name,mime_type,size,url,asset_key,created_at,metadata_json)
SELECT id,site_id,name,mime_type,size,url,asset_key,created_at,
CASE WHEN json_valid(metadata_json) THEN metadata_json ELSE '{}' END
FROM cms_legacy_assets;
INSERT INTO cms_page_sections(id,page_id,section_type,section_name,section_data,sort_order,is_visible)
SELECT id,page_id,type,name,
json_object('fields',json(CASE WHEN json_valid(fields_json) THEN fields_json ELSE '{}' END),
'css',json(CASE WHEN json_valid(css_json) THEN css_json ELSE '{}' END),
'zone',zone,'color',color),sort_order,visible
FROM cms_legacy_sections;
INSERT INTO cms_section_blocks(id,section_id,block_key,block_type,sort_order,status,content_json,settings_json)
SELECT id,section_id,id,type,sort_order,
CASE WHEN visible=0 THEN 'hidden' ELSE 'active' END,
CASE WHEN json_valid(data_json) THEN data_json ELSE '{}' END,'{}'
FROM cms_legacy_blocks;
INSERT INTO cms_revisions(id,page_id,kind,created_at,label,snapshot_json)
SELECT id,page_id,kind,created_at,label,snapshot_json FROM cms_legacy_revisions;
INSERT INTO cms_publications(page_id,publication_id,route,revision_num,theme,sections_json,published_at,metadata_json)
SELECT page_id,publication_id,route,revision_num,theme,sections_json,published_at,
CASE WHEN metadata_json IS NULL OR json_valid(metadata_json) THEN metadata_json ELSE '{}' END
FROM cms_legacy_publications;
