import Link from "next/link";
import { motion } from "framer-motion";
import { BusinessCard } from "@/components/BusinessCard";
import { ChevronRight } from "lucide-react";
import type { Business } from "@/types/api.types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export function FeaturedBusinesses({ businesses, isLoading }: { businesses: Business[]; isLoading?: boolean }) {
  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold">Featured Businesses</h2>
        <Link href="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
          See More <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card shadow-card animate-pulse">
              <div className="aspect-[4/3] bg-secondary rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {businesses.map((biz, i) => (
            <motion.div key={biz.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <BusinessCard {...biz} showOffer={false} showTags={false} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
