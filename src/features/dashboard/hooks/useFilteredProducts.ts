import { useMemo } from "react";
import { filterProducts } from "@/domain/products";
import type { Product, ProductFilters } from "@/domain/products";

export const useFilteredProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  return useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);
};
