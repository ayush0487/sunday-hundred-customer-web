import { useEffect, useMemo, useState } from "react";
import { Scissors, Dumbbell, Sparkles, Heart, Wrench, Paintbrush, Camera, Car, Star, MapPin, TrendingUp, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { BusinessCard } from "@/components/BusinessCard";
import { businesses } from "@/data/mock";

const allCategories = [
  { name: "All", icon: Star },
  { name: "Salon", icon: Scissors },
  { name: "Spa", icon: Sparkles },
  { name: "Gym", icon: Dumbbell },
  { name: "Beauty", icon: Heart },
  { name: "Repairs", icon: Wrench },
  { name: "Painters", icon: Paintbrush },
  { name: "Photography", icon: Camera },
  { name: "Car Care", icon: Car },
];

const filterButtons = [
  { label: "Top Rated", icon: Star },
  { label: "Nearby", icon: MapPin },
  { label: "Popular", icon: TrendingUp },
];

export default function CategoryPage() {
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!queryCategory) {
      setActiveCategory("All");
      return;
    }

    const normalized = queryCategory.toLowerCase();
    const matchedCategory = allCategories.find((cat) => cat.name.toLowerCase() === normalized);
    setActiveCategory(matchedCategory ? matchedCategory.name : "All");
  }, [queryCategory]);

  const filteredBusinesses = useMemo(() => {
    if (activeCategory === "All") {
      return businesses;
    }

    const normalizedCategory = activeCategory.toLowerCase();
    return businesses.filter((biz) => biz.category.toLowerCase().includes(normalizedCategory));
  }, [activeCategory]);

  return (
    <Layout>
      <div className="container py-6 md:py-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Explore Categories</h1>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.name
                  ? "gradient-gold text-primary-foreground"
                  : "bg-card shadow-card text-card-foreground hover:bg-accent"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-card shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                <h3 className="font-semibold text-sm">Filters</h3>
              </div>
              <div className="space-y-2">
                {filterButtons.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setActiveFilter(activeFilter === f.label ? null : f.label)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeFilter === f.label
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <f.icon className="h-4 w-4" />
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs text-muted-foreground mb-3">DISTANCE</h4>
                <div className="space-y-1.5">
                  {["< 1 km", "1-3 km", "3-5 km", "5+ km"].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground">
                      <input type="checkbox" className="rounded border-border accent-gold-dark" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-xs text-muted-foreground mb-3">RATING</h4>
                <div className="space-y-1.5">
                  {["4.5+", "4.0+", "3.5+"].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground">
                      <input type="checkbox" className="rounded border-border accent-gold-dark" />
                      <Star className="h-3 w-3 fill-gold text-gold" /> {r}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterButtons.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(activeFilter === f.label ? null : f.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeFilter === f.label
                    ? "bg-accent text-accent-foreground"
                    : "bg-card shadow-card text-card-foreground"
                }`}
              >
                <f.icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">{filteredBusinesses.length} businesses found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredBusinesses.map((biz, i) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <BusinessCard {...biz} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
