export interface CartConfiguration {
  color?: string;
  size?: string;
}

export interface CartItem {
  id: string;
  name: string;
  category: string;

  price: number;
  discount?: number;

  quantity: number;

  image?: string;
  imageAlt?: string;

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
