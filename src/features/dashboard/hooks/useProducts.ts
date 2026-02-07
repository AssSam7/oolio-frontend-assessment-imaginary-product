import { useMemo } from "react";
import { generateProducts } from "@/domain/products";
import type { Product } from "@/domain/products";

export const useProducts = (count: number): Product[] => {
  return useMemo(() => generateProducts(count), [count]);
};
