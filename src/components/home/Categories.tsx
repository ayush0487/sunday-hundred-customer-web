import Link from "next/link";
import { motion } from "framer-motion";
import { Scissors, Dumbbell, Sparkles, Heart, Wrench, Paintbrush, Camera, Car, ChevronRight } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";

const categories = [
  { name: "Salon", icon: Scissors, count: 120, href: "/categories?category=Salon" },
  { name: "Spa", icon: Sparkles, count: 85, href: "/categories?category=Spa" },
  { name: "Gym", icon: Dumbbell, count: 64, href: "/categories?category=Gym" },
  { name: "Beauty", icon: Heart, count: 93, href: "/categories?category=Beauty" },
  { name: "Repairs", icon: Wrench, count: 42, href: "/categories?category=Repairs" },
  { name: "Painters", icon: Paintbrush, count: 31, href: "/categories?category=Painters" },
  { name: "Photography", icon: Camera, count: 27, href: "/categories?category=Photography" },
  { name: "Car Care", icon: Car, count: 58, href: "/categories?category=Car%20Care" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export function Categories() {
  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold">Browse Categories</h2>
        <Link href="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat, i) => (
          <motion.div key={cat.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <CategoryCard {...cat} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
