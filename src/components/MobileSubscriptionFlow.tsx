import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { useSubscriptionForm } from "../hooks/useSubscriptionForm";
import { type CupsRange, type BrewMethod, type GrindPref, type Schedule } from "../data/contact";

// ------------------------------------------------------
// Types
// ------------------------------------------------------
interface SubscriptionData {
  cupsRange: CupsRange | "";
  customCups?: number;
  brewMethod: BrewMethod | "";
  grindPref: GrindPref | "";
  autoGrindNote?: string;
  schedule: Schedule | "";
  fullName: string;
  email: string;
  phone?: string;
}

// Brand colors (focus on LOOKS only)
const PRIMARY = "#B47744";    
const SECONDARY = "#EEEBE7"; 

// ------------------------------------------------------
// Types
// ------------------------------------------------------
interface SubscriptionData {
  cupsRange: CupsRange | "";
  customCups?: number;
  brewMethod: BrewMethod | "";
  grindPref: GrindPref | "";
  autoGrindNote?: string;
  schedule: Schedule | "";
  fullName: string;
  email: string;
  phone?: string;
}

export interface SubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

// ------------------------------------------------------
// Helpers (unchanged logic)
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

const CUP_OPTIONS: CupsRange[] = ["1 to 2", "2 to 4", "5 - 7", "Others"];
const BREW_OPTIONS: BrewMethod[] = ["Espresso", "Pour-Over", "French Press", "Cold Brew"];
const GRIND_OPTIONS: GrindPref[] = ["Whole Bean", "Ground"];
const SCHEDULE_OPTIONS: Schedule[] = ["Every 2 weeks", "Every 4 weeks"];

// Shared card base using SECONDARY with subtle border
const cardBase = `rounded-2xl border px-4 py-3 transition focus-within:ring-2`;

const brewToGrindMap: Record<BrewMethod, string> = {
  Espresso: "Fine grind for espresso",
  "Pour-Over": "Medium grind for pour-over",
  "French Press": "Coarse grind for immersion",
  "Cold Brew": "Extra-coarse grind for steeping",
};

function calculateRecommendedSize(cupsPerDay: number, frequency: Schedule): string {
  const gramsPerCup = 20;
  const daysInPeriod = frequency === "Every 2 weeks" ? 14 : 28;
  
  const totalGramsNeeded = cupsPerDay * gramsPerCup * daysInPeriod;
  
  const totalWithBuffer = Math.ceil(totalGramsNeeded * 1.15);
  
  const availableSizes = [250, 500, 1000, 2000, 3000, 5000, 10000, 15000, 20000, 25000];
  
  const recommendedSizeGrams = availableSizes.find(size => size >= totalWithBuffer) || 
     Math.ceil(totalWithBuffer / 25000) * 25000;
  
   if (recommendedSizeGrams >= 1000) {
    if (recommendedSizeGrams % 1000 === 0) {
      return `${recommendedSizeGrams / 1000}kg`;
    } else {
      return `${(recommendedSizeGrams / 1000).toFixed(1)}kg`;
    }
  } else {
    return `${recommendedSizeGrams}g`;
  }
}

function getCupsPerDay(cupsRange: CupsRange | "", customCups?: number): number {
  if (cupsRange === "Others" && customCups !== undefined && customCups > 0) {
    return customCups;
  }
  
  switch (cupsRange) {
    case "1 to 2": return 1.5;   
    case "2 to 4": return 3;     
    case "5 - 7": return 6; 
    default: return 2;           
  }
}

function getSmartDescription(cupsPerDay: number): string {
  if (cupsPerDay <= 2) {
    return "Perfect for occasional coffee moments";
  } else if (cupsPerDay <= 4) {
    return "Ideal for daily coffee routine";
  } else if (cupsPerDay <= 8) {
    return "Great for coffee lovers & small teams";
  } else if (cupsPerDay <= 15) {
    return "Perfect for offices & heavy users";
  } else if (cupsPerDay <= 30) {
    return "Ideal for medium businesses & cafes";
  } else if (cupsPerDay <= 60) {
    return "Perfect for large offices & coffee shops";
  } else {
    return "Enterprise solution for high-volume needs";
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// ------------------------------------------------------
// Radio line item — recolored to brand palette
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
    <label
      className="flex items-center justify-between w-full rounded-2xl px-4 py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${PRIMARY}20`, 
      }}
    >
      <span style={{ color: "#3B2A1F" }}>
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="block text-sm" style={{ color: "#3B2A1F80" }}>
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5"
        style={{ accentColor: PRIMARY }}
      />
    </label>
  );
}

