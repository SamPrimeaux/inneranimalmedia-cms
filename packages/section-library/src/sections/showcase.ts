import type { SectionInstance } from "@inneranimalmedia/site-contracts";
import { escapeHtml, type RenderContext } from "../context.js";
import { registerSection } from "../registry.js";

type Action = { label: string; href: string };
type MediaItem = {
  title: string;
  label?: string;
  body?: string;
  href?: string;
  mediaKey?: string;
  mediaAlt?: string;
  price?: string;
  compareAtPrice?: string;
  badge?: string;
};

function resolveImage(
  context: RenderContext,
  key: string | undefined,
  alt: string | undefined,
  className: string,
): string {
  if (!key) return '<div class="' + className + ' is-placeholder" aria-hidden="true"></div>';
  const url = context.resolveMedia(key);
  if (!url) return '<div class="' + className + ' is-placeholder" aria-hidden="true"></div>';
  return '<img class="' + className + '" src="' + escapeHtml(url) +
    '" alt="' + escapeHtml(alt ?? "") + '" loading="lazy">';
}

function action(action: Action | undefined, className = "iam-action iam-action--primary"): string {
  if (!action) return "";
  return '<a class="' + className + '" href="' + escapeHtml(action.href) + '">' +
    escapeHtml(action.label) + "</a>";
}

function sectionHead(
  eyebrow: string | undefined,
  heading: string | undefined,
  body?: string,
): string {
  return [
    '<header class="iam-section-head">',
    eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(eyebrow) + "</p>" : "",
    heading ? '<h2 class="iam-section-head__heading">' + escapeHtml(heading) + "</h2>" : "",
    body ? '<p class="iam-section-head__body">' + escapeHtml(body) + "</p>" : "",
    "</header>",
  ].join("");
}

export function renderMediaGallery(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading?: string;
    items: MediaItem[];
  };
  const items = (data.items ?? []).map((item) => {
    const media = resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-media-card__image");
    return [
      '<a class="iam-media-card" href="' + escapeHtml(item.href ?? "#") + '">',
      '<figure class="iam-media-card__media">', media, "</figure>",
      '<span class="iam-media-card__label">' + escapeHtml(item.label ?? item.title) + "</span>",
      "</a>",
    ].join("");
  }).join("");

  return [
    '<div class="iam-media-gallery">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-media-gallery__track">', items, "</div>",
    "</div>",
  ].join("");
}

export function renderEditorialGrid(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading?: string;
    items: MediaItem[];
  };
  const items = (data.items ?? []).map((item, index) => {
    return [
      '<article class="iam-editorial-tile" style="--tile-index:' + index + '">',
      '<div class="iam-editorial-tile__media">',
      resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-editorial-tile__image"),
      "</div>",
      '<div class="iam-editorial-tile__copy">',
      item.label ? '<p class="iam-editorial-tile__eyebrow">' + escapeHtml(item.label) + "</p>" : "",
      '<h3>' + escapeHtml(item.title) + "</h3>",
      item.body ? '<p>' + escapeHtml(item.body) + "</p>" : "",
      item.href ? '<a class="iam-text-link" href="' + escapeHtml(item.href) + '">Explore</a>' : "",
      "</div>",
      "</article>",
    ].join("");
  }).join("");

  return [
    '<div class="iam-editorial-grid">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-editorial-grid__items">', items, "</div>",
    "</div>",
  ].join("");
}

export function renderStories(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as { items: MediaItem[] };
  const items = (data.items ?? []).map((item, index) => {
    return [
      '<button type="button" class="iam-story iam-touch-target" data-story-index="' + index + '">',
      '<span class="iam-story__ring">',
      resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-story__image"),
      "</span>",
      '<span class="iam-story__label">' + escapeHtml(item.label ?? item.title) + "</span>",
      "</button>",
    ].join("");
  }).join("");
  return '<div class="iam-stories" aria-label="Stories">' + items + "</div>";
}

