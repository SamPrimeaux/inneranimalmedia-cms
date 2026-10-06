import { useEffect, useMemo, useState } from 'react';
import { cmsApi, cmsEndpoint, cmsEditorialAssetBaseUrl } from './cmsApi';
import {
  EDITORIAL_PRESETS, createCmsEditorialInstall, defaultEditorialSection,
  extractCmsEditorialSection, renderCmsEditorialSection, cmsEditorialRuntimeScript,
} from '../../integration/host-adapters/cms-editorial-publisher.js';
import { applySectionFieldEdit, editableSectionFields } from '@inneranimalmedia/site-contracts';

import { resolveStorefrontUrl, storefrontDisplayHost } from './cmsStorefrontUrl';
import { StorefrontPreview } from './StorefrontPreview';
import type { CmsBootstrapData, CmsBootstrapPage, CmsBootstrapSection } from './cmsTypes';

function formatDate(value) {
  if (!value) return 'Not yet';
  const n = Number(value);
  const d = Number.isFinite(n) && n > 100000 ? new Date(n * 1000) : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function parseJson(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function statusLabel(status) {
  const s = String(status || 'draft').toLowerCase();
  if (s === 'published') return 'Visible';
  if (s === 'draft') return 'Draft';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildPath(panel, site, pageId) {
  const qs = site ? `?site=${encodeURIComponent(site)}` : '';
  if (panel === 'templates') return `/dashboard/cms/templates${qs}`;
  if (panel === 'imports') return `/dashboard/cms/imports${qs}`;
  if (pageId) return `/dashboard/cms/pages/${encodeURIComponent(pageId)}${qs}`;
  return `/dashboard/cms/pages${qs}`;
}

function withQuery(path, params = {}) {
  const [base, raw = ''] = path.split('?');
  const sp = new URLSearchParams(raw);
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') sp.delete(key);
    else sp.set(key, String(value));
  }
  const q = sp.toString();
  return q ? `${base}?${q}` : base;
}

function Loading({ label }) {
  return <div className="pt-page"><div className="pt-page-inner"><div className="pt-card" style={{ padding: 24, color: 'var(--muted)' }}>{label}</div></div></div>;
}

function ErrorBox({ error, onRetry }) {
  return <div className="pt-card" style={{ padding: 20, color: 'var(--muted)' }}><strong style={{ color: 'var(--text)' }}>Could not load CMS data.</strong><p>{error}</p>{onRetry ? <button type="button" className="pt-btn" onClick={onRetry}>Retry</button> : null}</div>;
}

function useBootstrap(projectSlug: string | null | undefined, pageId: string | null | undefined) {
  const [state, setState] = useState<{ loading: boolean; error: string; data: CmsBootstrapData | null }>({ loading: true, error: '', data: null });
  const load = () => {
    if (!projectSlug) { setState({ loading: false, error: 'CMS site not resolved.', data: null }); return; }
    setState((s) => ({ ...s, loading: true, error: '' }));
    const q = new URLSearchParams({ project_slug: projectSlug });
    if (pageId) q.set('page_id', pageId);
    cmsApi<CmsBootstrapData>(`/api/cms/bootstrap?${q}`).then((d) => setState({ loading: false, error: '', data: d })).catch((e: Error) => setState({ loading: false, error: e.message, data: null }));
  };
  useEffect(() => { load(); }, [projectSlug, pageId]);
  return { ...state, reload: load };
}

export function PageEditor({
  projectSlug,
  pageId,
  onNavigatePath,
  publicDomain = null,
}: {
  projectSlug: string | null | undefined;
  pageId: string | null | undefined;
  onNavigatePath: (path: string) => void;
  publicDomain?: string | null;
}) {
  const { loading, error, data, reload } = useBootstrap(projectSlug, pageId);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const page = useMemo(() => (data?.pages || []).find((p) => p.id === pageId) || data?.page || null, [data, pageId]);
  const sections = useMemo(() => {
    if (data?.sections_by_page && pageId) return data.sections_by_page[pageId] || [];
    return (data?.sections || []).filter((s: CmsBootstrapSection) => s.page_id === pageId);
  }, [data, pageId]);
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0] || null;
  const livePreviewUrl = useMemo(
    () =>
      resolveStorefrontUrl({
        projectSlug,
        tenantDomain: data?.tenant?.domain,
        publicDomain,
        path: page?.route_path || (page?.slug ? `/${page.slug}` : '/'),
      }),
    [projectSlug, publicDomain, data?.tenant?.domain, page?.route_path, page?.slug],
  );
  const [form, setForm] = useState({ title: '', seo_title: '', meta_description: '', robots: 'index,follow' });
  const [sectionJson, setSectionJson] = useState('{}');
  const [newEditorialPreset, setNewEditorialPreset] = useState('commons/collection-carousel');
  const [addingEditorial, setAddingEditorial] = useState(false);
  const editorialMedia = useMemo(() => {
    const result: Record<string, string> = {};
    for (const item of data?.assets ?? []) {
      if (!item || typeof item !== 'object') continue;
      const asset = item as Record<string, unknown>;
      let metadata: Record<string, unknown> = {};
      try {
        metadata = typeof asset.metadata_json === 'string'
          ? JSON.parse(asset.metadata_json) : (asset.metadata_json as Record<string, unknown>) ?? {};
      } catch { /* Invalid asset metadata is not an authority. */ }
      const key = asset.logical_key ?? metadata.logical_key;
      const url = asset.url;
      if (typeof key === 'string' && /^[a-z0-9_.-]+$/i.test(key) &&
        typeof url === 'string' && (url.startsWith('/') && !url.startsWith('//') || /^https:\/\//i.test(url))) {
        result[key] = url;
      }
    }
    return result;
  }, [data?.assets]);
  const activeEditorial = useMemo(() => {
    if (!activeSection) return null;
    try { return extractCmsEditorialSection({ section_data: JSON.parse(sectionJson) }); }
    catch { return null; }
  }, [activeSection?.id, sectionJson]);
  const updateEditorialField = (key: string, raw: string, blockIndex?: number) => {
    if (!activeEditorial) return;
    const candidate = structuredClone(activeEditorial);
    const target = blockIndex === undefined ? candidate.data : candidate.blocks?.[blockIndex]?.data;
    if (!target) return;
    const result = applySectionFieldEdit(target, key, raw, {
      mediaKeys: new Set(Object.keys(editorialMedia)),
    });
    if (!result.ok) return;
    setSectionJson(JSON.stringify({
      schema_id: 'inneranimalmedia.cms-editorial-section.v1',
      renderer: 'editorial-react',
      section: candidate,
    }, null, 2));
  };
  const addEditorialSection = async () => {
    if (!pageId) return;
    setAddingEditorial(true);
    try {
      const section = defaultEditorialSection(newEditorialPreset,
        'editorial-' + crypto.randomUUID().slice(0, 8));
      await cmsApi(cmsEndpoint('sections'), {
        method: 'POST',
        body: createCmsEditorialInstall(pageId, section),
      });
      showToast('Editorial section installed');
      reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error));
    } finally { setAddingEditorial(false); }
  };
  const editorialPreview = useMemo(() => {
    if (!activeEditorial) return '';
    try {
      const content = JSON.parse(sectionJson);
      const html = renderCmsEditorialSection({ section_data: content }, {
        assetBaseUrl: cmsEditorialAssetBaseUrl(),
        brand: { name: data?.tenant?.name || projectSlug || 'Site' },
        media: editorialMedia,
      });
      return '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' +
        html + cmsEditorialRuntimeScript(cmsEditorialAssetBaseUrl()) + '</body></html>';
    } catch { return ''; }
  }, [sectionJson, activeEditorial, data?.tenant?.name, projectSlug, editorialMedia]);


  useEffect(() => {
    if (page) setForm({ title: page.title || '', seo_title: page.seo_title || '', meta_description: page.meta_description || '', robots: page.robots || 'index,follow' });
  }, [page?.id]);

  useEffect(() => {
    if (activeSection) setSectionJson(JSON.stringify(parseJson(activeSection.section_data), null, 2));
  }, [activeSection?.id]);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(''), 1600); };

  const savePage = async () => {
    setSaving(true);
    try {
      await cmsApi(`/api/cms/pages/${encodeURIComponent(pageId)}`, { method: 'PUT', body: form });
      showToast('Page saved');
      reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const saveSection = async () => {
    if (!activeSection) return;
    let parsed;
    try { parsed = JSON.parse(sectionJson || '{}'); } catch { alert('Section JSON is invalid.'); return; }
    setSaving(true);
    try {
      await cmsApi(`/api/cms/sections/${encodeURIComponent(activeSection.id)}`, { method: 'PUT', body: { section_data: parsed } });
      showToast('Section draft saved');
      reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const publishPage = async () => {
    if (!pageId || !window.confirm('Publish this page to production?')) return;
    setSaving(true);
    try {
      const containsEditorial = sections.some((section) => {
        try { extractCmsEditorialSection(section); return true; } catch { return false; }
      });
      if (containsEditorial) {
        // Do not report success from a legacy HTML endpoint that lacks the React runtime.
        await cmsApi(cmsEndpoint('editorial/publish'), {
          method: 'POST', body: { page_id: pageId, project_slug: projectSlug },
        });
      } else {
        await cmsApi(cmsEndpoint('pages/' + encodeURIComponent(pageId) + '/snapshot'), { method: 'POST', body: {} }).catch(() => null);
        await cmsApi(cmsEndpoint('pages/' + encodeURIComponent(pageId) + '/publish'), { method: 'POST', body: {} });
      }
      showToast('Page published');
      reload();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const archivePage = async () => {
    if (!window.confirm('Archive this page?')) return;
    setSaving(true);
    try {
      await cmsApi(`/api/cms/pages/${encodeURIComponent(pageId)}`, { method: 'DELETE' });
      onNavigatePath(buildPath('pages', projectSlug));
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const toggleSection = async (s) => {
    try {
      await cmsApi(`/api/cms/sections/${encodeURIComponent(s.id)}/visibility`, { method: 'POST', body: { is_visible: !(s.is_visible === 1 || s.is_visible === true) } });
      reload();
    } catch (e) { alert(e.message); }
  };

  if (loading) return <Loading label="Loading page editor..." />;
  if (error) return <div className="pt-page"><div className="pt-page-inner"><ErrorBox error={error} onRetry={reload} /></div></div>;

  return (
    <div className="pt-editor-shell">
      <header className="pt-editor-top">
        <button type="button" className="pt-icon-btn" onClick={() => onNavigatePath(buildPath('pages', projectSlug))} aria-label="Back to pages">‹</button>
        <div className="pt-editor-crumb">
          <span>{page?.title || 'Page'}</span>
          <span className="pt-badge neutral">{statusLabel(page?.status)}</span>
        </div>
        <div style={{ flex: 1 }} />
        <button type="button" className="pt-btn primary" onClick={savePage} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="pt-btn" onClick={publishPage} disabled={saving}>Publish</button>
        <div className="pt-editor-more">
          <button type="button" className="pt-btn" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}>More</button>
          {moreOpen ? (
            <div className="pt-editor-more-menu">
              <button type="button" onClick={() => { setMoreOpen(false); onNavigatePath(buildPath('templates', projectSlug)); }}>Templates</button>
              <button type="button" onClick={() => { setMoreOpen(false); void archivePage(); }}>Archive page</button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="pt-editor-layout">
        <main className="pt-editor-main">
          <article className="pt-light-card">
            <div className="pt-light-field">
              <label htmlFor="cms-page-title">Title</label>
              <input id="cms-page-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="pt-light-field">
              <label>Content</label>
              <div className="pt-richbar">
                <button type="button" className="pt-icon-btn">B</button>
                <button type="button" className="pt-icon-btn">I</button>
                <button type="button" className="pt-icon-btn">U</button>
              </div>
              <div className="pt-richarea" contentEditable suppressContentEditableWarning>
                {form.meta_description || 'Edit structured sections below. Page body maps to R2 drafts on save.'}
              </div>
            </div>
          </article>

          <article className="pt-light-card">
            <div className="pt-side-title">Search engine preview</div>
            <div className="pt-seo-title">{form.seo_title || form.title || page?.title}</div>
            <div className="pt-subtext">{`${storefrontDisplayHost(livePreviewUrl)} › ${page?.slug || ''}`}</div>
            <p className="pt-subtext">{form.meta_description || 'No meta description yet.'}</p>
          </article>

          <section className="pt-light-card">
            <div className="pt-side-title">{page?.title || 'Page'} sections</div>
            <div className="pt-section-list">
              {sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pt-section-row ${activeSection?.id === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSectionId(s.id)}
                >
                  <span className="pt-code">‹/›</span>
                  <span>{s.section_name || s.section_type}</span>
                  <span className="pt-section-visibility">{s.is_visible === 0 ? 'hidden' : 'visible'}</span>
                </button>
              ))}
              <div className="pt-light-field" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <label htmlFor="cms-editorial-preset" style={{ width: '100%' }}>Install reusable React section</label>
                <select id="cms-editorial-preset" aria-label="Reusable editorial section"
                  value={newEditorialPreset} onChange={(event) => setNewEditorialPreset(event.target.value)}>
                  {EDITORIAL_PRESETS.map(({ preset, title }) => <option key={preset} value={preset}>{title}</option>)}
                </select>
                <button type="button" className="pt-btn primary" onClick={addEditorialSection}
                  disabled={addingEditorial || !pageId}>
                  {addingEditorial ? 'Installing…' : 'Add to page'}
                </button>
              </div>
              <button
                type="button"
                className="pt-section-row pt-add"
                onClick={() => onNavigatePath(withQuery(buildPath('templates', projectSlug), { add_to_page: pageId }))}
              >
                ⊕ Browse other templates
              </button>
            </div>
            {activeSection ? (
              <div className="pt-section-inspector">
                {activeEditorial && <>
                  <div className="pt-side-title">Reusable React section · {activeEditorial.preset}</div>
                  <iframe title="Editorial section draft preview" srcDoc={editorialPreview}
                    sandbox="allow-scripts allow-same-origin" style={{ width: '100%', minHeight: 350, border: '1px solid var(--line)', borderRadius: 10 }}/>
                  <div className="pt-subtext">Draft preview. Save the section before publishing. Missing media stays unfilled until the host resolves customer assets.</div>
                  <datalist id="cms-editorial-media-keys">
                    {Object.keys(editorialMedia).map((key) => <option key={key} value={key}/>)}
                  </datalist>
                  {[{ data: activeEditorial.data, label: 'Section content' },
                    ...(activeEditorial.blocks || []).map((block, index) => ({
                      data: block.data, label: 'Block ' + (index + 1), blockIndex: index,
                    }))].map((group, groupIndex) =>
                    <fieldset key={groupIndex} className="pt-light-field" style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 12 }}>
                      <legend>{group.label}</legend>
                      {editableSectionFields(group.data).map((field) => <label key={field.key}
                        style={{ display: 'grid', gap: 4, marginBottom: 8 }}>
                        {field.label}
                        <input type={field.kind === 'number' ? 'number' : 'text'}
                          list={field.kind === 'media' ? 'cms-editorial-media-keys' : undefined}
                          value={String(field.value ?? '')}
                          onChange={(event) => updateEditorialField(field.key, event.target.value, 'blockIndex' in group ? group.blockIndex : undefined)}
                          aria-label={group.label + ': ' + field.label}/>
                      </label>)}
                    </fieldset>)}
                </>}
                <div className="pt-light-field">
                  <label>Section data JSON</label>
                  <textarea className="pt-json" value={sectionJson} onChange={(e) => setSectionJson(e.target.value)} />
                </div>
                <div className="pt-editor-section-actions">
                  <button type="button" className="pt-btn primary" onClick={saveSection} disabled={saving}>Save section</button>
                  <button type="button" className="pt-btn" onClick={() => toggleSection(activeSection)}>
                    {activeSection.is_visible === 0 ? 'Show section' : 'Hide section'}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </main>

        <aside className="pt-editor-sidebar">
          <article className="pt-light-card">
            <div className="pt-side-title">Live page preview</div>
            <div style={{ height: 320, borderRadius: 12, overflow: 'hidden' }}>
              <StorefrontPreview url={livePreviewUrl} variant="desktop" title={storefrontDisplayHost(livePreviewUrl)} />
            </div>
          </article>
          <article className="pt-light-card">
            <div className="pt-side-title">Visibility</div>
            <label className="pt-radio-row"><span className="pt-radio active" /><span><strong>{statusLabel(page?.status)}</strong><div className="pt-subtext">Updated {formatDate(page?.updated_at)}</div></span></label>
            <label className="pt-radio-row"><span className="pt-radio" /><span>Hidden</span></label>
          </article>
          <article className="pt-light-card">
            <div className="pt-side-title">Template</div>
            <select value={page?.page_type || 'default'} onChange={() => {}}>
              <option>default</option>
              <option>shop</option>
              <option>landing</option>
            </select>
          </article>
          <article className="pt-light-card">
            <div className="pt-side-title">SEO</div>
            <div className="pt-light-field"><label>SEO title</label><input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
            <div className="pt-light-field"><label>Meta description</label><textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} /></div>
            <div className="pt-light-field"><label>Robots</label><input value={form.robots} onChange={(e) => setForm({ ...form, robots: e.target.value })} /></div>
          </article>
        </aside>
      </div>

      {toast ? <div className="pt-toast">{toast}</div> : null}
    </div>
  );
}

export default PageEditor;
