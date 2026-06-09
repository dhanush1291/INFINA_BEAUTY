import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About INFINA" },
      { name: "description", content: "INFINA is a curated destination for premium cosmetics & beauty products — your premier beauty destination." },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Our story</p>
          <h1 className="mt-3 font-serif text-5xl md:text-6xl">About INFINA</h1>
          <p className="mt-6 text-lg text-foreground/80">
            INFINA was created to bring you the finest selection of cosmetics and beauty products — without
            the noise. We curate, you discover.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <h2 className="font-serif text-3xl">Our mission</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Online shopping should feel like walking into your favourite beauty boutique — quiet, beautiful, and
          full of products chosen with intention. INFINA partners with trusted retailers so we can focus on
          what matters: surfacing extraordinary beauty products with honest pricing and a transparent affiliate
          model.
        </p>
        <h2 className="mt-12 font-serif text-3xl">How it works</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Every product on INFINA links to a trusted retail partner. When you click "Shop Now," we take you
          directly to their site to complete your purchase. INFINA may earn a commission — at no extra cost
          to you — which helps us keep curating the best of the best.
        </p>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Sparkles, title: "Curated, never crowded", body: "Every product earns its place. Quality over quantity, always." },
            { icon: ShieldCheck, title: "Trusted partners only", body: "We work with retailers known for service, authenticity and care." },
            { icon: HeartHandshake, title: "Honest affiliate model", body: "We're transparent about commissions — your trust matters more." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl bg-background p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
