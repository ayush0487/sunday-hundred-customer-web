import { useQuery } from "@tanstack/react-query";
import { offerService } from "@/services/offer.service";
import type { OfferParams, OffersData } from "@/types/api.types";

export function useOffers(businessId: string | number | undefined, params?: OfferParams, initialData?: OffersData) {
  return useQuery({
    queryKey: ["offers", businessId, params],
    queryFn: () => offerService.getByBusiness(businessId!, params).then((res) => res.data.data),
    enabled: !!businessId,
    initialData,
  });
}
