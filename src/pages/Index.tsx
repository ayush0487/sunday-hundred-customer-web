import { Scissors, Dumbbell, Sparkles, Heart, Wrench, Paintbrush, Camera, Car, ChevronRight, Flame, MapPin, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Layout } from "@/components/Layout";
import { BusinessCard } from "@/components/BusinessCard";
import { CategoryCard } from "@/components/CategoryCard";
import { businesses } from "@/data/mock";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const heroSlides = [
  {
    id: 1,
    title: "Premium Beauty Services",
    subtitle: "Get 50% OFF on your first salon booking",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop",
    cta: "Book Now",
  },
  {
    id: 2,
    title: "Fitness & Wellness",
    subtitle: "Join thousands achieving their fitness goals",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
    cta: "Get Started",
  },
  {
    id: 3,
    title: "Relaxation & Spa",
    subtitle: "Experience ultimate relaxation with our premium spa services",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=600&fit=crop",
    cta: "Explore",
  },
  {
    id: 4,
    title: "Beauty & Skincare",
    subtitle: "Transform your skin with expert professionals",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=600&fit=crop",
    cta: "Learn More",
  },
];

const categories = [
  { name: "Salon", icon: Scissors, count: 120, href: "/categories" },
  { name: "Spa", icon: Sparkles, count: 85, href: "/categories" },
  { name: "Gym", icon: Dumbbell, count: 64, href: "/categories" },
  { name: "Beauty", icon: Heart, count: 93, href: "/categories" },
  { name: "Repairs", icon: Wrench, count: 42, href: "/categories" },
  { name: "Painters", icon: Paintbrush, count: 31, href: "/categories" },
  { name: "Photography", icon: Camera, count: 27, href: "/categories" },
  { name: "Car Care", icon: Car, count: 58, href: "/categories" },
];

const filters = [
  { label: "Top Rated", icon: Star },
  { label: "Nearby", icon: MapPin },
  { label: "Trending", icon: TrendingUp },
  { label: "Hot Deals", icon: Flame },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function Homepage() {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Layout>
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          setApi={setApi}
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-96 md:h-[500px]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container text-center">
                      <motion.h1
                        key={slide.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white"
                      >
                        {slide.title}
                      </motion.h1>
                      <motion.p
                        key={`${slide.id}-subtitle`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto"
                      >
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Link
                          to="/categories"
                          className="inline-block px-8 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                          {slide.cta}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current ? "bg-white w-8" : "bg-white/50"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Filters */}
      <section className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card shadow-card text-sm font-medium text-card-foreground hover:bg-accent whitespace-nowrap transition-colors shrink-0"
            >
              <f.icon className="h-4 w-4 text-gold" />
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold">Browse Categories</h2>
          <Link to="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <CategoryCard {...cat} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold">Featured Businesses</h2>
          <Link to="/categories" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
            See More <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {businesses.map((biz, i) => (
            <motion.div key={biz.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <BusinessCard {...biz} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="container py-8">
        <div className="rounded-2xl gradient-gold p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Exclusive Deals
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Get up to 50% off on your first booking. Limited time offer!
            </p>
            <Link
              to="/categories"
              className="inline-block px-6 py-3 rounded-xl bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Grab Offers Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-background/10 to-transparent pointer-events-none" />
        </div>
      </section>
    </Layout>
  );
}
