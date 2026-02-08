export interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;

  couponCode: string;

  itemCount: number;

  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
}
