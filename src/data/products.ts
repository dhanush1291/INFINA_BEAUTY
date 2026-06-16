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

export type ProductCategory =
  | "skincare"
  | "makeup"
  | "hair-care"
  | "body-care"
  | "fragrances"
  | "nail-care"
  | "personal-care"
  | "mens-grooming"
  | "beauty-tools"
  | "natural-organic";

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

export interface SubCategory {
  slug: string;
  label: string;
}

export interface CategoryInfo {
  slug: ProductCategory;
  label: string;
  subcategories: SubCategory[];
}

export const PRODUCT_CATEGORIES: CategoryInfo[] = [
  {
    slug: "skincare",
    label: "Skincare",
    subcategories: [
      { slug: "face-wash", label: "Face Wash" },
      { slug: "moisturizer", label: "Moisturizer" },
      { slug: "sunscreen", label: "Sunscreen" },
      { slug: "serum", label: "Serum" },
      { slug: "toner", label: "Toner" },
      { slug: "face-masks", label: "Face Masks" },
    ]
  },
  {
    slug: "makeup",
    label: "Makeup",
    subcategories: [
      { slug: "foundation", label: "Foundation" },
      { slug: "concealer", label: "Concealer" },
      { slug: "compact-powder", label: "Compact Powder" },
      { slug: "lipstick", label: "Lipstick" },
      { slug: "mascara", label: "Mascara" },
      { slug: "eyeliner", label: "Eyeliner" },
      { slug: "blush", label: "Blush" },
    ]
  },
  {
    slug: "hair-care",
    label: "Hair Care",
    subcategories: [
      { slug: "shampoo", label: "Shampoo" },
      { slug: "conditioner", label: "Conditioner" },
      { slug: "hair-oil", label: "Hair Oil" },
      { slug: "hair-serum", label: "Hair Serum" },
      { slug: "hair-mask", label: "Hair Mask" },
      { slug: "hair-color", label: "Hair Color" },
    ]
  },
  {
    slug: "body-care",
    label: "Body Care",
    subcategories: [
      { slug: "body-wash", label: "Body Wash" },
      { slug: "body-lotion", label: "Body Lotion" },
      { slug: "body-scrub", label: "Body Scrub" },
      { slug: "hand-cream", label: "Hand Cream" },
      { slug: "foot-cream", label: "Foot Cream" },
    ]
  },
  {
    slug: "fragrances",
    label: "Fragrances",
    subcategories: [
      { slug: "perfumes", label: "Perfumes" },
      { slug: "deodorants", label: "Deodorants" },
      { slug: "body-mists", label: "Body Mists" },
    ]
  },
  {
    slug: "nail-care",
    label: "Nail Care",
    subcategories: [
      { slug: "nail-polish", label: "Nail Polish" },
      { slug: "nail-polish-remover", label: "Nail Polish Remover" },
      { slug: "cuticle-oil", label: "Cuticle Oil" },
    ]
  },
  {
    slug: "personal-care",
    label: "Personal Care",
    subcategories: [
      { slug: "soap", label: "Soap" },
      { slug: "toothpaste", label: "Toothpaste" },
      { slug: "mouthwash", label: "Mouthwash" },
      { slug: "feminine-hygiene", label: "Feminine Hygiene" },
    ]
  },
  {
    slug: "mens-grooming",
    label: "Men's Grooming",
    subcategories: [
      { slug: "beard-oil", label: "Beard Oil" },
      { slug: "shaving-cream", label: "Shaving Cream" },
      { slug: "aftershave", label: "Aftershave" },
      { slug: "hair-styling", label: "Hair Styling" },
    ]
  },
  {
    slug: "beauty-tools",
    label: "Beauty Tools & Accessories",
    subcategories: [
      { slug: "makeup-brushes", label: "Makeup Brushes" },
      { slug: "beauty-blenders", label: "Beauty Blenders" },
      { slug: "hair-dryers", label: "Hair Dryers" },
      { slug: "curling-irons", label: "Curling Irons" },
      { slug: "face-rollers", label: "Face Rollers" },
    ]
  },
  {
    slug: "natural-organic",
    label: "Natural & Organic Beauty",
    subcategories: [
      { slug: "herbal-skincare", label: "Herbal Skincare" },
      { slug: "organic-makeup", label: "Organic Makeup" },
      { slug: "essential-oils", label: "Essential Oils" },
    ]
  }
];

// For backward compatibility and easy lookup
export const ALL_SUBCATEGORIES = PRODUCT_CATEGORIES.flatMap(c => c.subcategories);
export const COSMETIC_SUBCATEGORIES = ALL_SUBCATEGORIES; // Alias for now

