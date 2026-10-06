import { BrandWorkspace, BrandCardItem, BrandConcept, RecoveryReceipt } from '../types';
import {
  HERO_IMAGE,
  LOOKBOOK_IMAGE,
  SPLIT_COTTON_IMAGE,
  SPLIT_LEATHER_IMAGE,
  PDP_LEATHER_TEE_IMAGE
} from './catalog';

export const DEMO_RECOVERY_RECEIPT: RecoveryReceipt = {
  capability: 'brand.recover',
  source: 'concept-fixtures/form26-editorial-sample.zip',
  timestamp: '2026-10-06T02:30:00Z',
  deterministic: false,
  filesSeen: 516,
  assetsFound: 106,
  duplicatesDetected: 18,
  tokenSources: 116,
  highConfidenceRoles: 84,
  needsReview: 22,
  packPath: 'concept-fixtures/form26-editorial/brand.pack.json',
  workspacePath: 'concept-fixtures/form26-editorial/workspace.json',
  strongEvidence: [
    'Two active luxury logo wordmark lockups (Monument Serif + Grotesk)',
    'Dominant tonal palette: Obsidian (#0e0e0e), Oxblood (#4a0d10), Raw Bone (#ede8e1)',
    '100% vector typography tokens with strict tracking rules (0.25em – 0.3em)',
    'Consistent architectural 3:4 and 16:9 editorial imagery ratios'
  ],
  conflictingItems: [
    'Four nearly identical neutral grays (#0a0a0a, #0e0e0e, #111111, #141414) in CSS',
    'Competing secondary logo variant with inverted badge accent',
    'Mobile hero crop missing in Act V Brand Film assets'
  ],
  missingElements: [
    'No explicit typography license metadata for sub-brand display face',
    'No declared seasonal social-media avatar variants'
  ],
  recommendedNextMove: 'Consolidate 4 neutral black/gray shades and confirm canonical Monument wordmark.'
};

