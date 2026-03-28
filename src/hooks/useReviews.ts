import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import type { ReviewParams, ReviewData } from "@/types/api.types";

export function useReviews(businessId: string | number, params?: ReviewParams, initialData?: ReviewData) {
  return useQuery({
    queryKey: ["reviews", businessId, params],
    queryFn: () => reviewService.getByBusiness(businessId, params).then((res) => res.data.data),
    enabled: !!businessId,
    initialData,
  });
}
