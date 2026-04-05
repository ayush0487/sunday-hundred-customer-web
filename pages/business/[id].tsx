import { useState } from "react";
import Head from "next/head";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { OfferCard } from "@/components/OfferCard";
import { useRouter } from "next/router";
import { useBusinessById } from "@/hooks/useBusiness";
import { useOffers } from "@/hooks/useOffers";
import { useGeolocation } from "@/hooks/useGeolocation";
import serverApi from "@/api/server";
import type { GetServerSidePropsContext } from "next";
import type { Business, OffersData } from "@/types/api.types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://app.sundayhundred.com").replace(/\/$/, "");

const placeholderImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop",
];

interface PageProps {
  ssrBusiness: Business | null;
  ssrOffers: OffersData | null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };

  try {
    const [bizRes, offersRes] = await Promise.all([
      serverApi.get(`/business/getBusinessById/${id}`),
      serverApi.get(`/offers/business/${id}`, { params: { limit: 10, page: 1, active_only: true } }),
    ]);

    return {
      props: {
        ssrBusiness: bizRes.data.data ?? null,
        ssrOffers: offersRes.data.data ?? null,
      },
    };
  } catch {
    return { props: { ssrBusiness: null, ssrOffers: null } };
  }
}

export default function BusinessDetail({ ssrBusiness, ssrOffers }: PageProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { location } = useGeolocation();

  const locationParams = location ? { lat: location.lat, long: location.long } : undefined;
  const { data: biz, isLoading: bizLoading } = useBusinessById(id as string, locationParams, ssrBusiness ?? undefined);
  const { data: offersData, isLoading: offersLoading } = useOffers(id as string, { limit: 10, page: 1, active_only: true }, ssrOffers ?? undefined);

  const services = biz?.services ?? [];
  const offers = offersData?.offers ?? [];

  const handleBookNow = (serviceName?: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const returnTo = router.asPath;
      void router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    const messageText = serviceName
      ? `Hi, I'd like to book ${serviceName} at ${biz?.name}`
      : `Hi, I'd like to book a service at ${biz?.name}`;

    // Use whatsapp_no if available, otherwise use contact for calling
    if (biz?.whatsapp_no) {
      window.open(
        `https://wa.me/${biz.whatsapp_no}?text=${encodeURIComponent(messageText)}`,
        "_blank"
      );
    } else if (biz?.contact) {
      window.location.href = `tel:${biz.contact}`;
    }
  };

  if (bizLoading && !biz) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-secondary" />
          <div className="container py-6 md:py-10 space-y-6">
            <div className="h-8 bg-secondary rounded w-1/3" />
            <div className="h-4 bg-secondary rounded w-1/2" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!biz) {
    return (
      <Layout>
        <Head>
          <title>Business Not Found - sundayhundred</title>
          <meta name="robots" content="noindex,follow" />
        </Head>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Business not found</h1>
          <Link href="/categories" className="text-gold hover:underline">Browse businesses</Link>
        </div>
      </Layout>
    );
  }

  const minPrice = services.length > 0 ? Math.min(...services.map((s) => s.price)) : null;
  const galleryImages = biz?.image_url ? [biz.image_url] : placeholderImages;
  const canonicalUrl = `${SITE_URL}/business/${biz.id}`;
  const metaDescription = biz.description || `Book ${biz.category_name} services at ${biz.name}.`;
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: biz.name,
    description: biz.description || undefined,
    image: biz.image_url || `${SITE_URL}/sundayhundred.jpeg`,
    telephone: biz.contact || biz.whatsapp_no || undefined,
    url: canonicalUrl,
    makesOffer:
      services.length > 0
        ? services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description || undefined,
            },
            price: service.price,
            priceCurrency: "INR",
          }))
        : undefined,
  };

  return (
    <>
      <Head>
        <title>{`${biz.name} - ${biz.category_name || "Local Services"} | sundayhundred`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={`${biz.name} - Book Services on sundayhundred`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={biz.image_url || `${SITE_URL}/sundayhundred.jpeg`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${biz.name} - Book Services on sundayhundred`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={biz.image_url || `${SITE_URL}/sundayhundred.jpeg`} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      </Head>
      <Layout>
        {/* Gallery */}
        <div className="relative">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-secondary">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={galleryImages[currentImage]}
              alt={biz.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <Link href="/categories" className="p-2.5 rounded-full glass hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2.5 rounded-full glass"><Share2 className="h-4 w-4" /></button>
          </div>
          <button
            onClick={() => setCurrentImage((p) => (p === 0 ? galleryImages.length - 1 : p - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentImage((p) => (p === galleryImages.length - 1 ? 0 : p + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass hidden md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-gold w-6" : "bg-foreground/40"}`}
              />
            ))}
          </div>
        </div>

        <div className="container py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-2xl md:text-4xl font-bold mb-3">{biz.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {biz.distance_km != null && (
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {biz.distance_km} km</span>
                  )}
                  {biz.category_name && (
                    <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {biz.category_name}
                    </span>
                  )}
                </div>
                {biz.description && (
                  <p className="text-muted-foreground leading-relaxed mb-8">{biz.description}</p>
                )}
              </motion.div>

              {/* Offers */}
              {(offersLoading || offers.length > 0) && (
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold mb-4">Special Offers</h2>
                  {offersLoading && !offers.length ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-card shadow-card animate-pulse space-y-2">
                          <div className="h-4 bg-secondary rounded w-3/4" />
                          <div className="h-3 bg-secondary rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : offers.length > 0 ? (
                    <div className="space-y-3">
                      {offers.map((offer, i) => (
                        <OfferCard key={offer.id} offer={offer} index={i} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No active offers available.</p>
                  )}
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="mb-10">
                  <h2 className="font-display text-xl font-bold mb-4">Services</h2>
                  <div className="space-y-3">
                    {services.map((svc, i) => (
                      <motion.div
                        key={svc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-card shadow-card"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-card-foreground">{svc.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{svc.duration} min</span>
                          </div>
                          {svc.description && (
                            <p className="text-xs text-muted-foreground mt-1">{svc.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-gold">₹{svc.price}</p>
                          <button
                            onClick={() => handleBookNow(svc.name)}
                            className="px-4 py-2 rounded-lg gradient-gold text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                          >
                            Book
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review system intentionally hidden */}
            </div>

            {/* Sidebar CTA (desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 rounded-2xl bg-card shadow-elevated p-6">
                <h3 className="font-display text-lg font-bold mb-2">{biz.name}</h3>
                {minPrice != null && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-gold">₹{minPrice}</p>
                  </div>
                )}
                <button
                  onClick={() => handleBookNow()}
                  className="w-full mt-6 py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  {biz?.whatsapp_no ? "Book via WhatsApp" : "Call"}
                </button>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Instant confirmation on WhatsApp</p>
              </div>
            </aside>
          </div>
        </div>

        {/* Sticky mobile CTA */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 p-4 glass border-t border-border">
          <button
            onClick={() => handleBookNow()}
            className="w-full py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            {biz?.whatsapp_no ? "Book Now via WhatsApp" : "Call Now"}
          </button>
        </div>
      </Layout>
    </>
  );
}
