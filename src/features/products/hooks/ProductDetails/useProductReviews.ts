import { useMemo } from "react";

import { generateProductReviews } from "@/domain/products/services/productReviews.generator";
import type { ProductReviewsData } from "@/domain/products/types/productReview.types";

export const useProductReviews = (productId?: string): ProductReviewsData => {
  return useMemo(() => {
    if (!productId) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };
    }

    return generateProductReviews(productId);
  }, [productId]);
};
