import { Layout } from "@/components/Layout";
import { Hero } from "@/components/home/Hero";
import { QuickFilters } from "@/components/home/QuickFilters";
import { Categories } from "@/components/home/Categories";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { OffersBanner } from "@/components/home/OffersBanner";

export async function getServerSideProps({ req }: { req: { headers: Record<string, unknown> } }) {
  const protoHeader = req.headers["x-forwarded-proto"];
  const hostHeader = req.headers["x-forwarded-host"] ?? req.headers["host"];
  const protocol = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader) ?? "http";
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/businesses`);
  const businesses = await res.json();

  return {
    props: {
      businesses,
    },
  };
}

export default function Homepage({ businesses }: { businesses: any[] }) {
  return (
    <Layout>
      <Hero />
      <QuickFilters />
      <Categories />
      <FeaturedBusinesses businesses={businesses} />
      <OffersBanner />
    </Layout>
  );
}
