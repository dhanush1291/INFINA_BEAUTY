import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  writeBatch,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ProductCategory = "cosmetics";

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

export const COSMETIC_SUBCATEGORIES = [
  { slug: "lipsticks", label: "Lipsticks & Lip Gloss" },
  { slug: "eyeshadow", label: "Eyeshadow Palettes" },
  { slug: "foundation", label: "Foundation & Concealer" },
  { slug: "blush", label: "Blush & Highlighter" },
  { slug: "skincare", label: "Skincare" },
  { slug: "tools", label: "Makeup Tools" },
] as const;

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

export const defaultProducts: Product[] = [
  // COSMETICS — lipsticks
  {
    id: nid(), name: "Velvet Matte Lipstick", brand: "INFINA Beauty", category: "cosmetics",
    subcategory: "lipsticks", price: 24, originalPrice: 32,
    images: [u(C[1]), u(C[0])], rating: 4.8, reviewCount: 1203,
    colors: ["#a23b3b", "#7a1f2b", "#c97a7a", "#5a1a1a"],
    description: "Long-wear matte lipstick that feels like silk.",
    details: "Vegan. Cruelty-free. 8 hour wear.",
    affiliateUrl: "https://example.com/partner/matte-lipstick", partnerName: "INFINA Beauty",
    badges: ["BESTSELLER", "SALE"], trending: true,
  },
  {
    id: nid(), name: "High-Shine Lip Gloss", brand: "INFINA Beauty", category: "cosmetics",
    subcategory: "lipsticks", price: 18,
    images: [u(C[2]), u(C[1])], rating: 4.6, reviewCount: 842,
    colors: ["#e8b8b0", "#d4847f", "#c0635c"],
    description: "Non-sticky, mirror-finish gloss with hyaluronic acid.",
    affiliateUrl: "https://example.com/partner/lip-gloss", partnerName: "INFINA Beauty",
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
    id: nid(), name: "Cream Blush Stick", brand: "INFINA Beauty", category: "cosmetics",
    subcategory: "blush", price: 26,
    images: [u(C[7]), u(C[8])], rating: 4.6, reviewCount: 612,
    colors: ["#e8a3a3", "#c97070", "#d4847f"],
    description: "A dewy flush that melts into skin.",
    affiliateUrl: "https://example.com/partner/cream-blush", partnerName: "INFINA Beauty",
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
    id: nid(), name: "Vegan Brush Set (12pc)", brand: "INFINA Beauty", category: "cosmetics",
    subcategory: "tools", price: 78, originalPrice: 110,
    images: [u(C[11]), u(C[0])], rating: 4.7, reviewCount: 256,
    description: "12 essential brushes with rose-gold ferrules.",
    affiliateUrl: "https://example.com/partner/brush-set", partnerName: "INFINA Beauty",
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

// ─── Firebase Firestore backed product store ─────────────────────────────────
const COLLECTION_NAME = "products";
const STORAGE_KEY = "infina_products_cache";

/**
 * Fetches products from Firestore.
 * If Firestore is empty, it populates it with defaultProducts.
 */
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No products in Firestore. Initializing with defaults...");
      await initializeDbWithDefaults();
      return defaultProducts;
    }

    const fetchedProducts = querySnapshot.docs.map(doc => doc.data() as Product);

    // Update local cache
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedProducts));
    }

    // Update in-memory reference
    products.length = 0;
    products.push(...fetchedProducts);

    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Fallback to local cache or defaults
    return loadProductsFromCache();
  }
}

async function initializeDbWithDefaults() {
  const batch = writeBatch(db);
  defaultProducts.forEach((p) => {
    const docRef = doc(db, COLLECTION_NAME, p.id);
    batch.set(docRef, p);
  });
  await batch.commit();
}

export async function saveProductToDb(product: Product) {
  try {
    await setDoc(doc(db, COLLECTION_NAME, product.id), product);
    // Update local list
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    updateCache(products);
  } catch (error) {
    console.error("Error saving product to Firestore:", error);
    throw error;
  }
}

export async function deleteProductFromDb(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    // Update local list
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products.splice(index, 1);
      updateCache(products);
    }
  } catch (error) {
    console.error("Error deleting product from Firestore:", error);
    throw error;
  }
}

export async function resetProductsInDb() {
  try {
    // Delete all first (simplified, for better ways use a cloud function)
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Re-initialize
    await initializeDbWithDefaults();

    products.length = 0;
    products.push(...defaultProducts);
    updateCache(products);
  } catch (error) {
    console.error("Error resetting products in Firestore:", error);
    throw error;
  }
}

// ─── Cache Helpers ──────────────────────────────────────────────────────────

function loadProductsFromCache(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { }
  return defaultProducts;
}

function updateCache(ps: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ps));
}

// Legacy exports for compatibility (will be updated over time)
export const products: Product[] = loadProductsFromCache();

export const allBrands = Array.from(new Set(products.map(p => p.brand))).sort();

export const getProduct = (id: string) => products.find(p => p.id === id);
export const getRelated = (p: Product, n = 4) =>
  products.filter(x => x.id !== p.id && x.subcategory === p.subcategory).slice(0, n);

export const subcategoryLabel = (slug: string) => {
  return COSMETIC_SUBCATEGORIES.find(s => s.slug === slug)?.label ?? slug;
};

// These legacy functions now just call the DB ones (simplified)
export function saveProducts(ps: Product[]) {
  // In a real app, you'd handle batches or individual updates
  console.warn("saveProducts is legacy. Use saveProductToDb instead.");
}

export function resetProducts() {
  console.warn("resetProducts is legacy. Use resetProductsInDb instead.");
}
