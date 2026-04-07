import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const heroSlides = [
  {
    id: 1,
    title: "Discover The Best Local Deals In Your City",
    subtitle: "Find salons, gyms, clinics, banquets & more with exclusive offers near you",
    image: "https://images.stockcake.com/public/0/9/c/09cfda9f-351f-4f89-a8c1-d65c6d54938c_large/vibrant-night-city-stockcake.jpg",
    cta: "Explore",
  },

  {
    id: 2,
    title: "Fitness & Wellness",
    subtitle: "Join thousands achieving their fitness goals",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
    cta: "Explore",
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
    cta: "Explore",
  },
];

const staticHeroSlide = heroSlides[0];
const carouselSlides = heroSlides.slice(1);

export function Hero() {
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
    <section className="relative overflow-hidden">
      <div className="relative h-96 md:h-[500px]">
        <img
          src={staticHeroSlide.image}
          alt={staticHeroSlide.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center">
            <motion.h1
              key={staticHeroSlide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white"
            >
              {staticHeroSlide.title}
            </motion.h1>
            <motion.p
              key={`${staticHeroSlide.id}-subtitle`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto"
            >
              {staticHeroSlide.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/categories"
                className="inline-block px-8 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {staticHeroSlide.cta}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {carouselSlides.length > 0 && (
        <div className="relative mt-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
              }),
            ]}
            setApi={setApi}
          >
            <CarouselContent>
              {carouselSlides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="container text-center">
                        <motion.h2
                          key={slide.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white"
                        >
                          {slide.title}
                        </motion.h2>
                        <motion.p
                          key={`${slide.id}-subtitle`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto"
                        >
                          {slide.subtitle}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <Link
                            href="/categories"
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

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {carouselSlides.map((_, index) => (
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
        </div>
      )}
    </section>
  );
}
