import type { ProductDetails } from "@/domain/products/types/productDetails.types";

export interface CartConfiguration {
  color?: string;
  size?: string;
}

/*
  CartItem derives required fields from ProductDetails
  → Prevents duplication
  → Keeps cart always aligned with product domain
*/

export interface CartItem
  extends Pick<
    ProductDetails,
    | "id"
    | "name"
    | "category"
    | "price"
    | "discount"
    | "image"
    | "imageAlt"
    | "inStock"
    | "stockCount"
  > {
  quantity: number;
  configuration?: CartConfiguration;
}

export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, configuration?: CartConfiguration) => void;
  increaseQty: (id: string, configuration?: CartConfiguration) => void;
  decreaseQty: (id: string, configuration?: CartConfiguration) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export type CartStore = CartState & CartActions;
