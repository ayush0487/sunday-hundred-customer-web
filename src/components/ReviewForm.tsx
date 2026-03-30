import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { reviewService } from "@/services/review.service";
import type { ReviewPayload } from "@/types/api.types";

interface ReviewFormProps {
  businessId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ businessId, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      const returnTo = router.asPath;
      void router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      setIsLoading(false);
      return;
    }

    try {
      const payload: ReviewPayload = {
        business_id: businessId,
        rating,
        comment: comment.trim() || undefined,
      };

      await reviewService.create(payload);
      setSuccess(true);
      setRating(5);
      setComment("");

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

      // Refresh reviews
      onSuccess?.();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("You have already reviewed this business.");
      } else if (err.response?.status === 400) {
        setError("Invalid rating (1-5)");
      } else if (err.response?.status === 404) {
        setError("Business not found");
      } else if (err.response?.status === 401) {
        void router.push(`/login?returnTo=${encodeURIComponent(router.asPath)}`);
      } else {
        setError(err.response?.data?.message || "Failed to submit review.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-card shadow-card border border-border"
    >
      <h3 className="font-semibold text-sm mb-3">Share Your Review</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Rating Stars */}
        <div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-5 w-5 ${
                    i < rating
                      ? "fill-gold text-gold"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 2000))}
          placeholder="Your feedback..."
          className="w-full resize-none p-2 text-sm rounded-lg bg-secondary text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
          rows={2}
        />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 rounded text-xs bg-green-500/10 border border-green-500/30 text-green-600"
          >
            Review submitted! Thank you.
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || success}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg gradient-gold text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          <Send className="h-3.5 w-3.5" />
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </motion.div>
  );
}
