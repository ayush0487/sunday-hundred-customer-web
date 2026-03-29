import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const returnToParam = router.query.returnTo;
      const returnTo = typeof returnToParam === "string" && returnToParam ? returnToParam : "/profile";
      router.replace(returnTo);
    }
  }, [router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          const returnToParam = router.query.returnTo;
          const returnTo = typeof returnToParam === "string" && returnToParam ? returnToParam : "/profile";
          router.push(returnTo);
        },
        onError: (err: any) => {
          setError(err.message || "Invalid email or password");
        },
      }
    );
  };

  return (
    <Layout>
      <div className="container py-10 md:py-16 max-w-md mx-auto">
        <Card className="rounded-2xl shadow-elevated">
          <CardHeader>
            <CardTitle className="font-display">Welcome back</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
