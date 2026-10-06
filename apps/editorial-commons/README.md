# Editorial Commons — FORM / 26 Storefront and Visual Scene Library

A multi-page editorial-commerce visual study with reusable React scene boundaries. Uses **React 19, TypeScript, Tailwind CSS v4, and Framer Motion**. Content and transactions are not connected to live customer backends.

Features a **6+ Page Editorial Experience**, a synchronized router with browser history & URL hash synchronization, 27 choreographed scroll scenes across Acts I through VII on the Flagship Storefront, standalone Product Detail Pages (PDP), and the groundbreaking **AgentSam Brand Stream & Visual Identity Archaeology Studio**.

**Current status:** 39 original and added scenes/pages are browseable through the visual gallery. Bag, promotions, appointments, VIP allocations, and brand recovery require real backend adapters; current data is illustrative. See [Editorial Commons architecture and validation](docs/EDITORIAL_COMMONS.md). Original historical source remains in Git history.

---

## 🌟 Multi-Page Architecture & Route Directory

The application features a synchronized client-side router (`CartContext.tsx`) with URL hash synchronization (`#/`, `#/collections`, `#/lookbook`, `#/product/:id`, `#/maison`, `#/reserve`, `#/studio`) and smooth Framer Motion `AnimatePresence` page transitions:

### 1. `Flagship Storefront` (`/` or `#/`)
- **27 Choreographed Sections across Acts I–VII**:
  - `HeroCurtain`: 100vh sticky curtain that scales down to $0.85\times$ and blurs up to $6\text{px}$ as subsequent sections slide over it.
  - `WardrobeGallery`: 5 isolated 3:4 category cutouts (Leather, Bottoms, Tops, Dresses, Footwear).
  - `PromoGrid`: Desktop-only dark promo tiles with hand-drawn red scribble vector.
  - `StoriesRings` & `StoriesViewerModal`: Instagram-style vertical fullscreen story reels.
  - `CollectionCarousel`: Tabbed slider with rollover image swap and swipe physics.
  - `FullscreenEditorial`: Scroll-linked word-by-word reveal over campaign visuals.
  - `SplitMediaDiptych`: Oversized comparisons (*Cotton* vs. *Leather*).
  - `ShopTheLookbook`: Shoppable visual with pulsing hotspots and quick-buy popovers.
  - `BundleBuilder`: Pinned sticky summary card with dynamic 20% bundle discounts.
  - `FeaturedPDP`: 3-column flagship PDP with dual pinned sticky rails.
  - `BrandFilm` & `TeaserReserve`: Cinematic video launcher and VIP waitlist forms.
  - `BeforeAfterSlider`: Draggable split-slider comparing raw fabrics to finished leathers.
  - `BlogPostsStack`, `SocialGrid`, `FAQAndTrust`, and luxury dark `Footer`.

### 2. `Collections & Archive Catalog` (`/collections` or `#/collections`)
- **Filterable Faceted Catalog Browser**:
  - Filter by Silhouette (`ALL`, `LEATHER & TAILORING`, `OUTERWEAR`, `TOPS & KNITWEAR`, `BOTTOMS`, `DRESSES`, `FOOTWEAR`).
  - Search filter within collection for instant keyword matches.
  - Sale Vault and In-Stock toggles.
  - Layout Grid Switcher: 2-Column Editorial View, 3-Column Classic Grid, 4-Column Dense Matrix.
  - Sorting: Featured Curation, New Arrivals, Price Low-High, Price High-Low, Customer Rating.
  - Swatch rollover image swaps, Quick View modal triggers, and "+1" Add to Bag with fly-to-cart animation.

### 3. `Editorial Lookbook` (`/lookbook` or `#/lookbook`)
- **Interactive Campaign Chapters**:
  - *Chapter 01: The Architecture of Noir* (English wool crepe & deep pleated culottes).
  - *Chapter 02: Distressed Nappa & Raw Twill* (Italian vegetable-tanned leather).
  - *Chapter 03: Midnight in Marais* (Sheer column slips & floor-skimming trenches).
