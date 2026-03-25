import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

export function CategoryCard({ name, icon: Icon, count, href }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm text-card-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{count} services</p>
      </div>
    </Link>
  );
}
