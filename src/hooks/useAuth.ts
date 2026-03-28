import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { SignupPayload, LoginPayload } from "@/types/api.types";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.data.token);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.data.token);
    },
  });
}
