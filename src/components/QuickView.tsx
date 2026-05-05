import { Link } from "@tanstack/react-router";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useWishlist, useMounted } from "@/lib/wishlist";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Stars } from "./Stars";
import { AffiliateRedirect } from "./AffiliateRedirect";
import { toast } from "sonner";

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [redirect, setRedirect] = useState(false);
  const { has, toggle } = useWishlist();
  const mounted = useMounted();
  const isWish = mounted && has(product.id);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin + `/product/${product.id}` : "";
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {}
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="bg-muted">
              <div className="aspect-square relative">
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {product.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`h-14 w-14 overflow-hidden rounded border-2 ${i === activeImg ? "border-primary" : "border-transparent"}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 p-6 overflow-y-auto max-h-[90vh]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </p>
              <h2 className="font-serif text-2xl">{product.name}</h2>
              <Stars rating={product.rating} count={product.reviewCount} />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{product.description}</p>

              {product.colors && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        aria-label={`Color ${c}`}
                        className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`}
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
                        className={`min-w-12 rounded-md border px-3 py-1.5 text-sm ${size === s ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <Button className="flex-1" size="lg" onClick={() => setRedirect(true)}>
                  Shop Now
                </Button>
                <Button variant="outline" size="icon" aria-label="Wishlist" onClick={() => toggle(product.id)}>
                  <Heart className={`h-4 w-4 ${isWish ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share" onClick={share}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Link
                to="/product/$id"
                params={{ id: product.id }}
                onClick={() => onOpenChange(false)}
                className="text-center text-sm text-primary underline-offset-4 hover:underline"
              >
                View full details
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AffiliateRedirect
        open={redirect}
        onOpenChange={setRedirect}
        url={product.affiliateUrl}
        partnerName={product.partnerName}
        productName={product.name}
      />
    </>
  );
}
