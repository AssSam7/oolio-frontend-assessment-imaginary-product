import { useMemo } from "react";
import { generateProducts } from "@/domain/products/";

export const useProductsQuery = (count: number) => {
  const products = useMemo(() => {
    return generateProducts(count);
  }, [count]);

  return {
    products,
    isLoading: false,
    error: null,
  };
};
