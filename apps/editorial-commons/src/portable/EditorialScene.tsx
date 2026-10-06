import React, { useEffect } from "react";
import { CartProvider, useCart } from "../context/CartContext";
import { EditorialHostProvider, useEditorialData } from "./EditorialHost";
import { BoundSectionProvider } from "./BoundSectionContext";
import { getEditorialScene, type EditorialSceneSpec } from "./scene-manifest";
import type { EditorialBrand, EditorialCatalog, EditorialCommerceAdapter } from "./EditorialHost";
import type { SiteSection, SiteDesignTokens } from "../../../../packages/site-contracts/src/site-document.js";

const modules = import.meta.glob("../components/*.tsx", { eager: true }) as Record<
  string, Record<string, React.ComponentType>
>;
const pageModules = import.meta.glob("../components/pages/*.tsx", { eager: true }) as Record<
  string, Record<string, React.ComponentType>
>;

export interface EditorialSceneProps {
  id: string;
  brand?: Partial<EditorialBrand>;
  catalog?: Partial<EditorialCatalog>;
  commerce?: EditorialCommerceAdapter;
  mode?: "preview" | "connected";
  section?: SiteSection;
  tokens?: SiteDesignTokens;
  resolveMedia?: (key: string) => string | null;
  showSupportOverlays?: boolean;
}

export function SceneActivation({ scene }: { scene: EditorialSceneSpec }) {
  const cart = useCart();
  const { PRODUCTS } = useEditorialData();
  useEffect(() => {
    switch (scene.id) {
      case "menu-drawer": cart.setIsMenuOpen(true); break;
      case "search-panel": cart.setIsSearchOpen(true); break;
      case "bag-drawer": cart.setIsBagOpen(true); break;
      case "discover-drawer": cart.setIsDiscoverOpen(true); break;
      case "promo-card": cart.setIsPromoOpen(true); break;
      case "stories-viewer": cart.setActiveStoryIndex(0); break;
      case "quick-view": cart.setQuickViewProduct(PRODUCTS[0] ?? null); break;
      case "product-page": cart.setActiveProductPage(PRODUCTS[0] ?? null); break;
      case "studio-assistant": cart.setIsAgentSamOpen(true); break;
    }
  }, [scene.id]);
  return null;
}

function ExistingSupport({ active }: { active: string }) {
  // Overlays are demo-scoped, never a forced part of a consuming site.
  const names = ["MenuDrawer", "SearchPanel", "BagDrawer", "DiscoverDrawer",
    "StoriesViewerModal", "QuickViewModal", "FlyToCartGhost"];
  return <>
    {names.map((name) => {
      if (getEditorialScene(active)?.component === name) return null;
      const Component = modules["../components/" + name + ".tsx"]?.[name];
      return Component ? <Component key={name} /> : null;
    })}
  </>;
}

/** React consumer entry: no theme/framework singleton or FNF storefront assumptions. */
export function EditorialScene({
  id, brand, catalog, commerce, section, tokens, resolveMedia,
  mode = "preview", showSupportOverlays = true,
}: EditorialSceneProps) {
  const scene = getEditorialScene(id);
  if (!scene) {
    return <div role="alert" className="p-7 bg-neutral-950 text-white">
      Unknown editorial scene: {id}
    </div>;
  }
  const Component = (scene.kind === "page"
    ? pageModules["../components/pages/" + scene.component + ".tsx"]
    : modules["../components/" + scene.component + ".tsx"])?.[scene.component];
  if (!Component) {
    return <div role="alert">Scene source missing: {scene.component}</div>;
  }
  return <EditorialHostProvider brand={brand} catalog={catalog} commerce={commerce}
    section={section} resolveMedia={resolveMedia} mode={mode}>
    <BoundSectionProvider section={section} resolveMedia={resolveMedia}>
    <CartProvider>
      <div
        data-editorial-scene={scene.id}
        data-editorial-scene-kind={scene.kind}
        className="editorial-scene"
        style={{
          minHeight: !section || section.settings.minHeight === "screen" ? "100dvh" : "auto",
          background: section?.settings.surface === "paper" ? tokens?.paper ?? "#fff" :
            section?.settings.surface === "muted" ? "#e8e8e2" :
            "var(--editorial-background, #0b0b0b)",
          "--editorial-accent": tokens?.accent ?? "#8b181b",
          "--editorial-accent-soft": tokens?.accentSoft ?? "#e2a8aa",
          "--editorial-canvas": tokens?.canvas ?? "#f4f3ee",
          "--editorial-paper": tokens?.paper ?? "#ffffff",
          "--editorial-ink": tokens?.ink ?? "#111111",
        } as React.CSSProperties}
      >
        <SceneActivation scene={scene} />
        <Component />
        {showSupportOverlays && <ExistingSupport active={scene.id} />}
      </div>
    </CartProvider>
    </BoundSectionProvider>
  </EditorialHostProvider>;
}
