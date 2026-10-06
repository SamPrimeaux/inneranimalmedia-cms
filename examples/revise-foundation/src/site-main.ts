import "@inneranimalmedia/section-library/layout.css";
import "@inneranimalmedia/revise-theme/theme.css";
import "./demo.css";
import "./site.css";
import "./site-polish.css";

import { renderSiteSection, presetLibraryFrom } from "@inneranimalmedia/section-library";
import { enhanceRevise, reviseShowcasePresets } from "@inneranimalmedia/revise-theme";
import { validateSiteDocument, type SiteDocument, type SiteHeaderBlock, type SiteFooterBlock, type SiteSection, type SitePage } from "@inneranimalmedia/site-contracts";
import { initialSite, refineFnfCopy, sectionCatalog, sectionFromCatalog, siteMedia } from "./site-data.js";
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
  const DRAFT_KEY = "revise-site-document-v1";
  function load(): SiteDocument {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (stored) {
        const candidate = JSON.parse(stored);
        if (validateSiteDocument(candidate).length === 0) return refineFnfCopy(candidate);
      }
    } catch { /* A corrupt local draft never breaks the published fixture. */ }
    return structuredClone(initialSite);
  }
  let site = load();
  let editorOpen = false;
  let enhancement: ReturnType<typeof enhanceRevise> | null = null;
  let editScroll = 0;
  const presets = presetLibraryFrom(reviseShowcasePresets);

  const esc = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const route = (path: string) => path === "/" ? "/" : "/" + path.split("/").filter(Boolean).join("/") + "/";
  const pageForPath = () => site.pages.find((p) => p.path === route(location.pathname)) ?? site.pages[0];
  const isLocalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");
  function persist() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(site));
  }
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
      '<button class="revise-site__edit-trigger" data-editor-toggle type="button" aria-expanded="' + editorOpen +
      '" aria-controls="site-editor">Edit site <span>✦</span></button>' +
      '<div class="revise-scrim" data-overlay-scrim data-state="closed"></div>' +
      menuMarkup() + searchMarkup() + bagMarkup() + previewMarkup() + discoverMarkup() + editorMarkup(page) +
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
    const editPane = root.querySelector<HTMLElement>(".revise-site__editor-content");
    if (editPane) editPane.scrollTop = editScroll;
  }
  const navigate = (path: string) => {
    const destination = new URL(path, location.href);
    history.pushState({}, "", destination.pathname + destination.hash);
    editorOpen = false;
    editScroll = 0;
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
    if (target.closest("[data-editor-toggle]")) {
      editorOpen = !editorOpen;
      draw();
      return;
    }
    handleEditorClick(target);
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
    handleEditorSubmit(event, form);
  });
  document.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    if (input.matches("[data-site-search-input]")) updateSearch(input.value);
  });
  document.addEventListener("keydown", (event) => {
    const search = root.querySelector<HTMLElement>('[data-overlay="search"][data-state="open"]');
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (editorOpen) return;
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
  document.addEventListener("change", (event) => handleEditorChange(event.target as HTMLElement));
  window.addEventListener("popstate", () => { editorOpen = false; draw(); });
  draw();

  // The editor's controls are defined below and mutate only the local draft.


  function editorRow(title: string, kind: string, index: number, extra = "") {
    return '<div class="revise-site__editor-row"><div><strong>' + esc(title) + '</strong>' + extra +
      '</div><div class="revise-site__reorder">' +
      '<button type="button" data-edit-action="up-' + kind + '" data-edit-index="' + index + '" aria-label="Move up">↑</button>' +
      '<button type="button" data-edit-action="down-' + kind + '" data-edit-index="' + index + '" aria-label="Move down">↓</button>' +
      '<button type="button" data-edit-action="remove-' + kind + '" data-edit-index="' + index + '" aria-label="Remove">×</button>' +
      '</div></div>';
  }
  function option(value: string, label: string, selected: string) {
    return '<option value="' + esc(value) + '"' + (value === selected ? " selected" : "") + '>' + esc(label) + '</option>';
  }
  function editorMarkup(page: SitePage) {
    const headerBlocks = site.header.blocks.map((block, i) =>
      editorRow(block.label, "header", i, '<small>' + esc(block.type) + '</small>')).join("");
    const sections = page.sections.map((section, index) => {
      const labels = section.blocks?.map((block, blockIndex) =>
        '<div class="revise-site__block"><input aria-label="Block title" data-editor-block-title="' + index +
        '" data-block-index="' + blockIndex + '" value="' + esc(block.data.title ?? block.data.label ?? "") + '">' +
        '<div class="revise-site__reorder"><button type="button" data-edit-action="up-block" data-edit-index="' +
        index + '" data-block-index="' + blockIndex + '">↑</button>' +
        '<button type="button" data-edit-action="down-block" data-edit-index="' +
        index + '" data-block-index="' + blockIndex + '">↓</button>' +
        '<button type="button" data-edit-action="remove-block" data-edit-index="' +
        index + '" data-block-index="' + blockIndex + '">×</button></div></div>').join("") ?? "";
      const backgrounds = (["canvas", "paper", "muted", "inverse", "image"] as const)
        .map((surface) => option(surface, surface, section.settings.surface ?? "canvas")).join("");
      return '<div class="revise-site__editor-section">' +
        editorRow(section.preset.replace("revise/", ""), "section", index) +
        '<label>Section heading<input data-editor-heading="' + index + '" value="' + esc(section.data.heading ?? "") + '"></label>' +
        '<label>Background<select data-editor-surface="' + index + '">' + backgrounds + '</select></label>' +
        '<label>Background image key<input data-editor-image="' + index + '" placeholder="fnf.hero" value="' +
        esc(section.settings.backgroundMediaKey ?? "") + '"></label>' +
        (section.blocks ? '<div class="revise-site__editor-blocks"><small>Blocks · move, rename or add</small>' + labels +
          '<button class="revise-site__editor-add" type="button" data-edit-action="add-block" data-edit-index="' +
          index + '">+ Add block</button></div>' : "") +
        '</div>';
    }).join("");
    const footerBlocks = site.footer.blocks.map((block, i) => {
      const editableLinks = block.type !== "newsletter" ? (block.links ?? []).map((item, j) =>
        '<div class="revise-site__editor-link">' +
        '<input aria-label="Link label" data-editor-footer-link-label="' + i + '" data-link-index="' + j +
        '" value="' + esc(item.label) + '">' +
        '<input aria-label="Link destination" data-editor-footer-link-href="' + i + '" data-link-index="' + j +
        '" value="' + esc(item.href) + '">' +
        '<button type="button" data-edit-action="remove-footer-link" data-edit-index="' + i +
        '" data-link-index="' + j + '" aria-label="Remove link">×</button></div>').join("") : "";
      const addLink = block.type !== "newsletter"
        ? '<form data-editor-form="footer-link" data-footer-index="' + i +
          '"><input name="label" placeholder="Link label" required><input name="href" placeholder="/products/ or https://…" required>' +
          '<button class="revise-site__editor-add" type="submit">+ Add link</button></form>' : "";
      return '<div class="revise-site__editor-footer-block">' +
        editorRow(block.title, "footer", i, '<small>' + esc(block.type) + '</small>') +
        editableLinks + addLink + '</div>';
    }).join("");
    return '<aside class="revise-site__editor' + (editorOpen ? ' is-open' : '') + '" id="site-editor" ' +
      'aria-label="Site layout editor" aria-hidden="' + !editorOpen + '"' + (!editorOpen ? ' inert' : '') + '>' +
      '<div class="revise-site__editor-head"><div><small>Revise / Local Studio</small><h2>Site structure</h2></div>' +
      '<button type="button" data-editor-toggle aria-label="Close editor">×</button></div>' +
      '<div class="revise-site__editor-content"><p class="revise-site__editor-note">' +
      'Local draft only. This editor does not modify live commerce, server files or campaigns. Export JSON when ready to commit.</p>' +
      '<div class="revise-site__editor-group"><h3>Global Header</h3>' +
      '<label class="revise-site__editor-toggle"><input type="checkbox" data-editor-sticky ' +
      (site.header.settings.sticky ? 'checked' : '') + '> Sticky header</label>' +
      '<label class="revise-site__editor-toggle"><input type="checkbox" data-editor-announcement-enabled ' +
      (site.header.announcement.enabled ? 'checked' : '') + '> Announcement bar</label>' +
      '<label>Announcements (separate with |)<input data-editor-announcements value="' +
      esc(site.header.announcement.messages.join(" | ")) + '"></label>' + headerBlocks +
      '<form data-editor-form="header"><label>Add navigation item<input name="label" placeholder="New page" required></label>' +
      '<label>Path<input name="href" placeholder="/stories/" pattern="/.*" required></label>' +
      '<button class="revise-site__editor-add" type="submit">+ Add header link</button></form></div>' +
      '<div class="revise-site__editor-group"><h3>Page Template · ' + esc(page.title) + '</h3>' +
      '<label>Page title<input data-editor-page-title value="' + esc(page.title) + '"></label>' +
      '<p class="revise-site__editor-note">' + page.sections.length + ' section(s). Each section is a portable preset instance.</p>' +
      sections +
      '<form data-editor-form="section"><label>Add section from Revise catalog<select name="preset">' +
      sectionCatalog.map((item) => option(item.id, item.title + " · " + item.type, "")).join("") +
      '</select></label><button class="revise-site__editor-add" type="submit">+ Add section</button></form></div>' +
      '<div class="revise-site__editor-group"><h3>Global Footer</h3>' +
      '<label>Footer surface<select data-editor-footer-surface>' +
      (["inverse", "canvas", "paper", "muted"] as const).map((v) => option(v, v, site.footer.settings.background)).join("") +
      '</select></label>' + footerBlocks +
      '<form data-editor-form="footer"><label>New footer block<input name="title" placeholder="Resources" required></label>' +
      '<label>Block type<select name="blockType">' +
      option("menu","Menu","menu") + option("social","Social","menu") +
      option("legal","Policies and legal","menu") + option("newsletter","Newsletter","menu") +
      '</select></label>' +
      '<button class="revise-site__editor-add" type="submit">+ Add menu block</button></form></div>' +
      '<div class="revise-site__editor-group"><h3>Design library</h3>' +
      '<p class="revise-site__editor-note">Browse historical themes, reusable sections and archived experiments before adding a new design direction.</p>' +
      '<a class="revise-site__editor-add revise-site__editor-open-library" href="/library/">Open visual library ↗</a></div>' +
      '<div class="revise-site__editor-group"><button type="button" data-edit-action="export">Export site JSON ↓</button>' +
      '<button type="button" data-edit-action="reset">Reset local draft</button></div>' +
      '</div></aside>';
  }
  function move<T>(list: T[], index: number, direction: number) {
    const next = index + direction;
    if (index < 0 || index >= list.length || next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
  }
  function updateView() {
    editScroll = root.querySelector(".revise-site__editor-content")?.scrollTop ?? 0;
    persist();
    draw();
  }
  function handleEditorClick(target: HTMLElement) {
    const trigger = target.closest<HTMLButtonElement>("[data-edit-action]");
    if (!trigger) return;
    const action = trigger.dataset.editAction ?? "";
    const index = Number(trigger.dataset.editIndex);
    const blockIndex = Number(trigger.dataset.blockIndex);
    const page = pageForPath();
    if (action === "export") {
      const blob = new Blob([JSON.stringify(site, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = site.id + ".site-document.json";
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (action === "remove-footer-link") {
      site.footer.blocks[index]?.links?.splice(Number(trigger.dataset.linkIndex), 1);
      updateView();
      return;
    }
    if (action === "reset") {
      if (!confirm("Discard the local draft and restore the initial site layout?")) return;
      site = structuredClone(initialSite);
      updateView();
      return;
    }
    if (action === "add-block") {
      const section = page.sections[index];
      if (!section?.blocks) return;
      const sample = section.blocks.at(-1)?.data ?? { title: "New item", mediaKey: "fnf.hero", href: "/" };
      section.blocks.push({ id: section.id + "-block-" + Date.now(), type: "item", data: { ...sample, title: "New item", label: "New item" } });
      updateView();
      return;
    }
    const groups: Record<string, Array<unknown>> = {
      header: site.header.blocks,
      section: page.sections,
      footer: site.footer.blocks,
      block: page.sections[index]?.blocks ?? [],
    };
    const operation = action.split("-")[0];
    const kind = action.slice(operation.length + 1);
    const list = groups[kind];
    if (!list) return;
    const current = kind === "block" ? blockIndex : index;
    if (operation === "up") move(list, current, -1);
    else if (operation === "down") move(list, current, 1);
    else if (operation === "remove") {
      if (kind === "header" && site.header.blocks[index]?.type === "brand") return;
      list.splice(current, 1);
    } else return;
    updateView();
  }
  function handleEditorSubmit(event: Event, form: HTMLFormElement) {
    const type = form.dataset.editorForm;
    if (!type) return;
    event.preventDefault();
    const values = new FormData(form);
    if (type === "header") {
      const label = String(values.get("label") ?? "").trim();
      const href = String(values.get("href") ?? "").trim();
      if (!label || !href.startsWith("/") || href.startsWith("//")) return;
      const brandIndex = site.header.blocks.findIndex((b) => b.type === "brand");
      site.header.blocks.splice(Math.max(0, brandIndex), 0, {
        id: "nav-" + Date.now(), type: "link", label, href,
      });
    }
    if (type === "section") {
      const preset = String(values.get("preset") ?? "");
      if (!sectionCatalog.some((item) => item.id === preset)) return;
      pageForPath().sections.push(sectionFromCatalog(preset, pageForPath().id));
    }
    if (type === "footer") {
      const title = String(values.get("title") ?? "").trim();
      const blockType = String(values.get("blockType") ?? "menu");
      if (!title || !["menu", "social", "legal", "newsletter"].includes(blockType)) return;
      site.footer.blocks.push({
        id: "footer-" + Date.now(), type: blockType as SiteFooterBlock["type"], title, links: [],
      });
    }
    if (type === "footer-link") {
      const index = Number(form.dataset.footerIndex);
      const block = site.footer.blocks[index];
      const label = String(values.get("label") ?? "").trim();
      const href = String(values.get("href") ?? "").trim();
      if (!block || !label || !(/^(\/(?!\/)|https:\/\/|mailto:)/).test(href)) return;
      if (!block.links) block.links = [];
      block.links.push({ id: "footer-link-" + Date.now(), label, href });
    }
    updateView();
  }
  function handleEditorChange(target: HTMLElement) {
    const input = target as HTMLInputElement | HTMLSelectElement;
    const page = pageForPath();
    if (input.hasAttribute("data-editor-sticky")) site.header.settings.sticky = (input as HTMLInputElement).checked;
    else if (input.hasAttribute("data-editor-announcement-enabled")) {
      site.header.announcement.enabled = (input as HTMLInputElement).checked;
    }
    else if (input.hasAttribute("data-editor-announcements")) {
      site.header.announcement.messages = input.value.split("|").map((s) => s.trim()).filter(Boolean);
    }
    else if (input.hasAttribute("data-editor-page-title")) page.title = input.value.trim() || page.title;
    else if (input.hasAttribute("data-editor-footer-surface")) {
      site.footer.settings.background = input.value as SiteDocument["footer"]["settings"]["background"];
    }
    else if (input.hasAttribute("data-editor-footer-link-label")) {
      const link = site.footer.blocks[Number(input.getAttribute("data-editor-footer-link-label"))]?.links?.[Number(input.dataset.linkIndex)];
      if (!link) return;
      link.label = input.value;
    }
    else if (input.hasAttribute("data-editor-footer-link-href")) {
      const link = site.footer.blocks[Number(input.getAttribute("data-editor-footer-link-href"))]?.links?.[Number(input.dataset.linkIndex)];
      if (!link || !(/^(\/(?!\/)|https:\/\/|mailto:)/).test(input.value)) return;
      link.href = input.value;
    }
    else if (input.hasAttribute("data-editor-heading")) {
      const section = page.sections[Number(input.getAttribute("data-editor-heading"))];
      if (!section) return;
      section.data.heading = input.value;
    }
    else if (input.hasAttribute("data-editor-surface")) {
      const section = page.sections[Number(input.getAttribute("data-editor-surface"))];
      if (!section) return;
      section.settings.surface = input.value as SiteSection["settings"]["surface"];
    }
    else if (input.hasAttribute("data-editor-image")) {
      const section = page.sections[Number(input.getAttribute("data-editor-image"))];
      if (!section) return;
      section.settings.backgroundMediaKey = siteMedia.has(input.value) ? input.value : undefined;
    }
    else if (input.hasAttribute("data-editor-block-title")) {
      const block = page.sections[Number(input.getAttribute("data-editor-block-title"))]
        ?.blocks?.[Number(input.dataset.blockIndex)];
      if (!block) return;
      block.data.title = input.value;
      block.data.label = input.value;
    }
    else return;
    updateView();
  }
}
