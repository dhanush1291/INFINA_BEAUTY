import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopListing } from "@/components/ShopListing";
import { products, DRESS_SUBCATEGORIES, COSMETIC_SUBCATEGORIES } from "@/data/products";

export const Route = createFileRoute("/shop/$category")({
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Category not found</h1>
    </div>
  ),
  head: ({ params }) => {
    const titles: Record<string, string> = {
      dresses: "Shop Dresses — Sai",
      cosmetics: "Shop Cosmetics — Sai",
      new: "New Arrivals — Sai",
      sale: "Sale — Sai",
    };
    return {
      meta: [
        { title: titles[params.category] ?? "Shop — Sai" },
        { name: "description", content: `Shop ${params.category} at Sai — curated picks from trusted partners.` },
      ],
    };
  },
});

function CategoryPage() {
  const { category } = Route.useParams();

  let title = "";
  let source = products;
  switch (category) {
    case "dresses":
      title = "Dresses";
      source = products.filter((p) => p.category === "dresses");
      break;
    case "cosmetics":
      title = "Cosmetics";
      source = products.filter((p) => p.category === "cosmetics");
      break;
    case "new":
      title = "New Arrivals";
      source = products.filter((p) => p.newArrival);
      break;
    case "sale":
      title = "Sale";
      source = products.filter((p) => !!p.originalPrice);
      break;
    default:
      throw notFound();
  }

  const subs =
    category === "dresses" ? DRESS_SUBCATEGORIES : category === "cosmetics" ? COSMETIC_SUBCATEGORIES : [];

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