- **Shoppable Hotspot Coordinates**: Pulsing pins with live garment cards and 1-click buy buttons.
- **Ensemble Breakdown**: Itemized look listings with direct links to dedicated PDPs.

### 4. `Maison & Ateliers` (`/maison` or `#/maison`)
- **Atelier Ethos & Craft Provenance**:
  - Huddersfield English Wool Mills, Florentine Drum-Dyed Leathercraft, Australian Merino circular knits.
  - Interactive *Before / After Material Slider* inspecting raw twill vs. finished lambskin.
- **5 Illustrative Atelier Location Cards**: Paris (Rue Saint-Honoré), Tokyo (Minami-Aoyama), New York (Mercer St, SoHo), London (Mayfair), Milan (Via Montenapoleone).
- **VIP Appointment Suite Booking Form**: Schedule bespoke fittings with local concept form preview (not real bookings).

### 5. `VIP Drop Vault & Reserve` (`/reserve` or `#/reserve`)
- **Limited Numbered Runway Drops**:
  - *Batch 01 / 50*: Hand-Waxed Calfskin Trench with serialized silver plaque.
  - *Batch 02 / 30*: Obsidian Cashmere Raw-Cut Overcoat.
  - *Batch 03 / 40*: Oxblood Leather Tee & Gloom Gauntlets Set.
- **Live Countdown Clock**: Real-time timer counting down to drop release zero.
- **Cryptographic Passcode Unlock**: Unlock vault with invite key `DEMO15` or `VAULT26`.
- **Digital VIP Allocation Pass Generator**: Issues verified collectible access codes.

### 6. `Brand Stream & Visual Recovery Studio` (`/studio` or `#/studio`)
- **AgentSam Brand Archaeology & Ingestion Engine**:
  - Multi-Brand Workspace Switcher: *FORM / 26 AW26 Flagship*, *FNF Technical Outdoor*, *CoPro Creative Lab*, *Messy Archive Ingest*, *Greenfield Brand*.
  - **Deterministic Recovery Simulator**: Simulates dropping a brand ZIP, extracting tokens, and emitting a full **Recovery Receipt** (`deterministic: true`, files seen, token sources, duplicate detection, semantic roles, uncertainty).
  - **Dynamic Multi-Format Brand Stream**: Mixed-geometry cards (Feature, Landscape, Portrait, Square, Palette Swatches, Type Specimen, Audit Report, Decision Timeline, Media Stack).
  - **Epistemic State System**: Visual filtering and badging (`Observed`, `Inferred`, `Proposed`, `Approved`, `Conflict`).
  - **Layout Modes**: `Stream` (editorial mixed sizes), `Board` (concept moodboards), `Grid` (asset inventory), `Compare` (side-by-side concept diff).
  - **Deep Inspector Drawer**: Inspects source file hashes, occurrence counts, and executes safe agent mutations ("Propose as Canonical", "Consolidate 4 Grays", "Export BrandPack JSON").

### 7. `Product Detail Page (PDP)` (`/product/:id` or `#/product/:id`)
- Deep standalone product view with high-res multi-angle photography, atelier shade swatches, size chips with live stock countdown, bespoke fit guide modal, live subtotal calculator, fabric accordions, and mobile sticky buy bar.

---

## 🏗️ Universal Globals & Scaffolding

- **`Header`**: Fixed floating pill with active page indicators, glowing "Brand Studio" badge, bag counter with pop animation, search trigger, and currency selector (USD, EUR, GBP, JPY).
- **`MenuDrawer`**: Full-height frosted glassmorphic drawer with multi-level drill-down directory for all 6+ pages.
- **`BagDrawer`**: 520px slide-over cart with shipping progress bar, quantity steppers, promo engine (`DEMO15`), and preview cart with optional host checkout adapter.
- **`AgentSamAssistant`**: Floating developer companion with instant page router buttons, brand stream recovery receipts, and copyable luxury prompts.
- **`FlyToCartGhost`**: Physical "+1" physics-based ghost arc animation from any buy button into the header cart badge.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev

# Run TypeScript typecheck
npm run lint

# Build for production
npm run build
```
Vite dev server is bound to `0.0.0.0:3000` with full host allowlisting for the live preview environment.
