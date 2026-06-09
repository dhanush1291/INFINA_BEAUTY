import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopListing } from "@/components/ShopListing";
import {
  products,
  COSMETIC_SUBCATEGORIES,
  subcategoryLabel,
} from "@/data/products";

export const Route = createFileRoute("/shop/$category/$sub")({
  component: SubPage,
  head: ({ params }) => ({
    meta: [
      { title: `${subcategoryLabel(params.sub)} — INFINA` },
      { name: "description", content: `Shop ${subcategoryLabel(params.sub)} at INFINA.` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl">Subcategory not found</h1>
    </div>
  ),
});

function SubPage() {
  const { category, sub } = Route.useParams();

  if (category !== "cosmetics") throw notFound();

  const subs = COSMETIC_SUBCATEGORIES;
  const found = subs.find((s) => s.slug === sub);
  if (!found) throw notFound();

  const source = products.filter((p) => p.category === category && p.subcategory === sub);
  const catLabel = "Cosmetics";

  return (
    <ShopListing
      title={found.label}
      crumbs={[
        { label: "Home", to: "/" },
        { label: catLabel, to: `/shop/${category}` },
        { label: found.label },
      ]}
      source={source}
    />
  );
}
