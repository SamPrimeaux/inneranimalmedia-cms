import type { ThemeManifest } from "@inneranimalmedia/site-contracts";

export const reviseThemeManifest: ThemeManifest = {
  id: "revise",
  name: "Revise",
  package: "@inneranimalmedia/revise-theme",
  contractVersion: 1,
  kind: "theme",
  capabilities: ["editorial", "immersive-media"],
  layout: {
    mobileFirst: true,
    maxWidth: 1440,
    containerQueryReady: true,
    safeAreaAware: true,
  },
  accessibility: {
    reducedMotion: true,
    keyboard: true,
    touch: true,
    focusManagement: true,
  },
};

export interface ThemeRegistry {
  registerTheme(manifest: ThemeManifest): void;
}

export function registerReviseTheme(registry: ThemeRegistry): void {
  registry.registerTheme(reviseThemeManifest);
}
