import { motion } from "framer-motion";
import { Zap, Calendar } from "lucide-react";
import type { Offer } from "@/types/api.types";

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

export function OfferCard({ offer, index = 0 }: OfferCardProps) {
  const discountDisplay = offer.discount_type === "percentage" ? `${offer.discount}%` : `₹${offer.discount}`;
  const startDate = new Date(offer.start_date);
  const endDate = new Date(offer.end_date);
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow border border-border p-4"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-2xl -mr-12 -mt-12" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground line-clamp-2">{offer.title}</h3>
            {offer.service_name && (
              <p className="text-xs text-muted-foreground mt-1">{offer.service_name}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gold/10 border border-gold/30 shrink-0">
            <Zap className="h-4 w-4 text-gold" />
            <span className="font-bold text-gold text-sm">{discountDisplay}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} -{" "}
              {endDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
            </span>
          </div>
          {daysRemaining > 0 && (
            <span className="px-2 py-1 rounded-full bg-accent/50 text-accent-foreground font-medium">
              {daysRemaining} days left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
