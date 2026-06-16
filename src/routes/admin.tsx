import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
    Plus, Pencil, Trash2, Save, X, Upload, Link as LinkIcon,
    Package, Image, RotateCcw, Search, Eye, EyeOff,
} from "lucide-react";
import {
    getProductsFromDb,
    saveProductToDb,
    deleteProductFromDb,
    resetProductsInDb,
    defaultProducts,
    PRODUCT_CATEGORIES,
    ALL_SUBCATEGORIES,
    type Product,
    type ProductCategory
} from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
    component: AdminPage,
    head: () => ({
        meta: [
            { title: "Admin Panel — INFINA" },
            { name: "description", content: "Manage your cosmetics products — add, edit, and delete products with images, names, and affiliate links." },
        ],
    }),
});

// Generate a unique id
function generateId() {
    return `p${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// Empty product template
function emptyProduct(): Product {
    return {
        id: generateId(),
        name: "",
        brand: "",
        category: "skincare",
        subcategory: "face-wash",
        price: 0,
        images: [],
        rating: 4.5,
        reviewCount: 0,
        description: "",
        affiliateUrl: "",
        partnerName: "",
        trending: false,
        newArrival: false,
    };
}

function AdminPage() {
    const [items, setItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSub, setFilterSub] = useState("all");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [imageInput, setImageInput] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    // Fetch from Firebase on mount
    useEffect(() => {
        async function load() {
            try {
                const fetched = await getProductsFromDb();
                setItems(fetched);
            } catch (error) {
                toast.error("Failed to load products.");
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    const filtered = items.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSub = filterSub === "all" || p.subcategory === filterSub;
        return matchesSearch && matchesSub;
    });

    async function handleSave(updated: Product) {
        setIsSaving(true);
        try {
            await saveProductToDb(updated);

            let newItems: Product[];
            if (isNew) {
                newItems = [...items, updated];
            } else {
                newItems = items.map((p) => (p.id === updated.id ? updated : p));
            }
            setItems(newItems);
            setEditingProduct(null);
            setIsNew(false);
            toast.success(isNew ? "Product added to Firebase!" : "Product updated in Firebase!");
        } catch (error) {
            toast.error("Failed to save product.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProductFromDb(id);
            const newItems = items.filter((p) => p.id !== id);
            setItems(newItems);
            toast.success("Product deleted from Firebase.");
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    }

    async function handleReset() {
        if (!confirm("This will reset ALL products to defaults in Firebase. Continue?")) return;

        setIsLoading(true);
        try {
            await resetProductsInDb();
            setItems([...defaultProducts]);
            setEditingProduct(null);
            setIsNew(false);
            toast.success("Products reset to defaults in Firebase.");
        } catch (error) {
            toast.error("Failed to reset products.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleAddNew() {
        const newProd = emptyProduct();
        setEditingProduct(newProd);
        setIsNew(true);
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || !editingProduct) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setEditingProduct({
                ...editingProduct,
                images: [...editingProduct.images, dataUrl],
            });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    }

    function addImageUrl() {
        if (!imageInput.trim() || !editingProduct) return;
        setEditingProduct({
            ...editingProduct,
            images: [...editingProduct.images, imageInput.trim()],
        });
        setImageInput("");
    }

    function removeImage(idx: number) {
        if (!editingProduct) return;
        setEditingProduct({
            ...editingProduct,
            images: editingProduct.images.filter((_, i) => i !== idx),
        });
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <div className="border-b bg-gradient-hero">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Admin Panel</p>
                            <h1 className="mt-2 font-serif text-4xl md:text-5xl">Product Manager</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Add, edit, or remove cosmetics products. Changes are saved to Firebase.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddNew} className="gap-2">
                                <Plus className="h-4 w-4" /> Add Product
                            </Button>
                            <Button variant="outline" onClick={handleReset} className="gap-2">
                                <RotateCcw className="h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={filterSub}
                        onChange={(e) => setFilterSub(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="all">All Categories</option>
                        {PRODUCT_CATEGORIES.map((cat) => (
                            <optgroup key={cat.slug} label={cat.label}>
                                {cat.subcategories.map((s) => (
                                    <option key={s.slug} value={s.slug}>{s.label}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                {/* Stats bar */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                        { label: "Total Products", value: items.length, color: "bg-primary/10 text-primary" },
                        { label: "On Sale", value: items.filter((p) => !!p.originalPrice).length, color: "bg-rose-100 text-rose-700" },
                        { label: "New Arrivals", value: items.filter((p) => p.newArrival).length, color: "bg-emerald-100 text-emerald-700" },
                        { label: "Trending", value: items.filter((p) => p.trending).length, color: "bg-amber-100 text-amber-700" },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border bg-background p-4 shadow-sm">
                            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                            <p className={`mt-1 text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Product List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                        <p className="mt-4 text-muted-foreground">Syncing with Firebase...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-16 text-center">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
                        <p className="mt-4 text-muted-foreground">No products found.</p>
                        <Button className="mt-4" onClick={handleAddNew}>
                            <Plus className="mr-2 h-4 w-4" /> Add your first product
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((p) => (
                            <div
                                key={p.id}
                                className="group flex items-center gap-4 rounded-xl border bg-background p-4 transition-all hover:shadow-md"
                            >
                                {/* Thumbnail */}
                                <div className="h-16 w-16 flex-none overflow-hidden rounded-lg bg-muted">
                                    {p.images[0] ? (
                                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Image className="h-6 w-6 text-muted-foreground/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                                        {p.badges?.map((b) => (
                                            <span
                                                key={b}
                                                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${b === "SALE" ? "bg-primary/10 text-primary" :
                                                    b === "NEW" ? "bg-foreground/10 text-foreground" :
                                                        "bg-secondary text-secondary-foreground"
                                                    }`}
                                            >
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{p.brand} · {p.subcategory}</p>
                                    <div className="mt-1 flex items-center gap-3 text-xs">
                                        <span className="font-semibold">₹{p.price}</span>
                                        {p.originalPrice && (
                                            <span className="text-muted-foreground line-through">₹{p.originalPrice}</span>
                                        )}
                                        {p.affiliateUrl && (
                                            <span className="flex items-center gap-1 text-primary">
                                                <LinkIcon className="h-3 w-3" /> Link set
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => { setEditingProduct({ ...p }); setIsNew(false); }}
                                        aria-label="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(p.id)}
                                        aria-label="Delete"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-6 pb-6 md:pt-10">
                    <div className="w-full max-w-2xl rounded-2xl border bg-background shadow-elegant animate-fade-in flex flex-col" style={{ maxHeight: 'calc(100vh - 3rem)' }}>
                        <div className="flex items-center justify-between p-6 pb-4 border-b flex-none">
                            <h2 className="font-serif text-2xl">{isNew ? "Add Product" : "Edit Product"}</h2>
                            <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(null); setIsNew(false); }}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="space-y-5 overflow-y-auto p-6 pt-4">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Product Name *</label>
                                <Input
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    placeholder="e.g. Velvet Matte Lipstick"
                                />
                            </div>

                            {/* Brand + Partner */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Brand *</label>
                                    <Input
                                        value={editingProduct.brand}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                        placeholder="e.g. INFINA Beauty"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Partner Name</label>
                                    <Input
                                        value={editingProduct.partnerName}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, partnerName: e.target.value })}
                                        placeholder="e.g. INFINA Beauty"
                                    />
                                </div>
                            </div>

                            {/* Category + Subcategory */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Category *</label>
                                    <select
                                        value={editingProduct.category}
                                        onChange={(e) => {
                                            const newCat = e.target.value as ProductCategory;
                                            const catInfo = PRODUCT_CATEGORIES.find(c => c.slug === newCat);
                                            setEditingProduct({
                                                ...editingProduct,
                                                category: newCat,
                                                subcategory: catInfo?.subcategories[0]?.slug ?? "",
                                            });
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {PRODUCT_CATEGORIES.map((cat) => (
                                            <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Subcategory *</label>
                                    <select
                                        value={editingProduct.subcategory}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {PRODUCT_CATEGORIES.find(c => c.slug === editingProduct.category)?.subcategories.map((s) => (
                                            <option key={s.slug} value={s.slug}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Price (₹) *</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editingProduct.price || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                        placeholder="24.00"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Original Price (₹)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editingProduct.originalPrice || ""}
                                        onChange={(e) => setEditingProduct({
                                            ...editingProduct,
                                            originalPrice: e.target.value ? Number(e.target.value) : undefined,
                                        })}
                                        placeholder="32.00 (leave empty if no sale)"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Description *</label>
                                <textarea
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="A short product description..."
                                />
                            </div>

                            {/* Affiliate URL */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                                    <LinkIcon className="h-3 w-3" /> Affiliate Link *
                                </label>
                                <Input
                                    value={editingProduct.affiliateUrl}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, affiliateUrl: e.target.value })}
                                    placeholder="https://partner-store.com/product/..."
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                                    <Image className="h-3 w-3" /> Product Images
                                </label>
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {editingProduct.images.map((src, idx) => (
                                        <div key={idx} className="group relative h-20 w-20 overflow-hidden rounded-lg border">
                                            <img src={src} alt="" className="h-full w-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {editingProduct.images.length === 0 && (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                                            <Image className="h-6 w-6 text-muted-foreground/40" />
                                        </div>
                                    )}
                                </div>
                                {/* Image URL input */}
                                <div className="flex gap-2">
                                    <Input
                                        value={imageInput}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        placeholder="Paste image URL..."
                                        className="flex-1"
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
                                    />
                                    <Button variant="outline" size="sm" onClick={addImageUrl}>
                                        Add URL
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <Upload className="mr-1 h-3 w-3" /> Upload
                                    </Button>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>

                            {/* Flags */}
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={!!editingProduct.trending}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, trending: e.target.checked })}
                                        className="accent-primary"
                                    />
                                    Trending
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={!!editingProduct.newArrival}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                                        className="accent-primary"
                                    />
                                    New Arrival
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.badges?.includes("BESTSELLER") || false}
                                        onChange={(e) => {
                                            const badges: ("NEW" | "SALE" | "BESTSELLER")[] = editingProduct.badges?.filter((b) => b !== "BESTSELLER") ?? [];
                                            if (e.target.checked) badges.push("BESTSELLER");
                                            setEditingProduct({ ...editingProduct, badges: badges.length ? badges : undefined });
                                        }}
                                        className="accent-primary"
                                    />
                                    Bestseller
                                </label>
                            </div>

                            {/* Rating */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Rating (0-5)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={editingProduct.rating}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">Review Count</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={editingProduct.reviewCount}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, reviewCount: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            {/* Save/Cancel */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => { setEditingProduct(null); setIsNew(false); }}>
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isSaving}
                                    onClick={() => {
                                        if (!editingProduct.name.trim()) return toast.error("Product name is required.");
                                        if (!editingProduct.brand.trim()) return toast.error("Brand is required.");
                                        if (!editingProduct.price) return toast.error("Price is required.");
                                        if (!editingProduct.description.trim()) return toast.error("Description is required.");
                                        if (!editingProduct.affiliateUrl.trim()) return toast.error("Affiliate link is required.");
                                        // Set sale badge automatically
                                        const badges: ("NEW" | "SALE" | "BESTSELLER")[] = editingProduct.badges?.filter((b) => b !== "SALE" && b !== "NEW") ?? [];
                                        if (editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price) badges.push("SALE");
                                        if (editingProduct.newArrival) badges.push("NEW");
                                        handleSave({ ...editingProduct, badges: badges.length ? badges : undefined });
                                    }}
                                    className="gap-2"
                                >
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {isNew ? "Add Product" : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
