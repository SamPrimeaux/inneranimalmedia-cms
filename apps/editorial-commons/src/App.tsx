import React from 'react';
import { EditorialScene } from './portable/EditorialScene';
import { EditorialSceneGallery } from './portable/EditorialSceneGallery';
import { EditorialHostProvider } from './portable/EditorialHost';
import { fieldworkSite, fieldworkMedia } from './portable/fieldwork-site';
import { coveSite, coveMedia } from './portable/cove-site';
import { SectionWorkbench } from './portable/SectionWorkbench';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { HeroCurtain } from './components/HeroCurtain';
import { WardrobeGallery } from './components/WardrobeGallery';
import { PromoGrid } from './components/PromoGrid';
import { StoriesRings } from './components/StoriesRings';
import { CollectionCarousel } from './components/CollectionCarousel';
import { FullscreenEditorial } from './components/FullscreenEditorial';
import { SplitMediaDiptych } from './components/SplitMediaDiptych';
import { DressBlurb } from './components/DressBlurb';
import { ShopTheLookbook } from './components/ShopTheLookbook';
import { BundleBuilder } from './components/BundleBuilder';
import { FeaturedPDP } from './components/FeaturedPDP';
import { TickerMarquee } from './components/TickerMarquee';
import { RefinedBasicsSplit } from './components/RefinedBasicsSplit';
import { BrandFilm } from './components/BrandFilm';
import { TeaserReserve } from './components/TeaserReserve';
import { LogoMarquee } from './components/LogoMarquee';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogPostsStack } from './components/BlogPostsStack';
import { NewsletterBand } from './components/NewsletterBand';
import { SocialGrid } from './components/SocialGrid';
import { FAQAndTrust } from './components/FAQAndTrust';
import { Footer } from './components/Footer';

// Global Overlays & Modals
import { MenuDrawer } from './components/MenuDrawer';
import { SearchPanel } from './components/SearchPanel';
import { BagDrawer } from './components/BagDrawer';
import { DiscoverDrawer } from './components/DiscoverDrawer';
import { PromoTabCard } from './components/PromoTabCard';
import { StoriesViewerModal } from './components/StoriesViewerModal';
import { QuickViewModal } from './components/QuickViewModal';
import { FlyToCartGhost } from './components/FlyToCartGhost';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AgentSamAssistant } from './components/AgentSamAssistant';

// Multi-Page Views
import { CollectionsPage } from './components/pages/CollectionsPage';
import { LookbookPage } from './components/pages/LookbookPage';
import { MaisonPage } from './components/pages/MaisonPage';
import { ReserveVaultPage } from './components/pages/ReserveVaultPage';
import { BrandStreamPage } from './components/pages/BrandStreamPage';

// High-Fashion Editorial Page Transition Variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.995,
    filter: 'blur(3px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.995,
    filter: 'blur(2px)',
    transition: {
      duration: 0.32,
      ease: [0.65, 0, 0.35, 1]
    }
  }
};

