import { useMemo } from "react";
import type { Product } from "@/types";

/* ---------------- Sort Types ---------------- */

export type ProductsSortOption =
  | "name"
  | "price-low-high"
  | "price-high-low"
  | "rating";

/* ---------------- Hook ---------------- */

export const useProductsSorting = (
  products: Product[],
  sort: ProductsSortOption
) => {
  return useMemo(() => {
    const sorted = [...products];

    switch (sort) {
      case "price-low-high":
        return sorted.sort((a, b) => a.price - b.price);

      case "price-high-low":
        return sorted.sort((a, b) => b.price - a.price);

      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);

      case "name":
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, sort]);
};
