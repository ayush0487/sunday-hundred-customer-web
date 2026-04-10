import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { useCity } from "@/context/CityContext";
import type { FeaturedBusinessData, FeaturedBusinessParams, Business, BusinessDetailParams } from "@/types/api.types";

export function useFeaturedBusinesses(params?: FeaturedBusinessParams, initialData?: FeaturedBusinessData) {
  const { selectedCity, needsCitySelection } = useCity();
  const currentPage = params?.page ?? 1;

  const effectiveParams: FeaturedBusinessParams = {
    ...params,
    ...(params?.city ? {} : selectedCity?.id ? { city: selectedCity.id } : {}),
  };

  return useQuery({
    queryKey: ["businesses", "featured", effectiveParams],
    queryFn: () => businessService.getFeatured(effectiveParams).then((res) => res.data.data),
    // Keep city gating for first-page discovery, but never block explicit pagination fetches.
    enabled: params?.city ? true : currentPage > 1 ? true : !needsCitySelection,
    // Only use SSR initialData for page 1, page 2+ always fetch fresh
    initialData: currentPage === 1 ? initialData : undefined,
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
