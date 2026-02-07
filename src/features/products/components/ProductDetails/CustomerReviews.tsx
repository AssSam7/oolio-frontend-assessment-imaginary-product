import { useState, useMemo } from "react";

import Image from "@/components/common/Image";
import Icon from "@/components/common/Icon";
import Button from "@/components/ui/Button";
import type { ProductReview } from "@/domain/products/types/productReview.types";

/* ---------------- Types ---------------- */

interface CustomerReviewsProps {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
  ratingDistribution?: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}

/* ---------------- Component ---------------- */

const CustomerReviews = ({
  averageRating,
  totalReviews,
  reviews,
  ratingDistribution = [],
}: CustomerReviewsProps) => {
  /*
   * Improvements:
   * - Removed internal mock review state and moved reviews to props for better data control
   * - Replaced repeated slice logic with memoized derived reviews list
   * - Migrated review types into domain layer for reuse across product flows
   * - Simplified rating star rendering and removed redundant optional chaining
   * - Improved date formatting consistency
   * - Added safer rendering guards for optional images and review lists
   */

  /* ---------- Local State ---------- */
  const [showAllReviews, setShowAllReviews] = useState(false);

  /* Limit reviews initially */
  const displayedReviews = useMemo(
    () => (showAllReviews ? reviews : reviews.slice(0, 2)),
    [showAllReviews, reviews]
  );

  /* Star renderer */
  const renderStars = (rating: number, size = 16) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={size}
        color={
          i < Math.floor(rating) ? "var(--color-warning)" : "var(--color-muted)"
        }
        className={i < Math.floor(rating) ? "fill-warning" : "fill-muted"}
      />
    ));

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
        Customer Reviews
      </h2>

      {/* ---------- Rating Summary ---------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 pb-8 border-b border-border">
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>

          <div className="flex items-center gap-1 mb-2">
            {renderStars(averageRating, 20)}
          </div>

          <p className="text-sm md:text-base text-muted-foreground">
            Based on {totalReviews.toLocaleString()} reviews
          </p>
        </div>

        {/* Distribution */}
        {ratingDistribution.length > 0 && (
          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-12">
                  {dist.stars} star
                </span>

                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning transition-all duration-250"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>

                <span className="text-sm text-muted-foreground w-12 text-right font-mono">
                  {dist.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Reviews ---------- */}

      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="pb-6 border-b border-border last:border-0"
          >
            {/* Header */}
            <div className="flex items-start gap-3 md:gap-4 mb-3">
              <Image
                src={review.avatar}
                alt={review.avatarAlt}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {review.author}
                  </span>

                  {review.verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-success/20 text-success text-xs rounded">
                      <Icon name="CheckCircle2" size={12} />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating, 14)}
                  </div>

                  <span className="text-xs md:text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
              {review.title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
              {review.content}
            </p>

            {/* Images */}
            {review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="ThumbsUp" size={16} />
                <span>Helpful ({review.helpful})</span>
              </button>

              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Toggle ---------- */}

      {reviews.length > 2 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews((prev) => !prev)}
          >
            {showAllReviews
              ? "Show Less"
              : `View All ${reviews.length} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
