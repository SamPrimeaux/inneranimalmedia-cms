export type CmsApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function cmsApi<T = unknown>(path: string, opts: CmsApiOptions = {}): Promise<T> {
  const isForm = opts.body instanceof FormData;
  const res = await fetch(path, {
    credentials: 'include',
    headers: isForm
      ? (opts.headers as HeadersInit) || {}
      : { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string>) },
    ...opts,
    body: isForm
      ? (opts.body as FormData)
      : opts.body != null
        ? JSON.stringify(opts.body)
        : undefined,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({ error: res.statusText }))) as {
      error?: string;
      message?: string;
    };
    throw new Error(err.error || err.message || res.statusText);
  }
  return res.json() as Promise<T>;
}


/** Host-injectable CMS endpoints; the existing same-origin default remains opt-in
 * for legacy hosts until they provide a runtime config object. */
export interface CmsRuntimeConfig {
  apiBaseUrl?: string;
  editorialAssetBaseUrl?: string;
}
function runtimeConfig(): CmsRuntimeConfig {
  if (typeof window === 'undefined') return {};
  return (window as Window & { __IAM_CMS_RUNTIME_CONFIG__?: CmsRuntimeConfig })
    .__IAM_CMS_RUNTIME_CONFIG__ ?? {};
}
export function cmsEndpoint(resource: string): string {
  if (!/^[a-z0-9/_-]+$/i.test(resource) || resource.includes('..')) {
    throw new Error('Invalid CMS endpoint');
  }
  const base = runtimeConfig().apiBaseUrl || '/api/cms';
  return base.replace(/\/$/, '') + '/' + resource.replace(/^\//, '');
}
export function cmsEditorialAssetBaseUrl(): string {
  return (runtimeConfig().editorialAssetBaseUrl || '/cms/editorial').replace(/\/$/, '');
}
