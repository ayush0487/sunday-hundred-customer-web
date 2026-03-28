import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, Dumbbell, Sparkles, Heart, Wrench, Paintbrush, Camera, Car, ChevronRight, type LucideIcon } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/api.types";

const iconMap: Record<string, LucideIcon> = {
  salon: Scissors,
  spa: Sparkles,
  gym: Dumbbell,
  beauty: Heart,
  repairs: Wrench,
  painters: Paintbrush,
  photography: Camera,
  "car care": Car,
};

const fallbackIcon = Sparkles;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export function Categories({ ssrCategories }: { ssrCategories?: Category[] }) {
  const { data: categories, isLoading } = useCategories(ssrCategories);

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold">Browse Categories</h2>
        <Link href="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card shadow-card animate-pulse p-4 h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories?.map((cat, i) => (
            <motion.div key={cat.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <CategoryCard
                name={cat.name}
                icon={iconMap[cat.name.toLowerCase()] || fallbackIcon}
                href={`/categories?category=${encodeURIComponent(cat.name)}`}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
