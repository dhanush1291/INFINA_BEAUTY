import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sai — Where Beauty Meets Style" },
      { name: "description", content: "Curated dresses & cosmetics from trusted partners. Discover your perfect look." },
    ],
  }),
  component: Home,
});

const SLIDES = [
  {
    eyebrow: "New Season",
    title: "Where Beauty Meets Style",
    subtitle: "Discover curated dresses & cosmetics from the world's most coveted brands.",
    cta: "Shop New Arrivals",
    category: "new",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1800&q=80",
  },
  {
    eyebrow: "Editor's Pick",
    title: "Soft. Glowing. Effortless.",
    subtitle: "Skin-first beauty that lets you shine through.",
    cta: "Explore Cosmetics",
    category: "cosmetics",
    image: "https://images.unsplash.com/photo-1522335789203-aaa83b4f4d11?auto=format&fit=crop&w=1800&q=80",
  },
  {
    eyebrow: "Up to 40% Off",
    title: "The Sale, Reimagined",
    subtitle: "Limited-edition pieces at prices you'll love.",
    cta: "Shop Sale",
    category: "sale",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80",
  },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-muted">
      {SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
        <div className="max-w-xl animate-fade-in" key={i}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{SLIDES[i].eyebrow}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
            {SLIDES[i].title}
          </h1>
          <p className="mt-5 max-w-md text-base text-foreground/80 md:text-lg">{SLIDES[i].subtitle}</p>
          <Button asChild size="lg" className="mt-8 px-8">
            <Link to="/shop/$category" params={{ category: SLIDES[i].category }}>
              {SLIDES[i].cta} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-foreground/30"}`}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({ category, sub, title, image }: { category: string; sub?: string; title: string; image: string }) {
  const inner = (
    <>
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-serif text-2xl text-white md:text-3xl">{title}</h3>
        <span className="mt-1 inline-flex items-center text-sm text-white/90">
          Shop now <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </>
  );
  const cls = "group relative block aspect-[4/5] overflow-hidden rounded-lg bg-muted";
  return sub ? (
    <Link to="/shop/$category/$sub" params={{ category, sub }} className={cls}>{inner}</Link>
  ) : (
    <Link to="/shop/$category" params={{ category }} className={cls}>{inner}</Link>
  );
}

function Home() {
  const trending = products.filter((p) => p.trending).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival);

  return (
    <>
      <Hero />

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Trending Now</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">Loved by everyone</h2>
          </div>
          <Link to="/shop/$category" params={{ category: "new" }} className="hidden text-sm text-primary hover:underline md:inline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Shop dresses */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Shop Dresses</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">From day to night</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <CategoryTile category="dresses" sub="evening" title="Evening" image="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80" />
          <CategoryTile category="dresses" sub="casual" title="Casual" image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" />
          <CategoryTile category="dresses" sub="party" title="Party" image="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80" />
        </div>
      </section>

      {/* Shop cosmetics */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Shop Cosmetics</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Beauty, curated</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <CategoryTile category="cosmetics" sub="lipsticks" title="Lipsticks" image="https://images.unsplash.com/photo-1599733589046-8a35aa39b3ac?auto=format&fit=crop&w=900&q=80" />
          <CategoryTile category="cosmetics" sub="eyeshadow" title="Eyeshadow" image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80" />
          <CategoryTile category="cosmetics" sub="skincare" title="Skincare" image="https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=900&q=80" />
        </div>
      </section>

      {/* Why shop */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl">Why shop with Sai</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Curated Selection", body: "Hand-picked pieces from brands we trust and love." },
              { icon: ShieldCheck, title: "Trusted Partners", body: "We only work with retailers known for quality and service." },
              { icon: Truck, title: "Best Prices", body: "We surface the deals so you don't have to chase them." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-background p-8 text-center shadow-soft">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals carousel */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Just In</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">New arrivals</h2>
          </div>
        </div>
        <div className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-2 lg:-mx-8 lg:px-8">
          {newArrivals.map((p) => (
            <div key={p.id} className="w-[260px] flex-none">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-hero py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl">Join the Sai Club</h2>
          <p className="mt-3 text-foreground/80">
            Sign up and get 10% off your first purchase, plus exclusive drops & beauty tips.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome to Sai! Check your inbox for your 10% off code.");
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Input type="email" required placeholder="your@email.com" className="h-12 bg-background" />
            <Button type="submit" size="lg" className="h-12 px-8">
              Get 10% off
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
