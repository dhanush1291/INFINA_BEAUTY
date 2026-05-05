import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-baseline gap-1 ${className}`} aria-label="Sai home">
      <span className="font-serif text-3xl font-semibold tracking-tight text-foreground">
        Sai
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
    </Link>
  );
}