function productCard(context: RenderContext, item: MediaItem, index: number): string {
  return [
    '<article class="iam-product-card" data-product-index="' + index + '">',
    '<a class="iam-product-card__media" href="' + escapeHtml(item.href ?? "#") + '">',
    resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-product-card__image"),
    item.badge ? '<span class="iam-product-card__badge">' + escapeHtml(item.badge) + "</span>" : "",
    "</a>",
    '<div class="iam-product-card__meta">',
    '<a class="iam-product-card__title" href="' + escapeHtml(item.href ?? "#") + '">' + escapeHtml(item.title) + "</a>",
    '<p class="iam-product-card__price">' + escapeHtml(item.price ?? "") +
      (item.compareAtPrice ? ' <s>' + escapeHtml(item.compareAtPrice) + "</s>" : "") + "</p>",
    '<button type="button" class="iam-product-card__quick iam-touch-target" aria-label="Quick add ' +
      escapeHtml(item.title) + '">+</button>',
    "</div>",
    "</article>",
  ].join("");
}

export function renderCollectionTrack(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading?: string;
    tabs: Array<{ id: string; label: string; items: MediaItem[] }>;
  };
  const tabs = data.tabs ?? [];
  const tabButtons = tabs.map((tab, index) =>
    '<button type="button" class="iam-tab iam-touch-target' + (index == 0 ? " is-active" : "") +
    '" role="tab" aria-selected="' + (index == 0 ? "true" : "false") +
    '" data-tab-target="' + escapeHtml(tab.id) + '">' + escapeHtml(tab.label) + "</button>"
  ).join("");
  const panels = tabs.map((tab, index) =>
    '<div class="iam-collection-track__panel' + (index == 0 ? " is-active" : "") +
    '" role="tabpanel" data-tab-panel="' + escapeHtml(tab.id) + '">' +
    '<div class="iam-collection-track__rail">' +
    tab.items.map((item, i) => productCard(context, item, i)).join("") +
    '</div><div class="iam-track-progress" aria-hidden="true"><span></span></div></div>'
  ).join("");

  return [
    '<div class="iam-collection-track" data-tab-group>',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-tabs" role="tablist">', tabButtons, "</div>",
    panels,
    "</div>",
  ].join("");
}

export function renderFullscreenMediaProduct(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    mediaKey?: string;
    mediaAlt?: string;
    product?: MediaItem;
  };
  const product = data.product;
  return [
    '<div class="iam-fullscreen-product">',
    '<div class="iam-fullscreen-product__media">',
    resolveImage(context, data.mediaKey, data.mediaAlt ?? data.heading, "iam-fullscreen-product__image"),
    "</div>",
    '<div class="iam-fullscreen-product__shade" aria-hidden="true"></div>',
    '<div class="iam-fullscreen-product__copy">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p class="iam-scroll-copy" data-scroll-reveal>' + escapeHtml(data.body) + "</p>" : "",
    "</div>",
    product ? '<aside class="iam-feature-card">' +
      resolveImage(context, product.mediaKey, product.mediaAlt ?? product.title, "iam-feature-card__image") +
      '<div><h3>' + escapeHtml(product.title) + '</h3><p>' + escapeHtml(product.price ?? "") +
      '</p><button class="iam-action iam-action--primary" type="button">Quick add</button></div></aside>' : "",
    "</div>",
  ].join("");
}

export function renderSplitMedia(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as { items: MediaItem[] };
  return '<div class="iam-split-media">' + (data.items ?? []).map((item) => [
    '<article class="iam-split-media__panel">',
    resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-split-media__image"),
    '<div class="iam-split-media__copy"><h3>' + escapeHtml(item.title) + "</h3>",
    item.body ? '<p>' + escapeHtml(item.body) + "</p>" : "",
    item.href ? '<a class="iam-text-link" href="' + escapeHtml(item.href) + '">Explore</a>' : "",
    "</div></article>",
  ].join("")).join("") + "</div>";
}

