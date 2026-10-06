# Repository Filemap & Architecture (historical + Editorial Commons)

**New contract:** src/portable exposes 39 individually inspectable React scenes and pages through a neutral host interface. See docs/EDITORIAL_COMMONS.md for readiness caveats. Original paths are preserved below.

## 📂 Complete File Tree Map

```text
/
├── index.html                           # HTML entry point with luxury typography & meta tags
├── metadata.json                        # AI Studio applet capabilities and naming
├── package.json                         # Dependencies & project scripts
├── tsconfig.json                        # TypeScript strict compiler configuration
├── vite.config.ts                       # Vite 8 config with Tailwind v4 & host allowlisting
├── README.md                            # Complete multi-page storefront & Brand Studio documentation
├── FILEMAP.md                           # This file: component map, module roles & WIP status
├── .env.example                         # Environment variables placeholder
├── .gitignore                           # Git ignore rules
│
└── src/
    ├── main.tsx                         # React 19 root bootstrap
    ├── App.tsx                          # Synchronized page router with Framer Motion transitions
    ├── index.css                        # Custom easing tokens, marquees, keyframes & touch rules
    │
    ├── types/
    │   └── index.ts                     # TypeScript data interfaces (PageRoute, Product, EpistemicState, BrandWorkspace)
    │
    ├── data/
    │   ├── catalog.ts                   # Autumn/Winter 26 products, stories, reviews, blogs, faqs datasets
    │   └── brandStreamData.ts           # Brand workspaces (RADIAN, FNF, CoPro), recovery receipts & cards
    │
    ├── context/
    │   └── CartContext.tsx              # Central state: multi-page routing, cart, overlays, currency & fly ghost
    │
    ├── assets/
    │   └── images/                      # Generated campaign & studio photography assets
    │       ├── hero_autumn_winter_*.jpg        # S02 Hero campaign visual (16:9)
    │       ├── lookbook_leather_editorial_*.jpg# S11 Shoppable lookbook visual (16:9)
    │       ├── split_media_cotton_maroon_*.jpg # S09 Cotton editorial (3:4)
    │       ├── split_media_leather_kuro_*.jpg  # S09 Leather editorial (3:4)
    │       └── pdp_gallery_leather_tee_*.jpg   # S13 Calfskin Tee PDP gallery (3:4)
    │
    └── components/                      # Modular UI components
        │
        ├── # Dedicated Multi-Page Views (src/components/pages/)
        ├── pages/CollectionsPage.tsx    # Faceted catalog with category filters, grid toggles & sorting
        ├── pages/LookbookPage.tsx       # Shoppable campaign lookbook with interactive hotspot pins
        ├── pages/MaisonPage.tsx         # Atelier heritage, material craft slider & flagship bookings
        ├── pages/ReserveVaultPage.tsx   # Limited-batch numbered drop vault & VIP pass generator
        ├── pages/BrandStreamPage.tsx    # AgentSam Brand Stream, recovery simulator & inspector drawer
        │
        ├── # Standalone PDP & Studio Dashboard
        ├── ProductDetailPage.tsx        # Dedicated standalone PDP view with contiguous buy module
        ├── AgentSamAssistant.tsx        # Developer dashboard, multi-page fast router & prompt carousel
        │
        ├── # Global Navigation & Overlays
        ├── Header.tsx                   # Universal floating pill navigation with active route tabs
        ├── Footer.tsx                   # Dark luxury footer with multi-page directory & currency selector
        ├── MenuDrawer.tsx               # Full-height frosted glassmorphic drill-down navigation
        ├── SearchPanel.tsx              # Top drop-down search sheet with predictive search
        ├── BagDrawer.tsx                # Slide-over bag (520px) with shipping meter & checkout
        ├── DiscoverDrawer.tsx           # Megaphone tabbed drawer (New & Now, Offers, More)
        ├── PromoTabCard.tsx             # Persistent vertical left tab ("Get 15% off") + modal card
        ├── StoriesViewerModal.tsx       # Full-screen vertical Instagram-style story player
        ├── QuickViewModal.tsx           # In-place modal PDP preview with swatches & size chips
        ├── FlyToCartGhost.tsx           # "+1" physical arc animation from button to header BAG
        │
        ├── # Master Scroll Flagship Sections (Acts I – VII)
        ├── HeroCurtain.tsx              # S02 Sticky curtain hero with pulsating garment hotspots
        ├── WardrobeGallery.tsx          # S03 5-tile 3:4 cut-out category row
        ├── PromoGrid.tsx                # S04 Dark 4-up promo tiles with red scribble SVG (desktop)
        ├── StoriesRings.tsx             # S05 "The Selected" heading + S06 5 circular story rings
        ├── CollectionCarousel.tsx       # S07 Tabbed product carousel with passive touch-action
        ├── FullscreenEditorial.tsx      # S08 Timeless style + scroll-linked word-by-word reveal
        ├── SplitMediaDiptych.tsx        # S09 Discover Cotton | Discover Leather diptych
        ├── DressBlurb.tsx               # S10 Black leather dress quote & cascade link
        ├── ShopTheLookbook.tsx          # S11 Interactive shoppable lookbook with hotspots
        ├── BundleBuilder.tsx            # S12 Better Together pinned sticky summary & 20% discount
        ├── FeaturedPDP.tsx              # S13 3-column PDP with dual pinned sticky rails
        ├── TickerMarquee.tsx            # S14 Giant ticker marquee (white caps + icons)
        ├── RefinedBasicsSplit.tsx       # S15 Pinned media column + 2-col product grid
        ├── BrandFilm.tsx                # S16 Full-bleed brand film reel & video launcher
        ├── TeaserReserve.tsx            # S17 "Something new is almost ready" display & VIP waitlist
        ├── LogoMarquee.tsx              # S18 Press logo infinite loop (Vogue, GQ, etc.)
        ├── BeforeAfterSlider.tsx        # S19 The Rhythm of Contrast with touch-action pointer capture
        ├── TestimonialsSection.tsx      # S20 5-star review carousel with reviewer & product tabs
        ├── BlogPostsStack.tsx           # S21 Sticky card-deck stacking blog posts
        ├── NewsletterBand.tsx           # S22 "The Edit, In Your Inbox" regular heading
        ├── SocialGrid.tsx               # S23 @RADIAN 3x2 full bleed Instagram square grid
        └── FAQAndTrust.tsx              # S24 FAQ accordions + S25 Trust strip
```

