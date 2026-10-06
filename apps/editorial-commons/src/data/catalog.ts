import heroAutumn from '../assets/images/hero_autumn_winter_1790997144449.jpg';
import lookbookLeather from '../assets/images/lookbook_leather_editorial_1790997154232.jpg';
import pdpLeatherTee from '../assets/images/pdp_gallery_leather_tee_1790997183315.jpg';
import splitCotton from '../assets/images/split_media_cotton_maroon_1790997163291.jpg';
import splitLeather from '../assets/images/split_media_leather_kuro_1790997173107.jpg';
import { Product, StoryGroup } from '../types';

export const HERO_IMAGE = heroAutumn;
export const LOOKBOOK_IMAGE = lookbookLeather;
export const SPLIT_COTTON_IMAGE = splitCotton;
export const SPLIT_LEATHER_IMAGE = splitLeather;
export const PDP_LEATHER_TEE_IMAGE = pdpLeatherTee;

export const PRODUCTS: Product[] = [
  {
    id: 'sable-blazer',
    name: 'SABLE BLAZER',
    category: 'OUTERWEAR',
    price: 480.0,
    image: HERO_IMAGE,
    hoverImage: SPLIT_LEATHER_IMAGE,
    colors: [
      { name: 'Obsidian Black', hex: '#0e0e0e' },
      { name: 'Oxblood Noir', hex: '#4a0d10' }
    ],
    sizes: ['36', '38', '40', '42'],
    description: 'Sculpted single-breasted blazer tailored from 380gsm English wool crepe with hand-finished notched lapels, padded architectural shoulders, and horn buttons.',
    details: [
      '100% Virgin English Wool Crepe',
      'Cupro jacquard lining with interior welt pocket',
      'Dry clean only by leather & tailoring specialist',
      'Artisanal production run limited to 120 pieces'
    ],
    badge: 'NEW',
    rating: 5
  },
  {
    id: 'merino-turtleneck',
    name: 'MERINO SECOND-SKIN TURTLENECK',
    category: 'TOPS',
    price: 240.0,
    image: SPLIT_COTTON_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Onyx Noir', hex: '#111111' },
      { name: 'Charcoal Smoke', hex: '#2c2c2c' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Ultra-fine 16-gauge Australian merino knit engineered to contour the torso with seamless ribbed collar and extended wrist cuffs.',
    details: [
      '100% Extra-fine Merino Wool (19.5 micron)',
      'Fully fashioned seamless circular knit',
      'Naturally thermo-regulating and odor resistant'
    ]
  },
  {
    id: 'slouchy-culottes',
    name: 'SLOUCHY CULOTTES',
    category: 'BOTTOMS',
    price: 385.0,
    image: splitCotton,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Slate Deep', hex: '#1c1f24' },
      { name: 'Carbon Black', hex: '#121212' }
    ],
    sizes: ['34', '36', '38', '40', '42'],
    description: 'High-waisted wide-leg culottes with deep double front pleats and fluid heavy drape in Italian wool-twill blend.',
    details: ['68% Wool, 32% Cotton twill', 'Concealed hook-and-bar closure', 'Made in Italy']
  },
  {
    id: 'calm-pullover',
    name: 'CALM PULLOVER',
    category: 'TOPS',
    price: 410.0,
    originalPrice: 500.0,
    isSale: true,
    image: SPLIT_COTTON_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Bone White', hex: '#ede8e1' },
      { name: 'Heather Charcoal', hex: '#313337' }
    ],
    sizes: ['S', 'M', 'L'],
    description: 'Heavyweight ribbed fisherman knit constructed from organic carded cashmere and organic cotton.',
    details: ['70% Organic Carded Cashmere, 30% GOTS Cotton', 'Drop-shoulder relaxed proportion', 'Ribbed boat collar'],
    badge: 'SALE'
  },
  {
    id: 'matrix-mini-dress',
    name: 'MATRIX MINI DRESS',
    category: 'DRESSES',
    price: 185.0,
    image: LOOKBOOK_IMAGE,
    hoverImage: SPLIT_LEATHER_IMAGE,
    colors: [
      { name: 'Gloss Lambskin', hex: '#0a0a0a' },
      { name: 'Deep Oxblood', hex: '#581013' }
    ],
    sizes: ['34', '36', '38', '40'],
    description: 'Minimalist straight-cut mini silhouette cut from ultra-supple bonded lambskin with concealed side zip.',
    details: ['Bonded European Lambskin', 'Silk-touch stretch lining', 'Clean raw-cut hem']
  },
  {
    id: 'sharp-leather-trench',
    name: 'SHARP LEATHER TRENCH',
    category: 'LEATHER',
    price: 720.0,
    image: SPLIT_LEATHER_IMAGE,
    hoverImage: LOOKBOOK_IMAGE,
    colors: [
      { name: 'Midnight Black', hex: '#0f0f0f' },
      { name: 'Burnished Wine', hex: '#3b0a0e' }
    ],
    sizes: ['36', '38', '40'],
    description: 'Floor-skimming double-breasted trench in full-grain vegetable tanned Italian leather with storm flap and buckled belt.',
    details: ['100% Full-Grain Vegetable Tanned Italian Nappa', 'Matte ruthenium custom hardware', 'Hand-waxed edge finishing']
  },
  {
    id: 'leather-tee',
    name: 'LEATHER TEE',
    category: 'LEATHER',
    price: 325.0,
    originalPrice: 440.0,
    isSale: true,
    image: PDP_LEATHER_TEE_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Obsidian Noir', hex: '#111111' },
      { name: 'Chestnut Patina', hex: '#3b241a' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An icon of the Autumn/Winter 26 edit: an architectural crewneck t-shirt precision-cut from glove-soft French calfskin with laser-cut edges and subtle dropped shoulder.',
    details: [
      '0.6mm ultra-soft French calfskin nappa',
      'Bonded interior with anti-friction microfiber',
      'Laser-finished collar, cuffs, and hem',
      'Concealed shoulder zip closure for effortless fit'
    ],
    badge: 'FEATURED'
  },
  {
    id: 'abyssal-cardigan',
    name: 'ABYSSAL CARDIGAN',
    category: 'TOPS',
    price: 280.0,
    image: SPLIT_COTTON_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Ink Black', hex: '#0e1014' },
      { name: 'Deep Umber', hex: '#2d1e17' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Substantial chunky cardigan with tactile waffle weave and horn buttons, cut with generous volume.',
    details: ['100% Superfine Shetland Wool', 'Natural buffalo horn buttons']
  },
  {
    id: 'zenith-shift-dress',
    name: 'ZENITH SHIFT DRESS',
    category: 'DRESSES',
    price: 390.0,
    image: LOOKBOOK_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Anthracite', hex: '#1f2022' },
      { name: 'Wine Velvet', hex: '#480e12' }
    ],
    sizes: ['36', '38', '40'],
    description: 'Sleek asymmetric slip silhouette with diagonal bias drape and subtle square neckline.',
    details: ['Sandwashed heavy silk satin', 'Adjustable double spaghetti straps']
  },
  {
    id: 'gloom-gauntlets',
    name: 'GLOOM GAUNTLETS',
    category: 'LEATHER',
    price: 195.0,
    image: SPLIT_LEATHER_IMAGE,
    hoverImage: LOOKBOOK_IMAGE,
    colors: [{ name: 'Matte Calfskin', hex: '#141414' }],
    sizes: ['S/M', 'M/L'],
    description: 'Elongated mid-arm gloves in glove-grade sheepskin with tonal darting.',
    details: ['100% Cabretta Leather', 'Cashmere silk blend lining']
  },
  {
    id: 'ink-boots',
    name: 'INK PLATFORM BOOTS',
    category: 'FOOTWEAR',
    price: 495.0,
    image: SPLIT_LEATHER_IMAGE,
    hoverImage: PDP_LEATHER_TEE_IMAGE,
    colors: [{ name: 'Deep Black Polish', hex: '#0a0a0a' }],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    description: 'Sculptural square-toe chelsea boots with chunky tread sole and concealed tonal elastic gussets.',
    details: ['Full grain waxed bovine leather', 'Vibram custom lug sole', 'Goodyear welted construction']
  },
  {
    id: 'kuro-jacket',
    name: 'KURO LEATHER JACKET',
    category: 'LEATHER',
    price: 520.0,
    originalPrice: 650.0,
    isSale: true,
    image: SPLIT_LEATHER_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Kuro Noir', hex: '#0f0f0f' }
    ],
    sizes: ['38', '40', '42', '44'],
    description: 'Asymmetric biker reimagined with minimal exterior hardware, stand collar, and washed drum-dyed lambskin.',
    details: ['Drum-dyed washed lambskin', 'YKK Excella oxidized black zippers'],
    badge: 'SALE'
  },
  {
    id: 'slate-trousers',
    name: 'TAILORED SLATE TROUSERS',
    category: 'BOTTOMS',
    price: 190.0,
    image: SPLIT_COTTON_IMAGE,
    hoverImage: HERO_IMAGE,
    colors: [
      { name: 'Dark Slate', hex: '#1b1d20' }
    ],
    sizes: ['46', '48', '50', '52'],
    description: 'Mid-rise tailored trousers with sharp permanent press crease and adjustable side tabs.',
    details: ['Super 120s virgin wool', 'Half lined in viscose']
  }
];

