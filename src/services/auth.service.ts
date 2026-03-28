import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse, AuthData, SignupPayload, LoginPayload } from "@/types/api.types";

export const authService = {
  signup(payload: SignupPayload) {
    return api.post<ApiResponse<AuthData>>(ENDPOINTS.SIGNUP, payload);
  },

  login(payload: LoginPayload) {
    return api.post<ApiResponse<AuthData>>(ENDPOINTS.LOGIN, payload);
  },
};
