import { useState, useCallback } from "react";
import type { ProductsPageFilters } from "../types/products.types";

const DEFAULT_FILTERS: ProductsPageFilters = {
  search: "",
  category: "all",
  minPrice: null,
  maxPrice: null,
  categories: [],
  minRating: null,
};

export const useProductsFiltersState = () => {
  const [filters, setFilters] = useState<ProductsPageFilters>(DEFAULT_FILTERS);

  const updateFilters = useCallback((partial: Partial<ProductsPageFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
};
