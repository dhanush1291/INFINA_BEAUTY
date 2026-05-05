import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { useWishlist, useMounted } from "@/lib/wishlist";
import { products } from "@/data/products";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useNavigate } from "@tanstack/react-router";

const NAV = [
  { category: "dresses", path: "/shop/dresses", label: "Dresses" },
  { category: "cosmetics", path: "/shop/cosmetics", label: "Cosmetics" },
  { category: "new", path: "/shop/new", label: "New Arrivals" },
  { category: "sale", path: "/shop/sale", label: "Sale" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { ids } = useWishlist();
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        scrolled ? "bg-background/85 backdrop-blur-md border-border" : "bg-background border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                <Logo />
                <nav className="mt-8 flex flex-col gap-1">
                  {NAV.map((n) => (
                    <Link
                      key={n.path}
                      to="/shop/$category"
                      params={{ category: n.category }}
                      className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
                    >
                      {n.label}
                    </Link>
                  ))}
                  <Link to="/about" className="rounded-md px-3 py-3 text-base hover:bg-muted">
                    About
                  </Link>
                  <Link to="/contact" className="rounded-md px-3 py-3 text-base hover:bg-muted">
                    Contact
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.path);
            return (
              <Link
                key={n.path}
                to="/shop/$category"
                params={{ category: n.category }}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-foreground/80"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            {mounted && ids.length > 0 && (
              <span className="pointer-events-none absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {ids.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search products, brands, categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.slice(0, 30).map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.name} ${p.brand} ${p.subcategory}`}
                onSelect={() => {
                  setSearchOpen(false);
                  navigate({ to: "/product/$id", params: { id: p.id } });
                }}
              >
                <span className="text-xs uppercase text-muted-foreground mr-2">{p.brand}</span>
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4 lg:px-8">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Curated dresses & cosmetics from trusted partners. Where beauty meets style.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop/$category" params={{ category: "dresses" }} className="hover:text-foreground">Dresses</Link></li>
            <li><Link to="/shop/$category" params={{ category: "cosmetics" }} className="hover:text-foreground">Cosmetics</Link></li>
            <li><Link to="/shop/$category" params={{ category: "new" }} className="hover:text-foreground">New Arrivals</Link></li>
            <li><Link to="/shop/$category" params={{ category: "sale" }} className="hover:text-foreground">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Sai</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/policies/returns" className="hover:text-foreground">Returns</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Sai. All rights reserved.</p>
          <p>Sai may earn commission from purchases made through partner links.</p>
        </div>
      </div>
    </footer>
  );
}
