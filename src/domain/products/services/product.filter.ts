import type { Product, ProductFilters } from "../types/product.types";

export const filterProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesCategory =
      filters.category === "all" || product.category === filters.category;

    const matchesMin =
      filters.minPrice === null || product.price >= filters.minPrice;

    const matchesMax =
      filters.maxPrice === null || product.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });
};