export function renderShopTheLook(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    heading?: string;
    mediaKey?: string;
    mediaAlt?: string;
    hotspots: Array<{ x: number; y: number; title: string; price?: string }>;
  };
  const spots = (data.hotspots ?? []).map((spot, index) => [
    '<button type="button" class="iam-hotspot" style="--x:' + spot.x + '%;--y:' + spot.y +
      '%" aria-label="' + escapeHtml(spot.title) + '" data-hotspot="' + index + '">',
    '<span class="iam-hotspot__dot"></span>',
    '<span class="iam-hotspot__card"><strong>' + escapeHtml(spot.title) + "</strong>",
    spot.price ? '<span>' + escapeHtml(spot.price) + "</span>" : "",
    '<span class="iam-hotspot__action">Quick buy</span></span></button>',
  ].join("")).join("");
  return [
    '<div class="iam-lookbook">',
    data.heading ? '<h2 class="iam-lookbook__heading">' + escapeHtml(data.heading) + "</h2>" : "",
    '<div class="iam-lookbook__media">',
    resolveImage(context, data.mediaKey, data.mediaAlt ?? data.heading, "iam-lookbook__image"),
    spots,
    "</div></div>",
  ].join("");
}

export function renderFeaturedProduct(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    price?: string;
    media: Array<{ key: string; alt?: string }>;
    actions?: Action[];
  };
  const media = (data.media ?? []).map((item) =>
    '<figure class="iam-pdp__media">' +
    resolveImage(context, item.key, item.alt ?? data.heading, "iam-pdp__image") +
    "</figure>"
  ).join("");
  return [
    '<div class="iam-pdp">',
    '<aside class="iam-pdp__rail iam-pdp__rail--left">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p>' + escapeHtml(data.body) + "</p>" : "",
    "</aside>",
    '<div class="iam-pdp__gallery">', media, "</div>",
    '<aside class="iam-pdp__rail iam-pdp__rail--right">',
    '<p class="iam-pdp__price">' + escapeHtml(data.price ?? "") + "</p>",
    '<div class="iam-pdp__swatches"><span></span><span></span><span></span></div>',
    '<div class="iam-pdp__sizes"><button>XS</button><button>S</button><button>M</button><button>L</button></div>',
    action(data.actions?.[0] ?? { label: "Add to bag", href: "#bag" }),
    "</aside>",
    "</div>",
  ].join("");
}

export function renderMarquee(instance: SectionInstance): string {
  const data = instance.data as { items: string[] };
  const track = (data.items ?? []).map((item) =>
    '<span class="iam-marquee__item">' + escapeHtml(item) + "</span>"
  ).join("");
  return '<div class="iam-marquee" aria-label="Highlights"><div class="iam-marquee__track">' +
    track + track + "</div></div>";
}

export function renderLogoTrack(instance: SectionInstance): string {
  const data = instance.data as { items: string[] };
  const track = (data.items ?? []).map((item) =>
    '<span class="iam-logo-track__item">' + escapeHtml(item) + "</span>"
  ).join("");
  return '<div class="iam-logo-track"><div class="iam-logo-track__track">' + track + track + "</div></div>";
}

export function renderTestimonials(instance: SectionInstance): string {
  const data = instance.data as { eyebrow?: string; heading?: string; items: Array<{ quote: string; by: string }> };
  return [
    '<div class="iam-testimonials">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-testimonials__grid">',
    (data.items ?? []).map((item) =>
      '<blockquote><p>“' + escapeHtml(item.quote) + '”</p><footer>' + escapeHtml(item.by) + "</footer></blockquote>"
    ).join(""),
    "</div></div>",
  ].join("");
}

export function renderCtaBand(instance: SectionInstance): string {
  const data = instance.data as { eyebrow?: string; heading: string; body?: string; action?: Action };
  return [
    '<div class="iam-cta-band">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p>' + escapeHtml(data.body) + "</p>" : "",
    '<form class="iam-cta-band__form"><label class="sr-only" for="revise-email">Email</label>',
    '<input id="revise-email" type="email" placeholder="Email address">',
    '<button type="submit" class="iam-action iam-action--primary">' +
      escapeHtml(data.action?.label ?? "Join the list") + "</button></form>",
    "</div>",
  ].join("");
}

