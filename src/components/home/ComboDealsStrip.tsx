import Link from "next/link";
import { Camera, Dumbbell, Sparkles, ArrowRight } from "lucide-react";

const comboDeals = [
  {
    title: "Wedding Package",
    subtitle: "Salon + Banquet",
    icon: Sparkles,
  },
  {
    title: "Fit & Fab",
    subtitle: "Gym + Nutritionist",
    icon: Dumbbell,
  },
  {
    title: "Beauty & Photoshoot",
    subtitle: "Makeup + Photographer",
    icon: Camera,
  },
];

export function ComboDealsStrip() {
  return (
    <section className="container pb-8">
      <div className="rounded-[2rem] border border-white/10 bg-[#0b0f17] px-5 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:px-7 md:py-7">
        <div className="mb-5 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Exclusive Combo Deals
          </span>
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Bundle services, save more, and launch faster</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {comboDeals.map((deal, index) => {
            const Icon = deal.icon;

            return (
              <Link
                key={deal.title}
                href="/combo-deals"
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/35 hover:bg-white/[0.06]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_40%)]" />
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/10 blur-3xl" />

                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-gold shadow-inner shadow-black/20">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      Click to open
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold leading-tight text-white">{deal.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 md:text-base">{deal.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm font-semibold text-gold">
                    <span>Launching soon</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
