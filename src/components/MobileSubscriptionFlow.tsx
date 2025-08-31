import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

// ------------------------------------------------------
// Types (aligned with your desktop wizard)
// ------------------------------------------------------
export type CupsRange = "Up to 4" | "4–8" | "8–12";
export type BrewMethod = "Espresso" | "Pour-Over" | "French Press" | "Cold Brew";
export type FlavorProfile =
  | "Bright & Fruity"
  | "Nutty & Chocolatey"
  | "Balanced & Smooth"
  | "Surprise me!";
export type GrindPref = "Whole Bean" | "Ground";
export type Size = "250g" | "500g" | "1kg";
export type Schedule = "Every 2 weeks" | "Every 4 weeks";

export interface SubscriptionData {
  cupsRange: CupsRange | "";
  brewMethod: BrewMethod | "";
  flavorProfile: FlavorProfile | "";
  grindPref: GrindPref | "";
  autoGrindNote?: string; 
  schedule: Schedule | "";
  size: Size | "";  
  fullName: string;
  email: string;
  phone?: string;
}

export interface SubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SubscriptionData) => Promise<void> | void;
}

// ------------------------------------------------------
// Helpers (no regex literals to avoid escaping in canvas updates)
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

const CUP_OPTIONS: CupsRange[] = ["Up to 4", "4–8", "8–12"];
const BREW_OPTIONS: BrewMethod[] = ["Espresso", "Pour-Over", "French Press", "Cold Brew"];
const FLAVOR_OPTIONS: FlavorProfile[] = [
  "Bright & Fruity",
  "Nutty & Chocolatey",
  "Balanced & Smooth",
  "Surprise me!",
];
const GRIND_OPTIONS: GrindPref[] = ["Whole Bean", "Ground"];
const SIZE_OPTIONS: Size[] = ["250g", "500g", "1kg"];
const SCHEDULE_OPTIONS: Schedule[] = ["Every 2 weeks", "Every 4 weeks"];

const cardBase =
  "rounded-2xl border border-coffee-brown/15 bg-[#F7F3ED] px-4 py-3 transition focus-within:ring-2 focus-within:ring-coffee-gold/50";

const brewToGrindMap: Record<BrewMethod, string> = {
  Espresso: "Fine grind for espresso",
  "Pour-Over": "Medium grind for pour-over",
  "French Press": "Coarse grind for immersion",
  "Cold Brew": "Extra-coarse grind for steeping",
};

function recommendSize(cupsRange: CupsRange | ""): Size | "" {
  switch (cupsRange) {
    case "Up to 4":
      return "250g";
    case "4–8":
      return "500g";
    case "8–12":
      return "1kg";
    default:
      return "";
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// ------------------------------------------------------
// Radio line item used throughout
// ------------------------------------------------------
function RadioLine({
  name,
  value,
  checked,
  onChange,
  label,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center justify-between w-full bg-white border border-coffee-brown/15 rounded-2xl px-4 py-4">
      <span className="text-enzi-db">
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="block text-sm text-enzi-db/70">{description}</span>
        ) : null}
      </span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5 accent-coffee-gold"
      />
    </label>
  );
}

