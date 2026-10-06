import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import type { SiteSection, SiteDesignTokens } from "../../../../packages/site-contracts/src/site-document.js";
import { BoundSectionProvider } from "./BoundSectionContext";
import { BoundHero } from "./BoundHero";
import { BoundWardrobe } from "./BoundWardrobe";
import { BoundDiptych } from "./BoundDiptych";
import { BoundStatement } from "./BoundStatement";
import { BoundCollectionCarousel } from "./BoundCollectionCarousel";
import { BoundLookbook } from "./BoundLookbook";
import { BoundFAQ } from "./BoundFAQ";

const scenes: Record<string, React.ComponentType> = {
  "commons/curtain-hero": BoundHero,
  "commons/wardrobe-gallery": BoundWardrobe,
  "commons/split-media": BoundDiptych,
  "commons/editorial-statement": BoundStatement,
  "commons/collection-carousel": BoundCollectionCarousel,
  "commons/lookbook-hotspots": BoundLookbook,
  "commons/faq-trust": BoundFAQ,
};
interface Payload {
  schema_id: "inneranimalmedia.cms-editorial-publication.v1";
  section: SiteSection;
  brand: { name: string };
  design?: SiteDesignTokens;
  media?: Record<string, string>;
}
function safeMediaUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === window.location.hostname)) return null;
    return url.href;
  } catch { return null; }
}
function mount(root: HTMLElement) {
  const data = root.querySelector<HTMLScriptElement>('script[type="application/json"][data-cms-editorial-payload]');
  if (!data) throw new Error("Missing editorial section data");
  const payload = JSON.parse(data.textContent || "{}") as Payload;
  if (payload.schema_id !== "inneranimalmedia.cms-editorial-publication.v1" ||
    !payload.section || !payload.brand || !payload.section.id ||
    !Array.isArray(payload.section.blocks ?? []) || !scenes[payload.section.preset]) {
    throw new Error("Unsupported editorial publication");
  }
  const Component = scenes[payload.section.preset];
  const shadow = root.attachShadow({ mode: "open" });
  const css = root.dataset.cmsEditorialCss;
  if (css) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = css;
    shadow.appendChild(link);
  }
  const mountPoint = document.createElement("div");
  mountPoint.className = "editorial-publication";
  shadow.appendChild(mountPoint);
  const resolveMedia = (key: string) => safeMediaUrl(payload.media?.[key]);
  const t = payload.design ?? {};
  createRoot(mountPoint).render(
    <div className="editorial-scene" data-editorial-scene={payload.section.preset}
      style={{
        "--editorial-accent": t.accent ?? "#476758",
        "--editorial-accent-soft": t.accentSoft ?? "#c2d3c2",
        "--editorial-canvas": t.canvas ?? "#f4f3ee",
        "--editorial-paper": t.paper ?? "#ffffff",
        "--editorial-ink": t.ink ?? "#111111",
      } as React.CSSProperties}>
      <BoundSectionProvider section={payload.section} resolveMedia={resolveMedia}>
        <Component />
      </BoundSectionProvider>
    </div>,
  );
}
document.querySelectorAll<HTMLElement>("[data-cms-editorial-root]").forEach((root) => {
  try { mount(root); }
  catch (error) {
    root.textContent = "This editorial section could not be loaded.";
    root.setAttribute("data-cms-editorial-error", "true");
    console.error("CMS editorial publication", error);
  }
});
