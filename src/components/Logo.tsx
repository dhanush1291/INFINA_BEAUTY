import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex flex-col items-center gap-0 ${className}`} aria-label="INFINA Beauty home">
      <div className="relative flex items-center justify-center">
        {/* Monogram / Icon Area */}
        <div className="relative flex items-center justify-center h-12 w-24">
          {/* Stylized iB Monogram Placeholder using text and shapes */}
          <div className="flex items-center -space-x-1 font-serif text-3xl font-bold italic">
            <span className="text-foreground z-10">i</span>
            <span className="text-rose-400 translate-y-1">B</span>
          </div>

          {/* Infinity Loop mimic using an SVG path */}
          <svg
            className="absolute inset-0 w-full h-full text-rose-300 opacity-60"
            viewBox="0 0 100 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M30 20 C 10 20, 10 5, 25 5 C 40 5, 60 35, 75 35 C 90 35, 90 20, 70 20" />
            <circle cx="82" cy="15" r="4" fill="currentColor" className="opacity-40" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col items-center -mt-1">
        <div className="flex items-baseline font-serif tracking-widest uppercase">
          <span className="text-xl font-bold text-rose-500">INFINA</span>
          <span className="text-lg font-light text-foreground/80 lowercase italic -ml-0.5">beauty</span>
        </div>
        <span className="text-[7px] uppercase tracking-[0.4em] font-medium text-muted-foreground -mt-0.5 whitespace-nowrap">
          Premium Cosmetics & Skincare
        </span>
      </div>
    </Link>
  );
}
