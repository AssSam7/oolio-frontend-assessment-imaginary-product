import {
  PRODUCT_NAMES,
  PRODUCT_CATEGORIES,
} from "../constants/product.constants";
import type { Product } from "../types/products.types";
import { generateRatingFromProductId } from "../utils/rating.generator";
import { seededRandom } from "../utils/seededRandom";

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const category = PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length];
    const name = PRODUCT_NAMES[index % PRODUCT_NAMES.length];

    const ratingData = generateRatingFromProductId(`product-${index + 1}`);

    return {
      id: `product-${index + 1}`,
      name: `${name} - Model ${index + 1}`,
      price: Number((seededRandom(index) * 500 + 10).toFixed(2)),
      category,
      rating: ratingData.rating,
      isNew: index % 50 === 0,
      image: `https://picsum.photos/seed/${index}/400/600`,
      imageAlt: `${name} in ${category} category`,
    };
  });
};
