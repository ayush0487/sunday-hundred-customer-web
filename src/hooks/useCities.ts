import { useQuery } from "@tanstack/react-query";
import { cityService } from "@/services/city.service";

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => cityService.getAll().then((res) => res.data.data),
  });
}
