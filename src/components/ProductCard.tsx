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
      <div className="group relative">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full">
            <img
              src={img1}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            <img
              src={img2}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </Link>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badges?.map((b) => (
              <span
                key={b}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  b === "SALE"
                    ? "bg-primary text-primary-foreground"
                    : b === "NEW"
                      ? "bg-foreground text-background"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
          >
            <Heart className={`h-4 w-4 ${isWish ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>

          {/* Quick view */}
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              className="w-full bg-background/95 backdrop-blur hover:bg-background"
              onClick={() => setQuick(true)}
            >
              Quick View
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <Link to="/product/$id" params={{ id: product.id }} className="block">
            <h3 className="text-sm font-medium leading-snug hover:text-primary">{product.name}</h3>
          </Link>
          <Stars rating={product.rating} count={product.reviewCount} />
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm font-semibold">${product.price}</span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>

      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </>
  );
}