export const FORM26_CARDS: BrandCardItem[] = [
  {
    id: 'card-brand-main',
    type: 'brand-feature',
    title: 'FORM / 26 — Autumn / Winter 26',
    subtitle: 'High-Fashion Direct-to-Consumer Flagship & Atelier',
    state: 'approved',
    confidence: 0.98,
    sourceHash: '0x4a1bc34e24',
    sourcePath: 'config/brand.contract.json',
    imageUrl: HERO_IMAGE,
    tags: ['Flagship', 'Luxury', 'AW26', 'Atelier'],
    badge: 'CORE IDENTITY',
    metrics: [
      { label: 'Brand Health', value: '94%' },
      { label: 'Active SKUs', value: '42' },
      { label: 'Ateliers', value: '5 Global' },
      { label: 'Integrity', value: 'Verified' }
    ],
    notes: 'Approved brand contract for Autumn/Winter 26 master global rollout.'
  },
  {
    id: 'card-palette-primary',
    type: 'palette-swatches',
    title: 'Maison Noir & Oxblood System',
    subtitle: 'Primary living color token matrix extracted from runway collections',
    state: 'approved',
    confidence: 0.96,
    sourceHash: '0x9f06f181c5',
    sourcePath: 'src/index.css',
    tags: ['Tokens', 'Color System', 'CSS'],
    swatches: [
      { name: 'Obsidian Noir', hex: '#0e0e0e', role: 'Primary Background / Leather', state: 'approved', count: 482 },
      { name: 'Oxblood Crimson', hex: '#8b181b', role: 'Brand Accent / Signature Tag', state: 'approved', count: 124 },
      { name: 'Deep Oxblood', hex: '#4a0d10', role: 'Secondary Accent / Velvet', state: 'proposed', count: 68 },
      { name: 'Raw Bone Twill', hex: '#ede8e1', role: 'Editorial Light Surface', state: 'approved', count: 88 },
      { name: 'Slate Deep', hex: '#1c1f24', role: 'Tailored Neutral', state: 'observed', count: 32 }
    ],
    notes: 'Obsidian and Oxblood Crimson verified across 600+ component instances.'
  },
  {
    id: 'card-concept-field-notes',
    type: 'concept-board',
    title: 'Concept 01 · "ARCHITECTURAL DRAPE"',
    subtitle: 'Heavy English wool crepe contrasting fluid bonded lambskin',
    state: 'proposed',
    confidence: 0.89,
    sourceHash: '0xc7dc5f355b',
    sourcePath: 'campaigns/aw26/concept-01.md',
    imageUrl: SPLIT_LEATHER_IMAGE,
    tags: ['Concept', 'Editorial', 'AW26 Runway'],
    badge: 'PROPOSED DIRECTION',
    notes: 'Exploring sculptural silhouettes with deep double-pleats and raw cut edges.'
  },
  {
    id: 'card-type-specimen',
    type: 'type-specimen',
    title: 'Editorial & Mono Typography Specimen',
    subtitle: 'Monument Serif Display & Maison Mono tracking hierarchy',
    state: 'approved',
    confidence: 0.95,
    sourceHash: '0x89f7dea145',
    sourcePath: 'assets/fonts/specimens.css',
    tags: ['Typography', 'Font Tokens', 'Hierarchy'],
    typography: {
      family: 'Monument Extended & Maison Mono',
      sample: 'THE ARCHITECTURE OF SILHOUETTE',
      usage: 'Display Titles (46.8px/700), Monogram Badges (10px/0.3em tracking)',
      weights: ['Light (300)', 'Regular (400)', 'Medium (500)', 'Bold (700)']
    },
    notes: 'Rigorous uppercase letterspacing applied across navigation and product titles.'
  },
  {
    id: 'card-logo-family',
    type: 'logo-family',
    title: 'Wordmark & Diamond Crest Lineage',
    subtitle: 'Canonical wordmark with flanking red diamond glyph accents (◆ FORM / 26 ◆)',
    state: 'approved',
    confidence: 0.99,
    sourceHash: '0x83ce3c6182',
    sourcePath: 'assets/brand/logos/form26-master-wordmark.svg',
    imageUrl: LOOKBOOK_IMAGE,
    tags: ['Logo', 'Vector', 'Canonical Mark'],
    badge: 'CANONICAL WORDMARK',
    metrics: [
      { label: 'Aspect Ratio', value: '4:1 Vector' },
      { label: 'Occurrences', value: '1,571 files' },
      { label: 'Glyphs', value: '◆ FORM / 26 ◆' }
    ],
    notes: 'Canonical wordmark declared with 0.3em letterspacing and oxblood gem anchors.'
  },
  {
    id: 'card-audit-health',
    type: 'audit-report',
    title: 'Deterministic Brand Health Audit',
    subtitle: 'Automated static analysis across 516 files and 106 assets',
    state: 'observed',
    confidence: 0.94,
    sourceHash: '0x95c026640d',
    sourcePath: '.agentsam/reports/audit-aw26.json',
    tags: ['Audit', 'Linter', 'Quality'],
    badge: '94% HEALTH',
    metrics: [
      { label: 'Consistency', value: '94 / 100' },
      { label: 'Asset Provenance', value: '100% Verified' },
      { label: 'Token Deduplication', value: '18 Flagged' },
      { label: 'Voice Cohesion', value: '96%' }
    ],
    notes: 'Static analysis complete. 3 minor color ambiguities flagged for consolidation.'
  },
  {
    id: 'card-asset-calfskin-tee',
    type: 'asset-media',
    title: 'Calfskin As Textile · Look 07',
    subtitle: 'Ultra-thin 0.4mm drum-dyed lambskin cut as casual luxury tee',
    state: 'approved',
    confidence: 0.97,
    sourceHash: '0xb341e4263d',
    sourcePath: 'assets/images/pdp_gallery_leather_tee.jpg',
    imageUrl: PDP_LEATHER_TEE_IMAGE,
    tags: ['Lookbook', 'Hero Asset', 'PDP Master'],
    badge: 'HERO MEDIA',
    notes: 'Key campaign asset for Act IV PDP Spotlight and bundle cross-sells.'
  },
  {
    id: 'card-decision-01',
    type: 'decision-timeline',
    title: 'Decision 04: Obsidian Black Standard',
    subtitle: 'Consolidated 4 conflicting gray hex codes into single master #0e0e0e token',
    state: 'approved',
    confidence: 1.0,
    sourceHash: '0x849b3d770a',
    sourcePath: '.agentsam/decisions/04-color-consolidation.json',
    tags: ['Decision', 'Governance', 'Approved'],
    badge: 'APPROVED DECISION',
    metrics: [
      { label: 'Decided By', value: 'Atelier Director' },
      { label: 'Date', value: 'Oct 04, 2026' },
      { label: 'Scope', value: 'All Storefront Surfaces' }
    ],
    notes: 'Supersedes legacy #0a0a0a and #121212 hex values across CSS bundles.'
  },
  {
    id: 'card-campaign-paris-nocturne',
    type: 'campaign-wide',
    title: 'Campaign: "PARIS NOCTURNE AW26"',
    subtitle: 'Cinematic night editorial captured on the Pont Alexandre III in 35mm film',
    state: 'approved',
    confidence: 0.95,
    sourceHash: '0x1a586dacaa',
    sourcePath: 'campaigns/paris-nocturne/brief.json',
    imageUrl: SPLIT_COTTON_IMAGE,
    tags: ['Campaign', 'Cinematic', 'Film Stills'],
    badge: 'ACTIVE CAMPAIGN',
    metrics: [
      { label: 'Channel Reach', value: 'Global Multi-Channel' },
      { label: 'Lookbook Count', value: '18 Looks' },
      { label: 'Conversion Lift', value: '+34%' }
    ],
    notes: 'Cinematic brand film campaign anchoring Act V of the flagship storefront.'
  }
];

