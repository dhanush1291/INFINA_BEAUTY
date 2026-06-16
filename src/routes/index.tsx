import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Sparkles, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INFINA — Premium Cosmetics & Skincare" },
      { name: "description", content: "Curated cosmetics & beauty products. Discover your perfect beauty look at INFINA." },
    ],
  }),
  component: Home,
});

const SLIDES = [
  {
    eyebrow: "New Collection",
    title: "Glow Like Never Before",
    subtitle: "High-performance skincare meets luxury cosmetics. Curated for the modern beauty enthusiast.",
    cta: "Shop The Collection",
    category: "skincare",
    image: "/images/hero-skincare.png",
  },
  {
    eyebrow: "Summer Essentials",
    title: "Your Daily Ritual",
    subtitle: "Experience the ultimate hydration and finish with our best-selling summer picks.",
    cta: "Shop Best Sellers",
    category: "skincare",
    image: "/images/hero-summer.png",
  },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-[#fafafa]">
      {SLIDES.map((s, idx) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="" className="h-full w-full object-cover object-center lg:object-[center_30%]" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
        <div className="max-w-md animate-fade-in" key={i}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{SLIDES[i].eyebrow}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1] tracking-tight md:text-7xl uppercase text-white drop-shadow-md">
            {SLIDES[i].title}
          </h1>
          <p className="mt-8 text-lg font-light leading-relaxed text-white/90 lowercase drop-shadow-sm">
            {SLIDES[i].subtitle}
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="h-12 px-10 text-xs uppercase tracking-[0.2em] bg-white text-black border shadow-sm hover:bg-white/90 transition-all rounded-none">
              <Link to="/shop/$category" params={{ category: SLIDES[i].category }}>
                shop now
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1 transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-foreground/20"}`}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryCircle({ category, title, image }: { category: string; title: string; image: string }) {
  return (
    <Link
      to="/shop/$category"
      params={{ category }}
      className="group flex flex-col items-center gap-4 text-center"
    >
      <div className="relative h-40 w-40 overflow-hidden rounded-full border border-border shadow-soft transition-transform duration-500 group-hover:scale-105 md:h-56 md:w-56">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div>
        <h3 className="font-serif text-xl tracking-tight text-foreground">{title}</h3>
        <span className="text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">Shop Now</span>
      </div>
    </Link>
  );
}

function Home() {
  const { products: allProducts, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const trending = allProducts.filter((p) => p.trending).slice(0, 8);
  const collections = [
    { category: "skincare", title: "SKINCARE", image: "/images/hero-skincare.png" },
    { category: "makeup", title: "MAKEUP", image: "/images/cat-makeup.png" },
    { category: "hair-care", title: "HAIR CARE", image: "/images/cat-haircare.png" },
    { category: "fragrances", title: "FRAGRANCES", image: "/images/cat-fragrance.png" },
    { category: "mens-grooming", title: "MEN'S GROOMING", image: "https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="bg-background">
      <Hero />

      {/* Shop By Collection - Circular style like Kylie */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl uppercase">Shop By Category</h2>
          <div className="mx-auto mt-4 h-0.5 w-24 bg-primary" />
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {collections.map((cat) => (
            <CategoryCircle
              key={cat.category}
              category={cat.category}
              title={cat.title}
              image={cat.image}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="border-t bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Fan Favorites</p>
              <h2 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Best Sellers</h2>
            </div>
            <Link to="/shop/$category" params={{ category: "skincare" }} className="group flex items-center text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors">
              View All Products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Full Width Callout */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img
          src="/images/callout-glow.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="max-w-2xl font-serif text-4xl text-white md:text-6xl uppercase tracking-tight">The Perfect Glow Starts Here</h2>
          <Button asChild size="lg" className="mt-8 h-14 px-12 text-base uppercase tracking-widest bg-white text-black hover:bg-white/90 rounded-none border-none">
            <Link to="/shop/$category" params={{ category: "skincare" }}>Shop Skincare</Link>
          </Button>
        </div>
      </section>

      {/* Features - Minimalist */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Clean Formula", body: "Cruelty-free, vegan-friendly, and dermatologist tested for all skin types." },
              { icon: ShieldCheck, title: "Trusted Luxury", body: "Premium ingredients curated for long-lasting performance." },
              { icon: Truck, title: "Fast Shipping", body: "Direct and secure delivery to your doorstep with premium packaging." },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl tracking-tight">{f.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Signature Pink */}
      <section className="bg-primary py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl uppercase">Join The Club</h2>
          <p className="mt-6 text-lg text-primary-foreground/90 font-light">
            Sign up for exclusive access to new drops, beauty tips and get 15% off your first order.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome! Check your inbox for your 15% off code.");
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="mt-12 flex flex-col gap-0 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder="Enter your email"
              className="h-14 border-none bg-background text-foreground rounded-none px-6 focus-visible:ring-0"
            />
            <Button type="submit" size="lg" className="h-14 px-8 uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none border-none">
              Sign Up
            </Button>
          </form>
          <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">
            By signing up, you agree to receive marketing emails.
          </p>
        </div>
      </section>
    </div>
  );
}
