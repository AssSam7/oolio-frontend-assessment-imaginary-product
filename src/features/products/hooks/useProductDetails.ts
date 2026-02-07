import { useEffect, useState } from "react";

import { generateProductDetails } from "@/domain/products/services/productDetails.generator";
import type { ProductDetails } from "@/domain/products/types/productDetails.types";
import type { Product } from "@/domain/products/types/products.types";

/* --------------------------------------- */
/* Simple in-memory cache (session scope) */
/* --------------------------------------- */

const productDetailsCache = new Map<string, ProductDetails>();

/* --------------------------------------- */
/* Hook */
/* --------------------------------------- */

export const useProductDetails = (
  productId?: string,
  baseProduct?: Product
) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId || !baseProduct) return;

    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        /* ----- Check Cache ----- */

        if (productDetailsCache.has(productId)) {
          if (isMounted) {
            setProduct(productDetailsCache.get(productId)!);
            setIsLoading(false);
          }
          return;
        }

        /* ----- Simulate Network Delay ----- */

        await new Promise((res) => setTimeout(res, 200));

        /* ----- Generate Details ----- */

        const details = generateProductDetails(baseProduct);

        productDetailsCache.set(productId, details);

        if (isMounted) {
          setProduct(details);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [productId, baseProduct]);

  return {
    product,
    isLoading,
    error,
  };
};
