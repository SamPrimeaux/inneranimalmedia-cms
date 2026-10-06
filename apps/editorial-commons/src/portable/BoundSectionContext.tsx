import React, { createContext, useContext } from "react";
import type { SiteSection } from "../../../../packages/site-contracts/src/site-document.js";

/** Small, commerce-free context shared by the donor preview and published React islands. */
interface BoundSectionContextValue {
  section?: SiteSection;
  resolveMedia: (key: string) => string | null;
}
const Context = createContext<BoundSectionContextValue>({
  resolveMedia: () => null,
});
export function BoundSectionProvider({
  children, section, resolveMedia,
}: React.PropsWithChildren<{
  section?: SiteSection;
  resolveMedia?: (key: string) => string | null;
}>) {
  return <Context.Provider value={{ section, resolveMedia: resolveMedia ?? (() => null) }}>
    {children}
  </Context.Provider>;
}
export function useBoundSection() {
  return useContext(Context);
}
