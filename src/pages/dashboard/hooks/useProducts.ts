import { useMemo } from "react";
import { generateProducts } from "../utils/generateProducts";

export const useProducts = (count: number) => {
  return useMemo(() => generateProducts(count), [count]);
};
