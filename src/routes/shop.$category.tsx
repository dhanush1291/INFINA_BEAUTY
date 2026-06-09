import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopListing } from "@/components/ShopListing";
import { products, COSMETIC_SUBCATEGORIES } from "@/data/products";

export const Route = createFileRoute("/shop/$category")({
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Category not found</h1>
    </div>
  ),
  head: ({ params }) => {
    const titles: Record<string, string> = {
      cosmetics: "Shop Cosmetics — INFINA",
      new: "New Arrivals — INFINA",
      sale: "Sale — INFINA",
    };
    return {
      meta: [
        { title: titles[params.category] ?? "Shop — INFINA" },
        { name: "description", content: `Shop ${params.category} at INFINA — curated beauty picks from trusted partners.` },
      ],
    };
  },
});

import { useProducts } from "@/hooks/useProducts";

function CategoryPage() {
  const { category } = Route.useParams();
  const { products: allProducts, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  let title = "";
  let source = allProducts;
  switch (category) {
    case "cosmetics":
      title = "Cosmetics";
      source = allProducts.filter((p) => p.category === "cosmetics");
      break;
    case "new":
      title = "New Arrivals";
      source = allProducts.filter((p) => p.newArrival);
      break;
    case "sale":
      title = "Sale";
      source = allProducts.filter((p) => !!p.originalPrice);
      break;
    default:
      throw notFound();
  }

  const subs = category === "cosmetics" ? COSMETIC_SUBCATEGORIES : [];

  return (
    <>
      {subs.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="no-scrollbar mx-auto flex max-w-7xl gap-4 overflow-x-auto px-6 py-3 text-sm lg:px-8">
            {subs.map((s) => (
              <a
                key={s.slug}
                href={`/shop/${category}/${s.slug}`}
                className="whitespace-nowrap rounded-full border bg-background px-4 py-1.5 hover:border-primary hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
      <ShopListing
        title={title}
        crumbs={[{ label: "Home", to: "/" }, { label: title }]}
        source={source}
      />
    </>
  );
}
