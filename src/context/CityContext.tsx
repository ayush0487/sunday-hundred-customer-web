import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useCities } from "@/hooks/useCities";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { City } from "@/types/api.types";

const CITY_STORAGE_KEY = "selected_city_slug";

interface CityContextValue {
  /** Currently selected city (null until cities load) */
  selectedCity: City | null;
  /** All available cities */
  cities: City[];
  /** Change selected city by slug */
  setCity: (slug: string) => void;
  /** True while cities are loading */
  loading: boolean;
}

const CityContext = createContext<CityContextValue>({
  selectedCity: null,
  cities: [],
  setCity: () => {},
  loading: true,
});

export function useCity() {
  return useContext(CityContext);
}

async function detectCitySlugFromLocation(lat: number, long: number, cities: City[]): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}&zoom=10&addressdetails=1`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return null;

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

    if (candidateNames.length === 0) return null;

    const matchedCity = cities.find((city) =>
      candidateNames.some((name) => name.includes(city.name.toLowerCase()))
    );
    return matchedCity?.slug ?? null;
  } catch {
    return null;
  }
}

export function CityProvider({ children }: { children: ReactNode }) {
  const { data: cities = [], isLoading } = useCities();
  const { location } = useGeolocation();
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [shouldAutoDetect, setShouldAutoDetect] = useState(false);

  // Step 1: Initialize from localStorage or default to first city
  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized || cities.length === 0) return;

    const savedSlug = window.localStorage.getItem(CITY_STORAGE_KEY);
    const hasSavedCity = savedSlug && cities.some((c) => c.slug === savedSlug);

    if (hasSavedCity) {
      setSelectedSlug(savedSlug);
      setHasInitialized(true);
      setShouldAutoDetect(false);
    } else {
      setSelectedSlug(cities[0].slug);
      window.localStorage.setItem(CITY_STORAGE_KEY, cities[0].slug);
      setHasInitialized(true);
      setShouldAutoDetect(true);
    }
  }, [cities, hasInitialized]);

  // Step 2: Auto-detect city from geolocation
  useEffect(() => {
    if (!hasInitialized || !shouldAutoDetect || !location || cities.length === 0) return;

    let cancelled = false;

    void detectCitySlugFromLocation(location.lat, location.long, cities).then((detectedSlug) => {
      if (cancelled || !detectedSlug) return;

      setSelectedSlug(detectedSlug);
      window.localStorage.setItem(CITY_STORAGE_KEY, detectedSlug);
      setShouldAutoDetect(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cities, hasInitialized, location, shouldAutoDetect]);

  const setCity = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      setShouldAutoDetect(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CITY_STORAGE_KEY, slug);
      }
    },
    []
  );

  const selectedCity = cities.find((c) => c.slug === selectedSlug) ?? null;

  return (
    <CityContext.Provider value={{ selectedCity, cities, setCity, loading: isLoading }}>
      {children}
    </CityContext.Provider>
  );
}
