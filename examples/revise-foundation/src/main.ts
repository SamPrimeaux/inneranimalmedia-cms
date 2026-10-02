import "@inneranimalmedia/section-library/layout.css";
import "@inneranimalmedia/revise-theme/theme.css";
import "./demo.css";

import {
  presetLibraryFrom,
  renderPage,
} from "@inneranimalmedia/section-library";
import {
  enhanceRevise,
  reviseShowcaseHome,
  reviseShowcasePresets,
} from "@inneranimalmedia/revise-theme";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

const keys = [
  "showcase.hero",
  "showcase.wardrobe.1",
  "showcase.wardrobe.2",
  "showcase.wardrobe.3",
  "showcase.wardrobe.4",
  "showcase.wardrobe.5",
  "showcase.editorial.1",
  "showcase.editorial.2",
  "showcase.editorial.3",
  "showcase.story.1",
  "showcase.story.2",
  "showcase.story.3",
  "showcase.story.4",
  "showcase.story.5",
  "showcase.product.1",
  "showcase.product.2",
  "showcase.product.3",
  "showcase.product.4",
  "showcase.product.5",
  "showcase.product.6",
  "showcase.product.7",
  "showcase.product.8",
  "showcase.product.9",
  "showcase.world",
  "showcase.split.1",
  "showcase.split.2",
  "showcase.look",
  "showcase.pdp.1",
  "showcase.pdp.2",
  "showcase.pdp.3",
  "showcase.bundle.1",
  "showcase.bundle.2",
  "showcase.bundle.3",
  "showcase.collection",
  "showcase.collection.1",
  "showcase.collection.2",
  "showcase.collection.3",
  "showcase.collection.4",
  "showcase.film",
  "showcase.campaign",
  "showcase.before",
  "showcase.after",
  "showcase.post.1",
  "showcase.post.2",
  "showcase.post.3",
  "showcase.social.1",
  "showcase.social.2",
  "showcase.social.3",
  "showcase.social.4",
  "showcase.social.5",
  "showcase.social.6",
];

const media = new Map(
  keys.map((key, index) => [
    key,
    "/visual-" + String((index % 24) + 1).padStart(2, "0") + ".svg",
  ]),
);

const pageHtml = renderPage(reviseShowcaseHome, {
  context: {
    theme: "revise",
    resolveMedia: (key) => media.get(key) ?? null,
  },
  presets: presetLibraryFrom(reviseShowcasePresets),
});

const announcement = [
  "Free studio dispatch over $150",
  "Members receive first access",
  "New volume now available",
].map((item) => "<span>" + item + "</span>").join("");

app.innerHTML = [
  '<div data-theme="revise" class="revise-demo">',
  '<div class="revise-announcement"><div class="revise-announcement__track">',
  announcement, announcement,
  "</div></div>",
  '<header class="revise-header" data-revise-header>',
  '<div class="revise-header__left">',
  '<button class="revise-header__control" type="button" data-overlay-open="menu" aria-label="Open menu">',
  '<span class="revise-burger" aria-hidden="true"></span><span>Menu</span></button>',
  '<a class="revise-header__link" href="#collection">Shop</a>',
  '<a class="revise-header__link" href="#world">Editorial</a>',
  "</div>",
  '<a class="revise-header__brand" href="#">Revise</a>',
  '<div class="revise-header__right">',
  '<button class="revise-header__control" type="button" data-overlay-open="search"><span>Search</span><b aria-hidden="true">⌕</b></button>',
  '<button class="revise-header__control" type="button" data-overlay-open="discover"><span>Discover</span><b aria-hidden="true">◌</b></button>',
  '<button class="revise-header__control" type="button" data-overlay-open="bag"><span>Bag</span><b aria-hidden="true">0</b></button>',
  "</div></header>",
  '<main class="revise-demo__main">',
  pageHtml,
  "</main>",
  '<footer class="revise-footer">',
  '<div class="iam-layout-max iam-safe-inline revise-footer__main">',
  '<div class="revise-footer__brand">Revise / directed commerce.</div>',
  '<div class="revise-footer__col"><strong>Explore</strong><a href="#">New volume</a><a href="#">Objects</a><a href="#">Editorial</a></div>',
  '<div class="revise-footer__col"><strong>Service</strong><a href="#">Delivery</a><a href="#">Returns</a><a href="#">Care</a></div>',
  '<div class="revise-footer__col"><strong>Studio</strong><a href="#">About</a><a href="#">Journal</a><a href="#">Contact</a></div>',
  "</div>",
  '<div class="iam-layout-max iam-safe-inline revise-footer__bottom"><span>Theme study / neutral fixture</span><span>Framework-independent · ESM · reduced-motion safe</span></div>',
  "</footer>",
  '<button class="revise-offer-tab" type="button" data-overlay-open="promo">Get the edit</button>',
  '<div class="revise-scrim" data-overlay-scrim data-state="closed"></div>',
  menuMarkup(),
  searchMarkup(),
  bagMarkup(),
  discoverMarkup(),
  promoMarkup(),
  "</div>",
].join("");

