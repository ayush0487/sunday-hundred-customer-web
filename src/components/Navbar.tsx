import { MapPin, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { getCurrentUserEmail } from "@/lib/auth";
import { useCities } from "@/hooks/useCities";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { City } from "@/types/api.types";

const CITY_STORAGE_KEY = "selected_city_slug";

async function detectCitySlugFromLocation(lat: number, long: number, cities: City[]): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}&zoom=10&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state_district?: string;
        state?: string;
      };
    };

    const candidateNames = [
      data.address?.city,
      data.address?.town,
      data.address?.village,
      data.address?.state_district,
      data.address?.state,
    ]
      .filter(Boolean)
      .map((value) => value!.toLowerCase());

    if (candidateNames.length === 0) {
      return null;
    }

    const matchedCity = cities.find((city) => candidateNames.some((name) => name.includes(city.name.toLowerCase())));
    return matchedCity?.slug ?? null;
  } catch {
    return null;
  }
}

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>("");
  const [hasInitializedCity, setHasInitializedCity] = useState(false);
  const [shouldAutoDetectCity, setShouldAutoDetectCity] = useState(false);
  const { data: cities = [] } = useCities();
  const { location } = useGeolocation();

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

  useEffect(() => {
    if (typeof window === "undefined" || hasInitializedCity || cities.length === 0) {
      return;
    }

    const savedSlug = window.localStorage.getItem(CITY_STORAGE_KEY);
    const hasSavedCity = savedSlug && cities.some((city) => city.slug === savedSlug);

    if (hasSavedCity) {
      setSelectedCitySlug(savedSlug);
      setHasInitializedCity(true);
      setShouldAutoDetectCity(false);
      return;
    }

    const defaultCity = cities[0];
    setSelectedCitySlug(defaultCity.slug);
    window.localStorage.setItem(CITY_STORAGE_KEY, defaultCity.slug);
    setHasInitializedCity(true);
    setShouldAutoDetectCity(true);
  }, [cities, hasInitializedCity]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !hasInitializedCity ||
      !shouldAutoDetectCity ||
      !location ||
      cities.length === 0
    ) {
      return;
    }

    let cancelled = false;

    void detectCitySlugFromLocation(location.lat, location.long, cities).then((detectedSlug) => {
      if (cancelled || !detectedSlug) {
        return;
      }

      setSelectedCitySlug(detectedSlug);
      window.localStorage.setItem(CITY_STORAGE_KEY, detectedSlug);
      setShouldAutoDetectCity(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cities, hasInitializedCity, location, shouldAutoDetectCity]);

  const onCityChange = (slug: string) => {
    setSelectedCitySlug(slug);
    setShouldAutoDetectCity(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CITY_STORAGE_KEY, slug);
    }
  };

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
            <Select value={selectedCitySlug} onValueChange={onCityChange}>
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
