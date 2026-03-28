import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, Category } from "@/types/api.types";

export const categoryService = {
  getAll() {
    return api.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES);
  },
};