export const FORM26_CONCEPTS: BrandConcept[] = [
  {
    id: 'concept-1',
    name: 'Concept 01 · Architectural Drape',
    subtitle: 'Structured wools paired with buttery lambskin',
    theme: 'Sculptural Tailoring',
    moodImages: [HERO_IMAGE, SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE],
    palette: [
      { name: 'Obsidian Noir', hex: '#0e0e0e' },
      { name: 'Oxblood Noir', hex: '#4a0d10' },
      { name: 'Raw Bone', hex: '#ede8e1' }
    ],
    typography: 'Monument Extended + Maison Mono',
    statement: 'Silhouettes born from quiet study, sharp notched lapels, and raw-cut hem finishes.',
    alignmentScore: 98,
    status: 'approved',
    referencesCount: 24,
    notesCount: 6
  },
  {
    id: 'concept-2',
    name: 'Concept 02 · Raw Contrast Twill',
    subtitle: 'Heavy paraffin-coated cotton paired with satin slip column dresses',
    theme: 'Utilitarian Dualism',
    moodImages: [SPLIT_COTTON_IMAGE, LOOKBOOK_IMAGE, HERO_IMAGE],
    palette: [
      { name: 'Paraffin Tan', hex: '#8c7d70' },
      { name: 'Deep Slate', hex: '#1c1f24' },
      { name: 'Crimson Tag', hex: '#8b181b' }
    ],
    typography: 'Grotesque Bold + Courier Studio',
    statement: 'Weather-resistant workwear engineering elevated to evening luxury standards.',
    alignmentScore: 89,
    status: 'proposed',
    referencesCount: 16,
    notesCount: 4
  },
  {
    id: 'concept-3',
    name: 'Concept 03 · Ghost Monochrome',
    subtitle: 'Translucent chiffon layers floating over heavy distressed leather',
    theme: 'Ethereal Cyber-Noir',
    moodImages: [LOOKBOOK_IMAGE, SPLIT_LEATHER_IMAGE, SPLIT_COTTON_IMAGE],
    palette: [
      { name: 'Smoke White', hex: '#f4f4f4' },
      { name: 'Charcoal Ghost', hex: '#313337' },
      { name: 'Pitch Black', hex: '#050505' }
    ],
    typography: 'Neue Haas Unica + Mono 02',
    statement: 'Experimental evening wear playing with light refraction and sheer layers.',
    alignmentScore: 82,
    status: 'exploring',
    referencesCount: 19,
    notesCount: 8
  }
];

