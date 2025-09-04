import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { ChevronLeft, X, Plus, Minus } from "lucide-react";
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
}

export interface OrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------
function isValidEmail(s: string) {
  const at = s.indexOf("@");
  const dot = s.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < s.length - 1;
}

function isValidPhone(s: string) {
  const digits = s.replace(/[^0-9]/g, "");
  return digits.length >= 6 && digits.length <= 20;
}

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/,/g, ''), 10);
}

function formatPrice(price: number): string {
  return price.toLocaleString();
}

function calculateTotal(product: RoastedCoffeeBeanProduct, quantity: number): number {
  return parsePrice(product.price) * quantity;
}

// Brand colors (matching the subscription flow)
const PRIMARY = "#B47744";
const SECONDARY = "#EEEBE7";

// ------------------------------------------------------
// Product Card for Mobile
// ------------------------------------------------------
function ProductCard({
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
      className={`rounded-2xl border px-4 py-4 cursor-pointer transition-all ${
        selected ? `border-[${PRIMARY}] bg-white` : `border-[${PRIMARY}20] bg-[#FFFFFF]`
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#3B2A1F] truncate">{product.name}</h3>
          <p className="text-sm text-[#3B2A1F80] line-clamp-2">{product.description}</p>
          <p className="text-sm font-semibold text-[#B47744] mt-1">
            TZS {product.price} per {product.weight}
          </p>
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex items-center justify-between"
        >
          <span className="text-sm text-[#3B2A1F]">Quantity:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(Math.max(1, quantity - 1));
              }}
              className="w-8 h-8 rounded-full border border-[#B4774420] flex items-center justify-center"
              style={{ color: PRIMARY }}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-[#3B2A1F] font-medium">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
              className="w-8 h-8 rounded-full border border-[#B4774420] flex items-center justify-center"
              style={{ color: PRIMARY }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ------------------------------------------------------
// Mobile Order Flow
// ------------------------------------------------------
export default function MobileOrderFlow({ isOpen, onClose, initialProductId }: OrderWizardProps) {
  const { mutation } = useOrderForm();
  type Screen = "product" | "contact";

  const order: Screen[] = ["product", "contact"];

  const [screen, setScreen] = useState<Screen>("product");
  const [dir, setDir] = useState<1 | -1>(1);

  const [data, setData] = useState<OrderData>({
    productId: initialProductId || "",
    quantity: 1,
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setScreen("product");
      setDir(1);
      setData({
        productId: initialProductId || "",
        quantity: 1,
        fullName: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen, initialProductId]);

  // Handle successful submission
  useEffect(() => {
    if (mutation.isSuccess) {
      onClose();
    }
  }, [mutation.isSuccess, onClose]);

  const go = (next: Screen) => {
    const a = order.indexOf(screen);
    const b = order.indexOf(next);
    setDir(b > a ? 1 : -1);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setField = useCallback(
    (k: keyof OrderData) => (val: string | number) => setData((d) => ({ ...d, [k]: val })),
    []
  );

  const isValid = useMemo(() => {
    switch (screen) {
      case "product":
        return !!data.productId && data.quantity > 0;
      case "contact":
        return (
          data.fullName.trim().length > 0 &&
          (!data.email || isValidEmail(data.email)) &&
          isValidPhone(data.phone || "")
        );
    }
  }, [screen, data]);

  const next = () => {
    const i = order.indexOf(screen);
    if (!isValid) return;
    if (i < order.length - 1) go(order[i + 1]);
  };

  const back = () => {
    const i = order.indexOf(screen);
    if (i > 0) go(order[i - 1]);
  };

  const submit = async () => {
    if (!isValid || screen !== "contact") return;

    // Convert component data to hook format
    const formData = {
      productId: data.productId,
      quantity: data.quantity,
      fullName: data.fullName,
      email: data.email || "",
      phone: data.phone,
      note: "",
    };

    // Use mutation directly to submit the data
    mutation.mutate(formData);
  };

  const selectedProduct = mockProducts.find(p => p.id === data.productId);
  const totalPrice = selectedProduct ? calculateTotal(selectedProduct, data.quantity) : 0;

  if (!isOpen) return null;

  const t: Transition = { type: "spring", stiffness: 260, damping: 28 };
  const variants = {
    enter: (direction: 1 | -1) => ({ x: direction * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({ x: direction * -60, opacity: 0 }),
  } as const;

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: SECONDARY }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 backdrop-blur"
        style={{ backgroundColor: "rgba(238,235,231,0.9)", borderBottom: `1px solid ${PRIMARY}1A` }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={back}
            disabled={order.indexOf(screen) === 0}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
            style={{
              border: `1px solid ${PRIMARY}33`,
              color: PRIMARY,
              backgroundColor: "#FFFFFF",
              opacity: order.indexOf(screen) === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl"
            aria-label="Close"
            style={{ backgroundColor: `${SECONDARY}`, color: PRIMARY, border: `1px solid ${PRIMARY}33` }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 pb-40">
        <AnimatePresence mode="wait" custom={dir}>
          {screen === "product" && (
            <motion.section key="product" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h1 className="text-2xl font-bold mb-2" style={{ color: "#3B2A1F" }}>Choose your coffee</h1>
              <p className="text-sm mb-6" style={{ color: "#3B2A1FCC" }}>Select a product and adjust the quantity for your order.</p>

              <div className="grid gap-4">
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

              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl"
                  style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[#3B2A1F] font-medium">Total:</span>
                    <span className="text-lg font-bold" style={{ color: PRIMARY }}>
                      TZS {formatPrice(totalPrice)}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          {screen === "contact" && (
            <motion.section key="contact" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#3B2A1F" }}>Contact details</h2>
              <p className="text-sm mb-6" style={{ color: "#3B2A1FCC" }}>We'll use this information to process your order.</p>

              <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}>
                  <label className="block text-sm mb-2 font-medium" style={{ color: "#3B2A1F99" }}>Full name *</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="Your full name"
                    value={data.fullName}
                    onChange={(e) => setField("fullName")(e.target.value)}
                  />
                </div>

                                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}>
                  <label className="block text-sm mb-2 font-medium" style={{ color: "#3B2A1F99" }}>Email (optional)</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="your.email@example.com"
                    inputMode="email"
                    autoComplete="email"
                    value={data.email || ""}
                    onChange={(e) => setField("email")(e.target.value)}
                  />
                  {!!data.email && !isValidEmail(data.email) && (
                    <p className="mt-2 text-xs" style={{ color: "#B00020" }}>Please enter a valid email.</p>
                  )}
                </div>

                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}>
                  <label className="block text-sm mb-2 font-medium" style={{ color: "#3B2A1F99" }}>Phone *</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="+255 712 345 678"
                    inputMode="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(e) => setField("phone")(e.target.value)}
                  />
                  {!!data.phone && !isValidPhone(data.phone) && (
                    <p className="mt-2 text-xs" style={{ color: "#B00020" }}>Please enter a valid phone.</p>
                  )}
                </div>

                <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}>
                  <label className="block text-sm mb-2 font-medium" style={{ color: "#3B2A1F99" }}>Phone (optional)</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="+255 712 345 678"
                    inputMode="tel"
                    autoComplete="tel"
                    value={data.phone || ""}
                    onChange={(e) => setField("phone")(e.target.value)}
                  />
                  {!!data.phone && !isValidPhone(data.phone) && (
                    <p className="mt-2 text-xs" style={{ color: "#B00020" }}>Please enter a valid phone.</p>
                  )}
                </div>
              </form>

              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl"
                  style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26` }}
                >
                  <h4 className="font-medium mb-2" style={{ color: "#3B2A1F" }}>Order Summary</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: "#3B2A1F" }}>{selectedProduct.name} × {data.quantity}</span>
                    <span className="font-semibold" style={{ color: PRIMARY }}>
                      TZS {formatPrice(totalPrice)}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky bottom nav */}
      <footer
        className="fixed bottom-0 inset-x-0 p-4"
        style={{
          background: `linear-gradient(180deg, rgba(238,235,231,0.85) 0%, rgba(238,235,231,0.95) 40%, ${SECONDARY} 100%)`,
          borderTop: `1px solid ${PRIMARY}1A`,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          backdropFilter: "saturate(1.1) blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            disabled={order.indexOf(screen) === 0}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium w-1/3"
            style={{
              border: `1px solid ${PRIMARY}66`,
              color: PRIMARY,
              backgroundColor: "#FFFFFF",
              opacity: order.indexOf(screen) === 0 ? 0.6 : 1,
              boxShadow: `0 1px 0 ${PRIMARY}1A inset` ,
            }}
          >
            ← Back
          </button>

          {screen === "contact" ? (
            <button
              onClick={submit}
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold flex-1"
              style={{
                backgroundColor: PRIMARY,
                color: "#FFFFFF",
                boxShadow: `0 6px 18px ${PRIMARY}33`,
                opacity: mutation.isPending ? 0.7 : 1,
              }}
            >
              {mutation.isPending ? "Placing Order…" : "Place Order"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!isValid}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold flex-1"
              style={{
                backgroundColor: PRIMARY,
                color: "#FFFFFF",
                boxShadow: `0 6px 18px ${PRIMARY}33`,
                opacity: !isValid ? 0.6 : 1,
              }}
            >
              Next →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
