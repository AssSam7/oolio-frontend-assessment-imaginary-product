import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import type { CartConfiguration, CartStore } from "../types/cart.types";

const isSameConfig = (a?: CartConfiguration, b?: CartConfiguration) =>
  a?.color === b?.color && a?.size === b?.size;

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [
          {
            id: "product-1",
            name: "Professional Wireless Noise-Cancelling Headphones",
            category: "Electronics > Audio",
            price: 299.99,
            quantity: 2,
            inStock: true,
            stockCount: 5,
            image:
              "https://img.rocket.new/generatedImages/rocket_gen_img_13e126511-1765030295691.png",
            imageAlt: "Wireless headphones",
          },
          {
            id: "product-2",
            name: "Mechanical Gaming Keyboard RGB",
            category: "Electronics > Computers",
            price: 149.99,
            quantity: 1,
            inStock: true,
            stockCount: 8,
            image:
              "https://images.unsplash.com/photo-1619683322755-4545503f1afa",
            imageAlt: "RGB keyboard",
          },
          {
            id: "product-3",
            name: "Adjustable Laptop Stand",
            category: "Electronics > Accessories",
            price: 49.99,
            quantity: 1,
            inStock: true,
            stockCount: 3,
            image:
              "https://img.rocket.new/generatedImages/rocket_gen_img_1f9ea2001-1764658995251.png",
            imageAlt: "Laptop stand",
          },
          {
            id: "product-4",
            name: "Wireless Gaming Mouse",
            category: "Electronics > Gaming",
            price: 79.99,
            quantity: 3,
            inStock: true,
            stockCount: 2,
            image:
              "https://images.unsplash.com/photo-1604080214833-df65352fb97a",
            imageAlt: "Gaming mouse",
          },
        ],
        addItem: (item, quantity = 1) => {
          const existing = get().items.find(
            (i) =>
              i.id === item.id &&
              isSameConfig(i.configuration, item.configuration)
          );

          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              existing.stockCount
            );

            set({
              items: get().items.map((i) =>
                i === existing ? { ...i, quantity: nextQty } : i
              ),
            });

            return;
          }

          set({
            items: [
              ...get().items,
              {
                ...item,
                quantity: Math.min(quantity, item.stockCount),
              },
            ],
          });
        },

        removeItem: (id, config) => {
          set({
            items: get().items.filter(
              (i) => !(i.id === id && isSameConfig(i.configuration, config))
            ),
          });
        },

        increaseQty: (id, config) => {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id !== id || !isSameConfig(item.configuration, config)) {
                return item;
              }

              // ⭐ STOCK ENFORCEMENT
              if (item.quantity >= item.stockCount) return item;

              return { ...item, quantity: item.quantity + 1 };
            }),
          }));
        },

        decreaseQty: (id, config) => {
          set({
            items: get()
              .items.map((i) =>
                i.id === id && isSameConfig(i.configuration, config)
                  ? { ...i, quantity: i.quantity - 1 }
                  : i
              )
              .filter((i) => i.quantity > 0),
          });
        },

        clearCart: () => set({ items: [] }),

        getTotalItems: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        getTotalPrice: () =>
          get().items.reduce(
            (sum, item) =>
              sum + (item.price - (item.discount ?? 0)) * item.quantity,
            0
          ),
      }),
      {
        name: "oolio-cart-storage",
      }
    )
  )
);
