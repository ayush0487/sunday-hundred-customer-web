import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, City } from "@/types/api.types";

export const cityService = {
  getAll() {
    return api.get<ApiResponse<City[]>>(ENDPOINTS.CITIES);
  },
};
