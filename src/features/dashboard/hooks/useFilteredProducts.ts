import { useMemo } from "react";
import type { Product } from "@/types";
import type { ProductFilters } from "../types/dashboard.types";

export const useFilteredProducts = (
  products: Product[],
  filters: ProductFilters
) => {
  return useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;

      const matchesMinPrice =
        filters.minPrice === null || product.price >= filters.minPrice;

      const matchesMaxPrice =
        filters.maxPrice === null || product.price <= filters.maxPrice;

      return (
        matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [
    products,
    filters.search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ]);
};
