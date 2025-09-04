import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOrderForm } from "../hooks/useOrderForm";
import { mockProducts } from "../data/mockData";
import { type RoastedCoffeeBeanProduct } from "../types";

// ------------------------------------------------------
// Types
// ------------------------------------------------------
interface OrderData {
  productId: string;
  quantity: number;
  fullName: string;
  email?: string;
  phone: string;
  note?: string;
}

interface OrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

// ------------------------------------------------------
// Constants & Helpers
// ------------------------------------------------------
const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneRegex = /^[+]?[\d ()-]{6,20}$/;

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/,/g, ''), 10);
}

function formatPrice(price: number): string {
  return price.toLocaleString();
}

function calculateTotal(product: RoastedCoffeeBeanProduct, quantity: number): number {
  return parsePrice(product.price) * quantity;
}

function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [lock]);
}

// ------------------------------------------------------
// Reusable UI Components
// ------------------------------------------------------
const ProductCard = React.memo(function ProductCard({
  product,
  selected,
  onSelect,
  quantity,
  onQuantityChange,
}: {
  product: RoastedCoffeeBeanProduct;
  selected: boolean;
  onSelect: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <div 
      className={`relative rounded-xl border transition-all duration-200 cursor-pointer ${
        selected 
          ? 'border-coffee-gold bg-coffee-cream shadow-md' 
          : 'border-coffee-brown/20 bg-white hover:border-coffee-brown/40'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? 'border-coffee-gold bg-coffee-gold' : 'border-coffee-brown/30'
          }`}>
            {selected && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-enzi-db text-sm">{product.name}</h4>
            <p className="text-coffee-gold font-semibold text-xs">
              TZS {product.price} per {product.weight}
            </p>
          </div>
        </div>
        
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-coffee-brown/10 pt-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-enzi-db">Quantity</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(Math.max(1, quantity - 1));
                  }}
                  className="w-7 h-7 rounded-full border border-coffee-brown/30 flex items-center justify-center text-sm hover:bg-coffee-cream transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(quantity + 1);
                  }}
                  className="w-7 h-7 rounded-full border border-coffee-brown/30 flex items-center justify-center text-sm hover:bg-coffee-cream transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
});

const InputField = React.memo(function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-enzi-db">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-enzi-db placeholder-enzi-db/50 outline-none transition-colors ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
            : 'border-coffee-brown/20 focus:border-coffee-gold focus:ring-1 focus:ring-coffee-gold/20'
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

// ------------------------------------------------------
// Main Component - Single Screen Design
// ------------------------------------------------------
export default function OrderWizard({
  isOpen,
  onClose,
  initialProductId,
}: OrderWizardProps) {
  const { mutation } = useOrderForm();
  
  const [data, setData] = useState<OrderData>({
    productId: initialProductId || "",
    quantity: 1,
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  // a11y & UX helpers
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => dialogRef.current?.focus(), 0);
    } else {
      previouslyFocused.current?.focus?.();
      setData({
        productId: initialProductId || "",
        quantity: 1,
        fullName: "",
        email: "",
        phone: "",
        note: "",
      });
    }
  }, [isOpen, initialProductId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (mutation.isSuccess) {
      onClose();
    }
  }, [mutation.isSuccess, onClose]);

  // Validation
  const errors = useMemo(() => {
    const errs: Partial<Record<keyof OrderData, string>> = {};
    
    if (!data.productId) errs.productId = "Please select a product";
    if (!data.fullName.trim()) errs.fullName = "Full name is required";
    if (data.email && !emailRegex.test(data.email)) errs.email = "Please enter a valid email";
    if (!data.phone || !phoneRegex.test(data.phone)) errs.phone = "Please enter a valid phone number";
    
    return errs;
  }, [data]);

  const isValid = Object.keys(errors).length === 0;

  const setField = useCallback(
    (k: keyof OrderData) => (val: string | number) =>
      setData((d) => ({ ...d, [k]: val })),
    []
  );

  const submit = async () => {
    if (!isValid) return;

    const formData = {
      productId: data.productId,
      quantity: data.quantity,
      fullName: data.fullName,
      email: data.email || "",
      phone: data.phone || "",
      note: data.note || "",
    };

    mutation.mutate(formData);
  };

  const selectedProduct = mockProducts.find(p => p.id === data.productId);
  const totalPrice = selectedProduct ? calculateTotal(selectedProduct, data.quantity) : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-title"
          tabIndex={-1}
          ref={dialogRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative border-b border-coffee-brown/10 px-6 py-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
            
            <div>
              <div className="text-coffee-brown/70 text-xs font-medium tracking-wider uppercase mb-1">
                Place Order
              </div>
              <h2 id="order-title" className="text-xl font-bold text-enzi-db">
                Get your coffee delivered
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Product Selection */}
              <div>
                <h3 className="text-lg font-semibold text-enzi-db mb-4">Choose your coffee</h3>
                
                <div className="space-y-3">
                  {mockProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={data.productId === product.id}
                      onSelect={() => setField("productId")(product.id)}
                      quantity={data.quantity}
                      onQuantityChange={(qty) => setField("quantity")(qty)}
                    />
                  ))}
                </div>

                {errors.productId && (
                  <p className="mt-2 text-sm text-red-600">{errors.productId}</p>
                )}
              </div>

              {/* Right Column - Contact & Summary */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-enzi-db mb-4">Contact details</h3>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      value={data.fullName}
                      onChange={setField("fullName")}
                      placeholder="Enter your full name"
                      required
                      error={errors.fullName}
                    />

                    <InputField
                      label="Email"
                      type="email"
                      value={data.email || ""}
                      onChange={setField("email")}
                      placeholder="your.email@example.com"
                      error={errors.email}
                    />

                    <InputField
                      label="Phone"
                      type="tel"
                      value={data.phone}
                      onChange={setField("phone")}
                      placeholder="+255 712 345 678"
                      required
                      error={errors.phone}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-coffee-cream rounded-xl p-4 border border-coffee-brown/10"
                  >
                    <h4 className="font-semibold text-enzi-db mb-3">Order Summary</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-enzi-db">
                          {selectedProduct.name} × {data.quantity}
                        </span>
                        <span className="text-sm font-medium text-enzi-db">
                          TZS {formatPrice(parsePrice(selectedProduct.price) * data.quantity)}
                        </span>
                      </div>
                      
                      <div className="border-t border-coffee-brown/10 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-enzi-db">Total</span>
                          <span className="text-lg font-bold text-coffee-gold">
                            TZS {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={submit}
                  disabled={!isValid || mutation.isPending}
                  className="w-full bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {mutation.isPending ? "Placing Order..." : "Place Order"}
                </button>

                <p className="text-xs text-enzi-db/60 text-center">
                  We'll contact you to confirm your order and arrange delivery.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
