import Link from "next/link";
import { useRandomOffers } from "@/hooks/useOffers";

const FALLBACK_OFFER_IMAGE = "/offers-fallback.svg";

function formatDiscountLabel(discountType: "percentage" | "flat", discount: string) {
  const numericDiscount = Number(discount);
  const value = Number.isFinite(numericDiscount)
    ? Number.isInteger(numericDiscount)
      ? `${numericDiscount}`
      : numericDiscount.toFixed(2)
    : discount;

  if (discountType === "percentage") {
    return `${value}% OFF`;
  }

  return `₹${value} OFF`;
}

export function OffersBanner() {
  const { data: offers = [], isLoading, isError } = useRandomOffers(4);

  return (
    <section className="container py-8">
      <div className="rounded-2xl bg-slate-900 p-4 md:p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-white md:text-xl">Live Offers Near You</h2>
          <Link href="/categories" className="text-xs font-semibold uppercase tracking-wide text-gold hover:underline">
            Browse Services
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-white/10 bg-white/5 animate-pulse">
                <div className="aspect-[16/10] bg-white/10" />
                <div className="space-y-2 p-3">
                  <div className="h-3 w-3/4 rounded bg-white/15" />
                  <div className="h-2 w-1/2 rounded bg-white/15" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            Offers are unavailable right now. Please refresh and try again.
          </p>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {offers.map((offer) => {
              const imageUrl = offer.img_url || FALLBACK_OFFER_IMAGE;
              const discountLabel = formatDiscountLabel(offer.discount_type, offer.discount);

              return (
                <Link key={offer.id} href={`/business/${offer.business_id}`} className="group overflow-hidden rounded-xl border border-white/10 bg-slate-800/70 transition hover:border-gold/70">
                  <div
                    className="relative aspect-[16/10] bg-cover bg-center"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute left-2 top-2 rounded bg-gold px-2 py-1 text-[10px] font-bold text-black">
                      {discountLabel}
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold text-white">{offer.title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-300">{offer.business_name || "Sunday Hundred Partner"}</p>
                    <p className="mt-2 text-[11px] font-semibold text-gold group-hover:text-amber-300">View Offer</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            No live offers available right now.
          </p>
        )}
      </div>
    </section>
  );
}