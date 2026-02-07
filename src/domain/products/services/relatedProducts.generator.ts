import { generateProductDetails } from "./productDetails.generator";
import type { Product } from "../types/products.types";
import type { ProductDetails } from "../types/productDetails.types";

export const getRelatedProducts = (
  products: Product[],
  currentProductId: string | number,
  category?: string,
  limit = 4
): ProductDetails[] => {
  return products
    .filter((p) => p.id !== currentProductId)
    .filter((p) => !category || p.category === category)
    .slice(0, limit)
    .map(generateProductDetails);
};
