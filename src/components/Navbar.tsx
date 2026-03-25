import { MapPin, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">S</span>
          </div>
          <span className="font-display text-xl font-bold hidden sm:block">
            Serv<span className="text-gold">X</span>
          </span>
        </Link>

        {/* Location + Search (desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-8">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <MapPin className="h-4 w-4 text-gold" />
            <span>Mumbai</span>
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for services, salons, spas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/profile" className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors">
            <User className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            Mumbai
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
