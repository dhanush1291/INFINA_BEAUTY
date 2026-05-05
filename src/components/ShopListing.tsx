import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { products as allProducts, type Product, allBrands } from "@/data/products";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

interface Crumb { label: string; to?: string }

interface Props {
  title: string;
  description?: string;
  crumbs: Crumb[];
  source: Product[];
}

export function ShopListing({ title, description, crumbs, source }: Props) {
  const maxPrice = useMemo(() => Math.max(200, ...source.map((p) => p.price)), [source]);
  const [price, setPrice] = useState<[number, number]>([0, maxPrice]);
  const [brands, setBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("featured");
  const [visible, setVisible] = useState(12);

  const filtered = useMemo(() => {
    let r = source.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (brands.length) r = r.filter((p) => brands.includes(p.brand));
    if (minRating) r = r.filter((p) => p.rating >= minRating);
    switch (sort) {
      case "price-asc": r = [...r].sort((a, b) => a.price - b.price); break;
      case "price-desc": r = [...r].sort((a, b) => b.price - a.price); break;
      case "rating": r = [...r].sort((a, b) => b.rating - a.rating); break;
      case "newest": r = [...r].sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival)); break;
    }
    return r;
  }, [source, price, brands, minRating, sort]);

  const brandsInScope = useMemo(
    () => allBrands.filter((b) => source.some((p) => p.brand === b)),
    [source],
  );

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Price</h3>
        <Slider
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          min={0}
          max={maxPrice}
          step={5}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${price[0]}</span>
          <span>${price[1]}</span>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Brand</h3>
        <div className="space-y-2">
          {brandsInScope.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={brands.includes(b)}
                onCheckedChange={(v) =>
                  setBrands((prev) => (v ? [...prev, b] : prev.filter((x) => x !== b)))
                }
              />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 0].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="accent-primary"
              />
              {r === 0 ? "All ratings" : `${r}+ stars`}
            </label>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setPrice([0, maxPrice]);
          setBrands([]);
          setMinRating(0);
        }}
      >
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-20 lg:px-8">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {c.to ? (
              <Link to={c.to} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-6 mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {description ? ` · ${description}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetTitle className="mb-6">Filters</SheetTitle>
              {Filters}
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed py-16 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-12 text-center">
                  <Button variant="outline" onClick={() => setVisible((v) => v + 12)}>
                    Load more
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Showing {Math.min(visible, filtered.length)} of {filtered.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
