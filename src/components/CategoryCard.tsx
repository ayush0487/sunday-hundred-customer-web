import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon?: LucideIcon;
  count?: number;
  href: string;
  image?: string;
}

export function CategoryCard({ name, icon: Icon, count, href, image }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {image ? (
        <div className="w-14 h-14 rounded-2xl overflow-hidden relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : Icon ? (
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <div className="text-center">
        <p className="font-medium text-sm text-card-foreground line-clamp-2">{name}</p>
        {count != null && <p className="text-xs text-muted-foreground">{count} services</p>}
      </div>
    </Link>
  );
}
