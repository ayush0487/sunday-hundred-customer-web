import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { SignupPayload, SignupVerifyPayload, LoginPayload, AuthData } from "@/types/api.types";
import { setAuthSession } from "@/lib/auth";

function hasAuthSession(data: unknown): data is AuthData {
  if (!data || typeof data !== "object") return false;
  const maybeAuth = data as Partial<AuthData>;
  return Boolean(maybeAuth.token && maybeAuth.user);
}

export function useSignupRequestOtp() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => authService.requestSignupOtp(payload),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupVerifyPayload) => authService.signup(payload),
    onSuccess: ({ data }) => {
      if (hasAuthSession(data.data)) {
        setAuthSession(data.data);
      }
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
