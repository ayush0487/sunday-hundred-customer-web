import { useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { getAuthToken, getCurrentUser, logout } from "@/lib/auth";

export default function MyReviewsPage() {
  const router = useRouter();

  const token = getAuthToken();
  const currentUser = getCurrentUser();
  const hasSession = Boolean(token && currentUser);

  useEffect(() => {
    if (!hasSession) {
      logout();
      void router.replace("/login?returnTo=/profile/reviews");
      return;
    }
    void router.replace("/profile");
  }, [hasSession, router]);

  if (!hasSession) {
    return null;
  }

  return (
    <Layout>
      <div className="hidden" aria-hidden="true" />
    </Layout>
  );
}
