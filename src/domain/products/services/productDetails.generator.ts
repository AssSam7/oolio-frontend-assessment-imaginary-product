import { extractSeed, seededRandom } from "../utils/seededRandom";
import type { Product } from "../types/products.types";
import type { ProductDetails } from "../types/productDetails.types";

import { generateRatingFromProductId } from "../utils/rating.generator";

export const generateProductDetails = (product: Product): ProductDetails => {
  const seed = extractSeed(product.id);

  const randRaw = seededRandom(seed);
  const rand = Number.isFinite(randRaw) ? randRaw : 0.5;

  const ratingSummary = generateRatingFromProductId(product.id);

  return {
    ...product,

    sku: `SKU-${product.id}`,

    description:
      "Premium quality product with advanced configuration and durable materials.",

    discount: rand > 0.6 ? Math.floor(rand * 30) : 0,

    rating: ratingSummary.rating,
    reviewCount: ratingSummary.reviewCount,

    inStock: rand > 0.2,
    stockCount: Math.floor(rand * 100),

    images: Array.from({ length: 5 }).map((_, i) => ({
      url: `https://picsum.photos/seed/${product.id}-${i}/800/800`,
      alt: `${product.name} image ${i + 1}`,
    })),

    colors: ["Black", "White", "Blue", "Rose Gold"].slice(
      0,
      Math.floor(rand * 4) + 1
    ),

    sizes: ["Small", "Medium", "Large"],

    features: [
      "High quality build",
      "Premium finish",
      "Extended durability",
      "Advanced configuration",
    ],

    specifications: {
      Weight: `${(rand * 2 + 0.5).toFixed(2)} kg`,
      Material: "Aluminium",
      Warranty: "1 Year",
    },
  };
};
