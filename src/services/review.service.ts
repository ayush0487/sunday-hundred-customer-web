import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, ReviewData, ReviewParams } from "@/types/api.types";

export const reviewService = {
  getByBusiness(businessId: string | number, params?: ReviewParams) {
    return api.get<ApiResponse<ReviewData>>(ENDPOINTS.REVIEWS(businessId), { params });
  },

  getByUser(userId: string | number, params?: ReviewParams) {
    return api.get<ApiResponse<ReviewData>>(ENDPOINTS.REVIEWS_BY_USER(userId), { params });
  },
};
