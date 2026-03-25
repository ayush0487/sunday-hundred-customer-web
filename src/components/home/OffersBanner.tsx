import Link from "next/link";

export function OffersBanner() {
  return (
    <section className="container py-8">
      <div className="rounded-2xl gradient-gold p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
            Exclusive Deals
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md">
            Get up to 50% off on your first booking. Limited time offer!
          </p>
          <Link
            href="/categories"
            className="inline-block px-6 py-3 rounded-xl bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Grab Offers Now
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-background/10 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
