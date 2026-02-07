import { extractSeed, seededRandom } from "./seededRandom";

export const generateRatingFromProductId = (productId: string) => {
  const seed = extractSeed(productId);

  const rating = Number((seededRandom(seed + 50) * 2 + 3).toFixed(1));

  const reviewCount = Math.floor(seededRandom(seed + 100) * 1500) + 50;

  return {
    rating,
    reviewCount,
  };
};