// Additional Synthetic Brand Workspaces for instant switching
export const FNF_OUTDOOR_WORKSPACE: BrandWorkspace = {
  id: 'fnf-outdoor',
  name: 'FNF — Functional Nature Form',
  industry: 'Technical Utility & Outdoor Commerce',
  healthScore: 91,
  purpose: 'Build durable technical garments engineered for backcountry extremes without aesthetic compromise.',
  positioning: 'Ultra-durable, waterproof alpine utility tailored with sleek city proportions.',
  voiceKeywords: ['Direct', 'Capable', 'Rugged', 'Optimistic', 'Precise'],
  lastReceipt: {
    capability: 'brand.recover',
    source: 'archives/fnf-technical-gear.tar.gz',
    timestamp: '2026-10-06T01:45:00Z',
    deterministic: false,
    filesSeen: 412,
    assetsFound: 88,
    duplicatesDetected: 6,
    tokenSources: 94,
    highConfidenceRoles: 76,
    needsReview: 12,
    packPath: '.agentsam/brand/packs/fnf/brand.pack.json',
    workspacePath: '.agentsam/brand/workspaces/fnf/workspace.json',
    strongEvidence: [
      'Topographic map line patterns throughout brand media',
      'High-contrast safety orange (#ff5e00) and forest pine (#1b2e23) accents',
      'Tested 3-layer Gore-Tex fabrication specs'
    ],
    conflictingItems: ['2 competing wordmarks (All-caps bold vs Geometric symbol)'],
    missingElements: ['Social square badges'],
    recommendedNextMove: 'Resolve primary logo mark for water-resistant badge stitching.'
  },
  items: [
    {
      id: 'fnf-card-1',
      type: 'brand-feature',
      title: 'FNF — Outdoor Systems',
      subtitle: 'Technical Weatherproof Apparel & Footwear',
      state: 'approved',
      confidence: 0.95,
      imageUrl: SPLIT_COTTON_IMAGE,
      badge: 'TECHNICAL BRAND',
      metrics: [
        { label: 'Health', value: '91%' },
        { label: 'Garment Field Tests', value: '140 Alpine Runs' },
        { label: 'Waterproof Rating', value: '28,000mm' }
      ]
    },
    {
      id: 'fnf-card-2',
      type: 'palette-swatches',
      title: 'Alpine High-Visibility & Forest Palette',
      subtitle: 'Engineered safety and natural camouflage tokens',
      state: 'approved',
      confidence: 0.98,
      swatches: [
        { name: 'Alpine Orange', hex: '#ff5e00', role: 'Safety Accent / Cord', state: 'approved', count: 180 },
        { name: 'Forest Pine', hex: '#1b2e23', role: 'Primary 3L Shell', state: 'approved', count: 310 },
        { name: 'Granite Slate', hex: '#3d4447', role: 'Reinforced Cordura', state: 'approved', count: 140 },
        { name: 'Glacier White', hex: '#edf2f4', role: 'Reflective Trim', state: 'proposed', count: 55 }
      ]
    },
    {
      id: 'fnf-card-3',
      type: 'concept-board',
      title: 'Concept: "SUMMIT DRIFT 8000"',
      subtitle: 'Sub-zero insulated down parkas with magnetic glove locks',
      state: 'proposed',
      confidence: 0.91,
      imageUrl: HERO_IMAGE,
      badge: 'WINTER CONCEPT',
      notes: 'Field tested in the Chamonix aiguilles in 40-knot blizzard conditions.'
    }
  ],
  concepts: [
    {
      id: 'fnf-c1',
      name: 'Summit Drift 8000',
      subtitle: 'Ultra-packable 900-fill down alpine shells',
      theme: 'High Alpine Survival',
      moodImages: [HERO_IMAGE, SPLIT_COTTON_IMAGE],
      palette: [
        { name: 'Alpine Orange', hex: '#ff5e00' },
        { name: 'Forest Pine', hex: '#1b2e23' }
      ],
      typography: 'DIN Pro Expanded',
      statement: 'Zero failure tolerance in sub-zero alpine conditions.',
      alignmentScore: 94,
      status: 'approved',
      referencesCount: 18,
      notesCount: 3
    }
  ]
};

