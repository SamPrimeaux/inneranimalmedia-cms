import type { SiteSection, SiteDesignTokens } from "../../packages/site-contracts/src/site-document.js";
export const EDITORIAL_SECTION_SCHEMA: string;
export const EDITORIAL_PUBLICATION_SCHEMA: string;
export const EDITORIAL_PRESETS: readonly { preset: string; title: string }[];
export function validateEditorialSection(section: SiteSection): SiteSection;
export function defaultEditorialSection(preset: string, id?: string): SiteSection;
export function createCmsEditorialInstall(pageId: string, section: SiteSection): {
  page_id: string; section_type: string; section_name: string;
  section_data: { schema_id: string; renderer: string; section: SiteSection };
  sort_order: number;
};
export function extractCmsEditorialSection(row: {
  section_data?: unknown; fields_json?: string | unknown;
}): SiteSection;
export function renderCmsEditorialSection(row: { section_data?: unknown; fields_json?: unknown },
  options: { assetBaseUrl: string; brand: { name: string }; design?: SiteDesignTokens;
    media?: Record<string, string> }): string;
export function cmsEditorialRuntimeScript(assetBaseUrl: string): string;
export function renderCmsEditorialPage(options: {
  page: { title: string }; sections: unknown[]; assetBaseUrl: string;
  brand: { name: string }; design?: SiteDesignTokens; media?: Record<string, string>;
}): string;
export function publishCmsEditorialPage(options: {
  bucket: { put: (key: string, value: unknown, options?: unknown) => Promise<unknown> };
  key: string; page: { title: string }; sections: unknown[]; assetBaseUrl: string;
  brand: { name: string }; design?: SiteDesignTokens; media?: Record<string, string>;
}): Promise<{ ok: true; key: string; sections: number; bytes: number }>;
export function installCmsEditorialAssets(options: {
  bucket: { put: (key: string, value: unknown, options?: unknown) => Promise<unknown> };
  prefix: string; assets: Record<string, Uint8Array>;
}): Promise<{ ok: true; prefix: string }>;
export function handleCmsEditorialPublishRequest(request: Request, options: {
  authorize: (request: Request) => Promise<unknown>;
  loadPage: (args: { pageId: string; projectSlug: string; actor: unknown }) => Promise<unknown>;
  bucket: { put: (key: string, value: unknown, options?: unknown) => Promise<unknown> };
  runtimeAssets: Record<string, Uint8Array>;
  assetOrigin: string; assetPrefix?: string;
}): Promise<Response>;
