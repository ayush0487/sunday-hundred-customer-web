import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CitySelectionModal() {
  const { needsCitySelection, cities, setCity, loading } = useCity();
  const [pendingCity, setPendingCity] = useState<string>("");

  const canSubmit = useMemo(() => pendingCity.trim().length > 0, [pendingCity]);

  if (!needsCitySelection) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-elevated md:p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-accent p-2 text-gold">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Choose Your City</h2>
            <p className="mt-1 text-sm text-muted-foreground">Kahan ki services dekhni hain? City select karo.</p>
          </div>
        </div>

        <Select value={pendingCity || undefined} onValueChange={setPendingCity} disabled={loading || cities.length === 0}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder={loading ? "Loading cities..." : "Select city"} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.slug}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setCity(pendingCity)}
          disabled={!canSubmit}
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold px-4 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
