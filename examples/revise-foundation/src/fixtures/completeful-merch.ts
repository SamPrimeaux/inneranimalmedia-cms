export interface CompletefulDemoProduct {
  id: string;
  completefulProductId: string;
  title: string;
  sourceName: string;
  sourceType: string;
  variant?: string;
  role: string;
  body: string;
  fulfillmentCostCents: number;
  proposedRetailCents: number;
  mediaKey: string;
  mediaUrl: string;
}

export interface CompletefulDemoOffer {
  id: string;
  badge: string;
  title: string;
  body: string;
  productIds: string[];
  compareAtCents: number;
  offerPriceCents: number;
  fulfillmentCostCents: number;
  ctaLabel: string;
}

export const completefulDemoProducts: CompletefulDemoProduct[] = [
  {
    id: "heavyweight-tee",
    completefulProductId: "47d3afff-3e4c-492a-8e8b-2dcfca38caa1",
    title: "Heavyweight Garment-Dyed Tee",
    sourceName: "Unisex Garment-Dyed Heavyweight T-Shirt-Comfort Colors 1717",
    sourceType: "DTG",
    variant: "Black / S",
    role: "Core product",
    body: "A dependable hero SKU for graphic drops, collections, and bundle anchors.",
    fulfillmentCostCents: 1100,
    proposedRetailCents: 3200,
    mediaKey: "completeful.heavyweight-tee",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-47d3afff-3e4c-492a-8e8b-2dcfca38caa1/covers/f5efc1e0-4964-4e62-91be-96cdcf1f932f-clothing-mockups15.png",
  },
  {
    id: "long-sleeve",
    completefulProductId: "3722768a-157d-4f7e-9f48-bec2bd0cb0c6",
    title: "Ultra Cotton Long Sleeve",
    sourceName: "Unisex Ultra Cotton® Long Sleeve T-Shirt- Gildan 2400",
    sourceType: "DTG",
    variant: "Ash Grey / S",
    role: "Seasonal core",
    body: "A higher-ticket apparel step-up that works naturally with accessories.",
    fulfillmentCostCents: 1300,
    proposedRetailCents: 3800,
    mediaKey: "completeful.long-sleeve",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-3722768a-157d-4f7e-9f48-bec2bd0cb0c6/covers/7b76b7e0-43fa-4f90-9aea-f20205f2b3be-clothing-mockups12.png",
  },
  {
    id: "hoodie",
    completefulProductId: "2f195507-5f6b-4992-8018-b34de51e3ea8",
    title: "Sponge Fleece Full-Zip Hoodie",
    sourceName: "Unisex Sponge Fleece Full-Zip Hoodie Sweatshirt- Bella + Canvas 3739",
    sourceType: "DTG",
    variant: "Black / S",
    role: "Premium anchor",
    body: "A premium apparel anchor for higher-AOV bundles or limited capsule offers.",
    fulfillmentCostCents: 2850,
    proposedRetailCents: 6400,
    mediaKey: "completeful.hoodie",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/2f195507-5f6b-4992-8018-b34de51e3ea8/cover/bd8d7c16-d466-4d51-ae04-2ff02c5019be.png",
  },
  {
    id: "coffee-mug",
    completefulProductId: "5b3cf047-8af0-4bd8-9397-6cbae9d64490",
    title: "Ceramic Coffee Mug",
    sourceName: "Coffee Mug",
    sourceType: "SUBLIMATION",
    variant: "Ceramic",
    role: "Cart add-on",
    body: "Low fulfillment cost and familiar utility make this a clean post-product add-on.",
    fulfillmentCostCents: 450,
    proposedRetailCents: 1800,
    mediaKey: "completeful.coffee-mug",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-5b3cf047-8af0-4bd8-9397-6cbae9d64490/covers/a73acb88-1ab3-48d3-8fda-f4ad39740c5c-ceramic-mug-ai-center.jpg",
  },
  {
    id: "glass-coffee-can",
    completefulProductId: "ab6f79dd-51de-4c33-9148-9cfec81e3870",
    title: "16oz Glass Coffee Can",
    sourceName: "16oz Glass Coffee Can",
    sourceType: "UV",
    variant: "Clear",
    role: "Lifestyle upsell",
    body: "A visually distinctive drinkware add-on that photographs well beside apparel.",
    fulfillmentCostCents: 700,
    proposedRetailCents: 2400,
    mediaKey: "completeful.glass-coffee-can",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-ab6f79dd-51de-4c33-9148-9cfec81e3870/covers/b6e9432f-a08a-4092-83bb-97ccd92bf461-glass-can-w-bamboo-lid-center.jpg",
  },
  {
    id: "bamboo-sunglasses",
    completefulProductId: "af7b535b-bed4-4c1f-9db3-b09676091842",
    title: "Bamboo Frame Sunglasses",
    sourceName: "Bamboo Frame Sunglasses",
    sourceType: "ENGRAVING",
    variant: "Black",
    role: "Accessory cross-sell",
    body: "An easy visual cross-sell for summer, travel, outdoor, and lifestyle collections.",
    fulfillmentCostCents: 750,
    proposedRetailCents: 2400,
    mediaKey: "completeful.bamboo-sunglasses",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-af7b535b-bed4-4c1f-9db3-b09676091842/covers/3bad2a79-f988-48ec-be78-d1e45fbb6d44-sunglasses-ai-center.jpg",
  },
  {
    id: "luggage-tag",
    completefulProductId: "0687f9d6-b826-47e3-adbf-84c331f365d6",
    title: "Aluminum Luggage Tag",
    sourceName: "Aluminum Luggage Tags",
    sourceType: "ETCHING",
    variant: "Black",
    role: "Low-friction upsell",
    body: "Small personalized add-on with a low fulfillment baseline and clear travel story.",
    fulfillmentCostCents: 400,
    proposedRetailCents: 1600,
    mediaKey: "completeful.luggage-tag",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-0687f9d6-b826-47e3-adbf-84c331f365d6/covers/7b11e02b-a694-4028-aea4-1b0df43fa621-luggage-tag-ai-center.jpg",
  },
  {
    id: "pet-tag",
    completefulProductId: "aaaa06e9-fc31-4edb-81cf-6353d9bd58f0",
    title: "Circle Pet Tag",
    sourceName: "Circle Pet Tag",
    sourceType: "ETCHING",
    variant: "Gold 25mm",
    role: "Personalization add-on",
    body: "A tiny personalized SKU that can attach naturally to pet-oriented collections.",
    fulfillmentCostCents: 350,
    proposedRetailCents: 1400,
    mediaKey: "completeful.pet-tag",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-aaaa06e9-fc31-4edb-81cf-6353d9bd58f0/covers/6eb5a540-8ab5-4615-89f8-4d310e8f511a-pet-tag-silver-black-rock-center.png",
  },
  {
    id: "pet-feeder",
    completefulProductId: "8b94108b-120e-462c-b77f-ccdc3cbb96ef",
    title: "Bamboo Pet Bowl Feeder",
    sourceName: "Bamboo Pet Bowl Feeders",
    sourceType: "ENGRAVING",
    variant: "Small Pet Feeder",
    role: "Giftable anchor",
    body: "A personalized home/pet anchor that pairs with the low-cost tag for a complete offer.",
    fulfillmentCostCents: 1500,
    proposedRetailCents: 3400,
    mediaKey: "completeful.pet-feeder",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-8b94108b-120e-462c-b77f-ccdc3cbb96ef/covers/bc878d33-f0b6-4863-9f54-369140515c6f-pet-bowl-ai-center.jpg",
  },
  {
    id: "bookmark",
    completefulProductId: "80cd9ddf-d034-49b4-b76c-c2b21f14b4f4",
    title: "Acrylic Bookmark",
    sourceName: "Acrylic Bookmark with Tassel",
    sourceType: "UV",
    variant: "Black",
    role: "Checkout add-on",
    body: "A compact low-cost add-on for editorial, book, education, or gift-driven stores.",
    fulfillmentCostCents: 400,
    proposedRetailCents: 1400,
    mediaKey: "completeful.bookmark",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-80cd9ddf-d034-49b4-b76c-c2b21f14b4f4/covers/52f8c725-f977-4cae-8b2f-a0a93984f8f3-bookmark-ai-center.jpg",
  },
  {
    id: "framed-decor",
    completefulProductId: "fcc6321b-96c7-4052-8bd8-a695410357bd",
    title: "6×6 Wooden Framed Decor",
    sourceName: "1:1 Wooden Framed Decor",
    sourceType: "UV",
    variant: "(6X6) Walnut",
    role: "Giftable add-on",
    body: "A small personalized decor piece that can raise AOV without competing with the hero SKU.",
    fulfillmentCostCents: 651,
    proposedRetailCents: 2400,
    mediaKey: "completeful.framed-decor",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-fcc6321b-96c7-4052-8bd8-a695410357bd/covers/f9747f5b-dca7-43ba-9cde-2221def0d429-framed-sign-ai-1.jpg",
  },
  {
    id: "stainless-tumbler",
    completefulProductId: "0dc6cade-4e94-4d30-89c7-c489e136ce1d",
    title: "16oz Stainless Tumbler",
    sourceName: "16 oz Tumbler - Stainless",
    sourceType: "ETCHING",
    variant: "Black",
    role: "Premium add-on",
    body: "A durable mid-ticket drinkware option for bundle step-ups.",
    fulfillmentCostCents: 1150,
    proposedRetailCents: 2800,
    mediaKey: "completeful.stainless-tumbler",
    mediaUrl: "https://jvkydnvdajcfnqysmuwt.supabase.co/storage/v1/object/public/product-images/product-0dc6cade-4e94-4d30-89c7-c489e136ce1d/covers/6f067017-f442-42fd-b1ac-c9e65407923b-16oz-tumblers-white-center.png",
  },
];

