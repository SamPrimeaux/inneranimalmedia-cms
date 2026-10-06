export type PageRoute = 'home' | 'collections' | 'lookbook' | 'pdp' | 'maison' | 'reserve' | 'studio';

export interface Product {
  id: string;
  name: string;
  category: 'LEATHER' | 'BOTTOMS' | 'TOPS' | 'DRESSES' | 'FOOTWEAR' | 'OUTERWEAR';
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  image: string;
  hoverImage: string;
  colors: { name: string; hex: string; bgClass?: string }[];
  sizes: string[];
  description: string;
  details?: string[];
  badge?: string;
  rating?: number;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface StorySlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productTag?: {
    name: string;
    price: number;
    productId: string;
  };
}

export interface StoryGroup {
  id: string;
  title: string;
  coverImage: string;
  slides: StorySlide[];
}

export interface Hotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  productId: string;
  name: string;
  price: number;
  colorsCount?: number;
}

// ==========================================
// BRAND STREAM & ARCHAEOLOGY TYPES
// ==========================================

export type EpistemicState = 'observed' | 'declared' | 'inferred' | 'proposed' | 'approved' | 'deprecated';

export type BrandCardType =
  | 'brand-feature'
  | 'concept-board'
  | 'campaign-wide'
  | 'asset-media'
  | 'palette-swatches'
  | 'type-specimen'
  | 'audit-report'
  | 'stat-metric'
  | 'decision-timeline'
  | 'logo-family';

export interface BrandCardItem {
  id: string;
  type: BrandCardType;
  title: string;
  subtitle?: string;
  state: EpistemicState;
  confidence?: number;
  sourceHash?: string;
  sourcePath?: string;
  tags?: string[];
  imageUrl?: string;
  badge?: string;
  notes?: string;
  metrics?: { label: string; value: string | number }[];
  swatches?: { name: string; hex: string; role?: string; state?: EpistemicState; count?: number }[];
  typography?: { family: string; sample: string; usage: string; weights: string[] };
  actionLabel?: string;
  actionPayload?: string;
}

export interface BrandConcept {
  id: string;
  name: string;
  subtitle: string;
  theme: string;
  moodImages: string[];
  palette: { name: string; hex: string }[];
  typography: string;
  statement: string;
  alignmentScore: number;
  status: 'exploring' | 'proposed' | 'approved' | 'archived';
  referencesCount: number;
  notesCount: number;
}

export interface RecoveryReceipt {
  capability: string;
  source: string;
  timestamp: string;
  deterministic: boolean;
  filesSeen: number;
  assetsFound: number;
  duplicatesDetected: number;
  tokenSources: number;
  highConfidenceRoles: number;
  needsReview: number;
  packPath: string;
  workspacePath: string;
  strongEvidence: string[];
  conflictingItems: string[];
  missingElements: string[];
  recommendedNextMove: string;
}

export interface BrandWorkspace {
  id: string;
  name: string;
  industry: string;
  healthScore: number;
  purpose: string;
  positioning: string;
  voiceKeywords: string[];
  items: BrandCardItem[];
  concepts: BrandConcept[];
  lastReceipt?: RecoveryReceipt;
}
