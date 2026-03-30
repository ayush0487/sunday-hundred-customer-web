import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, OffersData, OfferParams } from "@/types/api.types";

export const offerService = {
  getByBusiness(businessId: string | number, params?: OfferParams) {
    return api.get<ApiResponse<OffersData>>(
      ENDPOINTS.OFFERS_BY_BUSINESS(businessId),
      { params }
    );
  },
};