export function renderFaq(instance: SectionInstance): string {
  const data = instance.data as { eyebrow?: string; heading?: string; items: Array<{ q: string; a: string }> };
  return [
    '<div class="iam-faq">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-faq__items">',
    (data.items ?? []).map((item, index) =>
      '<details class="iam-faq__item"' + (index == 0 ? " open" : "") + '><summary>' +
      escapeHtml(item.q) + '<span aria-hidden="true">+</span></summary><p>' +
      escapeHtml(item.a) + "</p></details>"
    ).join(""),
    "</div></div>",
  ].join("");
}

export function renderTrustRow(instance: SectionInstance): string {
  const data = instance.data as { items: Array<{ title: string; body: string }> };
  return '<div class="iam-trust-row">' + (data.items ?? []).map((item) =>
    '<div class="iam-trust-row__item"><strong>' + escapeHtml(item.title) +
    '</strong><span>' + escapeHtml(item.body) + "</span></div>"
  ).join("") + "</div>";
}



type CommerceIdea = {
  id: string;
  title: string;
  sourceLabel?: string;
  role?: string;
  body?: string;
  mediaKey?: string;
  mediaAlt?: string;
  fulfillmentCostCents?: number;
  proposedRetailCents?: number;
};

type CommerceOffer = {
  id: string;
  badge?: string;
  title: string;
  body?: string;
  productIds: string[];
  compareAtCents?: number;
  offerPriceCents: number;
  fulfillmentCostCents?: number;
  ctaLabel?: string;
};

function money(cents: number | undefined, currency = "USD"): string {
  if (cents === undefined || cents === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function renderCommerceOffers(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    products: CommerceIdea[];
    offers: CommerceOffer[];
    showEconomics?: boolean;
    sourceNote?: string;
    anchor?: string;
    currency?: string;
  };

  const productsById = new Map((data.products ?? []).map((product) => [product.id, product]));
  const productCards = (data.products ?? []).map((product) => {
    return [
      '<article class="iam-commerce-idea">',
      '<figure class="iam-commerce-idea__media">',
      resolveImage(context, product.mediaKey, product.mediaAlt ?? product.title, "iam-commerce-idea__image"),
      product.role ? '<span class="iam-commerce-idea__role">' + escapeHtml(product.role) + "</span>" : "",
      "</figure>",
      '<div class="iam-commerce-idea__copy">',
      product.sourceLabel ? '<p class="iam-commerce-idea__source">' + escapeHtml(product.sourceLabel) + "</p>" : "",
      '<h3>' + escapeHtml(product.title) + "</h3>",
      product.body ? '<p>' + escapeHtml(product.body) + "</p>" : "",
      '<div class="iam-commerce-idea__prices">',
      product.proposedRetailCents !== undefined
        ? '<span><small>Demo retail</small><strong>' + money(product.proposedRetailCents, data.currency) + "</strong></span>"
        : "",
      data.showEconomics && product.fulfillmentCostCents !== undefined
        ? '<span><small>Fulfillment</small><strong>' + money(product.fulfillmentCostCents, data.currency) + "</strong></span>"
        : "",
      "</div>",
      "</div></article>",
    ].join("");
  }).join("");

  const offerCards = (data.offers ?? []).map((offer) => {
    const attached = offer.productIds
      .map((id) => productsById.get(id))
      .filter((value): value is CommerceIdea => Boolean(value));
    const savings = offer.compareAtCents !== undefined
      ? Math.max(0, offer.compareAtCents - offer.offerPriceCents)
      : 0;
    const gross = offer.fulfillmentCostCents !== undefined
      ? offer.offerPriceCents - offer.fulfillmentCostCents
      : undefined;
    const margin = gross !== undefined && offer.offerPriceCents > 0
      ? Math.round((gross / offer.offerPriceCents) * 100)
      : undefined;

    return [
      '<article class="iam-offer-card">',
      '<div class="iam-offer-card__top">',
      offer.badge ? '<span class="iam-offer-card__badge">' + escapeHtml(offer.badge) + "</span>" : "",
      '<h3>' + escapeHtml(offer.title) + "</h3>",
      offer.body ? '<p>' + escapeHtml(offer.body) + "</p>" : "",
      "</div>",
      '<ul class="iam-offer-card__items">',
      attached.map((product) => '<li><span>' + escapeHtml(product.title) + '</span><small>' +
        (product.role ? escapeHtml(product.role) : "Item") + "</small></li>").join(""),
      "</ul>",
      '<div class="iam-offer-card__pricing">',
      offer.compareAtCents !== undefined
        ? '<span><small>À la carte</small><s>' + money(offer.compareAtCents, data.currency) + "</s></span>"
        : "",
      '<span class="iam-offer-card__price"><small>Bundle</small><strong>' + money(offer.offerPriceCents, data.currency) + "</strong></span>",
      savings > 0 ? '<span><small>Save</small><strong>' + money(savings, data.currency) + "</strong></span>" : "",
      "</div>",
      data.showEconomics && offer.fulfillmentCostCents !== undefined
        ? '<div class="iam-offer-card__economics"><span>Fulfillment ' + money(offer.fulfillmentCostCents, data.currency) +
          '</span><span>Gross ' + money(gross, data.currency) + '</span><span>Est. gross margin ' + margin + "%</span></div>"
        : "",
      '<button type="button" class="iam-action iam-action--primary" data-commerce-offer="' +
      escapeHtml(offer.id) + '">' +
      escapeHtml(offer.ctaLabel ?? "Add bundle") + "</button>",
      "</article>",
    ].join("");
  }).join("");

  const anchor = data.anchor ? ' id="' + escapeHtml(data.anchor) + '"' : "";
  return [
    '<div class="iam-commerce-offers"' + anchor + '>',
    sectionHead(data.eyebrow, data.heading, data.body),
    data.sourceNote ? '<p class="iam-commerce-offers__source-note">' + escapeHtml(data.sourceNote) + "</p>" : "",
    '<div class="iam-commerce-offers__ideas">', productCards, "</div>",
    '<div class="iam-commerce-offers__bundles">', offerCards, "</div>",
    "</div>",
  ].join("");
}

export function renderBundleBuilder(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    items: MediaItem[];
    total?: string;
  };
  return [
    '<div class="iam-bundle">',
    '<aside class="iam-bundle__summary">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p>' + escapeHtml(data.body) + "</p>" : "",
    '<div class="iam-bundle__total"><span>Set total</span><strong>' + escapeHtml(data.total ?? "") + "</strong></div>",
    '<button type="button" class="iam-action iam-action--primary">Add the set</button>',
    "</aside>",
    '<div class="iam-bundle__items">',
    (data.items ?? []).map((item, index) => productCard(context, item, index)).join(""),
    "</div></div>",
  ].join("");
}

