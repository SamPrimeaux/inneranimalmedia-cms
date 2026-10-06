export type EditorialSceneKind =
  | "section" | "header" | "footer" | "overlay" | "product-page" | "page" | "studio";

export type EditorialSceneStatus =
  | "adapted-catalog" | "site-document-bound" | "legacy-interaction" | "studio-only";

export interface EditorialSceneSpec {
  id: string;
  component: string;
  title: string;
  act: string;
  kind: EditorialSceneKind;
  status: EditorialSceneStatus;
  source: string;
  /** Does not imply conversion tracking or production checkout readiness. */
  customerFacing: boolean;
}

const section = (
  id: string, component: string, title: string, act: string,
  status: EditorialSceneStatus = "adapted-catalog",
): EditorialSceneSpec => ({
  id, component, title, act,
  kind: "section", status,
  source: "src/components/" + component + ".tsx",
  customerFacing: true,
});
const support = (
  id: string, component: string, title: string,
  kind: EditorialSceneKind, status: EditorialSceneStatus,
): EditorialSceneSpec => ({
  id, component, title,
  act: kind === "overlay" ? "Global UI" : kind === "studio" ? "Studio" : kind === "page" ? "Standalone pages" : "Shell",
  kind, status,
  source: "src/components/" + (kind === "page" ? "pages/" : "") + component + ".tsx",
  customerFacing: kind !== "studio" && component !== "BrandStreamPage",
});

/** Every original React scene has a discoverable, stable, brand-neutral ID. */
export const EDITORIAL_SCENES: readonly EditorialSceneSpec[] = Object.freeze([
  support("site-header", "Header", "Announcement & navigation", "header", "legacy-interaction"),
  section("curtain-hero", "HeroCurtain", "Sticky curtain hero", "I · Entrance", "site-document-bound"),
  section("wardrobe-gallery", "WardrobeGallery", "Category wardrobe rail", "I · Entrance", "site-document-bound"),
  section("promo-grid", "PromoGrid", "Dark promotional grid", "II · Discovery"),
  section("story-rings", "StoriesRings", "Interactive story rings", "II · Discovery"),
  section("collection-carousel", "CollectionCarousel", "Tabbed collection carousel", "II · Discovery", "site-document-bound"),
  section("full-screen-editorial", "FullscreenEditorial", "Fullscreen editorial product", "III · Brand world"),
  section("split-media", "SplitMediaDiptych", "Editorial media diptych", "III · Brand world", "site-document-bound"),
  section("editorial-statement", "DressBlurb", "Editorial statement", "III · Brand world", "site-document-bound"),
  section("lookbook-hotspots", "ShopTheLookbook", "Interactive lookbook hotspots", "III · Brand world", "site-document-bound"),
  section("bundle-builder", "BundleBuilder", "Selectable bundle composition", "IV · Commerce"),
  section("featured-product", "FeaturedPDP", "Three-column featured product", "IV · Commerce"),
  section("ticker-marquee", "TickerMarquee", "Oversized ticker", "IV · Commerce"),
  section("pinned-collection", "RefinedBasicsSplit", "Pinned collection split", "IV · Commerce"),
  section("brand-film", "BrandFilm", "Brand film surface", "V · Film"),
  section("teaser-reserve", "TeaserReserve", "Coming-soon reserve", "V · Film"),
  section("brand-logos", "LogoMarquee", "Brand logo marquee", "VI · Proof"),
  section("before-after", "BeforeAfterSlider", "Before and after slider", "VI · Proof"),
  section("testimonials", "TestimonialsSection", "Customer testimonial tabs", "VI · Proof"),
  section("story-stack", "BlogPostsStack", "Pinned story card deck", "VI · Proof"),
  section("newsletter", "NewsletterBand", "Newsletter band", "VII · Close"),
  section("social-gallery", "SocialGrid", "Editorial social gallery", "VII · Close"),
  section("faq-trust", "FAQAndTrust", "FAQs and trust rows", "VII · Close", "site-document-bound"),
  support("site-footer", "Footer", "Editorial footer and legal", "footer", "legacy-interaction"),
  support("menu-drawer", "MenuDrawer", "Frosted menu drawer", "overlay", "legacy-interaction"),
  support("search-panel", "SearchPanel", "Search overlay", "overlay", "legacy-interaction"),
  support("bag-drawer", "BagDrawer", "Cart drawer", "overlay", "legacy-interaction"),
  support("discover-drawer", "DiscoverDrawer", "Discover drawer", "overlay", "legacy-interaction"),
  support("promo-card", "PromoTabCard", "Privilege card", "overlay", "legacy-interaction"),
  support("stories-viewer", "StoriesViewerModal", "Fullscreen stories viewer", "overlay", "legacy-interaction"),
  support("quick-view", "QuickViewModal", "Quick product view", "overlay", "legacy-interaction"),
  support("fly-to-cart", "FlyToCartGhost", "Cart microinteraction", "overlay", "legacy-interaction"),
  support("product-page", "ProductDetailPage", "Individual product page", "product-page", "legacy-interaction"),
  support("collections-page", "CollectionsPage", "Collections / Archive", "page", "legacy-interaction"),
  support("lookbook-page", "LookbookPage", "Editorial Lookbook", "page", "legacy-interaction"),
  support("maison-page", "MaisonPage", "Maison / Atelier", "page", "legacy-interaction"),
  support("reserve-page", "ReserveVaultPage", "Reserve / Preview vault", "page", "legacy-interaction"),
  support("brand-stream-page", "BrandStreamPage", "Brand Stream / Concept studio", "page", "studio-only"),
  support("studio-assistant", "AgentSamAssistant", "AgentSam studio assistant", "studio", "studio-only"),
]);

export function getEditorialScene(id: string): EditorialSceneSpec | undefined {
  return EDITORIAL_SCENES.find((scene) => scene.id === id);
}