export const completefulDemoOffers: CompletefulDemoOffer[] = [
  {
    id: "launch-kit",
    badge: "Starter bundle",
    title: "Launch Kit",
    body: "One hero apparel item plus two easy lifestyle add-ons. A clean default bundle for a new drop.",
    productIds: ["heavyweight-tee", "glass-coffee-can", "luggage-tag"],
    compareAtCents: 7200,
    offerPriceCents: 5800,
    fulfillmentCostCents: 2200,
    ctaLabel: "Add launch kit",
  },
  {
    id: "desk-drop",
    badge: "High attach potential",
    title: "Desk Drop",
    body: "A low-cost gift trio that demonstrates cross-category bundling without requiring apparel sizing.",
    productIds: ["coffee-mug", "bookmark", "framed-decor"],
    compareAtCents: 5600,
    offerPriceCents: 4400,
    fulfillmentCostCents: 1501,
    ctaLabel: "Add desk drop",
  },
  {
    id: "weekend-carry",
    badge: "AOV step-up",
    title: "Weekend Carry",
    body: "Seasonal apparel with two practical accessories, built to demonstrate a higher-value cross-sell.",
    productIds: ["long-sleeve", "bamboo-sunglasses", "stainless-tumbler"],
    compareAtCents: 9000,
    offerPriceCents: 7200,
    fulfillmentCostCents: 3200,
    ctaLabel: "Add weekend carry",
  },
  {
    id: "pet-personalization",
    badge: "Personalized pair",
    title: "Pet Personalization",
    body: "A giftable anchor plus a tiny personalized add-on — useful for demonstrating conditional upsells.",
    productIds: ["pet-feeder", "pet-tag"],
    compareAtCents: 4800,
    offerPriceCents: 4200,
    fulfillmentCostCents: 1850,
    ctaLabel: "Add pet pair",
  },
];

