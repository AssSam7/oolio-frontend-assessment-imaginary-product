import { useEffect, useMemo, useRef, useState } from "react";

import Image from "@/components/common/Image";
import Icon from "@/components/common/Icon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import type { CartItem } from "@/domain/cart/types/cart.types";
import { useCartStore } from "@/domain/cart/store/cart.store";

interface Props {
  item: CartItem;
}

/* -------------------------------------------------------------------------- */
/* Cart Item Row                                                              */
/* -------------------------------------------------------------------------- */
/*
  Improvements:

  1. Added stockCount enforcement across ALL entry points
  2. Prevent manual typing beyond stock
  3. Disabled + button when stock reached
  4. Auto increment now auto-stops at stock limit
  5. Added max attribute to quantity input
  6. Memoized base item snapshot
  7. Safe interval cleanup
*/

const CartItemRow = ({ item }: Props) => {
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------------- Derived Flags ---------------- */

  const reachedStockLimit = item.quantity >= item.stockCount;

  /* ---------------- Base Item Mapper ---------------- */

  const baseItem = useMemo(
    () => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      discount: item.discount,
      image: item.image,
      imageAlt: item.imageAlt,
      inStock: item.inStock,
      stockCount: item.stockCount,
      configuration: item.configuration,
    }),
    [item]
  );

  /* ---------------- Quantity Change ---------------- */

  const handleQuantityChange = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;

    // Clamp value within stock
    const clampedValue = Math.min(value, item.stockCount);

    const diff = clampedValue - item.quantity;

    if (diff > 0) {
      addItem(baseItem, diff);
      return;
    }

    if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        decreaseQty(item.id, item.configuration);
      }
    }
  };

  /* ---------------- Auto Increment Toggle ---------------- */

  const toggleAutoIncrement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsAutoRunning(false);
      return;
    }

    if (item.quantity >= item.stockCount) return;

    intervalRef.current = setInterval(() => {
      const current = useCartStore
        .getState()
        .items.find(
          (i) =>
            i.id === item.id &&
            JSON.stringify(i.configuration ?? {}) ===
              JSON.stringify(item.configuration ?? {})
        );

      if (!current) return;

      if (current.quantity >= current.stockCount) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsAutoRunning(false);
        return;
      }

      increaseQty(item.id, item.configuration);
    }, 1000);

    setIsAutoRunning(true);
  };

  /* ---------------- Cleanup ---------------- */

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ---------------- Derived Values ---------------- */

  const subtotal = useMemo(
    () => (item.price * item.quantity).toFixed(2),
    [item.price, item.quantity]
  );

  /* ---------------- Render ---------------- */

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow duration-250">
      {/* Product Image */}
      <div className="w-full md:w-32 lg:w-40 h-32 md:h-32 lg:h-40 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
        {/* Title + Price */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground line-clamp-2">
              {item.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-1">
              {item.category}
            </p>
          </div>

          <div className="text-right sm:text-left">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-primary whitespace-nowrap">
              ${item.price.toFixed(2)}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">per item</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Minus"
              onClick={() => decreaseQty(item.id, item.configuration)}
              disabled={item.quantity <= 1}
            />

            <Input
              type="number"
              value={item.quantity}
              min="1"
              max={item.stockCount}
              className="w-16 md:w-20 text-center"
              onChange={(e) => {
                const parsed = Number(e.target.value);
                if (!Number.isNaN(parsed)) {
                  handleQuantityChange(parsed);
                }
              }}
            />

            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => increaseQty(item.id, item.configuration)}
              disabled={reachedStockLimit}
            />
          </div>

          {/* Auto Increment */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Zap"
            iconPosition="left"
            onClick={toggleAutoIncrement}
            disabled={reachedStockLimit}
            className="text-warning"
          >
            {isAutoRunning ? "Stop Auto" : "Auto +1/sec"}
          </Button>

          {/* Subtotal */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm md:text-base text-muted-foreground">
              Subtotal:
            </span>
            <span className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
              ${subtotal}
            </span>
          </div>
        </div>

        {/* Stock Indicator (UX Boost) */}
        {item.stockCount - item.quantity <= 3 && (
          <p className="text-xs text-warning">
            Only {item.stockCount - item.quantity} left in stock
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Truck" size={16} color="var(--color-success)" />
            <span>Free shipping on orders &gt; $50</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => removeItem(item.id, item.configuration)}
            className="text-error hover:text-error"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
