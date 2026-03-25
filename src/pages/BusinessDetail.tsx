import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, Star, Share2, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { StarRating } from "@/components/StarRating";
import { businesses, services, reviews } from "@/data/mock";

const galleryImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop",
];

export default function BusinessDetail() {
  const { id } = useParams();
  const biz = businesses.find((b) => b.id === id) || businesses[0];
  const [currentImage, setCurrentImage] = useState(0);

  const handleBookNow = () => {
    window.open(
      `https://wa.me/919999999999?text=Hi, I'd like to book a service at ${biz.name}`,
      "_blank"
    );
  };

  return (
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
          <Link to="/categories" className="p-2.5 rounded-full glass hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2.5 rounded-full glass"><Share2 className="h-4 w-4" /></button>
          <button className="p-2.5 rounded-full glass"><Heart className="h-4 w-4" /></button>
        </div>
        {/* Carousel controls */}
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
        {/* Dots */}
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
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {biz.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full gradient-gold text-primary-foreground font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold mb-3">{biz.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <StarRating rating={biz.rating} count={biz.reviews} />
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {biz.distance}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Open now</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Experience premium {biz.category.toLowerCase()} services in a luxurious setting.
                Our expert team delivers exceptional results with personalized attention to every client.
              </p>
            </motion.div>

            {/* Services */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-bold mb-4">Services</h2>
              <div className="space-y-3">
                {services.map((svc, i) => (
                  <motion.div
                    key={svc.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-card shadow-card"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground">{svc.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{svc.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground line-through">₹{svc.originalPrice}</p>
                        <p className="font-bold text-gold">₹{svc.price}</p>
                      </div>
                      <button
                        onClick={handleBookNow}
                        className="px-4 py-2 rounded-lg gradient-gold text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Book
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-xl font-bold mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card shadow-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                        {rev.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rev.name}</p>
                        <p className="text-xs text-muted-foreground">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA (desktop) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-card shadow-elevated p-6">
              <h3 className="font-display text-lg font-bold mb-2">{biz.name}</h3>
              <StarRating rating={biz.rating} count={biz.reviews} />
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <p className="text-2xl font-bold text-gold">₹250</p>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full mt-6 py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Book via WhatsApp
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Instant confirmation on WhatsApp</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 p-4 glass border-t border-border">
        <button
          onClick={handleBookNow}
          className="w-full py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Book Now via WhatsApp
        </button>
      </div>
    </Layout>
  );
}
