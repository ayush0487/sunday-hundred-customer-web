import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Star, MapPin, TrendingUp, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { BusinessCard } from "@/components/BusinessCard";
import { CategorySelector } from "@/components/CategorySelector";
import { CategoryBreadcrumb } from "@/components/CategoryBreadcrumb";
import { useFeaturedBusinesses } from "@/hooks/useBusiness";
import { useCategories } from "@/hooks/useCategories";
import { useGeolocation } from "@/hooks/useGeolocation";
import serverApi from "@/api/server";
import type { FeaturedBusinessData, FeaturedBusinessParams, Category, SubCategory } from "@/types/api.types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://app.sundayhundred.com").replace(/\/$/, "");

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
      serverApi.get("/business/getAllFeatureBusiness", { params: { page: 1, limit: 25 } }),
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
  const { location } = useGeolocation();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FeaturedBusinessParams["sort"] | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBusinesses, setAllBusinesses] = useState<FeaturedBusinessData["businesses"]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { categories, isLoading: categoriesLoading } = useCategories(ssrCategories ?? undefined);

  // Load selection from query params if available
  useEffect(() => {
    const { cat_id, subcat_id } = router.query;
    if (cat_id && categories.length > 0) {
      const category = categories.find((c) => c.id === cat_id);
      if (category) {
        setSelectedCategory(category);
        if (subcat_id && category.sub_categories) {
          const subcategory = category.sub_categories.find((sc) => sc.id === subcat_id);
          if (subcategory) {
            setSelectedSubcategory(subcategory);
            setShowCategorySelector(false);
            return;
          }
        }
      }
    }

    setShowCategorySelector(true);
  }, [router.query, categories]);

  const handleCategorySelect = (category: Category, subcategory: SubCategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setShowCategorySelector(false);
    
    // Update URL
    router.push(
      {
        pathname: "/categories",
        query: { cat_id: category.id, subcat_id: subcategory.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    router.push("/categories", undefined, { shallow: true });
  };

  const params: FeaturedBusinessParams = {
    page: currentPage,
    limit: 25,
    ...(location && { lat: location.lat, long: location.long }),
    ...(selectedSubcategory && { sub_category_id: selectedSubcategory.id }),
    ...(activeFilter && { sort: activeFilter }),
    ...(maxDistance && { max_distance: maxDistance }),
    ...(minRating && { min_rating: minRating }),
  };

  const isDefaultState = !selectedSubcategory && !activeFilter && !maxDistance && !minRating;
  const { data, isLoading, isFetching } = useFeaturedBusinesses(
    params,
    isDefaultState && currentPage === 1 ? (ssrBusinesses ?? undefined) : undefined
  );
  const businesses = data?.businesses ?? [];

  useEffect(() => {
    setCurrentPage(1);
    setAllBusinesses([]);
    setHasMore(true);
  }, [selectedSubcategory?.id, activeFilter, maxDistance, minRating, location?.lat, location?.long]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (currentPage === 1) {
      setAllBusinesses(businesses);
    } else {
      setAllBusinesses((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const next = businesses.filter((item) => !seen.has(item.id));
        return [...prev, ...next];
      });
    }

    const pagination = data.pagination;
    setHasMore(pagination.page < pagination.totalPages);
  }, [data, businesses, currentPage]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || isFetching || isLoading || !hasMore) {
          return;
        }

        setCurrentPage((prev) => prev + 1);
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isFetching, isLoading]);

  const pageTitle = selectedSubcategory
    ? `${selectedSubcategory.sub_cat} Services Near You — Sunday Hundred`
    : "Browse Services — Sunday Hundred";
  const canonicalUrl =
    selectedSubcategory
      ? `${SITE_URL}/categories?cat_id=${selectedCategory?.id}&subcat_id=${selectedSubcategory.id}`
      : `${SITE_URL}/categories`;
  const metaDescription = selectedSubcategory
    ? `Find top-rated ${selectedSubcategory.sub_cat} businesses near you on Sunday Hundred. Compare ratings and book your service today.`
    : "Browse and compare top-rated local businesses on Sunday Hundred. Find salons, gyms, services and more near you.";

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
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {selectedSubcategory ? selectedSubcategory.sub_cat : "Find Services"}
            </h1>
            <p className="text-gray-500">
              {selectedSubcategory
                ? `Explore the best ${selectedSubcategory.sub_cat} providers in your area`
                : "Explore top businesses near you or pick a category"}
            </p>
          </div>

          {/* Category Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {showCategorySelector || !selectedSubcategory ? (
              <CategorySelector
                categories={categories}
                onCategorySelect={handleCategorySelect}
                variant="inline"
                onClose={selectedSubcategory ? () => setShowCategorySelector(false) : undefined}
              />
            ) : (
              <CategoryBreadcrumb
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryClick={() => setShowCategorySelector(true)}
                onClear={handleClearSelection}
                isLoading={categoriesLoading}
              />
            )}
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (desktop) */}
            {/* <aside className="hidden lg:block w-64 shrink-0">
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
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside> */}

            {/* Mobile Filters */}
            {/* <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {r.label}
                </button>
              ))}
            </div> */}

            {/* Results Grid */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {isLoading && currentPage === 1 ? "Loading businesses..." : `${allBusinesses.length} businesses found`}
              </p>

              {isLoading && currentPage === 1 ? (
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
              ) : allBusinesses.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-12 text-center">
                  <p className="text-gray-600">
                    {selectedSubcategory || activeFilter || maxDistance || minRating
                      ? "No businesses found for your selection"
                      : "No businesses available right now"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedSubcategory || activeFilter || maxDistance || minRating
                      ? "Try changing your filters or category"
                      : "Please try again in a bit"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {allBusinesses.map((biz, i) => (
                      <motion.div
                        key={biz.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                      >
                        <BusinessCard {...biz} />
                      </motion.div>
                    ))}
                  </div>

                  <div ref={loadMoreRef} className="h-12 flex items-center justify-center mt-6">
                    {isFetching && currentPage > 1 ? (
                      <p className="text-xs text-muted-foreground">Loading more businesses...</p>
                    ) : !hasMore ? (
                      <p className="text-xs text-muted-foreground">You have reached the end.</p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