const revise = enhanceRevise(document);

const previewOverlay = new URLSearchParams(window.location.search).get("overlay");
if (previewOverlay) {
  requestAnimationFrame(() => revise.overlays.open(previewOverlay));
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest(".iam-product-card__quick") || target?.closest('a[href="#bag"]')) {
    event.preventDefault();
    revise.overlays.open("bag", { trigger: target });
  }
});

function menuMarkup() {
  return [
    '<aside role="dialog" aria-modal="true" aria-label="Navigation" data-overlay="menu" data-overlay-shape="left-sheet" data-overlay-modal="true" data-overlay-duration="620" data-state="closed" aria-hidden="true" inert>',
    '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>',
    '<div class="revise-overlay__header"><p class="revise-overlay-kicker">Navigation</p>',
    '<button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close aria-label="Close menu">×</button></div>',
    '<nav class="revise-nav-stack" aria-label="Main navigation">',
    '<button class="revise-nav-stack__row" data-overlay-item style="--i:0"><span>New volume</span><span>→</span></button>',
    '<button class="revise-nav-stack__row" data-overlay-item style="--i:1"><span>Objects</span><span>→</span></button>',
    '<button class="revise-nav-stack__row" data-overlay-item style="--i:2"><span>Editorial</span><span>→</span></button>',
    '<button class="revise-nav-stack__row" data-overlay-item style="--i:3"><span>Archive</span><span>→</span></button>',
    "</nav>",
    '<div class="revise-menu-editorial" data-overlay-item style="--i:4"><span>Find your direction</span>',
    '<div><img src="/visual-06.svg" alt=""><img src="/visual-09.svg" alt=""><img src="/visual-11.svg" alt=""></div></div>',
    '<div class="revise-menu-utility" data-overlay-item style="--i:5"><span>USD / US</span><span>Account</span></div>',
    "</div></aside>",
  ].join("");
}

function searchMarkup() {
  return [
    '<section role="search" data-overlay="search" data-overlay-shape="top-sheet" data-overlay-modal="false" data-overlay-duration="380" data-state="closed" aria-hidden="true" inert>',
    '<form class="revise-search-form">',
    '<input type="search" placeholder="Search objects, materials, stories…" data-overlay-autofocus>',
    '<button class="iam-action iam-action--primary" type="submit">Search</button>',
    "</form></section>",
  ].join("");
}

function bagMarkup() {
  return [
    '<aside role="dialog" aria-modal="true" aria-label="Shopping bag" data-overlay="bag" data-overlay-shape="right-sheet" data-overlay-modal="true" data-overlay-duration="620" data-state="closed" aria-hidden="true" inert>',
    '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>',
    '<div class="revise-overlay__header"><h2>Your bag</h2><button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close>×</button></div>',
    '<div class="revise-cart-empty"><p data-overlay-item style="--i:0">Your bag is ready for an object.</p>',
    '<button class="iam-action iam-action--primary" data-overlay-item style="--i:1" type="button" data-overlay-close>Continue exploring</button></div>',
    "</div></aside>",
  ].join("");
}

function discoverMarkup() {
  return [
    '<aside role="dialog" aria-modal="true" aria-label="Discover" data-overlay="discover" data-overlay-shape="wide-right-sheet" data-overlay-modal="true" data-overlay-duration="620" data-state="closed" aria-hidden="true" inert>',
    '<div class="revise-overlay__inner" tabindex="-1" data-overlay-autofocus>',
    '<div class="revise-overlay__header"><h2>Discover</h2><button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close>×</button></div>',
    '<div class="revise-discover-tabs" data-overlay-item style="--i:0"><button class="is-active">New & now</button><button>Offers</button><button>Notes</button></div>',
    '<article class="revise-discover-feature" data-overlay-item style="--i:1"><img src="/visual-10.svg" alt=""><div><span>New volume</span><h3>Direction without noise.</h3><p>Three new objects built around proportion, texture, and repeat wear.</p></div></article>',
    '<div class="revise-discover-grid" data-overlay-item style="--i:2"><img src="/visual-13.svg" alt=""><img src="/visual-17.svg" alt=""></div>',
    "</div></aside>",
  ].join("");
}

function promoMarkup() {
  return [
    '<aside role="dialog" aria-label="Studio dispatch" data-overlay="promo" data-overlay-shape="anchored-card" data-overlay-modal="false" data-overlay-duration="700" data-state="closed" aria-hidden="true" inert>',
    '<div class="revise-promo-card" tabindex="-1" data-overlay-autofocus><button class="revise-overlay__close iam-touch-target" type="button" data-overlay-close>×</button>',
    '<p class="iam-section-head__eyebrow">Studio dispatch</p><h2>Take the first look.</h2>',
    '<p>One concise note when a new volume lands.</p><form><input type="email" placeholder="Email address"><button type="submit">→</button></form>',
    "</div></aside>",
  ].join("");
}
