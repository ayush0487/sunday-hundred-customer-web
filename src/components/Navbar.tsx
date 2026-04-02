import { MapPin, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { getCurrentUserEmail } from "@/lib/auth";
import { useCity } from "@/context/CityContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { selectedCity, cities, setCity } = useCity();

  useEffect(() => {
    const refresh = () => {
      setIsLoggedIn(Boolean(getCurrentUserEmail()));
    };

    refresh();

    const onRouteChangeComplete = () => {
      refresh();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "token" || event.key === "user") {
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
            <Image
              src="/sundayhundred.jpeg"
              alt="sundayhundred logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
              priority
            />
            <span className="font-display text-xl font-bold hidden sm:block">sundayhundred</span>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm">
            <MapPin className="h-4 w-4 text-gold" />
            <Select value={selectedCity?.slug ?? ""} onValueChange={setCity}>
              <SelectTrigger className="h-8 min-w-[130px] border-0 bg-transparent px-1 text-xs md:text-sm text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.slug}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
