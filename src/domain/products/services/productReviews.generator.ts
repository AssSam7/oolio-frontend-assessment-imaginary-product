import { extractSeed, seededRandom } from "../utils/seededRandom";
import type {
  ProductReviewsData,
  ProductReview,
} from "../types/productReview.types";
import { generateRatingFromProductId } from "../utils/rating.generator";

const AUTHORS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "James Patel",
  "Aisha Khan",
  "Daniel Brooks",
];

const TITLES = [
  "Excellent product quality!",
  "Worth the price",
  "Highly recommended",
  "Good but has minor issues",
  "Amazing performance",
];

const CONTENT = [
  "This product exceeded expectations. Build quality is excellent.",
  "Very reliable and easy to use. Would purchase again.",
  "Performance is consistent and materials feel premium.",
  "Customer support was helpful and responsive.",
  "Good balance between price and quality.",
];

export const generateProductReviews = (
  productId: string | number
): ProductReviewsData => {
  const seed = extractSeed(productId);
  const randRaw = seededRandom(seed);
  const rand = Number.isFinite(randRaw) ? randRaw : 0.5;

  const reviewCount = Math.floor(rand * 6) + 3;

  const reviews: ProductReview[] = Array.from({ length: reviewCount }).map(
    (_, index) => {
      const r = seededRandom(seed + index * 3);

      return {
        id: index + 1,
        author: AUTHORS[index % AUTHORS.length],
        avatar: `https://i.pravatar.cc/150?img=${(seed + index) % 70}`,
        avatarAlt: "Reviewer avatar",
        rating: Math.floor(r * 2) + 3,
        date: new Date(
          Date.now() - r * 1000 * 60 * 60 * 24 * 120
        ).toISOString(),
        verified: r > 0.3,
        title: TITLES[index % TITLES.length],
        content: CONTENT[index % CONTENT.length],
        helpful: Math.floor(r * 40),
        images:
          r > 0.6
            ? [
                {
                  url: `https://picsum.photos/seed/review-${seed}-${index}/300/300`,
                  alt: "Review image",
                },
              ]
            : [],
      };
    }
  );

  const summary = generateRatingFromProductId(String(productId));

  const averageRating = summary.rating;
  const totalReviews = summary.reviewCount;

  return {
    averageRating,
    totalReviews,
    reviews,
  };
};
