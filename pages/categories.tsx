import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Scissors, Dumbbell, Sparkles, Heart, Wrench, Paintbrush, Camera, Car, Star, MapPin, TrendingUp, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { BusinessCard } from "@/components/BusinessCard";
import { useFeaturedBusinesses } from "@/hooks/useBusiness";
import { useCategories } from "@/hooks/useCategories";
import { useGeolocation } from "@/hooks/useGeolocation";
import serverApi from "@/api/server";
import type { FeaturedBusinessData, FeaturedBusinessParams, Category } from "@/types/api.types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://app.sundayhundred.com").replace(/\/$/, "");

const iconMap: Record<string, any> = {
  salon: Scissors,
  spa: Sparkles,
  gym: Dumbbell,
  beauty: Heart,
  repairs: Wrench,
  painters: Paintbrush,
  photography: Camera,
  "car care": Car,
};

const filterButtons = [
  { label: "Top Rated", value: "top_rated" as const, icon: Star },
  { label: "Nearby", value: "nearby" as const, icon: MapPin },
  { label: "Popular", value: "popular" as const, icon: TrendingUp },
];

interface PageProps {
  ssrBusinesses: FeaturedBusinessData | null;
  ssrCategories: Category[] | null;
}

export async function getServerSideProps() {
  try {
    const [bizRes, catRes] = await Promise.all([
      serverApi.get("/business/getAllFeatureBusiness", { params: { page: 1, limit: 20 } }),
      serverApi.get("/categories/"),
    ]);

    return {
      props: {
        ssrBusinesses: bizRes.data.data ?? null,
        ssrCategories: catRes.data.data ?? null,
      },
    };
  } catch {
    return { props: { ssrBusinesses: null, ssrCategories: null } };
  }
}

export default function CategoryPage({ ssrBusinesses, ssrCategories }: PageProps) {
  const router = useRouter();
  const { category: queryCategory } = router.query;
  const { location } = useGeolocation();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeFilter, setActiveFilter] = useState<FeaturedBusinessParams["sort"] | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);

  const { data: apiCategories } = useCategories(ssrCategories ?? undefined);

  useEffect(() => {
    if (!queryCategory) {
      setActiveCategory("All");
      return;
    }
    setActiveCategory(queryCategory as string);
  }, [queryCategory]);

  const selectedCategoryId = useMemo(() => {
    if (activeCategory === "All" || !apiCategories) return undefined;
    const found = apiCategories.find((c) => c.name.toLowerCase() === activeCategory.toLowerCase());
    return found?.id;
  }, [activeCategory, apiCategories]);

  const params: FeaturedBusinessParams = {
    page: 1,
    limit: 20,
    ...(location && { lat: location.lat, long: location.long }),
    ...(selectedCategoryId && { category_id: selectedCategoryId }),
    ...(activeFilter && { sort: activeFilter }),
    ...(maxDistance && { max_distance: maxDistance }),
    ...(minRating && { min_rating: minRating }),
  };

  // Use SSR data as initialData only when no filters applied (default state)
  const isDefaultState = activeCategory === "All" && !activeFilter && !maxDistance && !minRating;
  const { data, isLoading } = useFeaturedBusinesses(
    params,
    isDefaultState ? (ssrBusinesses ?? undefined) : undefined
  );
  const businesses = data?.businesses ?? [];

  const allCategories = useMemo(() => {
    const cats = [{ name: "All", icon: Star }];
    if (apiCategories) {
      apiCategories.forEach((c) => {
        cats.push({ name: c.name, icon: iconMap[c.name.toLowerCase()] || Sparkles });
      });
    }
    return cats;
  }, [apiCategories]);

  const pageTitle = activeCategory === "All"
    ? "Explore All Businesses & Services — Sunday Hundred"
    : `Best ${activeCategory} Services Near You — Sunday Hundred`;
  const canonicalUrl =
    activeCategory === "All"
      ? `${SITE_URL}/categories`
      : `${SITE_URL}/categories?category=${encodeURIComponent(activeCategory)}`;
  const metaDescription = `Browse top-rated ${activeCategory === "All" ? "local" : activeCategory} businesses near you on sundayhundred. Compare ratings, offers and service prices before booking.`;
  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    url: canonicalUrl,
    description: metaDescription,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: businesses.slice(0, 10).map((business, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/business/${business.id}`,
        name: business.name,
      })),
    },
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SITE_URL}/sundayhundred.jpeg`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}/sundayhundred.jpeg`} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }} />
      </Head>
      <Layout>
        <div className="container py-6 md:py-10">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Explore Categories</h1>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            {allCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat.name
                    ? "gradient-gold text-primary-foreground"
                    : "bg-card shadow-card text-card-foreground hover:bg-accent"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (desktop) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 rounded-2xl bg-card shadow-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="h-4 w-4 text-gold" />
                  <h3 className="font-semibold text-sm">Filters</h3>
                </div>
                <div className="space-y-2">
                  {filterButtons.map((f) => (
                    <button
                      key={f.label}
                      onClick={() => setActiveFilter(activeFilter === f.value ? null : f.value)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeFilter === f.value
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <f.icon className="h-4 w-4" />
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs text-muted-foreground mb-3">DISTANCE</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "< 1 km", value: 1 },
                      { label: "< 3 km", value: 3 },
                      { label: "< 5 km", value: 5 },
                      { label: "< 10 km", value: 10 },
                    ].map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setMaxDistance(maxDistance === d.value ? null : d.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          maxDistance === d.value
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs text-muted-foreground mb-3">RATING</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "4.5+", value: 4.5 },
                      { label: "4.0+", value: 4 },
                      { label: "3.5+", value: 3.5 },
                    ].map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setMinRating(minRating === r.value ? null : r.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          minRating === r.value
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filters */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filterButtons.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setActiveFilter(activeFilter === f.value ? null : f.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeFilter === f.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-card shadow-card text-card-foreground"
                  }`}
                >
                  <f.icon className="h-3.5 w-3.5" />
                  {f.label}
                </button>
              ))}
              {[
                { label: "< 3 km", value: 3 },
                { label: "< 5 km", value: 5 },
                { label: "< 10 km", value: 10 },
              ].map((d) => (
                <button
                  key={`dist-${d.value}`}
                  onClick={() => setMaxDistance(maxDistance === d.value ? null : d.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    maxDistance === d.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-card shadow-card text-card-foreground"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {d.label}
                </button>
              ))}
              {[
                { label: "4.5+ ★", value: 4.5 },
                { label: "4.0+ ★", value: 4 },
              ].map((r) => (
                <button
                  key={`rate-${r.value}`}
                  onClick={() => setMinRating(minRating === r.value ? null : r.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    minRating === r.value
                      ? "bg-accent text-accent-foreground"
                      : "bg-card shadow-card text-card-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {isLoading ? "Loading..." : `${businesses.length} businesses found`}
              </p>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-card shadow-card animate-pulse">
                      <div className="aspect-[4/3] bg-secondary rounded-t-2xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-secondary rounded w-3/4" />
                        <div className="h-3 bg-secondary rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {businesses.map((biz, i) => (
                    <motion.div
                      key={biz.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                      <BusinessCard {...biz} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
