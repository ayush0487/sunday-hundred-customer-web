import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ApiResponse,
  FeaturedBusinessData,
  FeaturedBusinessParams,
  Business,
  BusinessDetailParams,
} from "@/types/api.types";

export const businessService = {
  getFeatured(params?: FeaturedBusinessParams) {
    return api.get<ApiResponse<FeaturedBusinessData>>(ENDPOINTS.FEATURED_BUSINESSES, { params });
  },

  getById(id: string | number, params?: BusinessDetailParams) {
    return api.get<ApiResponse<Business>>(ENDPOINTS.BUSINESS_BY_ID(id), { params });
  },
};