export const CATEGORIES_WARDROBE = [
  { id: 'leather', name: 'LEATHER', count: '14 Styles', image: SPLIT_LEATHER_IMAGE, href: '#shop' },
  { id: 'bottoms', name: 'BOTTOMS', count: '18 Styles', image: SPLIT_COTTON_IMAGE, href: '#shop' },
  { id: 'tops', name: 'TOPS', count: '22 Styles', image: PDP_LEATHER_TEE_IMAGE, href: '#shop' },
  { id: 'dresses', name: 'DRESSES', count: '11 Styles', image: LOOKBOOK_IMAGE, href: '#shop' },
  { id: 'footwear', name: 'FOOTWEAR', count: '8 Styles', image: SPLIT_LEATHER_IMAGE, href: '#shop' },
];

export const STORIES_DATA: StoryGroup[] = [
  {
    id: 'story-1',
    title: 'AW26 EDIT',
    coverImage: HERO_IMAGE,
    slides: [
      {
        id: 's1-1',
        title: 'AUTUMN / WINTER 26',
        subtitle: 'Considered silhouettes born from quiet study and sculptural proportion.',
        image: HERO_IMAGE,
        productTag: { name: 'Sable Blazer', price: 480, productId: 'sable-blazer' }
      },
      {
        id: 's1-2',
        title: 'OXBLOOD & OBSIDIAN',
        subtitle: 'Shadowed tones punctured by warm rim-lighting and rich tactile depth.',
        image: SPLIT_LEATHER_IMAGE,
        productTag: { name: 'Kuro Jacket', price: 520, productId: 'kuro-jacket' }
      }
    ]
  },
  {
    id: 'story-2',
    title: 'THE ATELIER',
    coverImage: SPLIT_LEATHER_IMAGE,
    slides: [
      {
        id: 's2-1',
        title: 'MASTER PATTERN CUTTING',
        subtitle: 'Every curve drafted by hand in our Florence workshop.',
        image: LOOKBOOK_IMAGE
      },
      {
        id: 's2-2',
        title: 'VEGETABLE TANNED LEATHER',
        subtitle: 'Slow drum-dyed skins that evolve and patina with every wear.',
        image: SPLIT_LEATHER_IMAGE,
        productTag: { name: 'Sharp Leather Trench', price: 720, productId: 'sharp-leather-trench' }
      }
    ]
  },
  {
    id: 'story-3',
    title: 'TAILORING',
    coverImage: PDP_LEATHER_TEE_IMAGE,
    slides: [
      {
        id: 's3-1',
        title: 'CALFSKIN AS TEXTILE',
        subtitle: 'Treated to mimic the lightness and breathability of raw cotton.',
        image: PDP_LEATHER_TEE_IMAGE,
        productTag: { name: 'Leather Tee', price: 325, productId: 'leather-tee' }
      }
    ]
  },
  {
    id: 'story-4',
    title: 'RUNWAY LOOKS',
    coverImage: LOOKBOOK_IMAGE,
    slides: [
      {
        id: 's4-1',
        title: 'PARIS EDITORIAL',
        subtitle: 'Contrasting structured leather with ethereal column slips.',
        image: LOOKBOOK_IMAGE,
        productTag: { name: 'Matrix Mini Dress', price: 185, productId: 'matrix-mini-dress' }
      }
    ]
  },
  {
    id: 'story-5',
    title: 'VIP ARCHIVE',
    coverImage: SPLIT_COTTON_IMAGE,
    slides: [
      {
        id: 's5-1',
        title: 'RESERVED ACCESS',
        subtitle: 'Members receive private 48-hour access to small batch releases.',
        image: HERO_IMAGE
      }
    ]
  }
];