---

## 🏗️ Multi-Page & Master Scroll State Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │                      CartProvider                      │
               │   (Synchronized Multi-Page Router & Global State)      │
               └──────────────────────────┬─────────────────────────────┘
                                          │
        ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
        ▼                  ▼              ▼              ▼                  ▼
┌──────────────┐   ┌──────────────┐ ┌───────────┐ ┌──────────────┐   ┌──────────────┐
│  / (Home)    │   │ /collections │ │ /lookbook │ │   /maison    │   │   /reserve   │
│  Flagship    │   │ Catalog Grid │ │ Hotspots  │ │ Atelier Code │   │  VIP Vault   │
│  27 Sections │   │ Faceted Sort │ │ Diptychs  │ │ VIP Bookings │   │ Passes & Drops│
└──────────────┘   └──────────────┘ └───────────┘ └──────────────┘   └──────────────┘
        │                  │              │              │                  │
        └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
               ┌───────────────────┐             ┌───────────────────┐
               │   /product/:id    │             │      /studio      │
               │  Standalone PDP   │             │   Brand Stream    │
               │  Fit & Swatches   │             │ Recovery Studio   │
               └───────────────────┘             └───────────────────┘
```

---

## 📋 Complete Feature & Implementation Matrix

| Milestone / Feature Area | Target Spec | Implementation Status | Notes |
|:---|:---|:---|:---|
| **Master Scroll Map (S01–S27)** | Exact heights & act structure | ✅ 100% Preserved & Active | 27 sections matching teardown wireframes on `/` |
| **Sticky Curtain Hero (S02)** | Scales 1 $\to$ 0.85 & blurs on scroll | ✅ 100% Preserved & Active | Fully responsive with touch hotspots |
| **Dual Pinned Rails PDP (S13)** | Dual sticky rails at `top: 80px` | ✅ 100% Preserved & Active | Left rail options, right rail accordions |
| **Bundle Builder (S12)** | Pinned sticky card, 20% calculation | ✅ 100% Preserved & Active | Interactive checkboxes with live summary |
| **Full-Height Frosted Menu** | `inset-y-0`, `backdrop-blur-2xl` | ✅ Expanded to Multi-Page | Full screen height, glassmorphic styling |
| **Standalone PDP (`ProductDetailPage`)** | Dedicated individual product pages | ✅ 100% Preserved & Active | Cross-sell rail, model specs, size guide |
| **Framer Motion Transitions** | Page-level transitions | ✅ Active Across All Pages | Smooth cubic-bezier spring curves |
| **Collections Catalog Page** | Faceted filters, grid toggle (2/3/4) | ✅ Added | Full catalog browser with live search |
| **Lookbook Editorial Page** | Shoppable hotspot pins & chapters | ✅ Added | 3 chapters with 1-click garment buy |
| **Maison & Provenance Page** | Heritage, slider & VIP bookings | ✅ Added | Before/after fabric slider & suite booking |
| **VIP Drop Vault Page** | Countdown clocks, passes & unlocks | ✅ Added | Cryptographic invite code & serial pass |
| **AgentSam Brand Stream Studio** | Deterministic brand recovery & cards | ✅ Added | Visual archaeology, receipts & inspector |
