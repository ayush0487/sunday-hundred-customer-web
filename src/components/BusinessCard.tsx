import { MapPin } from "lucide-react";
import Link from "next/link";

const FALLBACK_BUSINESS_IMAGE = "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=450&fit=crop";

interface BusinessCardProps {
  id: string;
  name: string;
  image?: string;
  image_url?: string;
  rating: number;
  total_reviews?: number;
  reviews?: number;
  distance?: string;
  distance_km?: number;
  category?: string;
  category_name?: string;
  tags?: string[];
  offer?: string;
  showOffer?: boolean;
  showTags?: boolean;
}

export function BusinessCard({
  id,
  name,
  image,
  image_url,
  rating,
  total_reviews,
  reviews,
  distance,
  distance_km,
  category,
  category_name,
  tags,
  offer,
  showOffer = true,
  showTags = true,
}: BusinessCardProps) {
  void rating;
  void total_reviews;
  void reviews;
  const distanceText = distance ?? (distance_km != null ? `${distance_km} km` : "");
  const categoryText = category_name ?? category ?? "";
  const businessImage = image_url || image || FALLBACK_BUSINESS_IMAGE;

  return (
    <Link
      href={`/business/${id}`}
      className="group relative z-10 block cursor-pointer rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={businessImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(event) => {
            const target = event.currentTarget;
            target.onerror = null;
            target.src = FALLBACK_BUSINESS_IMAGE;
          }}
        />
        {showOffer && offer && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg gradient-gold text-xs font-bold text-primary-foreground">
            {offer}
          </div>
        )}
        {distanceText && (
          <div className="absolute bottom-3 right-3">
            <div className="px-2 py-1 rounded-md glass text-xs font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {distanceText}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-card-foreground line-clamp-1 mb-2">{name}</h3>
        {categoryText && <p className="text-xs text-muted-foreground mb-3">{categoryText}</p>}
        {showTags && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
