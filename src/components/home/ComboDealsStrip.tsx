import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const comboDeals = [
  {
    title: "Wedding Package",
    subtitle: "Salon + Banquet",
    image:
      "https://assets.vogue.in/photos/69a41ddc3b691ac3ed5baaa7/master/w_1024%2Cc_limit/VKR60769.jpg",
  },
  {
    title: "Fit & Fab",
    subtitle: "Gym + Nutritionist",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiMzRF7zrX2BTQ_n87lNyfBJxfOjLp1u1K4Gj_81eBxA&s=10",
  },
  {
    title: "Beauty & Photoshoot",
    subtitle: "Makeup + Photographer",
    image:
      "https://img.freepik.com/free-photo/dreamy-curly-woman-pink-suit-sitting-near-mirror_197531-16809.jpg?semt=ais_incoming&w=740&q=80",
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
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Exclusive Brand Collaborations</h2>
          <p className="max-w-2xl text-sm text-slate-200/90 md:text-base">Special combo offers you won’t find elsewhere</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {comboDeals.map((deal) => {
            return (
              <Link
                key={deal.title}
                href="/combo-deals"
                className="group relative h-56 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f172a] p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/35 md:h-64"
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.35)_78%)]" />
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/10 blur-3xl" />

                <div className="relative flex h-full flex-col justify-between gap-8 pt-6 md:pt-8">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight text-white">{deal.title}</h3>
                    <p className="mt-2 text-sm text-slate-200/90 md:text-base">{deal.subtitle}</p>
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
