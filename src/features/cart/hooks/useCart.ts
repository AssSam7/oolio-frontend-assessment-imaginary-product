import { useMemo, useState } from "react";

import { useCartStore } from "@/domain/cart/store/cart.store";
import type { CartItem } from "@/domain/cart/types/cart.types";

const TAX_RATE = 0.08;
const SHIPPING_COST = 9.99;

export const useCart = () => {
  const { items, increaseQty, decreaseQty, clearCart } = useCartStore();

  /* ---------------- Coupon State ---------------- */

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* ---------------- Derived Values ---------------- */
  const buildCartKey = (item: CartItem) =>
    `${item.id}-${item.configuration?.color ?? ""}-${
      item.configuration?.size ?? ""
    }`;

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);

  const shipping = useMemo(
    () => (subtotal > 50 ? 0 : SHIPPING_COST),
    [subtotal]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon === "SAVE10" && subtotal > 100) return subtotal * 0.1;

    if (appliedCoupon === "SAVE20" && subtotal > 200) return subtotal * 0.2;

    if (appliedCoupon === "FREESHIP") return shipping;

    return 0;
  }, [appliedCoupon, subtotal, shipping]);

  const total = useMemo(() => {
    return subtotal + tax + shipping - discount;
  }, [subtotal, tax, shipping, discount]);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  /* ---------------- Actions ---------------- */

  const updateQuantity = (
    id: string,
    newQty: number,
    config?: CartItem["configuration"]
  ) => {
    const current = items.find(
      (i) =>
        i.id === id &&
        JSON.stringify(i.configuration ?? {}) === JSON.stringify(config ?? {})
    );

    if (!current) return;

    if (newQty > current.quantity) {
      increaseQty(id, config);
    } else if (newQty < current.quantity) {
      decreaseQty(id, config);
    }
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();

    if (["SAVE10", "SAVE20", "FREESHIP"].includes(code)) {
      setAppliedCoupon(code);
    } else {
      alert("Invalid coupon code");
    }
  };

  return {
    /* store */
    items,
    clearCart,

    /* derived */
    buildCartKey,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    totalItems,

    /* coupon */
    couponCode,
    setCouponCode,
    applyCoupon,

    /* checkout */
    isCheckoutOpen,
    setIsCheckoutOpen,

    /* helpers */
    updateQuantity,
  };
};
