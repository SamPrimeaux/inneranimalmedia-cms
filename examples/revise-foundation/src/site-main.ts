import "@inneranimalmedia/section-library/layout.css";
import "@inneranimalmedia/revise-theme/theme.css";
import "./demo.css";
import "./site.css";
import "./site-polish.css";

import { renderSiteSection, presetLibraryFrom } from "@inneranimalmedia/section-library";
import { enhanceRevise, reviseShowcasePresets } from "@inneranimalmedia/revise-theme";
import { type SiteHeaderBlock, type SiteFooterBlock, type SitePage } from "@inneranimalmedia/site-contracts";
import { initialSite, refineFnfCopy, siteMedia } from "./site-data.js";
import { buildSiteSearchIndex, searchSite } from "./site-search.js";

const params = new URLSearchParams(location.search);
if (location.pathname.startsWith("/library")) {
  void import("./library-main.js");
} else if (params.has("legacy") || params.has("fixture") || params.has("overlay") || params.has("section")) {
  void import("./main.js");
} else {
  bootSite();
}

function bootSite() {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) throw new Error("Missing #app");
  // Public storefront previews are read-only; merchant editing is handled by
  // the canonical CMS Studio through authenticated server-backed adapters.
  const site = refineFnfCopy(structuredClone(initialSite));
  let enhancement: ReturnType<typeof enhanceRevise> | null = null;
  const presets = presetLibraryFrom(reviseShowcasePresets);

  const esc = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const route = (path: string) => path === "/" ? "/" : "/" + path.split("/").filter(Boolean).join("/") + "/";
  const pageForPath = () => site.pages.find((p) => p.path === route(location.pathname)) ?? site.pages[0];
  const isLocalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");
  function link(label: string, href: string, classes = "") {
    return '<a class="' + classes + '" href="' + esc(href) + '">' + esc(label) + "</a>";
  }
  function headerBlock(block: SiteHeaderBlock) {
    if (block.type === "brand") return link(site.brand.name, site.brand.home, "revise-header__brand");
    if (block.type === "link") return link(block.label, block.href ?? "/", "revise-header__link");
    const isSearch = block.action === "search";
    const searchGlyph = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
      '<circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/></svg>';
    return '<button class="revise-header__control" data-overlay-open="' + esc(block.action) +
      '" type="button"' + (isSearch ? ' aria-label="Search the site" aria-keyshortcuts="Control+K Meta+K"' : "") + '>' +
      (block.action === "menu" ? '<span class="revise-burger" aria-hidden="true"></span>' : "") +
      (isSearch ? '<span class="revise-header__search-label">' + esc(block.label) +
        '</span><span class="revise-header__search-icon">' + searchGlyph + '</span>' : esc(block.label)) +
      (block.action === "bag" ? ' <small>0</small>' : "") + "</button>";
  }
  function renderHeader() {
    const blocks = site.header.blocks;
    const brandIndex = blocks.findIndex((b) => b.type === "brand");
    const left = brandIndex < 0 ? blocks : blocks.slice(0, brandIndex);
    const right = brandIndex < 0 ? [] : blocks.slice(brandIndex + 1);
    const messages = site.header.announcement.messages;
    return '<div class="revise-site__chrome">' +
      (site.header.announcement.enabled && messages.length ?
        '<div class="revise-announcement"><div class="revise-announcement__track">' +
        [...messages, ...messages].map((m) => '<span>' + esc(m) + '</span>').join("") +
        '</div></div>' : "") +
      '<header class="revise-header ' + (site.header.settings.pill ? "is-pill" : "is-edge") +
      (site.header.settings.sticky ? "" : " is-static") + '" data-revise-header>' +
      '<nav class="revise-header__left" aria-label="Primary">' + left.map(headerBlock).join("") + '</nav>' +
      (brandIndex < 0 ? link(site.brand.name, "/", "revise-header__brand") : headerBlock(blocks[brandIndex])) +
      '<div class="revise-header__right">' + right.map(headerBlock).join("") + '</div>' +
      '</header></div>';
  }
  function renderFooterBlock(block: SiteFooterBlock) {
    if (block.type === "newsletter") return '<div class="revise-footer__col"><strong>' + esc(block.title) + '</strong><p>' +
      esc(block.description || "Dispatch signup will be connected by your storefront host.") +
      '</p><a href="https://fuelnfreetime.com" rel="noopener">Visit the live store ↗</a></div>';
    const links = (block.links ?? []).map((item) => link(item.label, item.href)).join("");
    return '<div class="revise-footer__col"><strong>' + esc(block.title) + '</strong>' + links + '</div>';
  }
  function renderFooter() {
    return '<footer class="revise-footer" data-surface="' + esc(site.footer.settings.background) + '">' +
      '<div class="iam-layout-max iam-safe-inline revise-footer__main">' +
      '<div class="revise-footer__brand">' + esc(site.brand.name) + '<span>' + esc(site.brand.description) + '</span></div>' +
      site.footer.blocks.map(renderFooterBlock).join("") + '</div>' +
      '<div class="iam-layout-max iam-safe-inline revise-footer__bottom"><span>' +
      esc(site.footer.settings.copyright) +
      '</span><span>Made for the hours that matter.</span></div></footer>';
  }
  function pageContent(page: SitePage) {
    const inner = page.sections.map((section) => renderSiteSection(section, {
      context: { theme: site.theme, resolveMedia: (key) => siteMedia.get(key) ?? null },
      presets,
    })).join("");
    const pageNumber = String(site.pages.findIndex((item) => item.id === page.id) + 1).padStart(2, "0");
    const intro = page.path === "/" ? "" :
      '<div class="revise-site__intro"><div class="revise-site__intro-inner">' +
      '<div class="revise-site__intro-top"><span>Fuel & Free Time / ' + esc(page.id) +
      '</span><span>Page ' + pageNumber + ' / ' + String(site.pages.length).padStart(2, "0") + '</span></div>' +
      '<div class="revise-site__intro-lockup"><h1>' + esc(page.title) + '</h1><p>' + esc(page.description) + '</p></div>' +
      '<div class="revise-site__intro-bottom"><span>Built for the hours that matter</span>' +
      '<span>Scroll to explore ↓</span></div></div></div>';
    return '<main class="revise-site__main" id="main-content" tabindex="-1" data-site-page="' + esc(page.id) +
      '"><div class="revise-site__page">' + intro + inner + '</div></main>';
  }
  function menuMarkup() {
    const links = site.pages.map((page, i) =>
      '<a class="revise-nav-stack__row" data-overlay-item style="--i:' + i + '" href="' + esc(page.path) +
      '" data-overlay-close><span>' + esc(page.title) + '</span><span>↗</span></a>').join("");
    const images = ["fnf.hero", "fnf.high-octane", "fnf.build.heli.2"].map((key) =>
      '<img alt="" src="' + esc(siteMedia.get(key)) + '">').join("");
    return '<aside role="dialog" aria-modal="true" aria-label="Navigation" data-overlay="menu" ' +
      'data-overlay-shape="left-sheet" data-overlay-modal="true" data-overlay-duration="580" data-state="closed" aria-hidden="true" inert>' +
      '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>' +
      '<div class="revise-overlay__header"><p class="revise-overlay-kicker">Explore the site</p>' +
      '<button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close aria-label="Close menu">×</button></div>' +
      '<nav class="revise-nav-stack" aria-label="All pages">' + links + '</nav>' +
      '<div class="revise-menu-editorial"><span>Behind the brand</span><div>' + images + '</div></div>' +
      '<div class="revise-menu-utility"><span>Lafayette · Louisiana</span><span>Revise</span></div></div></aside>';
  }
  function searchMarkup() {
    const searchIcon = '<svg class="revise-search-palette__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
      '<circle cx="10.8" cy="10.8" r="6.9"/><path d="m16 16 5 5"/></svg>';
    return '<aside role="dialog" aria-modal="true" aria-label="Search Fuel & Free Time" ' +
      'data-overlay="search" data-overlay-shape="search-palette" data-overlay-modal="true" ' +
      'data-overlay-duration="240" data-state="closed" aria-hidden="true" inert>' +
      '<div class="revise-search-palette">' +
      '<form class="revise-search-palette__form" role="search" data-site-search>' +
      searchIcon +
      '<label class="sr-only" for="revise-search-input">Search pages and collections</label>' +
      '<input type="search" id="revise-search-input" name="q" placeholder="Search pages, stories, collections…" ' +
      'autocomplete="off" spellcheck="false" data-overlay-autofocus data-site-search-input ' +
      'aria-controls="revise-search-results" aria-describedby="revise-search-hint">' +
      '<button class="revise-search-palette__close" type="button" data-overlay-close aria-label="Close search">' +
      '<span>ESC</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M5 5l14 14M19 5 5 19"/></svg></button></form>' +
      '<div class="revise-search-palette__results" id="revise-search-results" data-search-results aria-live="polite" aria-relevant="additions text"></div>' +
      '<div class="revise-search-palette__footer" id="revise-search-hint"><span>' +
      '<kbd>↑</kbd><kbd>↓</kbd> Choose <kbd>↵</kbd> Open</span><span>Search site pages and collections</span></div>' +
      '</div></aside>';
  }
  let selectedSearchResult = 0;
  function updateSearch(query = "") {
    const host = root.querySelector<HTMLElement>("[data-search-results]");
    if (!host) return;
    const matches = searchSite(buildSiteSearchIndex(site), query);
    selectedSearchResult = 0;
    const eyebrow = '<div class="revise-search-palette__eyebrow"><span>' +
      (query.trim() ? "Search results" : "Explore") + '</span><span>' +
      (query.trim() ? matches.length + (matches.length === 1 ? " match" : " matches") : "Suggested destinations") +
      '</span></div>';
    host.innerHTML = eyebrow + (matches.length ? matches.map((entry, i) =>
      '<a class="revise-search-palette__link' + (i === 0 ? ' is-active' : '') +
      '" data-search-hit href="' + esc(entry.href) + '">' +
      '<span class="revise-search-palette__number">' + String(i + 1).padStart(2, "0") + '</span>' +
      '<span class="revise-search-palette__copy"><strong>' + esc(entry.title) + '</strong>' +
      '<small>' + esc(entry.kind) + ' · ' + esc(entry.description) + '</small></span>' +
      '<span class="revise-search-palette__arrow" aria-hidden="true">↗</span></a>'
    ).join("") : '<div class="revise-search-palette__empty"><strong>No matching pages</strong>' +
      '<span>Try a collection, campaign, or story name.</span></div>');
  }
  function selectSearchResult(index: number) {
    const matches = [...root.querySelectorAll<HTMLElement>("[data-search-hit]")];
    if (!matches.length) return;
    selectedSearchResult = (index + matches.length) % matches.length;
    matches.forEach((item, position) => item.classList.toggle("is-active", position === selectedSearchResult));
    matches[selectedSearchResult]?.scrollIntoView({ block: "nearest" });
  }
  function bagMarkup() {
    return '<aside role="dialog" aria-modal="true" aria-label="Shopping bag" data-overlay="bag" ' +
      'data-overlay-shape="right-sheet" data-overlay-modal="true" data-overlay-duration="580" data-state="closed" aria-hidden="true" inert>' +
      '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>' +
      '<div class="revise-overlay__header"><h2>Your bag</h2>' +
      '<button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close aria-label="Close bag">×</button></div>' +
      '<div class="revise-cart-empty"><p>Checkout is not connected to this site draft.</p>' +
      '<p class="revise-site__muted">Products and candidate offers are for review. No order will be placed here.</p>' +
      '<a class="iam-action iam-action--primary" href="https://fuelnfreetime.com/shop">View the live store ↗</a>' +
      '<button class="iam-action iam-action--secondary" type="button" data-overlay-close>Continue exploring</button></div></div></aside>';
  }
  function previewMarkup() {
    return '<aside role="dialog" aria-modal="true" aria-label="Detail preview" data-overlay="preview" ' +
      'data-overlay-shape="right-sheet" data-overlay-modal="true" data-overlay-duration="440" ' +
      'data-state="closed" aria-hidden="true" inert>' +
      '<div class="revise-detail-preview">' +
      '<div class="revise-detail-preview__top"><span>Fuel & Free Time / A closer look</span>' +
      '<button type="button" data-overlay-close aria-label="Close detail preview">×</button></div>' +
      '<div class="revise-detail-preview__content">' +
      '<div class="revise-detail-preview__media" data-preview-media><img data-preview-image src="" alt=""></div>' +
      '<div class="revise-detail-preview__info">' +
      '<span class="revise-detail-preview__eyebrow" data-preview-kind>Preview</span>' +
      '<h2 data-preview-title>Explore the details</h2>' +
      '<p class="revise-detail-preview__price" data-preview-price></p>' +
      '<p class="revise-detail-preview__description" data-preview-description></p>' +
      '<p class="revise-detail-preview__disclaimer" data-preview-disclaimer></p>' +
      '<div class="revise-detail-preview__actions">' +
      '<a data-preview-cta href="/products/">Explore more ↗</a>' +
      '<button type="button" data-overlay-close>Back to the site</button>' +
      '</div></div></div></div></aside>';
  }
  function openDetailPreview(trigger: HTMLElement) {
    const card = trigger.closest<HTMLElement>(".iam-product-card,.iam-social-tile,.iam-sticky-card,.iam-editorial-tile");
    if (!card) return false;
    const product = card.matches(".iam-product-card");
    const image = card.querySelector<HTMLImageElement>("img");
    const title = card.querySelector<HTMLElement>(
      ".iam-product-card__title,.iam-sticky-card__heading,.iam-editorial-tile__copy h3,.iam-social-tile span,.iam-sticky-card h3"
    )?.textContent?.trim() || image?.alt || "Collection preview";
    const price = card.querySelector<HTMLElement>(".iam-product-card__price")?.textContent?.trim() || "";
    const badge = card.querySelector<HTMLElement>(".iam-product-card__badge")?.textContent?.trim() || "";
    const copy = card.querySelector<HTMLElement>(
      ".iam-sticky-card__body,.iam-editorial-tile__copy p:not(.iam-editorial-tile__eyebrow)"
    )?.textContent?.trim() || "";
    const panel = root.querySelector<HTMLElement>('[data-overlay="preview"]');
    if (!panel) return false;
    const put = (selector: string, value: string) => {
      const element = panel.querySelector<HTMLElement>(selector);
      if (element) element.textContent = value;
    };
    const isLive = product && /live/i.test(badge) && !/catalog/i.test(badge);
    put("[data-preview-title]", title);
    put("[data-preview-kind]", product ? (isLive ? "Existing product" : "Product direction") : "Story / Editorial");
    put("[data-preview-price]", price);
    put("[data-preview-description]", copy || (product
      ? "A closer look at this piece. Product details and inventory are maintained in the live store."
      : "An editorial preview from the Fuel & Free Time creative library."));
    put("[data-preview-disclaimer]", product
      ? (isLive
        ? "This is a visual preview. Purchases and current availability are handled by the live store."
        : "Concept or sourced item. Not available for purchase from this preview.")
      : "This is an editorial preview, not a published full-length article.");
    const visual = panel.querySelector<HTMLElement>("[data-preview-media]");
    const previewImage = panel.querySelector<HTMLImageElement>("[data-preview-image]");
    if (visual && previewImage) {
      visual.hidden = !image?.src;
      if (image?.src) {
        previewImage.src = image.currentSrc || image.src;
        previewImage.alt = image.alt || title;
      } else {
        previewImage.removeAttribute("src");
      }
    }
    const action = panel.querySelector<HTMLAnchorElement>("[data-preview-cta]");
    if (action) {
      action.href = product ? (isLive ? "https://fuelnfreetime.com/shop" : "/ideas/") : "/stories/";
      action.textContent = product ? (isLive ? "Browse the live store ↗" : "See product ideas ↗") : "Explore stories ↗";
    }
    enhancement?.overlays.open("preview", { trigger });
    return true;
  }
  function openOfferPreview(trigger: HTMLElement) {
    const offer = trigger.closest<HTMLElement>(".iam-offer-card");
    if (!offer) return false;
    const panel = root.querySelector<HTMLElement>('[data-overlay="preview"]');
    if (!panel) return false;
    const put = (selector: string, value: string) => {
      const element = panel.querySelector<HTMLElement>(selector);
      if (element) element.textContent = value;
    };
    const title = offer.querySelector("h3")?.textContent?.trim() || "Bundle concept";
    const body = offer.querySelector(".iam-offer-card__top p")?.textContent?.trim() || "";
    const items = [...offer.querySelectorAll(".iam-offer-card__items li span")]
      .map((item) => item.textContent?.trim()).filter(Boolean).join(" · ");
    put("[data-preview-kind]", "Bundle concept / Not for sale");
    put("[data-preview-title]", title);
    put("[data-preview-price]", "");
    put("[data-preview-description]", [body, items].filter(Boolean).join("\n\n"));
    put("[data-preview-disclaimer]", "This is an exploratory bundle. Pricing and availability are not verified; no item will be added to your bag.");
    const media = panel.querySelector<HTMLElement>("[data-preview-media]");
    if (media) media.hidden = true;
    const image = panel.querySelector<HTMLImageElement>("[data-preview-image]");
    image?.removeAttribute("src");
    const action = panel.querySelector<HTMLAnchorElement>("[data-preview-cta]");
    if (action) {
      action.href = "/ideas/";
      action.textContent = "Explore all ideas ↗";
    }
    enhancement?.overlays.open("preview", { trigger });
    return true;
  }
  function discoverMarkup() {
    const key = (id: string) => esc(siteMedia.get(id));
    return '<aside role="dialog" aria-modal="true" aria-label="Discover" data-overlay="discover" ' +
      'data-overlay-shape="wide-right-sheet" data-overlay-modal="true" data-overlay-duration="580" data-state="closed" aria-hidden="true" inert>' +
      '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>' +
      '<div class="revise-overlay__header"><h2>Discover</h2><button class="revise-overlay__close iam-touch-target" ' +
      'type="button" data-overlay-close aria-label="Close discover">×</button></div>' +
      '<nav class="revise-site__discover-nav">' + link("Campaigns", "/campaigns/") +
      link("Stories", "/stories/") + link("Product Ideas", "/ideas/") + '</nav>' +
      '<article class="revise-discover-feature"><img src="' + key("fnf.masters") +
      '" alt="Masters collection"><div><span>Campaign direction</span><h3>Make time worth keeping.</h3>' +
      '<p>Explore the worlds behind Earned Hours, Masters and High Octane.</p>' +
      link("Explore campaigns ↗", "/campaigns/") + '</div></article>' +
      '<div class="revise-discover-grid"><img src="' + key("fnf.high-octane") +
      '" alt="High Octane project"><img src="' + key("fnf.build.heli.2") +
      '" alt="Helicopter build"></div></div></aside>';
  }
  function draw() {
    enhancement?.dispose();
    document.documentElement.classList.remove("revise-scroll-locked");
    const page = pageForPath();
    document.title = page.title + " — " + site.brand.name;
    root.innerHTML = '<div class="revise-site revise-demo" data-theme="revise">' +
      '<a class="revise-site__skip" href="#main-content">Skip to content</a>' +
      renderHeader() + pageContent(page) + renderFooter() +
      '<div class="revise-scrim" data-overlay-scrim data-state="closed"></div>' +
      menuMarkup() + searchMarkup() + bagMarkup() + previewMarkup() + discoverMarkup() +
      '</div>';
    enhancement = enhanceRevise(document);
    root.querySelectorAll<HTMLButtonElement>(".iam-product-card__quick").forEach((button) => {
      const item = button.closest<HTMLElement>(".iam-product-card");
      const title = item?.querySelector(".iam-product-card__title")?.textContent?.trim() || "this item";
      button.textContent = "↗";
      button.setAttribute("aria-label", "Preview " + title);
      button.setAttribute("title", "Preview details");
    });
    root.querySelectorAll<HTMLButtonElement>("[data-commerce-offer]").forEach((button) => {
      button.textContent = "Preview concept ↗";
      button.setAttribute("aria-label", "Preview concept " +
        (button.closest(".iam-offer-card")?.querySelector("h3")?.textContent?.trim() || "bundle"));
    });
    root.querySelectorAll<HTMLAnchorElement>('.iam-sticky-card a[href="#"]').forEach((anchor) => {
      if (anchor.textContent?.trim() === "Read story") anchor.textContent = "Preview story ↗";
    });
    updateSearch();

  }
  const navigate = (path: string) => {
    const destination = new URL(path, location.href);
    history.pushState({}, "", destination.pathname + destination.hash);
    draw();
    const anchor = destination.hash ? decodeURIComponent(destination.hash.slice(1)) : "";
    if (anchor) {
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    root.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true });
  };

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-overlay-open="search"]')) {
      const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");
      if (input) input.value = "";
      updateSearch();
    }
    const previewTrigger = target.closest<HTMLElement>(
      '.iam-product-card__quick,.iam-product-card a[href="#"],.iam-social-tile[href="#"],.iam-sticky-card a[href="#"]'
    );
    if (previewTrigger) {
      event.preventDefault();
      if (openDetailPreview(previewTrigger)) return;
    }
    const offer = target.closest<HTMLElement>("[data-commerce-offer]");
    if (offer) {
      event.preventDefault();
      if (openOfferPreview(offer)) return;
    }
    const commerce = target.closest<HTMLElement>("a[href='#bag']");
    if (commerce) {
      event.preventDefault();
      enhancement?.overlays.open("bag", { trigger: commerce });
      return;
    }
    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (anchor && isLocalHref(anchor.getAttribute("href") ?? "") &&
        !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey &&
        anchor.target !== "_blank") {
      event.preventDefault();
      const href = anchor.getAttribute("href") ?? "/";
      if (href.startsWith("/library/")) {
        window.location.assign(href);
        return;
      }
      navigate(href);
      return;
    }
  });
  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form.matches("[data-site-search]")) {
      event.preventDefault();
      const first = root.querySelector<HTMLAnchorElement>("[data-search-hit].is-active") ??
        root.querySelector<HTMLAnchorElement>("[data-search-hit]");
      first?.click();
      return;
    }
    if (form.matches(".iam-cta-band__form")) {
      event.preventDefault();
      const notice = document.createElement("p");
      notice.className = "revise-site__signup-note";
      notice.role = "status";
      notice.textContent = "This site draft cannot subscribe you yet. Newsletter setup is pending.";
      form.replaceWith(notice);
      return;
    }
  });
  document.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    if (input.matches("[data-site-search-input]")) updateSearch(input.value);
  });
  document.addEventListener("keydown", (event) => {
    const search = root.querySelector<HTMLElement>('[data-overlay="search"][data-state="open"]');
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (search) {
        enhancement?.overlays.close();
        return;
      }
      const input = root.querySelector<HTMLInputElement>("[data-site-search-input]");
      if (input) input.value = "";
      updateSearch();
      enhancement?.overlays.open("search", { focus: input });
      return;
    }
    if (!search) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selectSearchResult(selectedSearchResult + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" && (event.target as Element)?.matches("[data-site-search-input]")) {
      event.preventDefault();
      const selected = root.querySelector<HTMLAnchorElement>("[data-search-hit].is-active");
      selected?.click();
    }
  });
  window.addEventListener("popstate", draw);
  draw();
}
