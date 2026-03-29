import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { SignupPayload, LoginPayload } from "@/types/api.types";
import { setAuthSession } from "@/lib/auth";

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.signup(payload),
    onSuccess: ({ data }) => {
      setAuthSession(data.data);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data }) => {
      setAuthSession(data.data);
    },
  });
}
