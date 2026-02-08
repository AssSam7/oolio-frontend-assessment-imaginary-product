import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/common/Icon";
import Input from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";

import { useCartStore } from "@/domain/cart/store/cart.store";
import { mapProductToCartItem } from "@/domain/cart/mappers/cart.mapper";

import type { ProductDetails } from "@/domain/products/types/productDetails.types";

interface ProductConfigurationProps {
  product: ProductDetails;
  onAddToCart: (
    configuredProduct: ProductDetails & {
      quantity: number;
      selectedColor?: string;
      selectedSize?: string;
    }
  ) => void;
}

/*
  React 18 Strict Mode Safe
  State resets via KEY remount
*/

const ProductConfiguration = ({
  product,
  onAddToCart,
}: ProductConfigurationProps) => {
  const navigate = useNavigate();

  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const stockCount = product.stockCount ?? 0;
  const inStock = product.inStock ?? false;

  /* ---------- Local State ---------- */

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizes[0]
  );

  /* ---------- Cart Store ---------- */

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const isItemPresentInCart = cartItems.some((item) => item.id === product.id);

  /* ---------- Quantity Controls ---------- */

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, stockCount || 1));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  /* ---------- Add To Cart ---------- */

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (isItemPresentInCart) {
      navigate("/shopping-cart");
      return;
    }

    const configuration = {
      color: selectedColor,
      size: selectedSize,
    };

    const cartItem = mapProductToCartItem(product, configuration);

    addItem(cartItem, quantity);

    onAddToCart({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
  };

  /* ---------- Render ---------- */

  return (
    <div className="space-y-4 md:space-y-6 bg-card border border-border rounded-lg p-4 md:p-6">
      {/* ---------- Color ---------- */}

      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Color: <span className="text-primary">{selectedColor ?? "—"}</span>
          </label>

          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`
                  px-4 py-2 rounded-md border-2 transition-all text-sm
                  ${
                    selectedColor === color
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-foreground hover:border-muted-foreground"
                  }
                `}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Size ---------- */}

      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Size: <span className="text-primary">{selectedSize ?? "—"}</span>
          </label>

          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 rounded-md border-2 transition-all text-sm font-medium
                  ${
                    selectedSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-foreground hover:border-muted-foreground"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Quantity ---------- */}

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Quantity
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            disabled={isItemPresentInCart || quantity <= 1}
            className="w-10 h-10 flex items-center justify-center bg-muted border border-border rounded-md disabled:opacity-50"
          >
            <Icon name="Minus" size={18} />
          </button>

          <Input
            type="number"
            value={quantity}
            min={1}
            max={stockCount || 1}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (!Number.isNaN(val) && val >= 1 && val <= (stockCount || 1)) {
                setQuantity(val);
              }
            }}
            className="w-16 h-10 text-center bg-background border border-border rounded-md font-mono"
          />

          <button
            onClick={incrementQuantity}
            disabled={isItemPresentInCart || quantity >= stockCount}
            className="w-10 h-10 flex items-center justify-center bg-muted border border-border rounded-md disabled:opacity-50"
          >
            <Icon name="Plus" size={18} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {stockCount > 0 && inStock
            ? `Maximum ${stockCount} items available`
            : "Out of stock"}
        </p>
      </div>

      {/* ---------- Actions ---------- */}

      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {isItemPresentInCart ? "Go to Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductConfiguration;
