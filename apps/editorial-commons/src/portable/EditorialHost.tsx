import React, { createContext, useContext, useMemo } from "react";
import type { CartItem } from "../types";
import * as demo from "../data/catalog";

/**
 * A scene owns layout and interaction, never the customer catalog, brand,
 * checkout authority, or identity. Defaults are demo-only, not commerce truth.
 */
export type EditorialCatalog = typeof demo;
export interface EditorialBrand {
  name: string;
  season: string;
  tagline?: string;
  socialHandle?: string;
}
export interface EditorialCommerceAdapter {
  /** Inform a host that a local visual cart item changed (no remote write). */
  onCartChange?: (items: readonly CartItem[]) => void;
  /** Host checkout must be explicitly supplied and user-initiated. */
  onCheckout?: (items: readonly CartItem[]) => Promise<void> | void;
  validatePromotion?: (code: string, items: readonly CartItem[]) => Promise<{
    code: string;
    discount: number;
  } | null>;
  /** Hosts supply verified checkout policies, promo handling, and taxes. */
  freeShippingThreshold?: number;
}
export interface EditorialHostConfig {
  brand: EditorialBrand;
  catalog: EditorialCatalog;
  commerce: EditorialCommerceAdapter;
  mode: "preview" | "connected";
}
const DEMO_BRAND: EditorialBrand = {
  name: "FORM / 26", season: "AUTUMN / WINTER 26",
  tagline: "Objects for the hours worth keeping",
  socialHandle: "@form26.studio",
};
const defaults: EditorialHostConfig = {
  brand: DEMO_BRAND,
  catalog: demo,
  commerce: {},
  mode: "preview",
};
const HostContext = createContext<EditorialHostConfig>(defaults);

export function EditorialHostProvider({
  children,
  brand,
  catalog,
  commerce,
  mode,
}: React.PropsWithChildren<{
  brand?: Partial<EditorialBrand>;
  catalog?: Partial<EditorialCatalog>;
  commerce?: EditorialCommerceAdapter;
  mode?: EditorialHostConfig["mode"];
}>) {
  const host = useMemo<EditorialHostConfig>(() => ({
    brand: { ...DEMO_BRAND, ...brand },
    catalog: { ...demo, ...catalog },
    commerce: commerce ?? {},
    mode: mode ?? "preview",
  }), [brand, catalog, commerce, mode]);
  return <HostContext.Provider value={host}>{children}</HostContext.Provider>;
}

export function useEditorialHost(): EditorialHostConfig {
  return useContext(HostContext);
}
export function useEditorialData(): EditorialCatalog {
  return useEditorialHost().catalog;
}
export function useEditorialBrand(): EditorialBrand {
  return useEditorialHost().brand;
}
