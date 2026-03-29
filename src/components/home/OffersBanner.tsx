import Link from "next/link";

export function OffersBanner() {
  return (
    <section className="container py-8">
      <div className="relative overflow-hidden rounded-2xl gradient-gold p-8 md:p-12">
        
        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Discover Local Businesses
          </h2>

          <p className="text-primary-foreground/80 mb-6">
            Explore newly listed businesses near you and connect instantly on WhatsApp for quick bookings and enquiries.
          </p>

          <Link
            href="/categories"
            className="inline-block px-6 py-3 rounded-xl bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Explore Now
          </Link>
        </div>

        {/* Decorative Gradient */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-background/10 to-transparent" />
      </div>
    </section>
  );
}