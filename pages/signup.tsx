import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignup, useSignupRequestOtp } from "@/hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const requestOtpMutation = useSignupRequestOtp();
  const signupMutation = useSignup();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request-otp" | "verify-otp">("request-otp");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [otpExpiresInMinutes, setOtpExpiresInMinutes] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/profile");
    }
  }, [router]);

  useEffect(() => {
    if (step !== "verify-otp" || resendCooldownSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [step, resendCooldownSeconds]);

  const onRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim().replace(/\s+/g, "");

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setError("Name must be between 2 and 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!/^\d{10,15}$/.test(trimmedPhone)) {
      setError("Phone must be 10 to 15 digits.");
      return;
    }

    if (password.length < 6 || password.length > 100) {
      setError("Password must be between 6 and 100 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    requestOtpMutation.mutate(
      { name: trimmedName, email: trimmedEmail, phone: trimmedPhone, password },
      {
        onSuccess: ({ data }) => {
          const expiresInMinutes = data?.data?.expires_in_minutes ?? 10;
          setStep("verify-otp");
          setOtp("");
          setResendCooldownSeconds(60);
          setOtpExpiresInMinutes(expiresInMinutes);
          setSuccessMessage(
            data?.message || `OTP sent to ${trimmedEmail}. It will expire in ${expiresInMinutes} minutes.`
          );
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || err.message || "Could not send OTP. Please try again.");
        },
      }
    );
  };

  const onResendOtp = () => {
    if (resendCooldownSeconds > 0 || requestOtpMutation.isPending) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim().replace(/\s+/g, "");

    setError(null);
    setSuccessMessage(null);

    requestOtpMutation.mutate(
      { name: trimmedName, email: trimmedEmail, phone: trimmedPhone, password },
      {
        onSuccess: ({ data }) => {
          const expiresInMinutes = data?.data?.expires_in_minutes ?? otpExpiresInMinutes ?? 10;
          setOtp("");
          setResendCooldownSeconds(60);
          setOtpExpiresInMinutes(expiresInMinutes);
          setSuccessMessage(
            data?.message || `A new OTP has been sent to ${trimmedEmail}. It will expire in ${expiresInMinutes} minutes.`
          );
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || err.message || "Could not resend OTP. Please try again.");
        },
      }
    );
  };

  const onVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedOtp = otp.trim();
    if (!/^\d{6}$/.test(trimmedOtp)) {
      setError("OTP must be a 6 digit code.");
      return;
    }

    signupMutation.mutate(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim().replace(/\s+/g, ""),
        password,
        otp: trimmedOtp,
      },
      {
        onSuccess: ({ data }) => {
          if (data?.data?.token) {
            router.push("/profile");
            return;
          }
          router.push("/login?signup=success");
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || err.message || "OTP verification failed. Please try again.");
        },
      }
    );
  };

  return (
    <Layout>
      <Head>
        <title>Sign Up | sundayhundred</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="container py-10 md:py-16 max-w-md mx-auto">
        <Card className="rounded-2xl shadow-elevated">
          <CardHeader>
            <CardTitle className="font-display">Create account</CardTitle>
            <CardDescription>
              {step === "request-otp" ? "Step 1: Enter details to get OTP on email." : "Step 2: Verify OTP to create account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={step === "request-otp" ? onRequestOtp : onVerifyOtp}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={step === "verify-otp"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={step === "verify-otp"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  disabled={step === "verify-otp"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={step === "verify-otp"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={step === "verify-otp"}
                />
              </div>

              {step === "verify-otp" ? (
                <div className="space-y-2">
                  <Label htmlFor="otp">Email OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    inputMode="numeric"
                    maxLength={6}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {otpExpiresInMinutes
                        ? `OTP valid for ${otpExpiresInMinutes} minutes.`
                        : "Enter the OTP sent to your email."}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto px-0 text-xs text-primary hover:text-primary"
                      onClick={onResendOtp}
                      disabled={resendCooldownSeconds > 0 || requestOtpMutation.isPending}
                    >
                      {requestOtpMutation.isPending
                        ? "Sending..."
                        : resendCooldownSeconds > 0
                          ? `Resend in ${resendCooldownSeconds}s`
                          : "Resend OTP"}
                    </Button>
                  </div>
                </div>
              ) : null}

              {successMessage ? <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p> : null}

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              {step === "request-otp" ? (
                <Button type="submit" className="w-full" disabled={requestOtpMutation.isPending}>
                  {requestOtpMutation.isPending ? "Sending OTP..." : "Send OTP"}
                </Button>
              ) : (
                <>
                  <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                    {signupMutation.isPending ? "Verifying..." : "Verify OTP & Create Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setStep("request-otp");
                      setOtp("");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                  >
                    Edit details
                  </Button>
                </>
              )}

              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
