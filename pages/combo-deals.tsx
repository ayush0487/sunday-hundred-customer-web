import Head from "next/head";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { OffersBanner } from "@/components/home/OffersBanner";
import { ArrowLeft, Sparkles } from "lucide-react";
import serverApi from "@/api/server";
import type { FeaturedBusinessData } from "@/types/api.types";

interface ComboDealsPageProps {
  featuredData: FeaturedBusinessData | null;
}

const previewDeals = [
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
                return (
                  <div
                    key={deal.title}
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f172a] p-5"
                  >
                    <img src={deal.image} alt={deal.title} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.35)_78%)]" />
                    <div className="relative flex h-full flex-col justify-between gap-8">
                      <div className="flex items-start justify-end gap-4">
                        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                          Preview only
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold leading-tight text-white">{deal.title}</h2>
                        <p className="mt-2 text-sm text-slate-200/90 md:text-base">{deal.subtitle}</p>
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
