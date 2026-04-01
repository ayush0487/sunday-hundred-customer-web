import type { GetServerSideProps } from "next";
import serverApi from "@/api/server";
import type { Business, FeaturedBusinessData } from "@/types/api.types";

const DEFAULT_SITE_URL = "https://app.sundayhundred.com";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function toXmlDate(value?: string): string {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function renderSitemap(urls: Array<{ loc: string; lastmod?: string; priority?: string; changefreq?: string }>): string {
  const entries = urls
    .map((url) => {
      return [
        "  <url>",
        `    <loc>${url.loc}</loc>`,
        `    <lastmod>${toXmlDate(url.lastmod)}</lastmod>`,
        url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : "",
        url.priority ? `    <priority>${url.priority}</priority>` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

async function getAllBusinesses(): Promise<Business[]> {
  const all: Business[] = [];
  const limit = 100;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await serverApi.get<{ data: FeaturedBusinessData }>("/business/getAllFeatureBusiness", {
      params: { page, limit },
    });

    const data = response.data?.data;
    const businesses = data?.businesses ?? [];
    totalPages = data?.pagination?.totalPages ?? 1;

    if (!businesses.length) {
      break;
    }

    all.push(...businesses);
    page += 1;
  }

  return all;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = getSiteUrl();

  const staticUrls = [
    { loc: `${siteUrl}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${siteUrl}/categories`, changefreq: "daily", priority: "0.9" },
  ];

  let dynamicBusinessUrls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }> = [];

  try {
    const businesses = await getAllBusinesses();
    dynamicBusinessUrls = businesses.map((business) => ({
      loc: `${siteUrl}/business/${business.id}`,
      lastmod: business.created_at,
      changefreq: "weekly",
      priority: "0.8",
    }));
  } catch {
    dynamicBusinessUrls = [];
  }

  const xml = renderSitemap([...staticUrls, ...dynamicBusinessUrls]);
  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}
