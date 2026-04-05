import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { RegistrationBanner } from "@/components/home/RegistrationBanner";
import { OffersBanner } from "@/components/home/OffersBanner";
import { DiscoverBox } from "@/components/home/DiscoverBox";
import { HowItWorksStrip } from "@/components/home/HowItWorksStrip";
import { ComboDealsStrip } from "@/components/home/ComboDealsStrip";
import { useFeaturedBusinesses } from "@/hooks/useBusiness";
import { useCategories } from "@/hooks/useCategories";
import { useGeolocation } from "@/hooks/useGeolocation";
import serverApi from "@/api/server";
import type { FeaturedBusinessData, Category } from "@/types/api.types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://app.sundayhundred.com").replace(/\/$/, "");

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
  const { categories: cats } = useCategories(categories ?? undefined);
  const canonicalUrl = `${SITE_URL}/`;
  const description =
    "Find top-rated local businesses near you on sundayhundred. Compare ratings, services, offers, and book instantly via WhatsApp.";
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "sundayhundred",
    url: canonicalUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/categories?category={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "sundayhundred",
    url: SITE_URL,
    logo: `${SITE_URL}/sundayhundred.jpeg`,
  };

  return (
    <>
      <Head>
        <title>sundayhundred - Find Top Local Services Near You</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="sundayhundred - Find Top Local Services Near You" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="sundayhundred" />
        <meta property="og:image" content={`${SITE_URL}/sundayhundred.jpeg`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="sundayhundred - Find Top Local Services Near You" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SITE_URL}/sundayhundred.jpeg`} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </Head>
      <Layout>
        <Hero />
        {/* <RegistrationBanner /> */}
        <OffersBanner />
        <Categories ssrCategories={cats} />
        <FeaturedBusinesses businesses={data?.businesses ?? []} isLoading={isLoading} />
        <HowItWorksStrip />
        <ComboDealsStrip />
        <DiscoverBox />
      </Layout>
    </>
  );
}
