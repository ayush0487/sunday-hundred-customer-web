import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";

const FALLBACK_BUSINESS_IMAGE = "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=450&fit=crop";

interface BusinessCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  category: string;
  tags?: string[];
  offer?: string;
  showOffer?: boolean;
  showTags?: boolean;
}

export function BusinessCard({ id, name, image, rating, reviews, distance, category, tags, offer, showOffer = true, showTags = true }: BusinessCardProps) {
  return (
    <Link
      to={`/business/${id}`}
      className="group relative z-10 block cursor-pointer rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
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
        <div className="absolute bottom-3 right-3">
          <div className="px-2 py-1 rounded-md glass text-xs font-medium flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {distance}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-card-foreground line-clamp-1">{name}</h3>
          <StarRating rating={rating} count={reviews} />
        </div>
        <p className="text-xs text-muted-foreground mb-3">{category}</p>
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
