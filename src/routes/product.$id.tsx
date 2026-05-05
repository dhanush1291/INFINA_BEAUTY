import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Share2, ChevronRight } from "lucide-react";
import { getProduct, getRelated } from "@/data/products";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWishlist, useMounted } from "@/lib/wishlist";
import { AffiliateRedirect } from "@/components/AffiliateRedirect";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) return { meta: [{ title: "Product — Sai" }] };
    return {
      meta: [
        { title: `${p.name} — ${p.brand} — Sai` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — ${p.brand}` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.images[0] },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Product not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  if (!product) throw notFound();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [redirect, setRedirect] = useState(false);
  const { has, toggle } = useWishlist();
  const mounted = useMounted();
  const isWish = mounted && has(product.id);
  const related = getRelated(product, 4);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop/$category" params={{ category: product.category }} className="hover:text-foreground capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded border-2 ${i === activeImg ? "border-primary" : "border-transparent"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
          <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
          <Stars rating={product.rating} count={product.reviewCount} />
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <p className="text-base text-muted-foreground">{product.description}</p>

          {product.colors && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide">
                Color {color && <span className="text-muted-foreground">({color})</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={`h-10 w-10 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-md border px-3 py-2 text-sm ${size === s ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="lg" className="flex-1" onClick={() => setRedirect(true)}>
              Shop Now
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggle(product.id)} aria-label="Wishlist">
              <Heart className={`h-5 w-5 ${isWish ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button variant="outline" size="lg" onClick={share} aria-label="Share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="info">{product.category === "dresses" ? "Size guide" : "Ingredients"}</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-sm text-muted-foreground">
              {product.details ?? product.description}
            </TabsContent>
            <TabsContent value="info" className="text-sm text-muted-foreground">
              {product.category === "dresses"
                ? "Refer to the partner site for the most accurate size guide. Models typically wear size S unless otherwise noted."
                : "Full ingredient lists are available on the partner product page."}
            </TabsContent>
            <TabsContent value="reviews" className="text-sm text-muted-foreground">
              <div className="space-y-4">
                {[
                  { name: "Mia R.", rating: 5, text: "Absolutely beautiful — even better in person." },
                  { name: "Aisha T.", rating: 4, text: "Great quality, runs slightly small." },
                  { name: "Sofia L.", rating: 5, text: "My new favourite. Fast shipping from the partner." },
                ].map((r) => (
                  <div key={r.name} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{r.name}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <p className="mt-2">{r.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-2xl md:text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <AffiliateRedirect
        open={redirect}
        onOpenChange={setRedirect}
        url={product.affiliateUrl}
        partnerName={product.partnerName}
        productName={product.name}
      />
    </div>
  );
}
