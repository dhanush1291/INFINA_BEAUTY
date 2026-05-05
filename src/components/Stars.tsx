import { Star } from "lucide-react";

export function Stars({ rating, count, className = "" }: { rating: number; count?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {typeof count === "number" && ` (${count.toLocaleString()})`}
      </span>
    </div>
  );
}
