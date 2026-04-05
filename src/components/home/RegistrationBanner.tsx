export function RegistrationBanner() {
  return (
    <section className="container py-8 md:py-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/5" />
        <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-10 lg:px-12 lg:py-12 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Register Your Business
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight mb-4">
              Grow your business with sundayhundred
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
              Create your listing, showcase services, and start getting discovered by local customers.
              Quick registration. Better reach. More bookings.
            </p>
          </div>

          <div className="flex md:justify-end">
            <a
              href="https://dashboard.sundayhundred.com/signup"
              className="inline-flex w-full md:w-auto items-center justify-center rounded-2xl gradient-gold px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-gold/20 transition-transform hover:-translate-y-0.5 hover:opacity-95"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}