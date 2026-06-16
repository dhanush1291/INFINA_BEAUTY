import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopListing } from "@/components/ShopListing";
import {
  products,
  PRODUCT_CATEGORIES,
  subcategoryLabel,
} from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

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
  const { products: allProducts, isLoading } = useProducts();

  const categoryInfo = PRODUCT_CATEGORIES.find(c => c.slug === category);
  if (!categoryInfo) throw notFound();

  const found = categoryInfo.subcategories.find((s) => s.slug === sub);
  if (!found) throw notFound();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const source = allProducts.filter((p) => p.category === category && p.subcategory === sub);

  return (
    <ShopListing
      title={found.label}
      crumbs={[
        { label: "Home", to: "/" },
        { label: categoryInfo.label, to: `/shop/${category}` },
        { label: found.label },
      ]}
      source={source}
    />
  );
}
