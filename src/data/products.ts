export type ProductCategory = "dresses" | "cosmetics";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  colors?: string[];
  sizes?: string[];
  description: string;
  details?: string;
  affiliateUrl: string;
  partnerName: string;
  badges?: ("NEW" | "SALE" | "BESTSELLER")[];
  trending?: boolean;
  newArrival?: boolean;
}

export const DRESS_SUBCATEGORIES = [
  { slug: "evening", label: "Evening Dresses" },
  { slug: "casual", label: "Casual Dresses" },
  { slug: "formal", label: "Formal Wear" },
  { slug: "party", label: "Party Dresses" },
  { slug: "maxi", label: "Maxi Dresses" },
  { slug: "mini", label: "Mini Dresses" },
] as const;

export const COSMETIC_SUBCATEGORIES = [
  { slug: "lipsticks", label: "Lipsticks & Lip Gloss" },
  { slug: "eyeshadow", label: "Eyeshadow Palettes" },
  { slug: "foundation", label: "Foundation & Concealer" },
  { slug: "blush", label: "Blush & Highlighter" },
  { slug: "skincare", label: "Skincare" },
  { slug: "tools", label: "Makeup Tools" },
] as const;

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=900&q=80&sat=-10&hue=${seed}`;

// Curated photo IDs from Unsplash (fashion + beauty editorial)
const D = [
  "1566174053879-31528523f8ae",
  "1539109136881-3be0616acf4b",
  "1572804013309-59a88b7e92f1",
  "1571513722275-4b41940f54b8",
  "1515886657613-9f3515b0c78f",
  "1469334031218-e382a71b716b",
  "1581044777550-4cfa60707c03",
  "1583846783214-7229a91b20ed",
  "1495121605193-b116b5b09a9c",
  "1496747611176-843222e1e57c",
  "1502716119720-b23a93e5fe1b",
  "1485968579580-b6d095142e6e",
];
const C = [
  "1522335789203-aaa83b4f4d11", // makeup flatlay
  "1599733589046-8a35aa39b3ac", // lipstick
  "1583241800698-9c7e4aa3a6b3",
  "1596462502278-27bfdc403348",
  "1620916566398-39f1143ab7be",
  "1571781926291-c477ebfd024b",
  "1515688594390-b649af70d282",
  "1487412947147-5cebf100ffc2",
  "1556228720-195a672e8a03",
  "1631730486572-226d1f595b68",
  "1610992015732-2449b76344bc",
  "1503236823255-94609f598e71",
];

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

let _id = 0;
const nid = () => `p${++_id}`;

export const products: Product[] = [
  // DRESSES — evening
  {
    id: nid(), name: "Silk Slip Midi Dress", brand: "Maison Roux", category: "dresses",
    subcategory: "evening", price: 189, originalPrice: 240,
    images: [u(D[0]), u(D[1])], rating: 4.7, reviewCount: 218,
    colors: ["#1a1a1a", "#c19a6b", "#8b1a3a"], sizes: ["XS","S","M","L","XL"],
    description: "Floor-skimming silk slip with delicate spaghetti straps and a bias-cut silhouette.",
    details: "100% mulberry silk. Dry clean only. Model wears size S.",
    affiliateUrl: "https://example.com/partner/silk-slip-midi", partnerName: "Maison Roux",
    badges: ["SALE"], trending: true,
  },
  {
    id: nid(), name: "Velvet Wrap Gown", brand: "Étoile", category: "dresses",
    subcategory: "evening", price: 320,
    images: [u(D[2]), u(D[3])], rating: 4.8, reviewCount: 142,
    colors: ["#3a0a2a", "#0f1a3a"], sizes: ["XS","S","M","L"],
    description: "A draped velvet gown that hugs in all the right places.",
    affiliateUrl: "https://example.com/partner/velvet-wrap", partnerName: "Étoile",
    badges: ["NEW"], newArrival: true, trending: true,
  },
  // casual
  {
    id: nid(), name: "Linen Tea Dress", brand: "Solène", category: "dresses",
    subcategory: "casual", price: 98,
    images: [u(D[4]), u(D[5])], rating: 4.5, reviewCount: 312,
    colors: ["#f5e6d3", "#e8b8b0"], sizes: ["XS","S","M","L","XL"],
    description: "Breathable linen with hand-finished buttons. Perfect for slow afternoons.",
    affiliateUrl: "https://example.com/partner/linen-tea", partnerName: "Solène",
    trending: true,
  },
  {
    id: nid(), name: "Cotton Poplin Sundress", brand: "Bloom & Co.", category: "dresses",
    subcategory: "casual", price: 72, originalPrice: 110,
    images: [u(D[6]), u(D[7])], rating: 4.4, reviewCount: 540,
    colors: ["#ffd9d4", "#d4e7d2"], sizes: ["XS","S","M","L"],
    description: "Tiered poplin with cinched waist — your new weekend uniform.",
    affiliateUrl: "https://example.com/partner/poplin-sun", partnerName: "Bloom & Co.",
    badges: ["SALE", "BESTSELLER"],
  },
  // formal
  {
    id: nid(), name: "Tailored Sheath Dress", brand: "Ivoire", category: "dresses",
    subcategory: "formal", price: 215,
    images: [u(D[8]), u(D[0])], rating: 4.6, reviewCount: 96,
    colors: ["#000000", "#2a2a40"], sizes: ["XS","S","M","L"],
    description: "Crisp wool-blend sheath with a hidden back zip — boardroom to dinner.",
    affiliateUrl: "https://example.com/partner/sheath", partnerName: "Ivoire",
  },
  // party
  {
    id: nid(), name: "Sequin Mini Dress", brand: "Glow Atelier", category: "dresses",
    subcategory: "party", price: 158, originalPrice: 220,
    images: [u(D[9]), u(D[10])], rating: 4.7, reviewCount: 401,
    colors: ["#d4af37", "#b76e79", "#1a1a1a"], sizes: ["XS","S","M","L"],
    description: "All-over sequins on a stretch base. Made for a night out.",
    affiliateUrl: "https://example.com/partner/sequin-mini", partnerName: "Glow Atelier",
    badges: ["SALE"], trending: true,
  },
  {
    id: nid(), name: "Satin Cowl-Neck Dress", brand: "Lune", category: "dresses",
    subcategory: "party", price: 134,
    images: [u(D[11]), u(D[2])], rating: 4.5, reviewCount: 188,
    colors: ["#b76e79", "#2a2a40", "#f5e6d3"], sizes: ["XS","S","M","L","XL"],
    description: "Liquid satin with a draped cowl neckline.",
    affiliateUrl: "https://example.com/partner/cowl-satin", partnerName: "Lune",
    badges: ["NEW"], newArrival: true,
  },
  // maxi
  {
    id: nid(), name: "Floral Maxi Dress", brand: "Solène", category: "dresses",
    subcategory: "maxi", price: 128,
    images: [u(D[3]), u(D[5])], rating: 4.6, reviewCount: 274,
    colors: ["#ffd9d4"], sizes: ["XS","S","M","L"],
    description: "Hand-painted floral print on flowing chiffon.",
    affiliateUrl: "https://example.com/partner/floral-maxi", partnerName: "Solène",
    newArrival: true,
  },
  {
    id: nid(), name: "Pleated Halter Maxi", brand: "Étoile", category: "dresses",
    subcategory: "maxi", price: 168,
    images: [u(D[6]), u(D[8])], rating: 4.7, reviewCount: 132,
    colors: ["#c19a6b", "#000000"], sizes: ["XS","S","M","L"],
    description: "Architectural pleats with an open back.",
    affiliateUrl: "https://example.com/partner/halter-maxi", partnerName: "Étoile",
  },
  // mini
  {
    id: nid(), name: "Tweed Mini Dress", brand: "Maison Roux", category: "dresses",
    subcategory: "mini", price: 145, originalPrice: 198,
    images: [u(D[7]), u(D[9])], rating: 4.4, reviewCount: 89,
    colors: ["#f5e6d3", "#ffd9d4"], sizes: ["XS","S","M","L"],
    description: "Classic tweed reimagined with a mini hemline and pearl buttons.",
    affiliateUrl: "https://example.com/partner/tweed-mini", partnerName: "Maison Roux",
    badges: ["SALE"],
  },
  {
    id: nid(), name: "Bodycon Knit Mini", brand: "Lune", category: "dresses",
    subcategory: "mini", price: 89,
    images: [u(D[10]), u(D[11])], rating: 4.3, reviewCount: 410,
    colors: ["#000000", "#b76e79", "#f5e6d3"], sizes: ["XS","S","M","L"],
    description: "Second-skin ribbed knit with long sleeves.",
    affiliateUrl: "https://example.com/partner/knit-mini", partnerName: "Lune",
    trending: true,
  },

  // COSMETICS — lipsticks
  {
    id: nid(), name: "Velvet Matte Lipstick", brand: "Sai Beauty", category: "cosmetics",
    subcategory: "lipsticks", price: 24, originalPrice: 32,
    images: [u(C[1]), u(C[0])], rating: 4.8, reviewCount: 1203,
    colors: ["#a23b3b", "#7a1f2b", "#c97a7a", "#5a1a1a"],
    description: "Long-wear matte lipstick that feels like silk.",
    details: "Vegan. Cruelty-free. 8 hour wear.",
    affiliateUrl: "https://example.com/partner/matte-lipstick", partnerName: "Sai Beauty",
    badges: ["BESTSELLER", "SALE"], trending: true,
  },
  {
    id: nid(), name: "High-Shine Lip Gloss", brand: "Sai Beauty", category: "cosmetics",
    subcategory: "lipsticks", price: 18,
    images: [u(C[2]), u(C[1])], rating: 4.6, reviewCount: 842,
    colors: ["#e8b8b0", "#d4847f", "#c0635c"],
    description: "Non-sticky, mirror-finish gloss with hyaluronic acid.",
    affiliateUrl: "https://example.com/partner/lip-gloss", partnerName: "Sai Beauty",
    badges: ["NEW"], newArrival: true, trending: true,
  },
  // eyeshadow
  {
    id: nid(), name: "Sunset Eyeshadow Palette", brand: "Lumière", category: "cosmetics",
    subcategory: "eyeshadow", price: 58,
    images: [u(C[3]), u(C[0])], rating: 4.7, reviewCount: 567,
    description: "12 buttery shades inspired by golden hour.",
    affiliateUrl: "https://example.com/partner/sunset-palette", partnerName: "Lumière",
    badges: ["BESTSELLER"], trending: true,
  },
  {
    id: nid(), name: "Nude Essentials Palette", brand: "Lumière", category: "cosmetics",
    subcategory: "eyeshadow", price: 48, originalPrice: 65,
    images: [u(C[4]), u(C[3])], rating: 4.6, reviewCount: 320,
    description: "Nine wearable neutrals from matte to shimmer.",
    affiliateUrl: "https://example.com/partner/nude-palette", partnerName: "Lumière",
    badges: ["SALE"],
  },
  // foundation
  {
    id: nid(), name: "Skin Tint Serum Foundation", brand: "Glow Atelier", category: "cosmetics",
    subcategory: "foundation", price: 42,
    images: [u(C[5]), u(C[4])], rating: 4.5, reviewCount: 980,
    description: "Lightweight, buildable coverage with skincare benefits.",
    affiliateUrl: "https://example.com/partner/skin-tint", partnerName: "Glow Atelier",
    newArrival: true,
  },
  {
    id: nid(), name: "Liquid Concealer", brand: "Glow Atelier", category: "cosmetics",
    subcategory: "foundation", price: 28,
    images: [u(C[6]), u(C[5])], rating: 4.7, reviewCount: 1450,
    description: "Crease-resistant under-eye coverage in 30 shades.",
    affiliateUrl: "https://example.com/partner/concealer", partnerName: "Glow Atelier",
    badges: ["BESTSELLER"], trending: true,
  },
  // blush
  {
    id: nid(), name: "Cream Blush Stick", brand: "Sai Beauty", category: "cosmetics",
    subcategory: "blush", price: 26,
    images: [u(C[7]), u(C[8])], rating: 4.6, reviewCount: 612,
    colors: ["#e8a3a3", "#c97070", "#d4847f"],
    description: "A dewy flush that melts into skin.",
    affiliateUrl: "https://example.com/partner/cream-blush", partnerName: "Sai Beauty",
    trending: true,
  },
  {
    id: nid(), name: "Liquid Highlighter", brand: "Lumière", category: "cosmetics",
    subcategory: "blush", price: 32, originalPrice: 42,
    images: [u(C[8]), u(C[7])], rating: 4.5, reviewCount: 388,
    colors: ["#f0d4a0", "#e8b8a0", "#d4a070"],
    description: "Liquid gold for an inner-glow finish.",
    affiliateUrl: "https://example.com/partner/highlighter", partnerName: "Lumière",
    badges: ["SALE"],
  },
  // skincare
  {
    id: nid(), name: "Hydrating Rose Serum", brand: "Maison Roux", category: "cosmetics",
    subcategory: "skincare", price: 68,
    images: [u(C[9]), u(C[10])], rating: 4.8, reviewCount: 720,
    description: "Damask rose + hyaluronic acid serum for plump, dewy skin.",
    details: "30ml. Vegan. Fragrance-free.",
    affiliateUrl: "https://example.com/partner/rose-serum", partnerName: "Maison Roux",
    badges: ["NEW", "BESTSELLER"], newArrival: true, trending: true,
  },
  {
    id: nid(), name: "Vitamin C Brightening Cream", brand: "Maison Roux", category: "cosmetics",
    subcategory: "skincare", price: 54,
    images: [u(C[10]), u(C[9])], rating: 4.6, reviewCount: 432,
    description: "10% vitamin C for an even, luminous tone.",
    affiliateUrl: "https://example.com/partner/vitamin-c", partnerName: "Maison Roux",
  },
  // tools
  {
    id: nid(), name: "Vegan Brush Set (12pc)", brand: "Sai Beauty", category: "cosmetics",
    subcategory: "tools", price: 78, originalPrice: 110,
    images: [u(C[11]), u(C[0])], rating: 4.7, reviewCount: 256,
    description: "12 essential brushes with rose-gold ferrules.",
    affiliateUrl: "https://example.com/partner/brush-set", partnerName: "Sai Beauty",
    badges: ["SALE"], newArrival: true,
  },
  {
    id: nid(), name: "Jade Roller & Gua Sha Set", brand: "Maison Roux", category: "cosmetics",
    subcategory: "tools", price: 38,
    images: [u(C[0]), u(C[11])], rating: 4.5, reviewCount: 612,
    description: "Authentic jade tools for facial massage and lymphatic drainage.",
    affiliateUrl: "https://example.com/partner/jade-set", partnerName: "Maison Roux",
  },
];

export const allBrands = Array.from(new Set(products.map(p => p.brand))).sort();

export const getProduct = (id: string) => products.find(p => p.id === id);
export const getRelated = (p: Product, n = 4) =>
  products.filter(x => x.id !== p.id && x.subcategory === p.subcategory).slice(0, n);

export const subcategoryLabel = (slug: string) => {
  const all = [...DRESS_SUBCATEGORIES, ...COSMETIC_SUBCATEGORIES];
  return all.find(s => s.slug === slug)?.label ?? slug;
};
