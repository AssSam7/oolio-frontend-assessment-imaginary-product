import { useMemo } from "react";
import { useProductsQuery } from "../useProductsQuery";
import { generateProductDetails } from "@/domain/products/services/productDetails.generator";

export const useRelatedProducts = (productId: string, category?: string) => {
  const { products } = useProductsQuery(100);

  return useMemo(() => {
    return products
      .filter((p) => p.id !== productId)
      .filter((p) => !category || p.category === category)
      .slice(0, 4)
      .map(generateProductDetails);
  }, [products, productId, category]);
};
