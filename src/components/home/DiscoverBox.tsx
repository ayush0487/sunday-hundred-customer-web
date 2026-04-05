import Link from "next/link";
import { Compass } from "lucide-react";

export function DiscoverBox() {
  return (
    <section className="container pb-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f17] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.20),transparent_34%),linear-gradient(90deg,rgba(251,191,36,0.08),transparent_45%)]" />
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 px-6 py-7 md:flex-row md:items-center md:justify-between md:px-8 md:py-9">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              <Compass className="h-3.5 w-3.5" />
              Discover
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold text-white md:text-[2rem]">Discover more nearby services</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
              Explore fresh categories, compare trusted businesses, and find your next best local deal in minutes.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 md:items-end">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300">
              Fresh listings, better offers, faster contact
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-gold px-7 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.24)] transition-transform hover:-translate-y-0.5 hover:brightness-105"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
