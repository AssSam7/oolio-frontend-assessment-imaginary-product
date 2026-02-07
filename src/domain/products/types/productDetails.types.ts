import type { Product } from "./products.types";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductDetails extends Product {
  sku: string;
  description: string;

  discount?: number;

  reviewCount: number;

  inStock: boolean;
  stockCount: number;

  images: ProductImage[];

  colors?: string[];
  sizes?: string[];

  features: string[];

  specifications: Record<string, string>;
}
