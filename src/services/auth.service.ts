import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ApiResponse,
  AuthData,
  SignupPayload,
  SignupRequestOtpData,
  SignupVerifyPayload,
  LoginPayload,
} from "@/types/api.types";

export const authService = {
  requestSignupOtp(payload: SignupPayload) {
    return api.post<ApiResponse<SignupRequestOtpData>>(ENDPOINTS.SIGNUP_REQUEST_OTP, payload);
  },

  signup(payload: SignupVerifyPayload) {
    return api.post<ApiResponse<AuthData>>(ENDPOINTS.SIGNUP, payload);
  },

  login(payload: LoginPayload) {
    return api.post<ApiResponse<AuthData>>(ENDPOINTS.LOGIN, payload);
  },
};
