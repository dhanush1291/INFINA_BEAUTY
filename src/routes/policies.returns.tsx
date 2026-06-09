import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/returns")({
  component: ReturnsPage,
  head: () => ({
    meta: [{ title: "Returns & Refunds — INFINA" }, { name: "description", content: "How returns work for purchases made through INFINA's partner retailers." }],
  }),
});

function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="font-serif text-4xl">Returns & Refunds</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground">
        <p>
          INFINA is an affiliate platform — we don't sell products directly. When you click "Shop Now," your
          purchase is completed on a partner retailer's website. All returns, refunds, and exchanges are
          handled by that retailer in line with their own policy.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-foreground">How to return an item</h2>
        <ol className="ml-5 list-decimal space-y-2">
          <li>Locate the order confirmation from the partner retailer.</li>
          <li>Review their return window and conditions.</li>
          <li>Initiate the return through the retailer's account or customer service.</li>
        </ol>
        <h2 className="mt-8 font-serif text-2xl text-foreground">Need help?</h2>
        <p>
          If you can't reach the retailer, email us at <a href="mailto:hello@INFINA.example" className="text-primary">hello@INFINA.example</a> and we'll do our best to help.
        </p>
      </div>
    </div>
  );
}
