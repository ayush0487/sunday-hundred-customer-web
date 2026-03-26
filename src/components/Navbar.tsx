import { MapPin, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { getCurrentUserEmail } from "@/lib/auth";

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setIsLoggedIn(Boolean(getCurrentUserEmail()));
    };

    refresh();

    const onRouteChangeComplete = () => {
      refresh();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "servx_current_user_email") {
        refresh();
      }
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);
    window.addEventListener("storage", onStorage);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      window.removeEventListener("storage", onStorage);
    };
  }, [router.events]);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">S</span>
            </div>
            <span className="font-display text-xl font-bold hidden sm:block">
              Serv<span className="text-gold">X</span>
            </span>
          </Link>

          {/* Location */}
          <button className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="h-4 w-4 text-gold" />
            <span>Mumbai</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link href="/profile" className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors">
              <User className="h-5 w-5 text-muted-foreground" />
            </Link>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