export function renderCollectionSplitMedia(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    mediaKey?: string;
    mediaAlt?: string;
    items: MediaItem[];
  };
  return [
    '<div class="iam-collection-split">',
    '<div class="iam-collection-split__media">',
    resolveImage(context, data.mediaKey, data.mediaAlt ?? data.heading, "iam-collection-split__image"),
    '<div class="iam-collection-split__caption">',
    data.eyebrow ? '<span>' + escapeHtml(data.eyebrow) + "</span>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p>' + escapeHtml(data.body) + "</p>" : "",
    "</div></div>",
    '<div class="iam-collection-split__products">',
    (data.items ?? []).map((item, index) => productCard(context, item, index)).join(""),
    "</div></div>",
  ].join("");
}

export function renderBrandFilm(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    mediaKey?: string;
    mediaAlt?: string;
  };
  return [
    '<div class="iam-brand-film">',
    resolveImage(context, data.mediaKey, data.mediaAlt ?? data.heading, "iam-brand-film__media"),
    '<div class="iam-brand-film__shade"></div>',
    '<div class="iam-brand-film__copy">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    '<button type="button" class="iam-brand-film__play iam-touch-target" aria-label="Play film">▶</button>',
    "</div></div>",
  ].join("");
}

export function renderCampaignTeaser(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    body?: string;
    mediaKey?: string;
    mediaAlt?: string;
    action?: Action;
  };
  return [
    '<div class="iam-campaign-teaser">',
    '<div class="iam-campaign-teaser__copy">',
    data.eyebrow ? '<p class="iam-section-head__eyebrow">' + escapeHtml(data.eyebrow) + "</p>" : "",
    '<h2>' + escapeHtml(data.heading) + "</h2>",
    data.body ? '<p>' + escapeHtml(data.body) + "</p>" : "",
    action(data.action, "iam-action iam-action--secondary"),
    "</div>",
    '<div class="iam-campaign-teaser__media">',
    resolveImage(context, data.mediaKey, data.mediaAlt ?? data.heading, "iam-campaign-teaser__image"),
    "</div></div>",
  ].join("");
}