export const subcategoryLabel = (slug: string) => {
  return ALL_SUBCATEGORIES.find(s => s.slug === slug)?.label ?? slug;
};

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
  // SKINCARE
  {
    id: nid(), name: "Hydrating Rose Serum", brand: "Maison Roux", category: "skincare",
    subcategory: "serum", price: 68,
    images: [u(C[9]), u(C[10])], rating: 4.8, reviewCount: 720,
    description: "Damask rose + hyaluronic acid serum for plump, dewy skin.",
    details: "30ml. Vegan. Fragrance-free.",
    affiliateUrl: "https://example.com/partner/rose-serum", partnerName: "Maison Roux",
    badges: ["NEW", "BESTSELLER"], newArrival: true, trending: true,
  },
  {
    id: nid(), name: "Deep Cleanse Face Wash", brand: "Glow Atelier", category: "skincare",
    subcategory: "face-wash", price: 32,
    images: [u(C[5])], rating: 4.6, reviewCount: 540,
    description: "Gentle foaming cleanser with aloe vera and green tea.",
    affiliateUrl: "https://example.com/partner/face-wash", partnerName: "Glow Atelier",
  },

  // MAKEUP
  {
    id: nid(), name: "Velvet Matte Lipstick", brand: "INFINA Beauty", category: "makeup",
    subcategory: "lipstick", price: 24, originalPrice: 32,
    images: [u(C[1]), u(C[0])], rating: 4.8, reviewCount: 1203,
    colors: ["#a23b3b", "#7a1f2b", "#c97a7a", "#5a1a1a"],
    description: "Long-wear matte lipstick that feels like silk.",
    details: "Vegan. Cruelty-free. 8 hour wear.",
    affiliateUrl: "https://example.com/partner/matte-lipstick", partnerName: "INFINA Beauty",
    badges: ["BESTSELLER", "SALE"], trending: true,
  },
  {
    id: nid(), name: "Sunset Eyeshadow Palette", brand: "Lumière", category: "makeup",
    subcategory: "eyeshadow", price: 58,
    images: [u(C[3])], rating: 4.7, reviewCount: 567,
    description: "12 buttery shades inspired by golden hour.",
    affiliateUrl: "https://example.com/partner/sunset-palette", partnerName: "Lumière",
  },

  // HAIR CARE
  {
    id: nid(), name: "Argan Oil Shampoo", brand: "Silk & Soul", category: "hair-care",
    subcategory: "shampoo", price: 45,
    images: [u(C[11])], rating: 4.5, reviewCount: 310,
    description: "Nourishing shampoo for dry and damaged hair.",
    affiliateUrl: "https://example.com/partner/shampoo", partnerName: "Silk & Soul",
    newArrival: true,
  },

  // FRAGRANCES
  {
    id: nid(), name: "Midnight Jasmine Perfume", brand: "Aura", category: "fragrances",
    subcategory: "perfumes", price: 120,
    images: [u(C[8])], rating: 4.9, reviewCount: 156,
    description: "A mysterious and seductive floral fragrance.",
    affiliateUrl: "https://example.com/partner/perfume", partnerName: "Aura",
    badges: ["BESTSELLER"],
  },

  // MEN'S GROOMING
  {
    id: nid(), name: "Sandalwood Beard Oil", brand: "Gentleman's Choice", category: "mens-grooming",
    subcategory: "beard-oil", price: 28,
    images: [u(C[6])], rating: 4.7, reviewCount: 225,
    description: "Softens beard hair and hydrates the skin underneath.",
    affiliateUrl: "https://example.com/partner/beard-oil", partnerName: "Gentleman's Choice",
  },

  // BEAUTY TOOLS
  {
    id: nid(), name: "Professional Makeup Brush Set", brand: "INFINA Beauty", category: "beauty-tools",
    subcategory: "makeup-brushes", price: 85, originalPrice: 120,
    images: [u(C[11])], rating: 4.8, reviewCount: 412,
    description: "15-piece synthetic brush set for a flawless finish.",
    affiliateUrl: "https://example.com/partner/brush-set", partnerName: "INFINA Beauty",
    badges: ["SALE"],
  }
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

// These legacy functions now just call the DB ones (simplified)
export function saveProducts(ps: Product[]) {
  // In a real app, you'd handle batches or individual updates
  console.warn("saveProducts is legacy. Use saveProductToDb instead.");
}

export function resetProducts() {
  console.warn("resetProducts is legacy. Use resetProductsInDb instead.");
}
