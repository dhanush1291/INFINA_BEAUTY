import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Share2 } from "lucide-react";
import { products } from "@/data/products";
import { useWishlist, useMounted } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [{ title: "My Wishlist — Sai" }, { name: "description", content: "Your saved Sai favourites." }],
  }),
});

function WishlistPage() {
  const { ids, clear } = useWishlist();
  const mounted = useMounted();
  const items = mounted ? products.filter((p) => ids.includes(p.id)) : [];

  const share = async () => {
    const url = `${window.location.origin}/wishlist?ids=${encodeURIComponent(ids.join(","))}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Wishlist link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">My Wishlist</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mounted ? `${items.length} ${items.length === 1 ? "item" : "items"} saved` : "Loading…"}
          </p>
        </div>
        {mounted && items.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={share}>
              <Share2 className="mr-2 h-4 w-4" /> Share wishlist
            </Button>
            <Button variant="ghost" onClick={clear}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {mounted && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h2 className="mt-4 font-serif text-2xl">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your favourite pieces and come back any time.
          </p>
          <Button asChild className="mt-6">
            <Link to="/shop/new">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
