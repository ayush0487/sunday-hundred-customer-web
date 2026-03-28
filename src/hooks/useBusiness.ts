import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import type { FeaturedBusinessData, FeaturedBusinessParams, Business, BusinessDetailParams } from "@/types/api.types";

export function useFeaturedBusinesses(params?: FeaturedBusinessParams, initialData?: FeaturedBusinessData) {
  return useQuery({
    queryKey: ["businesses", "featured", params],
    queryFn: () => businessService.getFeatured(params).then((res) => res.data.data),
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
