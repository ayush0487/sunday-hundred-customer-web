import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useUserReviews } from "@/hooks/useReviews";
import { getAuthToken, getCurrentUser, logout } from "@/lib/auth";

function formatReviewDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const year = parsed.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export default function MyReviewsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 5;

  const token = getAuthToken();
  const currentUser = getCurrentUser();
  const hasSession = Boolean(token && currentUser);

  useEffect(() => {
    if (!hasSession) {
      logout();
      void router.replace("/login?returnTo=/profile/reviews");
    }
  }, [hasSession, router]);

  const { data, isLoading, isFetching } = useUserReviews(currentUser?.id ?? "", { page, limit });

  if (!hasSession) {
    return null;
  }

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  const title = useMemo(() => {
    if (!pagination) {
      return "My Reviews";
    }

    return `My Reviews (${pagination.total})`;
  }, [pagination]);

  return (
    <Layout>
      <div className="container py-6 md:py-10 max-w-3xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-elevated p-5 md:p-6"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="font-display text-xl md:text-2xl font-bold">{title}</h1>
            {isFetching ? <span className="text-xs text-muted-foreground">Refreshing...</span> : null}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border animate-pulse space-y-2">
                  <div className="h-4 rounded bg-secondary w-1/3" />
                  <div className="h-3 rounded bg-secondary w-5/6" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">You have not posted any reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const reviewerName = review.user_name || review.reviewer_name || currentUser.name || "User";
                const reviewerAvatar = review.user_avatar || review.reviewer_avatar;

                return (
                  <div key={review.id} className="p-4 rounded-xl border border-border bg-background/80">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground">
                        {reviewerAvatar ? (
                          <img src={reviewerAvatar} alt={reviewerName} className="w-full h-full object-cover" />
                        ) : (
                          reviewerName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{reviewerName}</p>
                            <p className="text-xs text-muted-foreground">{formatReviewDate(review.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, idx) => (
                              <Star key={idx} className="h-3.5 w-3.5 fill-gold text-gold" />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>

                        {review.reply ? (
                          <div className="mt-3 rounded-lg bg-accent/60 px-3 py-2">
                            <p className="text-xs font-medium">Business reply</p>
                            <p className="text-sm mt-1 text-muted-foreground">{review.reply}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {pagination && pagination.totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <Button
                type="button"
                variant="outline"
                disabled={page >= pagination.totalPages || isFetching}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              >
                Next
              </Button>
            </div>
          ) : null}
        </motion.div>
      </div>
    </Layout>
  );
}