// ------------------------------------------------------
// Mobile-first full-screen experience (light theme, your palette)
// ------------------------------------------------------
export default function MobileSubscriptionFlow({ isOpen, onClose, onSubmit }: SubscriptionWizardProps) {
  type Screen =
    | "cups"
    | "brewMethod"
    | "flavor"
    | "grind"
    | "frequency"
    | "size"
    | "contact"
    | "summary";

  const order: Screen[] = [
    "cups",
    "brewMethod",
    "flavor",
    "grind",
    "frequency",
    "size",
    "contact",
    "summary",
  ];

  const [screen, setScreen] = useState<Screen>("cups");
  const [dir, setDir] = useState<1 | -1>(1);

  const [data, setData] = useState<SubscriptionData>({
    cupsRange: "",
    brewMethod: "",
    flavorProfile: "",
    grindPref: "",
    autoGrindNote: "",
    schedule: "",
    size: "",
    fullName: "",
    email: "",
    phone: "",
  });

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setScreen("cups");
      setDir(1);
      setData({
        cupsRange: "",
        brewMethod: "",
        flavorProfile: "",
        grindPref: "",
        autoGrindNote: "",
        schedule: "",
        size: "",
        fullName: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen]);

  // Derived
  const suggestedSize = useMemo(() => recommendSize(data.cupsRange), [data.cupsRange]);

  // Auto-set grind note
  useEffect(() => {
    if (data.grindPref === "Ground" && data.brewMethod) {
      setData((d) => ({ ...d, autoGrindNote: brewToGrindMap[d.brewMethod as BrewMethod] }));
    } else if (data.grindPref !== "Ground") {
      setData((d) => ({ ...d, autoGrindNote: "" }));
    }
  }, [data.grindPref, data.brewMethod]);

  // Seed size the moment cups are chosen (ensures Size screen shows something)
  useEffect(() => {
    if (data.cupsRange) {
      setData((d) => ({ ...d, size: d.size || (suggestedSize as Size) }));
    }
  }, [data.cupsRange, suggestedSize]);

  const go = (next: Screen) => {
    const a = order.indexOf(screen);
    const b = order.indexOf(next);
    setDir(b > a ? 1 : -1);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setField = useCallback(
    (k: keyof SubscriptionData) => (val: string) => setData((d) => ({ ...d, [k]: val })),
    []
  );

  // Validation per screen
  const isValid = useMemo(() => {
    switch (screen) {
      case "cups":
        return !!data.cupsRange;
      case "brewMethod":
        return !!data.brewMethod;
      case "flavor":
        return !!data.flavorProfile;
      case "grind":
        return !!data.grindPref;
      case "frequency":
        return !!data.schedule;
      case "size":
        return !!data.size;
      case "contact":
        return (
          data.fullName.trim().length > 0 &&
          isValidEmail(data.email) &&
          (!data.phone || isValidPhone(data.phone))
        );
      case "summary":
        return true;
    }
  }, [screen, data]);

  // Optional: auto-advance when selecting radios on choice screens
  const autoNextOnChoice = (s: Screen) => ["cups", "brewMethod", "flavor", "grind", "frequency", "size"].includes(s);

  const next = () => {
    const i = order.indexOf(screen);
    if (!isValid) return;
    if (i < order.length - 1) go(order[i + 1]);
  };
  const back = () => {
    const i = order.indexOf(screen);
    if (i > 0) go(order[i - 1]);
  };

  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    if (!isValid || screen !== "summary") return;
    try {
      setSubmitting(true);
      await onSubmit?.(data);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const t: Transition = prefersReducedMotion() ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 };
  const variants = {
    enter: (direction: 1 | -1) => ({ x: direction * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({ x: direction * -60, opacity: 0 }),
  } as const;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-coffee-brown/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={back}
            disabled={order.indexOf(screen) === 0}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-enzi-db/20 text-enzi-db disabled:opacity-40 bg-white"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-coffee-cream/80 hover:bg-coffee-cream text-coffee-brown"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 pb-28">
        <AnimatePresence mode="wait" custom={dir}>
          {/* Screen: cups */}
          {screen === "cups" && (
            <motion.section key="cups" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h1 className="text-2xl font-bold text-coffee-brown">Your partner in building a thriving coffee ritual</h1>
              <p className="mt-2 text-enzi-db/80 text-sm">Pick what best describes your weekly coffee habits to get a tailored plan.</p>

              <h2 className="mt-6 mb-2 text-enzi-db/80 text-sm font-semibold">I DRINK</h2>
              <div className="grid gap-3">
                {CUP_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="cupsRange"
                    value={opt}
                    checked={data.cupsRange === opt}
                    onChange={(v) => {
                      setField("cupsRange")(v);
                      if (autoNextOnChoice("cups")) setTimeout(next, 0);
                    }}
                    label={opt}
                  />
                ))}
              </div>

              {data.cupsRange && (
                <div className="mt-4 text-sm text-coffee-brown/90 bg-[#F7F3ED] border border-coffee-brown/20 rounded-xl p-3">
                  Suggested size: <strong className="font-['RoobertBold']">{suggestedSize} per month</strong> based on your pace. You can adjust later.
                </div>
              )}
            </motion.section>
          )}

          {/* Screen: brewMethod */}
          {screen === "brewMethod" && (
            <motion.section key="brew" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">How do you brew?</h2>
              <p className="mt-2 text-enzi-db/80 text-sm">We’ll match grind to your method if you choose ground.</p>
              <div className="mt-4 grid gap-3">
                {BREW_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="brewMethod"
                    value={opt}
                    checked={data.brewMethod === opt}
                    onChange={(v) => { setField("brewMethod")(v); if (autoNextOnChoice("brewMethod")) setTimeout(next, 0); }}
                    label={opt}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Screen: flavor */}
          {screen === "flavor" && (
            <motion.section key="flavor" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Flavour profile</h2>
              <div className="mt-4 grid gap-3">
                {FLAVOR_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="flavorProfile"
                    value={opt}
                    checked={data.flavorProfile === opt}
                    onChange={(v) => { setField("flavorProfile")(v); if (autoNextOnChoice("flavor")) setTimeout(next, 0); }}
                    label={opt}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Screen: grind */}
          {screen === "grind" && (
            <motion.section key="grind" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Grind preference</h2>
              <div className="mt-4 grid gap-3 max-w-lg">
                {GRIND_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="grindPref"
                    value={opt}
                    checked={data.grindPref === opt}
                    onChange={(v) => { setField("grindPref")(v); if (autoNextOnChoice("grind")) setTimeout(next, 0); }}
                    label={opt}
                    description={
                      opt === "Ground"
                        ? data.brewMethod
                          ? `We'll match: ${brewToGrindMap[data.brewMethod as BrewMethod]}`
                          : "We'll match grind size to your brew method"
                        : "Best freshness and flexibility"
                    }
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Screen: frequency */}
          {screen === "frequency" && (
            <motion.section key="freq" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Delivery frequency</h2>
              <div className="mt-4 grid gap-3 max-w-lg">
                {SCHEDULE_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="schedule"
                    value={opt}
                    checked={data.schedule === opt}
                    onChange={(v) => { setField("schedule")(v); if (autoNextOnChoice("frequency")) setTimeout(next, 0); }}
                    label={opt}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Screen: size */}
          {screen === "size" && (
            <motion.section key="size" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Confirm bag size</h2>
              <p className="mt-2 text-enzi-db/80 text-sm">We recommend <span className="text-coffee-brown font-semibold">{suggestedSize || "—"}</span> based on your cups/week.</p>
              <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-3 max-w-xl">
                {SIZE_OPTIONS.map((opt) => (
                  <label key={opt} className={`${cardBase} flex items-center justify-between`}>
                    <span className="text-enzi-db font-medium">{opt}</span>
                    <input
                      type="radio"
                      name="size"
                      value={opt}
                      checked={data.size === opt}
                      onChange={(e) => { setField("size")(e.target.value); if (autoNextOnChoice("size")) setTimeout(next, 0); }}
                      className="h-5 w-5 accent-coffee-gold"
                    />
                  </label>
                ))}
              </div>
            </motion.section>
          )}

          {/* Screen: contact */}
          {screen === "contact" && (
            <motion.section key="contact" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Where can we reach you?</h2>
              <p className="mt-2 text-enzi-db/80 text-sm">We’ll send order updates and tips to get the best out of your beans.</p>
              <form className="mt-4 grid gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className={`${cardBase} bg-white`}>
                  <label className="block text-enzi-db/70 text-sm mb-1">Full name *</label>
                  <input
                    className="w-full bg-transparent outline-none text-enzi-db"
                    placeholder="e.g., Asha N."
                    value={data.fullName}
                    onChange={(e) => setField("fullName")(e.target.value)}
                  />
                </div>
                <div className={`${cardBase} bg-white`}>
                  <label className="block text-enzi-db/70 text-sm mb-1">Email *</label>
                  <input
                    className="w-full bg-transparent outline-none text-enzi-db"
                    placeholder="you@example.com"
                    inputMode="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setField("email")(e.target.value)}
                  />
                  {!!data.email && !isValidEmail(data.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email.</p>
                  )}
                </div>
                <div className={`${cardBase} bg-white`}>
                  <label className="block text-enzi-db/70 text-sm mb-1">Phone (optional)</label>
                  <input
                    className="w-full bg-transparent outline-none text-enzi-db"
                    placeholder="+255 712 345 678"
                    inputMode="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(e) => setField("phone")(e.target.value)}
                  />
                  {!!data.phone && !isValidPhone(data.phone || "") && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid phone.</p>
                  )}
                </div>
              </form>
            </motion.section>
          )}

          {/* Screen: summary */}
          {screen === "summary" && (
            <motion.section key="summary" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold text-coffee-brown">Review & confirm</h2>
              <div className="mt-4 bg-white border border-coffee-brown/20 rounded-2xl divide-y divide-coffee-brown/10">
                <SummaryRow label="Cups / week" value={data.cupsRange || "—"} onEdit={() => go("cups")} />
                <SummaryRow label="Brew" value={data.brewMethod || "—"} onEdit={() => go("brewMethod")} />
                <SummaryRow label="Flavour" value={data.flavorProfile || "—"} onEdit={() => go("flavor")} />
                <SummaryRow label="Grind" value={`${data.grindPref || "—"}${data.autoGrindNote ? ` — ${data.autoGrindNote}` : ""}`} onEdit={() => go("grind")} />
                <SummaryRow label="Bag size" value={data.size || "—"} onEdit={() => go("size")} />
                <SummaryRow label="Frequency" value={data.schedule || "—"} onEdit={() => go("frequency")} />
                <SummaryRow label="Name" value={data.fullName || "—"} onEdit={() => go("contact")} />
                <SummaryRow label="Email" value={data.email || "—"} onEdit={() => go("contact")} />
              </div>
              <p className="mt-3 text-xs text-enzi-db/80">By subscribing you agree to receive transactional emails. You can pause or adjust any time.</p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky bottom nav like your desktop design */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-coffee-brown/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={order.indexOf(screen) === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-enzi-db/30 px-5 py-3 text-enzi-db disabled:opacity-40 bg-white"
          >
            ← Back
          </button>

          {screen === "summary" ? (
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Confirm & Subscribe"}
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!isValid}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50"
            >
              Next →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <button onClick={onEdit} className="w-full px-4 py-3 flex items-center justify-between text-enzi-db">
      <div>
        <div className="text-xs text-enzi-db/70">{label}</div>
        <div className="text-sm mt-0.5">{value}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-enzi-db/60" />
    </button>
  );
}