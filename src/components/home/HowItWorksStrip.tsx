import { BadgePercent, ChevronRight, PhoneCall, Search } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Search Your Service",
    icon: Search,
  },
  {
    id: 2,
    title: "Check Latest Offers",
    icon: BadgePercent,
  },
  {
    id: 3,
    title: "Contact Directly",
    icon: PhoneCall,
  },
];

export function HowItWorksStrip() {
  return (
    <section className="container pb-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f17] px-5 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:px-8 md:py-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_24%)]" />
        <div className="relative mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              How It Works
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">Simple steps to get the best local service</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-right md:text-base">
            Search fast, compare live offers, then contact the right business without extra friction.
          </p>
        </div>

        <div className="relative grid gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-7 text-center backdrop-blur-sm"
              >
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.88))] shadow-[0_16px_35px_rgba(0,0,0,0.28)] ring-4 ring-white/5">
                  <Icon className="h-11 w-11 text-slate-700" strokeWidth={1.8} />
                </div>

                <span className="mb-3 inline-flex h-7 items-center rounded-full border border-gold/20 bg-gold/10 px-3 text-[11px] font-bold tracking-[0.18em] text-gold">
                  0{step.id}
                </span>

                <p className="text-base font-semibold text-white md:text-lg">{step.title}</p>

                {!isLast ? (
                  <>
                    <div className="absolute -right-6 top-1/2 hidden h-px w-12 -translate-y-1/2 bg-gradient-to-r from-white/20 to-white/5 md:block lg:w-16" />
                    <ChevronRight className="absolute -right-8 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-white/30 md:block" />
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
