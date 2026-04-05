import Head from "next/head";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { OffersBanner } from "@/components/home/OffersBanner";
import { ArrowLeft, Camera, Dumbbell, Sparkles } from "lucide-react";
import serverApi from "@/api/server";
import type { FeaturedBusinessData } from "@/types/api.types";

interface ComboDealsPageProps {
  featuredData: FeaturedBusinessData | null;
}

const previewDeals = [
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

export async function getServerSideProps() {
  try {
    const featuredRes = await serverApi.get("/business/getAllFeatureBusiness", {
      params: { page: 1, limit: 6 },
    });

    return {
      props: {
        featuredData: featuredRes.data.data ?? null,
      },
    };
  } catch {
    return {
      props: {
        featuredData: null,
      },
    };
  }
}

export default function ComboDealsPage({ featuredData }: ComboDealsPageProps) {
  return (
    <>
      <Head>
        <title>Exclusive Combo Deals - sundayhundred</title>
        <meta
          name="description"
          content="Exclusive combo deals are under development on sundayhundred. Preview bundle-style services, featured businesses, and live offers."
        />
      </Head>
      <Layout>
        <section className="container py-10 md:py-14">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0f17] px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:px-10 md:py-12">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Under development
                </span>
                <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">Exclusive Combo Deals</h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                  This feature is being built for production launch. We will show bundled services, partner deals, and
                  smarter booking flows here soon.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-gold/40 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {previewDeals.map((deal) => {
                const Icon = deal.icon;

                return (
                  <div
                    key={deal.title}
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_40%)]" />
                    <div className="relative flex h-full flex-col justify-between gap-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-gold shadow-inner shadow-black/20">
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                          Preview only
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold leading-tight text-white">{deal.title}</h2>
                        <p className="mt-2 text-sm text-slate-400 md:text-base">{deal.subtitle}</p>
                      </div>

                      <p className="text-sm font-semibold text-gold">Launching soon</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container pb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">Featured businesses preview</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Live data</span>
          </div>
          <FeaturedBusinesses businesses={featuredData?.businesses ?? []} isLoading={false} />
        </section>

        <section className="pb-8">
          <OffersBanner />
        </section>
      </Layout>
    </>
  );
}
