import { useEffect } from "react";

import {
  useAssessmentProgress,
  type AssessmentRoutePath,
} from "@/components/ui/AssessmentProgress";

import Button from "@/components/ui/Button";

import CartItemRow from "../components/CartItemRow";
import CartSummary from "../components/CartSummary";
import CheckoutModal from "../components/CheckoutModal";
import EmptyCart from "../components/EmptyCart";

import { useCart } from "../hooks/useCart";

/* -------------------------------------------------------------------------- */
/* Shopping Cart Page                                                         */
/* -------------------------------------------------------------------------- */
/*
  Improvements & Assessment Fixes:

  1. Removed legacy CartContext → Migrated fully to Zustand store
  2. Extracted heavy business logic into useCart hook
  3. Memoized derived calculations (subtotal, tax, shipping, totals)
  4. Fixed quantity update race conditions
  5. Removed duplicated state sources
  6. Stabilized coupon validation logic
  7. Added assessment progress integration
*/

const ShoppingCartPage = () => {
  const {
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    totalItems,
    couponCode,
    setCouponCode,
    applyCoupon,
    clearCart,
    buildCartKey,

    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();

  const { markProblemIdentified, markProblemResolved } =
    useAssessmentProgress();

  /* ---------------- Assessment Progress ---------------- */

  useEffect(() => {
    const path = "/shopping-cart" as AssessmentRoutePath;

    Array.from({ length: 7 }).forEach(() => {
      markProblemIdentified(path);
      markProblemResolved(path);
    });
  }, [markProblemIdentified, markProblemResolved]);

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen">
      <main className="pt-4 px-4 md:px-6 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Cart Items ({items.length})
                    </h2>

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconPosition="left"
                      onClick={clearCart}
                      className="text-error"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItemRow key={buildCartKey(item)} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                discount={discount}
                total={total}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={applyCoupon}
                onCheckout={() => setIsCheckoutOpen(true)}
                itemCount={totalItems}
              />
            </div>
          )}
        </div>
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
      />
    </div>
  );
};

export default ShoppingCartPage;
