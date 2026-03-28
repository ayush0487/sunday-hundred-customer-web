import { useState, useEffect } from "react";

interface GeoLocation {
  lat: number;
  long: number;
}

interface UseGeolocationReturn {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "user_geolocation";

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage first for cached location
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as GeoLocation & { timestamp: number };
        // Use cached if less than 10 minutes old
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          setLocation({ lat: parsed.lat, long: parsed.long });
          setLoading(false);
          return;
        }
      }
    } catch {}

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geo: GeoLocation = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        setLocation(geo);
        setLoading(false);

        // Cache in localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...geo, timestamp: Date.now() }));
        } catch {}
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { location, loading, error };
}
