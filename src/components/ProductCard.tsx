import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useWishlist, useMounted } from "@/lib/wishlist";
import { Stars } from "./Stars";
import { Button } from "./ui/button";
import { QuickView } from "./QuickView";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const mounted = useMounted();
  const [quick, setQuick] = useState(false);
  const isWish = mounted && has(product.id);
  const onSale = !!product.originalPrice;
  const img1 = product.images[0];
  const img2 = product.images[1] ?? product.images[0];

  return (
    <>
      <div className="group relative floating-card shadow-soft hover:shadow-antigravity bg-card rounded-2xl border border-border/40 p-3 flex flex-col justify-between h-full">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full">
              <img
                src={img1}
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0"
              />
              <img
                src={img2}
                alt=""
                loading="lazy"
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            </Link>

            {/* Minimal Wishlist */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 shadow-sm"
            >
              <Heart className={`h-4 w-4 ${isWish ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>

            {/* Clean Quick view */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Button
                variant="secondary"
                className="w-full h-11 border-t bg-background/95 backdrop-blur-md uppercase text-[10px] tracking-widest hover:bg-primary hover:text-primary-foreground transition-all rounded-none font-medium"
                onClick={() => setQuick(true)}
              >
                Shop Now
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center text-center px-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              {product.brand}
            </p>
            <Link to="/product/$id" params={{ id: product.id }} className="block mt-1.5">
              <h3 className="text-sm font-medium tracking-tight text-foreground/80 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
            </Link>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
              {onSale && (
                <span className="text-xs text-muted-foreground line-through opacity-60">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating - very small and subtle */}
        <div className="mt-3 flex justify-center opacity-70 scale-90">
          <Stars rating={product.rating} count={product.reviewCount} />
        </div>
      </div>

      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </>
  );
}
