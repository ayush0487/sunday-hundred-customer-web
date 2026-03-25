import { Star, MapPin, TrendingUp, Flame } from "lucide-react";

const filters = [
  { label: "Top Rated", icon: Star },
  { label: "Nearby", icon: MapPin },
  { label: "Trending", icon: TrendingUp },
  { label: "Hot Deals", icon: Flame },
];

export function QuickFilters() {
  return (
    <section className="container py-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.label}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card shadow-card text-sm font-medium text-card-foreground hover:bg-accent whitespace-nowrap transition-colors shrink-0"
          >
            <f.icon className="h-4 w-4 text-gold" />
            {f.label}
          </button>
        ))}
      </div>
    </section>
  );
}
