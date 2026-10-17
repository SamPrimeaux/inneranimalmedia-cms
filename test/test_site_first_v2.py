import json, sqlite3, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCHEMA=(ROOT/'schemas/sqlite/cms-local-runtime.v2.sql').read_text()
REQUIRED={'cms_sites','cms_pages','cms_page_sections','cms_section_blocks','cms_themes','cms_definitions','cms_component_templates','cms_assets','cms_3d_assets','cms_revisions','cms_publications'}
class SiteFirstTests(unittest.TestCase):
 def test_install_without_tenant_or_workspace(self):
  c=sqlite3.connect(':memory:');c.executescript(SCHEMA)
  names={r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'")}
  self.assertTrue(REQUIRED<=names)
  self.assertNotIn('cms_tenants',names)
  for table in REQUIRED:
   cols={r[1] for r in c.execute('PRAGMA table_info('+table+')')}
   self.assertNotIn('tenant_id',cols,table)
   self.assertNotIn('workspace_id',cols,table)
  c.execute("INSERT INTO cms_sites(id,name,slug) VALUES('s1','First site','first')")
  c.execute("INSERT INTO cms_sites(id,name,slug) VALUES('s2','Second site','second')")
  c.execute("INSERT INTO cms_pages(id,site_id,title,slug,route_path) VALUES('p1','s1','Home','home','/')")
  c.execute("INSERT INTO cms_pages(id,site_id,title,slug,route_path) VALUES('p2','s2','Home','home','/')")
  self.assertEqual(c.execute("SELECT count(*) FROM cms_pages").fetchone()[0],2)
  self.assertEqual(c.execute('PRAGMA foreign_key_check').fetchall(),[])
if __name__=='__main__':unittest.main()
