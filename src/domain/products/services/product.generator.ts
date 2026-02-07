import {
  PRODUCT_NAMES,
  PRODUCT_CATEGORIES,
} from "../constants/product.constants";
import type { Product } from "../types/products.types";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const category = PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length];
    const name = PRODUCT_NAMES[index % PRODUCT_NAMES.length];

    return {
      id: `product-${index + 1}`,
      name: `${name} - Model ${index + 1}`,
      price: Number((seededRandom(index) * 500 + 10).toFixed(2)),
      category,
      rating: Number((seededRandom(index + 50) * 2 + 3).toFixed(1)),
      isNew: index % 50 === 0,
      image: `https://picsum.photos/seed/${index}/400/600`,
      imageAlt: `${name} in ${category} category`,
    };
  });
};