export const COPRO_STUDIO_WORKSPACE: BrandWorkspace = {
  id: 'copro-studio',
  name: 'CoPro — Creative Design Protocols',
  industry: 'Creative Concept Lab & Generative Media',
  healthScore: 88,
  purpose: 'Provide frictionless collaboration protocols for distributed luxury fashion design teams.',
  positioning: 'Experimental, minimalist, ghost-glass UI for high-tempo fashion directors.',
  voiceKeywords: ['Avant-Garde', 'Architectural', 'Cryptic', 'Precise'],
  lastReceipt: {
    capability: 'brand.recover',
    source: 'exports/copro-concept-dump.zip',
    timestamp: '2026-10-06T00:20:00Z',
    deterministic: false,
    filesSeen: 284,
    assetsFound: 64,
    duplicatesDetected: 11,
    tokenSources: 45,
    highConfidenceRoles: 52,
    needsReview: 18,
    packPath: '.agentsam/brand/packs/copro/brand.pack.json',
    workspacePath: '.agentsam/brand/workspaces/copro/workspace.json',
    strongEvidence: [
      'Ghost glassmorphism styling tokens across all cards',
      'Strict monochrome palette with holographic rim lighting'
    ],
    conflictingItems: ['3 competing typeface candidates for headline specimen'],
    missingElements: ['Favicon package'],
    recommendedNextMove: 'Select canonical font specimen between Inter Tight and Monument Grotesk.'
  },
  items: [
    {
      id: 'copro-card-1',
      type: 'brand-feature',
      title: 'CoPro Concept Studio',
      subtitle: 'Generative Design Lab & Archive',
      state: 'approved',
      confidence: 0.92,
      imageUrl: LOOKBOOK_IMAGE,
      badge: 'CONCEPT LAB',
      metrics: [
        { label: 'Health', value: '88%' },
        { label: 'Active Boards', value: '9' },
        { label: 'Generations', value: '1,420' }
      ]
    },
    {
      id: 'copro-card-2',
      type: 'concept-board',
      title: 'Concept: "GHOST GLASS & CHROME"',
      subtitle: 'Ultra-minimal frosted planes with specular highlights',
      state: 'proposed',
      confidence: 0.94,
      imageUrl: SPLIT_LEATHER_IMAGE,
      badge: 'AVANT-GARDE',
      notes: 'Exploring frosted acrylic physical packaging for capsule drops.'
    }
  ],
  concepts: [
    {
      id: 'copro-c1',
      name: 'Ghost Glass & Chrome',
      subtitle: 'Translucent layers and specular lighting for physical packaging',
      theme: 'Digital Tactility',
      moodImages: [LOOKBOOK_IMAGE, SPLIT_LEATHER_IMAGE],
      palette: [
        { name: 'Ghost White', hex: '#fafafa' },
        { name: 'Chrome Mirror', hex: '#e2e8f0' },
        { name: 'Void Black', hex: '#000000' }
      ],
      typography: 'Ghost Sans Variable',
      statement: 'Physical meets generative digital fashion architecture.',
      alignmentScore: 92,
      status: 'approved',
      referencesCount: 22,
      notesCount: 5
    }
  ]
};

export const WORKSPACES: Record<string, BrandWorkspace> = {
  'form26-editorial': {
    id: 'form26-editorial',
    name: 'FORM / 26 — Autumn / Winter 26',
    industry: 'High-Fashion Direct-to-Consumer Luxury Flagship',
    healthScore: 94,
    purpose: 'Sculpt timeless silhouettes through architectural tailoring, tactile leather craft, and quiet uncompromising proportion.',
    positioning: 'Direct-to-consumer artisanal luxury bridging Florentine leatherwork and modern English tailoring.',
    voiceKeywords: ['Editorial', 'Architectural', 'Refined', 'Tactile', 'Uncompromising'],
    items: FORM26_CARDS,
    concepts: FORM26_CONCEPTS,
    lastReceipt: DEMO_RECOVERY_RECEIPT
  },
  'fnf-outdoor': FNF_OUTDOOR_WORKSPACE,
  'copro-studio': COPRO_STUDIO_WORKSPACE
};
