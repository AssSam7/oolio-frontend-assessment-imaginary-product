import type { ProductDetails } from "@/domain/products/types/productDetails.types";
import type { CartConfiguration, CartItem } from "../types/cart.types";

export const mapProductToCartItem = (
  product: ProductDetails,
  configuration?: CartConfiguration
): Omit<CartItem, "quantity"> => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price,
  discount: product.discount,
  inStock: product.inStock,
  stockCount: product.stockCount,
  image: product.images?.[0]?.url ?? product.image,
  imageAlt: product.images?.[0]?.alt ?? product.imageAlt,
  configuration,
});
