import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/home/Hero";
import { QuickFilters } from "@/components/home/QuickFilters";
import { Categories } from "@/components/home/Categories";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { OffersBanner } from "@/components/home/OffersBanner";
import { useFeaturedBusinesses } from "@/hooks/useBusiness";
import { useCategories } from "@/hooks/useCategories";
import { useGeolocation } from "@/hooks/useGeolocation";
import serverApi from "@/api/server";
import type { FeaturedBusinessData, Category } from "@/types/api.types";

interface HomeProps {
  featuredData: FeaturedBusinessData | null;
  categories: Category[] | null;
}

export async function getServerSideProps() {
  try {
    const [featuredRes, categoriesRes] = await Promise.all([
      serverApi.get("/business/getAllFeatureBusiness", { params: { page: 1, limit: 6 } }),
      serverApi.get("/categories/"),
    ]);

    
    return {
      props: {
        featuredData: featuredRes.data.data ?? null,
        categories: categoriesRes.data.data ?? null,
      },
    };
  } catch {
    return { props: { featuredData: null, categories: null } };
  }
}

export default function Homepage({ featuredData, categories }: HomeProps) {
  const { location } = useGeolocation();
  const { data, isLoading } = useFeaturedBusinesses(
    { page: 1, limit: 6, ...(location && { lat: location.lat, long: location.long }) },
    featuredData ?? undefined
  );
  const { data: cats } = useCategories(categories ?? undefined);

  return (
    <>
      <Head>
        <title>Sunday Hundred — Find & Book Top Local Services</title>
        <meta name="description" content="Discover and book the best salons, spas, gyms, and local services near you. Top-rated businesses with instant WhatsApp booking." />
      </Head>
      <Layout>
        <Hero />
        <QuickFilters />
        <Categories ssrCategories={cats} />
        <FeaturedBusinesses businesses={data?.businesses ?? []} isLoading={isLoading} />
        <OffersBanner />
      </Layout>
    </>
  );
}