const MainStoreContent: React.FC = () => {
  const { currentPage, activeProductPage } = useCart();

  const getPageKey = () => {
    if (currentPage === 'pdp' && activeProductPage) return `pdp-${activeProductPage.id}`;
    return `page-${currentPage}`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={getPageKey()}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full will-change-transform"
      >
        {/* PAGE ROUTER */}
        {currentPage === 'pdp' ? (
          <ProductDetailPage />
        ) : currentPage === 'collections' ? (
          <CollectionsPage />
        ) : currentPage === 'lookbook' ? (
          <LookbookPage />
        ) : currentPage === 'maison' ? (
          <MaisonPage />
        ) : currentPage === 'reserve' ? (
          <ReserveVaultPage />
        ) : currentPage === 'studio' ? (
          <BrandStreamPage />
        ) : (
          /* MASTER SCROLL FLAGSHIP STOREFRONT (27 SECTIONS ACROSS ACTS I - VII) */
          <>
            {/* ACT I: THE ENTRANCE */}
            {/* S02: Sticky Curtain Hero with Hotspots */}
            <HeroCurtain />

            {/* S03: Image Gallery "The Wardrobe" (Slides OVER Hero) */}
            <WardrobeGallery />

            {/* ACT II: WINDOW SHOPPING */}
            {/* S04: Dark 4-Up Promo Tiles (Desktop) */}
            <PromoGrid />

            {/* S05 & S06: "The Selected" + 5 Circular Story Rings */}
            <StoriesRings />

            {/* S07: Tabbed Collection Carousel (New / Best / Sale) */}
            <CollectionCarousel />

            {/* ACT III: THE BRAND WORLD */}
            {/* S08: Fullscreen Media Product + Scroll-Linked Text Reveal */}
            <FullscreenEditorial />

            {/* S09: Split Media Diptych (Discover Cotton | Discover Leather) */}
            <SplitMediaDiptych />

            {/* S10: Dress Blurb & Cascade Link */}
            <DressBlurb />

            {/* S11: Shoppable Lookbook with Interactive Hotspots */}
            <ShopTheLookbook />

            {/* ACT IV: THE SELL */}
            {/* S12: Bundle Product "Better Together" with Pinned Summary */}
            <BundleBuilder />

            {/* S13: Featured Product 3-Column PDP with Dual Pinned Rails */}
            <FeaturedPDP />

            {/* S14: Giant Ticker Marquee */}
            <TickerMarquee />

            {/* S15: Featured Collection Split Media with Pinned Column */}
            <RefinedBasicsSplit />

            {/* ACT V: THE FILM + TEASER */}
            {/* S16: Full-Bleed Brand Film */}
            <BrandFilm />

            {/* S17: "Something New Is Almost Ready" Teaser & VIP Reserve */}
            <TeaserReserve />

            {/* ACT VI: PROOF + CONTENT */}
            {/* S18: Press Logo Infinite Loop */}
            <LogoMarquee />

            {/* S19: "The Rhythm of Contrast" Before / After Drag Slider */}
            <BeforeAfterSlider />

            {/* S20: 5-Star Testimonials Carousel */}
            <TestimonialsSection />

            {/* S21: Blog Posts Sticky Stacking Deck */}
            <BlogPostsStack />

            {/* ACT VII: CLOSE */}
            {/* S22: Newsletter "The Edit, In Your Inbox" */}
            <NewsletterBand />

            {/* S23: social media grid 3x2 Full Bleed */}
            <SocialGrid />

            {/* S24 & S25: FAQ Accordions & Trust Strip */}
            <FAQAndTrust />
          </>
        )}
      </motion.main>
    </AnimatePresence>
  );
};

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('workbench')) return <SectionWorkbench />;
  const selectedScene = params.get('scene');
  if (selectedScene) {
    const fixtureName = params.get('fixture');
    const fixture = fixtureName === 'fieldwork' ? fieldworkSite :
      fixtureName === 'cove' ? coveSite : null;
    const media = fixtureName === 'fieldwork' ? fieldworkMedia :
      fixtureName === 'cove' ? coveMedia : null;
    const section = fixture?.pages[0]?.sections.find((candidate) =>
      candidate.preset === 'commons/' + selectedScene);
    return <EditorialScene id={selectedScene}
      brand={fixture ? { name: fixture.brand.name, season: 'CORE COLLECTION' } :
        params.has('brand') ? { name: params.get('brand') ?? 'FORM / 26' } : undefined}
      section={section}
      tokens={fixture?.design}
      resolveMedia={media ? (key: string) => media.get(key) ?? null : undefined} />;
  }
  if (params.has('gallery')) return <EditorialSceneGallery />;
  return (
    <EditorialHostProvider>
    <CartProvider>
      <div className="relative min-h-screen bg-[#0b0b0b] text-[#111111] overflow-x-hidden selection:bg-[#8b181b] selection:text-white">
        {/* Header (S01 Marquee + Floating Nav) */}
        <Header />

        {/* Global Overlays & Drawers */}
        <MenuDrawer />
        <SearchPanel />
        <BagDrawer />
        <DiscoverDrawer />
        {/* Promotions require a real host adapter. Preview it independently in the scene library. */}
        <StoriesViewerModal />
        <QuickViewModal />
        <FlyToCartGhost />

        {/* Built-in AgentSam Assistant Dashboard with Interactive Tips */}
        {params.has('studio') && <AgentSamAssistant />}

        {/* Main Storefront or Dedicated Multi-Page View with Framer Motion Page Transitions */}
        <MainStoreContent />

        {/* S26 & S27: Footer & Bottom Panel */}
        <Footer />
      </div>
    </CartProvider>
    </EditorialHostProvider>
  );
}
