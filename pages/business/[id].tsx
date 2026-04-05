import { useState } from "react";
import Head from "next/head";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BusinessCard } from "@/components/BusinessCard";
import { OfferCard } from "@/components/OfferCard";
import { useRouter } from "next/router";
import { useBusinessById, useFeaturedBusinesses } from "@/hooks/useBusiness";
import { useOffers } from "@/hooks/useOffers";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getAuthToken } from "@/lib/auth";
import serverApi from "@/api/server";
import type { GetServerSidePropsContext } from "next";
import type { Business, OffersData } from "@/types/api.types";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://app.sundayhundred.com").replace(/\/$/, "");

const placeholderImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop",
];

function normalizePhoneNumber(value?: string | null) {
  return value ? value.replace(/\D/g, "") : "";
}

function formatPhoneNumber(value?: string | null) {
  if (!value) {
    return "";
  }

  const digits = normalizePhoneNumber(value);
  return digits || value;
}

interface PageProps {
  ssrBusiness: Business | null;
  ssrOffers: OffersData | null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };

  try {
    const [bizRes, offersRes] = await Promise.all([
      serverApi.get(`/business/getBusinessById/${id}`, { params: { source: "app" } }),
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

  const businessParams = {
    source: "app",
    ...(location ? { lat: location.lat, long: location.long } : {}),
  };
  const { data: biz, isLoading: bizLoading } = useBusinessById(id as string, businessParams, ssrBusiness ?? undefined);
  const { data: offersData, isLoading: offersLoading } = useOffers(id as string, { limit: 10, page: 1, active_only: true }, ssrOffers ?? undefined);
  const { data: relatedData, isLoading: relatedLoading } = useFeaturedBusinesses(
    biz
      ? {
          page: 1,
          limit: 6,
          ...(biz.city_id ? { city: biz.city_id } : {}),
          ...(biz.category_id ? { category_id: biz.category_id } : {}),
          ...(biz.sub_category_id ? { sub_category_id: biz.sub_category_id } : {}),
        }
      : undefined
  );

  const services = biz?.services ?? [];
  const offers = offersData?.offers ?? [];
  const relatedBusinesses = relatedData?.businesses.filter((item) => item.id !== biz?.id) ?? [];
  const addressText = biz?.address || biz?.city_name || "";
  const contactNumber = formatPhoneNumber(biz?.contact);
  const whatsappNumber = normalizePhoneNumber(biz?.whatsapp_no || biz?.contact);
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const callHref = contactNumber ? `tel:${normalizePhoneNumber(contactNumber) || contactNumber}` : "";
  const loginHref = `/login?returnTo=${encodeURIComponent(router.asPath)}`;
  const relatedTitle = biz?.sub_category_name
    ? `More ${biz.sub_category_name}`
    : biz?.category_name
      ? `More in ${biz.category_name}`
      : "More businesses like this";
  const isLoggedIn = Boolean(getAuthToken());

  const requireLogin = () => {
    void router.push(loginHref);
  };

  const handleBookNow = (serviceName?: string) => {
    if (!Boolean(getAuthToken())) {
      requireLogin();
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

  const handleShare = async () => {
    if (!biz) {
      return;
    }

    if (!Boolean(getAuthToken())) {
      requireLogin();
      return;
    }

    const shareUrl = canonicalUrl;
    const shareText = `${biz.name}${biz.address ? ` • ${biz.address}` : ""}`;

    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: biz.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to copy link below.
      }
    }

    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
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
            <button onClick={handleShare} className="p-2.5 rounded-full glass hover:bg-accent transition-colors" aria-label="Share business">
              <Share2 className="h-4 w-4" />
            </button>
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

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-gold/10 text-gold">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Address</p>
                        <p className="font-medium leading-relaxed text-card-foreground">{addressText || "Address not available"}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={callHref || undefined}
                    onClick={isLoggedIn ? undefined : (event) => {
                      event.preventDefault();
                      requireLogin();
                    }}
                    className={`rounded-2xl border border-border bg-card p-4 shadow-card transition-colors ${callHref ? "hover:border-gold/40 hover:bg-gold/5" : "opacity-70"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-foreground/5 text-foreground">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Phone</p>
                        <p className="font-medium leading-relaxed text-card-foreground">{contactNumber || "Call unavailable"}</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href={whatsappHref || undefined}
                    target={whatsappHref ? "_blank" : undefined}
                    rel={whatsappHref ? "noreferrer" : undefined}
                    onClick={isLoggedIn ? undefined : (event) => {
                      event.preventDefault();
                      requireLogin();
                    }}
                    className={`rounded-2xl border border-border bg-card p-4 shadow-card transition-colors ${whatsappHref ? "hover:border-gold/40 hover:bg-gold/5" : "opacity-70"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-green-500/10 text-green-600">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">WhatsApp</p>
                        <p className="font-medium leading-relaxed text-card-foreground">{formatPhoneNumber(biz.whatsapp_no || biz.contact) || "WhatsApp unavailable"}</p>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Keep contact info visible; primary actions stay in the sidebar to reduce CTA clutter. */}
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

              {(relatedLoading || relatedBusinesses.length > 0) && (
                <div className="mb-10">
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-display text-xl font-bold">{relatedTitle}</h2>
                      <p className="text-sm text-muted-foreground">Similar businesses in the same service category.</p>
                    </div>
                  </div>
                  {relatedLoading && !relatedBusinesses.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-2xl overflow-hidden bg-card shadow-card animate-pulse">
                          <div className="aspect-[4/3] bg-secondary" />
                          <div className="p-4 space-y-3">
                            <div className="h-4 w-3/4 rounded bg-secondary" />
                            <div className="h-3 w-1/2 rounded bg-secondary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : relatedBusinesses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {relatedBusinesses.slice(0, 6).map((business) => (
                        <BusinessCard
                          key={business.id}
                          id={business.id}
                          name={business.name}
                          image_url={business.image_url}
                          rating={business.rating}
                          total_reviews={business.total_reviews}
                          distance_km={business.distance_km}
                          category_name={business.category_name}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No similar businesses available right now.</p>
                  )}
                </div>
              )}

              {/* Review system intentionally hidden */}
            </div>

            {/* Sidebar CTA (desktop) */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-24 rounded-2xl bg-card shadow-elevated p-6 space-y-4">
                <h3 className="font-display text-lg font-bold mb-2">{biz.name}</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <p>{addressText || "Address not available"}</p>
                  </div>
                  {contactNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <p>{contactNumber}</p>
                    </div>
                  )}
                  {biz.whatsapp_no && (
                    <div className="flex items-start gap-3">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <p>{formatPhoneNumber(biz.whatsapp_no)}</p>
                    </div>
                  )}
                </div>
                {minPrice != null && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-gold">₹{minPrice}</p>
                  </div>
                )}
                <button
                  onClick={() => handleBookNow()}
                  className="w-full py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Book via WhatsApp
                </button>
                {/* <p className="text-[10px] text-muted-foreground text-center">Clicking will check login first, then open WhatsApp or call based on the profile.</p> */}
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
