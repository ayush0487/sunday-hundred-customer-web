import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-gold text-gold" />
      <span className="text-sm font-semibold">{rating}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
