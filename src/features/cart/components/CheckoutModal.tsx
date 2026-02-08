import { useState } from "react";

import Icon from "@/components/common/Icon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;

const stateOptions = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
];

const errorsMap = {
  ERR_001: "Full Name is required.",
  ERR_002: "Email Address is required.",
  ERR_003: "Phone Number is required.",
  ERR_004: "Street Address is required.",
  ERR_005: "City is required.",
  ERR_006: "State is required.",
  ERR_007: "ZIP Code is required.",
  ERR_008: "Card Number is required.",
  ERR_009: "Expiry Date is required.",
  ERR_010: "CVV is required.",
};

const CheckoutModal = ({ isOpen, onClose, total }: CheckoutModalProps) => {
  /* ---------- Local UI State ---------- */

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- Validation ---------- */

  const validateForm = () => {
    const newErrors: CheckoutErrors = {};

    if (!formData.fullName) newErrors.fullName = errorsMap.ERR_001;
    if (!formData.email) newErrors.email = errorsMap.ERR_002;
    if (!formData.phone) newErrors.phone = errorsMap.ERR_003;
    if (!formData.address) newErrors.address = errorsMap.ERR_004;
    if (!formData.city) newErrors.city = errorsMap.ERR_005;
    if (!formData.state) newErrors.state = errorsMap.ERR_006;
    if (!formData.zipCode) newErrors.zipCode = errorsMap.ERR_007;
    if (!formData.cardNumber) newErrors.cardNumber = errorsMap.ERR_008;
    if (!formData.expiryDate) newErrors.expiryDate = errorsMap.ERR_009;
    if (!formData.cvv) newErrors.cvv = errorsMap.ERR_010;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------- Handlers ---------- */

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      /* Simulate API */
      await new Promise((res) => setTimeout(res, 800));

      /*
       * Later wiring:
       * useCartStore.getState().clearCart();
       */

      alert("Order placed successfully!");
      onClose();
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Guard ---------- */

  if (!isOpen) return null;

  /* ---------- Render ---------- */

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Icon name="CreditCard" size={24} color="var(--color-primary)" />
            Checkout
          </h2>

          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-6 space-y-6 md:space-y-8"
        >
          {/* Total */}
          <div className="bg-primary/10 border border-primary rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <span className="text-base md:text-lg text-foreground">
                Order Total:
              </span>

              <span className="text-2xl md:text-3xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <section className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <Icon name="User" size={20} />
              Contact Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                error={errors.fullName}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
                className="md:col-span-2"
                required
              />
            </div>
          </section>

          {/* Shipping */}
          <section className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <Icon name="MapPin" size={20} />
              Shipping Address
            </h3>

            <Input
              label="Street Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={errors.address}
              required
            />

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                error={errors.city}
                required
              />

              <Select
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={(value) => handleChange("state", value ?? "")}
                error={errors.state}
                required
              />

              <Input
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                error={errors.zipCode}
                required
              />
            </div>
          </section>

          {/* Payment */}
          <section className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <Icon name="CreditCard" size={20} />
              Payment Information
            </h3>

            <Input
              label="Card Number"
              value={formData.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
              error={errors.cardNumber}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                error={errors.expiryDate}
                required
              />

              <Input
                label="CVV"
                value={formData.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                error={errors.cvv}
                required
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="Lock"
              iconPosition="left"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Purchase"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