export function renderBeforeAfter(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading: string;
    beforeKey?: string;
    afterKey?: string;
    beforeAlt?: string;
    afterAlt?: string;
  };
  return [
    '<div class="iam-before-after" data-before-after style="--position:50%">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-before-after__stage">',
    resolveImage(context, data.beforeKey, data.beforeAlt ?? "Before", "iam-before-after__image iam-before-after__image--before"),
    '<div class="iam-before-after__after">',
    resolveImage(context, data.afterKey, data.afterAlt ?? "After", "iam-before-after__image iam-before-after__image--after"),
    "</div>",
    '<div class="iam-before-after__divider" aria-hidden="true"><span>↔</span></div>',
    '<input class="iam-before-after__range" type="range" min="0" max="100" value="50" aria-label="Compare before and after">',
    "</div></div>",
  ].join("");
}

export function renderEditorialPosts(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as {
    eyebrow?: string;
    heading?: string;
    items: Array<MediaItem & { meta?: string }>;
  };
  return [
    '<div class="iam-editorial-posts">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-editorial-posts__grid">',
    (data.items ?? []).map((item, index) => [
      '<article class="iam-editorial-post" style="--post-index:' + index + '">',
      '<div class="iam-editorial-post__media">',
      resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-editorial-post__image"),
      "</div>",
      '<div class="iam-editorial-post__copy">',
      item.meta ? '<p>' + escapeHtml(item.meta) + "</p>" : "",
      '<h3>' + escapeHtml(item.title) + "</h3>",
      item.body ? '<p>' + escapeHtml(item.body) + "</p>" : "",
      '<a class="iam-text-link" href="' + escapeHtml(item.href ?? "#") + '">Read story</a>',
      "</div></article>",
    ].join("")).join(""),
    "</div></div>",
  ].join("");
}

export function renderSocialGallery(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as { eyebrow?: string; heading?: string; items: MediaItem[] };
  return [
    '<div class="iam-social-gallery">',
    sectionHead(data.eyebrow, data.heading),
    '<div class="iam-social-gallery__grid">',
    (data.items ?? []).map((item) =>
      '<a class="iam-social-tile" href="' + escapeHtml(item.href ?? "#") + '">' +
      resolveImage(context, item.mediaKey, item.mediaAlt ?? item.title, "iam-social-tile__image") +
      '<span>' + escapeHtml(item.title) + "</span></a>"
    ).join(""),
    "</div></div>",
  ].join("");
}

registerSection("media-gallery", renderMediaGallery);
registerSection("editorial-grid", renderEditorialGrid);
registerSection("stories", renderStories);
registerSection("collection-track", renderCollectionTrack);
registerSection("fullscreen-media-product", renderFullscreenMediaProduct);
registerSection("split-media", renderSplitMedia);
registerSection("shop-the-look", renderShopTheLook);
registerSection("featured-product", renderFeaturedProduct);
registerSection("marquee", renderMarquee);
registerSection("logo-track", renderLogoTrack);
registerSection("testimonials", renderTestimonials);
registerSection("cta-band", renderCtaBand);
registerSection("faq", renderFaq);
registerSection("trust-row", renderTrustRow);

registerSection("commerce-offers", renderCommerceOffers);
registerSection("bundle-builder", renderBundleBuilder);
registerSection("collection-split-media", renderCollectionSplitMedia);
registerSection("brand-film", renderBrandFilm);
registerSection("campaign-teaser", renderCampaignTeaser);
registerSection("before-after", renderBeforeAfter);
registerSection("editorial-posts", renderEditorialPosts);
registerSection("social-gallery", renderSocialGallery);