// ------------------------------------------------------
// Mobile-first full-screen experience (color refresh only)
// ------------------------------------------------------
export default function MobileSubscriptionFlow({ isOpen, onClose }: SubscriptionWizardProps) {
  const { mutation } = useSubscriptionForm();
  type Screen =
    | "cups"
    | "brewMethod"
    | "grind"
    | "frequency"
    | "contact"
    | "summary";

  const order: Screen[] = [
    "cups",
    "brewMethod",
    "grind",
    "frequency",
    "contact",
    "summary",
  ];

  const [screen, setScreen] = useState<Screen>("cups");
  const [dir, setDir] = useState<1 | -1>(1);

  const [data, setData] = useState<SubscriptionData>({
    cupsRange: "",
    customCups: undefined,
    brewMethod: "",
    grindPref: "",
    autoGrindNote: "",
    schedule: "",
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setScreen("cups");
      setDir(1);
      setData({
        cupsRange: "",
        customCups: undefined,
        brewMethod: "",
        grindPref: "",
        autoGrindNote: "",
        schedule: "",
        fullName: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen]);

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
    (k: keyof SubscriptionData) => (val: string) => setData((d) => ({ ...d, [k]: val })),
    []
  );

  const isValid = useMemo(() => {
    switch (screen) {
      case "cups":
        if (data.cupsRange === "Others") {
          return data.customCups !== undefined && data.customCups > 0;
        }
        return !!data.cupsRange;
      case "brewMethod":
        return !!data.brewMethod;
      case "grind":
        return !!data.grindPref;
      case "frequency":
        return !!data.schedule;
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

  const autoNextOnChoice = (s: Screen) =>
    ["cups", "brewMethod", "grind", "frequency"].includes(s);

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
    if (!isValid || screen !== "summary") return;

    // Convert component data to hook format
    const formData = {
      cupsRange: data.cupsRange as CupsRange,
      customCups: data.customCups,
      brewMethod: data.brewMethod as BrewMethod,
      grindPref: data.grindPref as GrindPref,
      schedule: data.schedule as Schedule,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    };

    // Use mutation directly to submit the data
    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  const t: Transition = prefersReducedMotion() ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 };
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
          {screen === "cups" && (
            <motion.section key="cups" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h1 className="text-2xl font-bold" style={{ color: "#3B2A1F" }}>Your partner in building a thriving coffee ritual</h1>
              <p className="mt-2 text-sm" style={{ color: "#3B2A1FCC" }}>Pick what best describes your weekly coffee habits to get a tailored plan.</p>

              <h2 className="mt-6 mb-2 text-sm font-semibold" style={{ color: "#3B2A1F99" }}>I DRINK</h2>
              <div className="grid gap-3">
                {CUP_OPTIONS.map((opt) => (
                  <RadioLine
                    key={opt}
                    name="cupsRange"
                    value={opt}
                    checked={data.cupsRange === opt}
                    onChange={(v) => {
                      setField("cupsRange")(v);
                      // Don't auto-advance for "Others" - user needs to enter custom number first
                      if (autoNextOnChoice("cups") && v !== "Others") setTimeout(next, 0);
                    }}
                    label={opt}
                  />
                ))}
              </div>

              {data.cupsRange === "Others" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-3">
                    <label className="text-sm whitespace-nowrap" style={{ color: "#3B2A1F" }}>How many cups per day?</label>
                    <input
                      type="number"
                      min="1"
                      value={data.customCups || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setData((d) => ({ ...d, customCups: isNaN(value) ? undefined : value }));
                      }}
                      className="w-20 px-2 py-1 border rounded-md bg-white text-sm outline-none focus:ring-2"
                      style={{ borderColor: `${PRIMARY}20`, color: "#3B2A1F" }}
                      placeholder="6"
                    />
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          {screen === "brewMethod" && (
            <motion.section key="brew" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold" style={{ color: "#3B2A1F" }}>How do you brew?</h2>
              <p className="mt-2 text-sm" style={{ color: "#3B2A1FCC" }}>We’ll match grind to your method if you choose ground.</p>
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

          {screen === "grind" && (
            <motion.section key="grind" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold" style={{ color: "#3B2A1F" }}>Grind preference</h2>
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

          {screen === "frequency" && (
            <motion.section key="freq" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold" style={{ color: "#3B2A1F" }}>Delivery frequency</h2>
              <div className="mt-4 grid gap-3 max-w-lg">
                {SCHEDULE_OPTIONS.map((opt) => {
                  const cupsPerDay = getCupsPerDay(data.cupsRange, data.customCups);
                  const recommendedSize = calculateRecommendedSize(cupsPerDay, opt);
                  const smartLabel = `${opt} (${recommendedSize})`;
                  const description = getSmartDescription(cupsPerDay);
                  
                  return (
                    <RadioLine
                      key={opt}
                      name="schedule"
                      value={opt}
                      checked={data.schedule === opt}
                      onChange={(v) => { setField("schedule")(v); if (autoNextOnChoice("frequency")) setTimeout(next, 0); }}
                      label={smartLabel}
                      description={description}
                    />
                  );
                })}
              </div>
            </motion.section>
          )}

          {screen === "contact" && (
            <motion.section key="contact" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold" style={{ color: "#3B2A1F" }}>Where can we reach you?</h2>
              <p className="mt-2 text-sm" style={{ color: "#3B2A1FCC" }}>We’ll send order updates and tips to get the best out of your beans.</p>
              <form className="mt-4 grid gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className={`${cardBase} rounded-2xl`} style={{ backgroundColor: "#FFFFFF", borderColor: `${PRIMARY}26`, boxShadow: `0 1px 0 ${PRIMARY}14 inset` }}>
                  <label className="block text-sm mb-1" style={{ color: "#3B2A1F99" }}>Full name *</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="e.g., Asha N."
                    value={data.fullName}
                    onChange={(e) => setField("fullName")(e.target.value)}
                  />
                </div>
                <div className={`${cardBase} rounded-2xl`} style={{ backgroundColor: "#FFFFFF", borderColor: `${PRIMARY}26`, boxShadow: `0 1px 0 ${PRIMARY}14 inset` }}>
                  <label className="block text-sm mb-1" style={{ color: "#3B2A1F99" }}>Email *</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="you@example.com"
                    inputMode="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setField("email")(e.target.value)}
                  />
                  {!!data.email && !isValidEmail(data.email) && (
                    <p className="mt-1 text-xs" style={{ color: "#B00020" }}>Please enter a valid email.</p>
                  )}
                </div>
                <div className={`${cardBase} rounded-2xl`} style={{ backgroundColor: "#FFFFFF", borderColor: `${PRIMARY}26`, boxShadow: `0 1px 0 ${PRIMARY}14 inset` }}>
                  <label className="block text-sm mb-1" style={{ color: "#3B2A1F99" }}>Phone (optional)</label>
                  <input
                    className="w-full bg-transparent outline-none"
                    style={{ color: "#3B2A1F" }}
                    placeholder="+255 712 345 678"
                    inputMode="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(e) => setField("phone")(e.target.value)}
                  />
                  {!!data.phone && !isValidPhone(data.phone || "") && (
                    <p className="mt-1 text-xs" style={{ color: "#B00020" }}>Please enter a valid phone.</p>
                  )}
                </div>
              </form>
            </motion.section>
          )}

          {screen === "summary" && (
            <motion.section key="summary" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={t}>
              <h2 className="text-xl font-bold" style={{ color: "#3B2A1F" }}>Review & confirm</h2>
              <div className="mt-4 rounded-2xl divide-y" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${PRIMARY}26`, color: "#3B2A1F", borderColor: `${PRIMARY}26` }}>
                <SummaryRow label="Cups / day" value={data.cupsRange === "Others" ? `${data.customCups || 0} cups/day` : data.cupsRange || "—"} onEdit={() => go("cups")} />
                <SummaryRow label="Brew" value={data.brewMethod || "—"} onEdit={() => go("brewMethod")} />
                <SummaryRow label="Grind" value={`${data.grindPref || "—"}${data.autoGrindNote ? ` — ${data.autoGrindNote}` : ""}`} onEdit={() => go("grind")} />
                <SummaryRow label="Frequency" value={data.schedule ? (() => {
                  const cupsPerDay = getCupsPerDay(data.cupsRange, data.customCups);
                  const recommendedSize = calculateRecommendedSize(cupsPerDay, data.schedule as Schedule);
                  return `${data.schedule} (${recommendedSize})`;
                })() : "—"} onEdit={() => go("frequency")} />
                <SummaryRow label="Name" value={data.fullName || "—"} onEdit={() => go("contact")} />
                <SummaryRow label="Email" value={data.email || "—"} onEdit={() => go("contact")} />
              </div>
              <p className="mt-3 text-xs" style={{ color: "#3B2A1FCC" }}>
                By subscribing you agree to receive transactional emails. You can pause or adjust any time.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky bottom nav — improved contrast & touch targets */}
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

          {screen === "summary" ? (
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
              {mutation.isPending ? "Submitting…" : "Confirm & Subscribe"}
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

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <button onClick={onEdit} className="w-full px-4 py-3 flex items-center justify-between" style={{ color: "#3B2A1F" }}>
      <div>
        <div className="text-xs" style={{ color: "#3B2A1F99" }}>{label}</div>
        <div className="text-sm mt-0.5">{value}</div>
      </div>
      <ChevronRight className="h-4 w-4" style={{ color: "#3B2A1F80" }} />
    </button>
  );
}
