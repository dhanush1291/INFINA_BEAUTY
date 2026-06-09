import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms of Service — INFINA" }] }),
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="font-serif text-4xl">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>By using INFINA, you agree to these terms. INFINA is a curation and affiliate platform; products are sold by partner retailers.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Affiliate disclosure</h2>
        <p>INFINA may earn a commission on purchases completed through partner links. This does not affect the price you pay.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Content</h2>
        <p>Product information is provided in good faith. Pricing, availability and details are ultimately set by the partner retailer.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Liability</h2>
        <p>INFINA is not responsible for transactions, shipping, returns, or product quality — these are the responsibility of the partner retailer.</p>
      </div>
    </div>
  );
}
