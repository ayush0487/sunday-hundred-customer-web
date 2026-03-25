import Link from "next/link";
import { motion } from "framer-motion";
import { BusinessCard } from "@/components/BusinessCard";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export function FeaturedBusinesses({ businesses }: { businesses: any[] }) {
  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl md:text-2xl font-bold">Featured Businesses</h2>
        <Link href="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
          See More <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {businesses.map((biz, i) => (
          <motion.div key={biz.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <BusinessCard {...biz} showOffer={false} showTags={false} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