export const completefulMedia = new Map(
  completefulDemoProducts.map((product) => [product.mediaKey, product.mediaUrl]),
);

export const completefulCommerceSectionData = {
  anchor: "merch-lab",
  currency: "USD",
  eyebrow: "Merchandising lab / live catalog source",
  heading: "Product ideas that can actually become offers.",
  body: "These normalized demo records come from the current Fuel & Free Time Completeful catalog mirror. Fulfillment is sourced from the mirror; retail and bundle prices are proposed demo pricing so the page can demonstrate attach-rate, savings, and margin-aware merchandising.",
  sourceNote: "Source snapshot: F&FT Completeful mirror · available + marketplace-eligible products · 2026-10-02. Proposed retail and bundle prices are illustrative, not provider pricing. Estimated gross margin uses mirrored fulfillment cost only and excludes shipping, payment fees, tax, discounts, and returns.",
  showEconomics: true,
  products: completefulDemoProducts.map((product) => ({
    id: product.id,
    title: product.title,
    sourceLabel: product.sourceType + " · " + product.sourceName,
    role: product.role,
    body: product.body,
    mediaKey: product.mediaKey,
    mediaAlt: product.title,
    fulfillmentCostCents: product.fulfillmentCostCents,
    proposedRetailCents: product.proposedRetailCents,
  })),
  offers: completefulDemoOffers,
};
