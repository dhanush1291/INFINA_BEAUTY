import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopListing } from "@/components/ShopListing";
import {
  products,
  DRESS_SUBCATEGORIES,
  COSMETIC_SUBCATEGORIES,
  subcategoryLabel,
} from "@/data/products";

export const Route = createFileRoute("/shop/$category/$sub")({
  component: SubPage,
  head: ({ params }) => ({
    meta: [
      { title: `${subcategoryLabel(params.sub)} — Sai` },
      { name: "description", content: `Shop ${subcategoryLabel(params.sub)} at Sai.` },
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
  if (category !== "dresses" && category !== "cosmetics") throw notFound();
  const subs = category === "dresses" ? DRESS_SUBCATEGORIES : COSMETIC_SUBCATEGORIES;
  const found = subs.find((s) => s.slug === sub);
  if (!found) throw notFound();

  const source = products.filter((p) => p.category === category && p.subcategory === sub);
  const catLabel = category === "dresses" ? "Dresses" : "Cosmetics";

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
