import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useCity } from "@/context/CityContext";

export function CitySelectionModal() {
  const {
    needsCitySelection,
    cities,
    setCity,
    loading,
    unsupportedAttemptedCity,
    dismissUnsupportedCityNotice,
  } = useCity();
  const [pendingCity, setPendingCity] = useState<string>("");

  const canSubmit = useMemo(() => pendingCity.trim().length > 0, [pendingCity]);
  const selectedCity = useMemo(
    () => cities.find((city) => city.slug === pendingCity) ?? null,
    [cities, pendingCity]
  );
  const isChandigarhSelected = useMemo(() => {
    if (!selectedCity) return false;
    const name = selectedCity.name.toLowerCase();
    const slug = selectedCity.slug.toLowerCase();
    return name === "chandigarh" || slug === "chandigarh";
  }, [selectedCity]);
  const showOnboardingMessage = Boolean(selectedCity) && !isChandigarhSelected;
  const isUnsupportedSelectionPopup = Boolean(unsupportedAttemptedCity);

  if (!needsCitySelection) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-elevated md:p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-accent p-2 text-gold">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {isUnsupportedSelectionPopup ? "City Not Available Yet" : "Choose Your City"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isUnsupportedSelectionPopup
                ? `We're currently onboarding businesses in ${unsupportedAttemptedCity?.name}. Chandigarh is available for now - stay tuned!`
                : "Select the city where you want to explore services."}
            </p>
          </div>
        </div>

        {isUnsupportedSelectionPopup ? (
          <button
            type="button"
            onClick={dismissUnsupportedCityNotice}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold px-4 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Got it
          </button>
        ) : (
          <>
            <select
              value={pendingCity}
              onChange={(event) => setPendingCity(event.target.value)}
              disabled={loading || cities.length === 0}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                {loading ? "Loading cities..." : "Select city"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>

            {showOnboardingMessage ? (
              <p className="mt-3 text-sm text-muted-foreground">
                We're currently onboarding businesses in this city. Chandigarh is available for now - stay tuned!
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setCity(pendingCity)}
              disabled={!canSubmit}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold px-4 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