export const TESTIMONIALS = [
  {
    author: 'Amelia C.',
    role: 'Fashion Director, London',
    product: 'Sable Blazer',
    quote: 'The Sable Blazer was easy to style right away. The cut is clean, sits perfectly on the shoulders, and the wool feels far better than anything I have worn this season.',
    stars: 5
  },
  {
    author: 'Lina O.',
    role: 'Architect, Berlin',
    product: 'Kuro Jacket',
    quote: 'Uncompromising craft. The drum-dyed leather has a tactile weight that feels like a vintage heirloom on day one. Worth every euro.',
    stars: 5
  },
  {
    author: 'Marcus V.',
    role: 'Creative Producer, New York',
    product: 'Leather Tee',
    quote: 'I had never worn a calfskin tee before this piece. The drape is architectural yet completely effortless. It has become my signature evening piece.',
    stars: 5
  }
];

export const BLOG_POSTS = [
  {
    id: 'post-1',
    title: 'CHIFFON COLUMN: LIGHT THROUGH OXBLOOD OBSIDIAN',
    date: 'AUG 07, 2026',
    readTime: '4 min read',
    excerpt: 'An investigation into dual-weight dressing for early autumn: balancing heavy English wool crepe with sheer bias-cut silk organza.',
    image: HERO_IMAGE,
    tag: 'EDITORIAL'
  },
  {
    id: 'post-2',
    title: 'THE RAVEN TRENCH IN THE RAIN: FUNCTION AS SCULPTURE',
    date: 'AUG 18, 2026',
    readTime: '6 min read',
    excerpt: 'How water-resistant paraffin-coated cotton and calfskin trim withstand northern squalls while preserving razor-sharp lines.',
    image: LOOKBOOK_IMAGE,
    tag: 'CRAFT'
  },
  {
    id: 'post-3',
    title: 'KURO LEATHER, WORN IN: THE BEAUTY OF NATURAL PATINA',
    date: 'AUG 29, 2026',
    readTime: '5 min read',
    excerpt: 'Why we choose untreated full-grain skins that remember each fold, crease, and midnight drive of their wearer.',
    image: SPLIT_LEATHER_IMAGE,
    tag: 'ARCHIVE'
  }
];

export const FAQS = [
  {
    question: 'Where do you ship?',
    answer: 'We offer complimentary express courier shipping to over 85 countries worldwide on all orders exceeding $150. All international duties and taxes are fully calculated and included at checkout with no surprise border fees.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We provide a 30-day effortless return and exchange window. Simply print your pre-paid label via your account or customer care, and arrange a complimentary home courier pick-up.'
  },
  {
    question: 'How do I find the right size?',
    answer: 'Our silhouettes are cut true to standard European sizing with tailored precision. Each product page features a detailed garment measurement table, and our digital styling concierge is available 24/7 to assist with bespoke fit recommendations.'
  }
];
