PRAGMA foreign_keys = ON;
-- CMS local SQLite + Cloudflare D1 site-first contract v2.
-- No tenant or workspace identity is required by a standalone installation.
CREATE TABLE IF NOT EXISTS cms_sites (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
 primary_domain TEXT, domain_aliases_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(domain_aliases_json) AND json_type(domain_aliases_json)='array'),
 settings_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(settings_json) AND json_type(settings_json)='object'),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('draft','active','archived')),
 created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now'))
);
CREATE TABLE IF NOT EXISTS cms_themes (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
 theme_family TEXT NOT NULL DEFAULT 'custom',config TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(config)),
 css_url TEXT,css_r2_key TEXT,css_r2_bucket TEXT,compiled_css_hash TEXT,preview_image_url TEXT,
 tokens_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(tokens_json)),
 css_vars_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(css_vars_json)),
 typography_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(typography_json)),
 layout_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(layout_json)),
 components_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(components_json)),
 motion_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(motion_json)),
 brand_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(brand_json)),
 tags_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(tags_json) AND json_type(tags_json)='array'),
 wcag_scores TEXT CHECK(wcag_scores IS NULL OR json_valid(wcag_scores)),
 contrast_flags TEXT CHECK(contrast_flags IS NULL OR json_valid(contrast_flags)),
 visibility TEXT NOT NULL DEFAULT 'public',status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now'))
);
CREATE TABLE IF NOT EXISTS cms_definitions (
 id TEXT PRIMARY KEY DEFAULT('cmsd_'||lower(hex(randomblob(8)))),
 account_id TEXT, definition_key TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('page','section','block','component','navigation','motion','scene','3d_asset')),
 label TEXT NOT NULL,description TEXT,category TEXT,origin TEXT NOT NULL DEFAULT 'package'
 CHECK(origin IN ('built_in','package','imported','generated','app')),
 version TEXT NOT NULL DEFAULT '1',artifact_id TEXT,
 settings_schema_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(settings_schema_json)),
 allowed_blocks_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(allowed_blocks_json)),
 max_blocks INTEGER CHECK(max_blocks IS NULL OR max_blocks>=0),
 metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','draft','deprecated','archived')),
 created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now')),
 UNIQUE(kind,definition_key,version)
);
CREATE TABLE IF NOT EXISTS cms_component_templates (
 id TEXT PRIMARY KEY DEFAULT(lower(hex(randomblob(16)))),sku TEXT NOT NULL UNIQUE,
 template_name TEXT NOT NULL,template_type TEXT NOT NULL,category TEXT NOT NULL,
 item_type TEXT CHECK(item_type IN ('section','block','page','global','skin','ui_component','motion','scene','navigation','media_layout','3d_asset','token_preset','design_preset')),
 definition_id TEXT REFERENCES cms_definitions(id),definition_key TEXT,definition_version TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('active','draft','archived')),
 label TEXT,tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(tags) AND json_type(tags)='array'),
 template_data TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(template_data)),
 editor_schema_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(editor_schema_json)),
 compatibility_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(compatibility_json)),
 responsive_schema_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(responsive_schema_json)),
 data_bindings_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(data_bindings_json)),
 preview_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(preview_json)),
 preview_image_url TEXT,r2_bucket TEXT,r2_key TEXT,source_html_r2_key TEXT,slug TEXT,
 sort_order INTEGER NOT NULL DEFAULT 50,is_featured INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now'))
);
CREATE TABLE IF NOT EXISTS cms_pages (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 title TEXT NOT NULL,slug TEXT NOT NULL,route_path TEXT NOT NULL,page_type TEXT NOT NULL DEFAULT 'custom',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived','scheduled')),
 definition_id TEXT REFERENCES cms_definitions(id),template_sku TEXT REFERENCES cms_component_templates(sku),
 parent_page_id TEXT REFERENCES cms_pages(id) ON DELETE SET NULL,
 description TEXT,meta_title TEXT,meta_description TEXT,seo_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(seo_json)),
 config_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(config_json)),
 analytics_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(analytics_json)),
 metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)),
 canonical_url TEXT,robots TEXT DEFAULT 'index,follow',og_image_asset_id TEXT,
 r2_bucket TEXT,r2_key TEXT,published_manifest_r2_key TEXT,
 is_homepage INTEGER NOT NULL DEFAULT 0,nav_visible INTEGER NOT NULL DEFAULT 1,
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL DEFAULT(unixepoch()),updated_at INTEGER NOT NULL DEFAULT(unixepoch()),
 published_at INTEGER,UNIQUE(site_id,slug),UNIQUE(site_id,route_path)
);
CREATE TABLE IF NOT EXISTS cms_page_sections (
 id TEXT PRIMARY KEY,page_id TEXT NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
 section_type TEXT NOT NULL,section_name TEXT NOT NULL,
 definition_id TEXT REFERENCES cms_definitions(id),template_sku TEXT REFERENCES cms_component_templates(sku),
 section_data TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(section_data)),
 sort_order INTEGER NOT NULL DEFAULT 0,is_visible INTEGER NOT NULL DEFAULT 1,
 css_classes TEXT,custom_css TEXT,created_at TEXT NOT NULL DEFAULT(datetime('now')),
 updated_at TEXT NOT NULL DEFAULT(datetime('now')),
 liquid_section_id TEXT,draft_r2_key TEXT,published_r2_key TEXT,r2_bucket TEXT NOT NULL DEFAULT 'cms',
 content_hash TEXT,published_hash TEXT,schema_version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS cms_section_blocks (
 id TEXT PRIMARY KEY DEFAULT('cmsb_'||lower(hex(randomblob(8)))),
 account_id TEXT,section_id TEXT NOT NULL REFERENCES cms_page_sections(id) ON DELETE CASCADE,
 parent_block_id TEXT REFERENCES cms_section_blocks(id) ON DELETE CASCADE,
 block_key TEXT NOT NULL,block_type TEXT NOT NULL,
 definition_id TEXT REFERENCES cms_definitions(id),template_sku TEXT REFERENCES cms_component_templates(sku),
 sort_order INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','hidden','archived')),
 content_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(content_json)),
 settings_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(settings_json)),
 artifact_id TEXT,metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)),
 created_at TEXT NOT NULL DEFAULT(datetime('now')),updated_at TEXT NOT NULL DEFAULT(datetime('now')),
 CHECK(parent_block_id IS NULL OR parent_block_id!=id),UNIQUE(section_id,block_key)
);
CREATE TABLE IF NOT EXISTS cms_assets (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 name TEXT NOT NULL,mime_type TEXT,size INTEGER,url TEXT,asset_key TEXT,
 r2_key TEXT,r2_bucket TEXT,thumbnail_url TEXT,alt_text TEXT,
 metadata_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(metadata_json)),
 created_at TEXT NOT NULL DEFAULT(datetime('now'))
);
CREATE TABLE IF NOT EXISTS cms_3d_assets (
 id TEXT PRIMARY KEY,asset_id TEXT NOT NULL REFERENCES cms_assets(id) ON DELETE CASCADE,
 sku TEXT UNIQUE,asset_name TEXT,asset_family TEXT,category TEXT NOT NULL DEFAULT 'model_3d',
 version TEXT NOT NULL DEFAULT '1.0.0',definition_id TEXT REFERENCES cms_definitions(id),
 source_provider TEXT,build_provider TEXT,r2_key TEXT,r2_bucket TEXT,
 created_at INTEGER NOT NULL DEFAULT(unixepoch()),
 source_refs_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(source_refs_json)),
 derivatives_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(derivatives_json)),
 config_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(config_json)),
 runtime_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(runtime_json)),
 specs_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(specs_json)),
 provenance_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(provenance_json)),
 validation_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(validation_json))
);
CREATE TABLE IF NOT EXISTS cms_global_settings (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 settings_key TEXT NOT NULL,settings_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(settings_json)),
 updated_at TEXT NOT NULL DEFAULT(datetime('now')),UNIQUE(site_id,settings_key)
);
CREATE TABLE IF NOT EXISTS cms_navigation_menus (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 handle TEXT NOT NULL,title TEXT NOT NULL,items_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(items_json)),
 status TEXT NOT NULL DEFAULT 'active',updated_at TEXT NOT NULL DEFAULT(datetime('now')),UNIQUE(site_id,handle)
);
CREATE TABLE IF NOT EXISTS cms_theme_preferences (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 scope_type TEXT NOT NULL DEFAULT 'site',scope_id TEXT NOT NULL,
 theme_id TEXT NOT NULL REFERENCES cms_themes(id),overrides_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(overrides_json)),
 updated_at TEXT NOT NULL DEFAULT(datetime('now')),UNIQUE(site_id,scope_type,scope_id)
);
CREATE TABLE IF NOT EXISTS cms_collections (
 id TEXT PRIMARY KEY,site_id TEXT NOT NULL REFERENCES cms_sites(id) ON DELETE CASCADE,
 name TEXT NOT NULL,slug TEXT,kind TEXT NOT NULL DEFAULT 'manual' CHECK(kind IN ('manual','smart')),
 allowed_item_types_json TEXT NOT NULL DEFAULT '["asset"]' CHECK(json_valid(allowed_item_types_json)),
 rule_json TEXT CHECK(rule_json IS NULL OR json_valid(rule_json)),
 tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(tags)),
 seo_title TEXT,seo_description TEXT,sku TEXT,created_at INTEGER NOT NULL DEFAULT(unixepoch())
);
CREATE TABLE IF NOT EXISTS cms_collection_assets (
 collection_id TEXT NOT NULL REFERENCES cms_collections(id) ON DELETE CASCADE,
 asset_id TEXT NOT NULL REFERENCES cms_assets(id) ON DELETE CASCADE,
 sort_order INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(collection_id,asset_id)
);
CREATE TABLE IF NOT EXISTS cms_revisions (
 id TEXT PRIMARY KEY,page_id TEXT NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
 kind TEXT NOT NULL,created_at TEXT NOT NULL,label TEXT,snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json))
);
CREATE TABLE IF NOT EXISTS cms_publications (
 page_id TEXT PRIMARY KEY REFERENCES cms_pages(id) ON DELETE CASCADE,
 publication_id TEXT NOT NULL,route TEXT NOT NULL,revision_num INTEGER NOT NULL,
 theme TEXT NOT NULL DEFAULT 'default',sections_json TEXT NOT NULL CHECK(json_valid(sections_json)),
 published_at TEXT,metadata_json TEXT CHECK(metadata_json IS NULL OR json_valid(metadata_json))
);
CREATE INDEX IF NOT EXISTS idx_cms_pages_site ON cms_pages(site_id);
CREATE INDEX IF NOT EXISTS idx_cms_page_sections_page ON cms_page_sections(page_id,sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_section_blocks_section ON cms_section_blocks(section_id,parent_block_id,sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_definitions_catalog ON cms_definitions(kind,status,category,definition_key);
CREATE INDEX IF NOT EXISTS idx_cms_component_templates_category ON cms_component_templates(item_type,category,status,sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_component_templates_definition ON cms_component_templates(definition_id);
CREATE INDEX IF NOT EXISTS idx_cms_assets_site ON cms_assets(site_id);
CREATE INDEX IF NOT EXISTS idx_cms_revisions_page ON cms_revisions(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_3d_assets_asset ON cms_3d_assets(asset_id);

-- Schema versions are tracked in SQLite PRAGMA user_version, not CMS registries.
PRAGMA user_version = 2;

-- Explicitly retire the legacy CMS-owned runtime registries on upgrade.
-- AgentSam owns capability, tool and skill registration; package manifests own docs.
DROP VIEW IF EXISTS cms_runtime_help;
DROP VIEW IF EXISTS cms_runtime_tools;
DROP VIEW IF EXISTS cms_runtime_tables;
DROP TABLE IF EXISTS cms_runtime_info;
DROP TABLE IF EXISTS cms_table_catalog;
DROP TABLE IF EXISTS cms_capability_catalog;
DROP TABLE IF EXISTS cms_tool_catalog;
DROP TABLE IF EXISTS cms_skill_catalog;
DROP TABLE IF EXISTS cms_usage_guides;
DROP TABLE IF EXISTS cms_schema_migrations;
