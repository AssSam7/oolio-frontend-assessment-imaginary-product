import { useMemo } from "react";

import type { Product } from "@/types";
import type { ProductsPageFilters } from "../types/products.types";

export const useFilteredProducts = (
  products: Product[],
  filters: ProductsPageFilters
) => {
  return useMemo(() => {
    return products.filter((product) => {
      /* Search */
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      /* Single category */
      if (
        filters.category &&
        filters.category !== "all" &&
        product.category !== filters.category
      ) {
        return false;
      }

      /* Multi category */
      if (
        filters.categories &&
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      /* Min price */
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }

      /* Max price */
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      /* Rating */
      if (filters.minRating != null && product.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [products, filters]);
};
