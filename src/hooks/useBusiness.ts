import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { useCity } from "@/context/CityContext";
import type { FeaturedBusinessData, FeaturedBusinessParams, Business, BusinessDetailParams } from "@/types/api.types";

export function useFeaturedBusinesses(params?: FeaturedBusinessParams, initialData?: FeaturedBusinessData) {
  const { selectedCity, needsCitySelection } = useCity();

  const effectiveParams: FeaturedBusinessParams = {
    ...params,
    ...(params?.city ? {} : selectedCity?.name ? { city: selectedCity.name } : {}),
  };

  return useQuery({
    queryKey: ["businesses", "featured", effectiveParams],
    queryFn: () => businessService.getFeatured(effectiveParams).then((res) => res.data.data),
    enabled: params?.city ? true : !needsCitySelection,
    initialData,
  });
}

export function useBusinessById(id: string | number, params?: BusinessDetailParams, initialData?: Business) {
  return useQuery({
    queryKey: ["business", id, params],
    queryFn: () => businessService.getById(id, params).then((res) => res.data.data),
    enabled: !!id,
    initialData,
  });
}
