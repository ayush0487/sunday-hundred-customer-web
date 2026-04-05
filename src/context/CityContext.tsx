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
  /** True when user must select a city first */
  needsCitySelection: boolean;
  /** Unsupported city selected by user (for notice popup) */
  unsupportedAttemptedCity: City | null;
  /** Close unsupported city notice popup */
  dismissUnsupportedCityNotice: () => void;
}

const CityContext = createContext<CityContextValue>({
  selectedCity: null,
  cities: [],
  setCity: () => {},
  loading: true,
  needsCitySelection: false,
  unsupportedAttemptedCity: null,
  dismissUnsupportedCityNotice: () => {},
});

export function useCity() {
  return useContext(CityContext);
}

function isSupportedCity(city: City): boolean {
  const name = city.name.toLowerCase();
  const slug = city.slug.toLowerCase();
  return name === "chandigarh" || slug === "chandigarh";
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
  const [needsCitySelection, setNeedsCitySelection] = useState(false);
  const [shouldAutoDetect, setShouldAutoDetect] = useState(false);
  const [unsupportedAttemptedCity, setUnsupportedAttemptedCity] = useState<City | null>(null);

  // Initialize from localStorage. If none is found, auto-detect first.
  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized || cities.length === 0) return;

    const savedSlug = window.localStorage.getItem(CITY_STORAGE_KEY);
    const savedCity = savedSlug ? cities.find((c) => c.slug === savedSlug) : null;
    const hasSupportedSavedCity = Boolean(savedCity && isSupportedCity(savedCity));

    if (hasSupportedSavedCity && savedCity) {
      setSelectedSlug(savedCity.slug);
      setNeedsCitySelection(false);
      setUnsupportedAttemptedCity(null);
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(CITY_STORAGE_KEY);
      }
      setSelectedSlug("");
      setNeedsCitySelection(false);
      setShouldAutoDetect(true);
      setUnsupportedAttemptedCity(null);
    }
    setHasInitialized(true);
  }, [cities, hasInitialized]);

  // Try to resolve city via geolocation and reverse geocoding.
  useEffect(() => {
    if (!hasInitialized || !shouldAutoDetect || !location || cities.length === 0) return;

    let cancelled = false;

    void detectCitySlugFromLocation(location.lat, location.long, cities).then((detectedSlug) => {
      if (cancelled) return;

      const detectedCity = detectedSlug ? cities.find((city) => city.slug === detectedSlug) : null;

      if (detectedCity && isSupportedCity(detectedCity)) {
        setSelectedSlug(detectedCity.slug);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CITY_STORAGE_KEY, detectedCity.slug);
        }
        setNeedsCitySelection(false);
        setUnsupportedAttemptedCity(null);
      } else {
        setNeedsCitySelection(true);
        setUnsupportedAttemptedCity(null);
      }

      setShouldAutoDetect(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cities, hasInitialized, location, shouldAutoDetect]);

  // If location is unavailable or denied, ask user after a short wait.
  useEffect(() => {
    if (!hasInitialized || !shouldAutoDetect) return;

    const timer = window.setTimeout(() => {
      setNeedsCitySelection(true);
      setShouldAutoDetect(false);
      setUnsupportedAttemptedCity(null);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasInitialized, shouldAutoDetect]);

  const setCity = useCallback(
    (slug: string) => {
      if (!slug || slug === "null") {
        return;
      }

      const matchedCity = cities.find((city) => city.slug === slug);
      if (!matchedCity) {
        return;
      }

      if (!isSupportedCity(matchedCity)) {
        const fallbackCity = cities.find((city) => isSupportedCity(city));
        if (fallbackCity) {
          setSelectedSlug(fallbackCity.slug);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(CITY_STORAGE_KEY, fallbackCity.slug);
          }
        }
        setUnsupportedAttemptedCity(matchedCity);
        setNeedsCitySelection(true);
        setShouldAutoDetect(false);
        return;
      }

      setSelectedSlug(matchedCity.slug);
      setNeedsCitySelection(false);
      setShouldAutoDetect(false);
      setUnsupportedAttemptedCity(null);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CITY_STORAGE_KEY, matchedCity.slug);
      }
    },
    [cities]
  );

  const selectedCity = cities.find((c) => c.slug === selectedSlug) ?? null;
  const dismissUnsupportedCityNotice = useCallback(() => {
    setUnsupportedAttemptedCity(null);
    setNeedsCitySelection(false);
  }, []);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        cities,
        setCity,
        loading: isLoading,
        needsCitySelection,
        unsupportedAttemptedCity,
        dismissUnsupportedCityNotice,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}
