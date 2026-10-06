/**
 * @inneranimalmedia/site-contracts
 *
 * Renderer defines geometry. Theme defines character.
 * Preset defines composition. Brand defines identity. App provides data.
 */

export const SITE_CONTRACT_VERSION = 1 as const;

export type LayoutWidth = "full" | "max" | "wide" | "content" | "reading";
export type LayoutBleed = "none" | "background" | "media";
export type LayoutSpacing = "none" | "sm" | "md" | "lg";
export type GutterMode = "fluid" | "none";

export interface LayoutManifest {
  width: LayoutWidth;
  bleed: LayoutBleed;
  gutters?: { mode: GutterMode };
  spacing?: { block: LayoutSpacing };
}

export interface ResponsivePolicy {
  mobileFirst: true;
  containerQuery?: boolean;
}

export interface TouchPolicy {
  minimumTarget: number;
}

export interface SafeAreaPolicy {
  enabled: boolean;
}

export interface MotionPolicy {
  reducedMotionSafe: boolean;
}

export interface SectionInstance<T = Record<string, unknown>> {
  type: string;
  preset?: string;
  variant?: string;
  layout: LayoutManifest;
  responsive?: ResponsivePolicy;
  touch?: TouchPolicy;
  safeArea?: SafeAreaPolicy;
  motion?: MotionPolicy & Record<string, unknown>;
  data: T;
}

export interface SectionPreset<T = Record<string, unknown>> extends SectionInstance<T> {
  id: string;
}

export interface PagePreset {
  id: string;
  type: "page-preset";
  theme: string;
  sections: Array<{
    type: string;
    preset?: string;
    variant?: string;
    data?: Record<string, unknown>;
  }>;
}

export type MediaType = "image" | "video" | "model" | "demo";
export type MediaFit = "cover" | "contain";

export interface MediaSourceRef {
  key: string;
  media?: string;
  width?: number;
  format?: string;
}

export interface MediaReference {
  key: string;
  type: MediaType;
  alt: string;
  poster?: string;
  aspectRatio?: string;
  fit?: MediaFit;
  focalPoint?: { x: number; y: number };
  sources?: MediaSourceRef[];
}

export interface ThemeManifest {
  id: string;
  name: string;
  package: string;
  contractVersion: number;
  kind: "theme";
  capabilities: string[];
  layout: {
    mobileFirst: boolean;
    maxWidth: number;
    containerQueryReady: boolean;
    safeAreaAware: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    keyboard: boolean;
    touch: boolean;
    focusManagement: boolean;
  };
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export const LAYOUT_BOUNDS = {
  max: 1440,
  wide: 1320,
  content: 1200,
  reading: 760,
  touchMinPx: 44,
  iosFormFontMinPx: 16,
} as const;

const WIDTHS = ["full", "max", "wide", "content", "reading"] as const;
const BLEEDS = ["none", "background", "media"] as const;
const SPACINGS = ["none", "sm", "md", "lg"] as const;

export function normalizeLayout(layout: LayoutManifest): Required<LayoutManifest> {
  return {
    width: layout.width,
    bleed: layout.bleed,
    gutters: layout.gutters ?? { mode: "fluid" },
    spacing: layout.spacing ?? { block: "md" },
  };
}

export function validateLayout(layout: unknown, path = "layout"): ValidationIssue[] {
  if (!layout || typeof layout !== "object") {
    return [{ path, message: "layout manifest is required" }];
  }

  const value = layout as Partial<LayoutManifest>;
  const issues: ValidationIssue[] = [];

  if (!WIDTHS.includes(value.width as LayoutWidth)) {
    issues.push({ path: path + ".width", message: "must be one of " + WIDTHS.join("|") });
  }
  if (!BLEEDS.includes(value.bleed as LayoutBleed)) {
    issues.push({ path: path + ".bleed", message: "must be one of " + BLEEDS.join("|") });
  }

  const spacing = value.spacing?.block ?? "md";
  if (!SPACINGS.includes(spacing as LayoutSpacing)) {
    issues.push({ path: path + ".spacing.block", message: "must be one of " + SPACINGS.join("|") });
  }

  if (value.gutters && value.gutters.mode !== "fluid" && value.gutters.mode !== "none") {
    issues.push({ path: path + ".gutters.mode", message: "must be fluid|none" });
  }
  return issues;
}

export function validateSectionPreset(preset: unknown, path = "preset"): ValidationIssue[] {
  if (!preset || typeof preset !== "object") {
    return [{ path, message: "preset must be an object" }];
  }
  const value = preset as Partial<SectionPreset>;
  const issues: ValidationIssue[] = [];
  if (!value.type) issues.push({ path: path + ".type", message: "type is required" });
  if (!value.id) issues.push({ path: path + ".id", message: "id is required" });
  if (!value.data || typeof value.data !== "object") {
    issues.push({ path: path + ".data", message: "data object is required" });
  }
  issues.push(...validateLayout(value.layout, path + ".layout"));
  return issues;
}

export function validatePagePreset(preset: unknown, path = "page"): ValidationIssue[] {
  if (!preset || typeof preset !== "object") {
    return [{ path, message: "page preset must be an object" }];
  }
  const value = preset as Partial<PagePreset>;
  const issues: ValidationIssue[] = [];
  if (!value.id) issues.push({ path: path + ".id", message: "id is required" });
  if (value.type !== "page-preset") issues.push({ path: path + ".type", message: 'must be "page-preset"' });
  if (!value.theme) issues.push({ path: path + ".theme", message: "theme is required" });
  if (!Array.isArray(value.sections)) {
    issues.push({ path: path + ".sections", message: "sections[] is required" });
  }
  return issues;
}

export function validateThemeManifest(manifest: unknown, path = "theme"): ValidationIssue[] {
  if (!manifest || typeof manifest !== "object") {
    return [{ path, message: "theme manifest must be an object" }];
  }
  const value = manifest as Partial<ThemeManifest>;
  const issues: ValidationIssue[] = [];
  if (!value.id) issues.push({ path: path + ".id", message: "id is required" });
  if (!value.name) issues.push({ path: path + ".name", message: "name is required" });
  if (!value.package) issues.push({ path: path + ".package", message: "package is required" });
  if (value.contractVersion !== SITE_CONTRACT_VERSION) {
    issues.push({ path: path + ".contractVersion", message: "must equal " + SITE_CONTRACT_VERSION });
  }
  if (value.kind !== "theme") issues.push({ path: path + ".kind", message: 'must be "theme"' });
  if (!Array.isArray(value.capabilities)) {
    issues.push({ path: path + ".capabilities", message: "capabilities[] is required" });
  }
  return issues;
}

export * from "./site-document.js";
