 

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
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
  coffeeProduct: "Tunu" | "Amka" | "";
  schedule: Schedule | "";
  recommendedSize?: string;
  calculatedPrice?: string;
  fullName: string;
  email: string;
  phone?: string;
}

interface SubscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

// ------------------------------------------------------
// Constants & Helpers
// ------------------------------------------------------
const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneRegex = /^[+]?[\d ()-]{6,20}$/;

const cardBase =
  "border border-coffee-brown/20 bg-[#F7F3ED] px-4 py-3 md:px-6 md:py-4 transition transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-coffee-gold/50";

const CUP_OPTIONS: CupsRange[] = ["1 cup a day", "A cup every other day", "Two or more cups a day", "Others"];
const BREW_OPTIONS: BrewMethod[] = ["Espresso", "Pour-Over", "French Press", "Cold Brew"];
const GRIND_OPTIONS: GrindPref[] = ["Whole Bean", "Ground"];
const COFFEE_OPTIONS = [
  { name: "Tunu", description: "Dark roast with vanilla", price: "TSH 22,000" },
  { name: "Amka", description: "Decaf blend", price: "TSH 15,000" }
] as const;
const SCHEDULE_OPTIONS: Schedule[] = ["Every 4 weeks"];

const brewToGrindMap: Record<BrewMethod, string> = {
  Espresso: "Fine grind for espresso",
  "Pour-Over": "Medium grind for pour-over",
  "French Press": "Coarse grind for immersion",
  "Cold Brew": "Extra-coarse grind for steeping",
};

function getCoffeePrice(coffeeProduct: string): number {
  switch (coffeeProduct) {
    case "Nguvu": return 18000;
    case "Tunu": return 22000;
    case "Amka": return 15000;
    default: return 22000;  
  }
}

function calculateRecommendedSize(cupsPerDay: number, frequency: Schedule): string {
  const gramsPerCup = 20;
  const daysInPeriod = 28; // Every 4 weeks
  
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

function calculatePrice(cupsPerDay: number, frequency: Schedule, coffeeProduct: string): string {
  const gramsPerCup = 20;
  const daysInPeriod = 28; // Every 4 weeks
  
  const totalGramsNeeded = cupsPerDay * gramsPerCup * daysInPeriod;
  const totalWithBuffer = Math.ceil(totalGramsNeeded * 1.15);
  
  const availableSizes = [250, 500, 1000, 2000, 3000, 5000, 10000, 15000, 20000, 25000];
  const recommendedSizeGrams = availableSizes.find(size => size >= totalWithBuffer) || 
     Math.ceil(totalWithBuffer / 25000) * 25000;
  
  const basePrice = getCoffeePrice(coffeeProduct);
  const pricePerGram = basePrice / 250;
  
  const totalPrice = recommendedSizeGrams * pricePerGram;
  
  return `TSH ${totalPrice.toLocaleString()}`;
}

function getCupsPerDay(cupsRange: CupsRange | "", customCups?: number): number {
  if (cupsRange === "Others" && customCups !== undefined && customCups > 0) {
    return customCups;
  }
  
  switch (cupsRange) {
    case "1 cup a day": return 1;
    case "A cup every other day": return 0.5;
    case "Two or more cups a day": return 2;
    case "Others": return 2; // default if no custom value
    default: return 1; // fallback
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
// Reusable UI
// ------------------------------------------------------
const RadioCard = React.memo(function RadioCard({
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
  onChange: (val: string) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className={`${cardBase} cursor-pointer flex items-start gap-3`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-6 w-6 sm:h-5 sm:w-5 shrink-0 accent-coffee-gold"
      />
      <span className="text-enzi-db">
        <span className="block font-medium">{label}</span>
        {description && (
          <span className="block text-sm text-enzi-db">{description}</span>
        )}
      </span>
    </label>
  );
});

function Progress({ stepIndex, total }: { stepIndex: number; total: number }) {
  // CHANGED: keep bar, remove percentage text
  const percent = Math.round(((stepIndex + 1) / total) * 100);
  return (
    <div className="w-full mb-6">
  <div className="h-2 w-full bg-enzi-db/10 overflow-hidden" aria-hidden="true">
        <motion.div
          className="h-2 bg-coffee-gold"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-3 text-sm text-enzi-db/70 tracking-wide" aria-live="polite">
        Step {stepIndex + 1} of {total}
      </div>
    </div>
  );
}

// ------------------------------------------------------
// Main Component (3 slides)
// ------------------------------------------------------
export default function SubscriptionWizard({
  isOpen,
  onClose,
}: SubscriptionWizardProps) {
  const { mutation } = useSubscriptionForm();
  const steps = ["cups", "brew", "schedule"] as const;
  type StepKey = typeof steps[number];

  const subStepsMap: Record<StepKey, string[]> = {
    cups: ["cups"],
    brew: ["brewMethod", "grind"],
    schedule: ["coffeeProduct", "frequency", "contact", "summary"],
  };

  const [step, setStep] = useState<StepKey>("cups");
  const [subStep, setSubStep] = useState<string>("cups");
  const [dir, setDir] = useState<1 | -1>(1);
  const total = steps.length;
  const index = steps.indexOf(step);

  const [data, setData] = useState<SubscriptionData>({
    cupsRange: "",
    customCups: undefined,
    brewMethod: "",
    grindPref: "",
    autoGrindNote: "",
    coffeeProduct: "",
    schedule: "",
    recommendedSize: undefined,
    calculatedPrice: undefined,
    fullName: "",
    email: "",
    phone: "",
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
      setStep("cups");
      setSubStep("cups");
      setData({
        cupsRange: "",
        customCups: undefined,
        brewMethod: "",
        grindPref: "",
        autoGrindNote: "",
        coffeeProduct: "",
        schedule: "",
        recommendedSize: undefined,
        calculatedPrice: undefined,
        fullName: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const nodes = Array.from(focusables).filter((el) => el.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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

  useEffect(() => {
    if (data.grindPref === "Ground" && data.brewMethod) {
      setData((d) => ({ ...d, autoGrindNote: brewToGrindMap[d.brewMethod as BrewMethod] }));
    } else if (data.grindPref !== "Ground") {
      setData((d) => ({ ...d, autoGrindNote: "" }));
    }
  }, [data.grindPref, data.brewMethod]);

  // Calculate price and recommended size when relevant data changes
  useEffect(() => {
    if (data.cupsRange && data.coffeeProduct && data.schedule) {
      const cupsPerDay = getCupsPerDay(data.cupsRange, data.customCups);
      const recommendedSize = calculateRecommendedSize(cupsPerDay, data.schedule as Schedule);
      const calculatedPrice = calculatePrice(cupsPerDay, data.schedule as Schedule, data.coffeeProduct);
      setData((d) => ({ ...d, recommendedSize, calculatedPrice }));
    }
  }, [data.cupsRange, data.customCups, data.coffeeProduct, data.schedule]);

  const isValid = useMemo(() => {
    switch (step) {
      case "cups":
        if (data.cupsRange === "Others") {
          return data.customCups !== undefined && data.customCups > 0;
        }
        return !!data.cupsRange;
      case "brew":
        switch (subStep) {
          case "brewMethod": return !!data.brewMethod;
          case "grind": return !!data.grindPref;
          default: return false;
        }
      case "schedule":
        switch (subStep) {
          case "coffeeProduct": return !!data.coffeeProduct;
          case "frequency": return !!data.schedule;
          case "contact": {
            const nameOk = data.fullName.trim().length > 0;
            const emailOk = emailRegex.test(data.email);
            const phoneOk = !data.phone || phoneRegex.test(data.phone);
            return nameOk && emailOk && phoneOk;
          }
          case "summary": return true;
          default: return false;
        }
    }
  }, [step, subStep, data]);

  const setField = useCallback(
    (k: keyof SubscriptionData) => (val: string) =>
      setData((d) => ({ ...d, [k]: val })),
    []
  );

  const toStep = (target: StepKey) => {
    setDir(steps.indexOf(target) > index ? 1 : -1);
    setStep(target);
    setSubStep(subStepsMap[target][0]);
  };

  const next = async () => {
    if (!isValid) return;
    const currentSubSteps = subStepsMap[step];
    const subIndex = currentSubSteps.indexOf(subStep);
    if (subIndex < currentSubSteps.length - 1) {
      setDir(1);
      setSubStep(currentSubSteps[subIndex + 1]);
    } else if (index < total - 1) {
      setDir(1);
      setStep(steps[index + 1]);
      setSubStep(subStepsMap[steps[index + 1]][0]);
    } else {
      await submit();
    }
  };

  const back = () => {
    const currentSubSteps = subStepsMap[step];
    const subIndex = currentSubSteps.indexOf(subStep);
    if (subIndex > 0) {
      setDir(-1);
      setSubStep(currentSubSteps[subIndex - 1]);
    } else if (index > 0) {
      setDir(-1);
      setStep(steps[index - 1]);
      const prevSubSteps = subStepsMap[steps[index - 1]];
      setSubStep(prevSubSteps[prevSubSteps.length - 1]);
    }
  };

  const submit = async () => {
    if (!isValid || index !== total - 1) return;

    // Convert component data to hook format
    const formData = {
      cupsRange: data.cupsRange as CupsRange,
      customCups: data.customCups,
      brewMethod: data.brewMethod as BrewMethod,
      grindPref: data.grindPref as GrindPref,
      coffeeProduct: data.coffeeProduct as "Nguvu" | "Tunu" | "Amka",
      schedule: data.schedule as Schedule,
      recommendedSize: data.recommendedSize,
      calculatedPrice: data.calculatedPrice,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    };

    // Use mutation directly to submit the data
    mutation.mutate(formData);
  };

  // NEW: helper to auto-advance after setting a selection
  const setFieldAndAutoNext = useCallback(
    (k: keyof SubscriptionData) => (val: string) => {
      setData((d) => ({ ...d, [k]: val })); 
      setTimeout(() => { 
        if (
          (step === "cups" && subStep === "cups" && data.cupsRange !== "Others") ||
          (step === "brew" && ["brewMethod", "flavor", "grind"].includes(subStep)) ||
          (step === "schedule" && ["coffeeProduct", "frequency", "size"].includes(subStep))
        ) {
          setDir(1);
          const current = subStepsMap[step];
          const idx = current.indexOf(subStep);
          if (idx < current.length - 1) {
            setSubStep(current[idx + 1]);
          } else if (index < total - 1) {
            setStep(steps[index + 1]);
            setSubStep(subStepsMap[steps[index + 1]][0]);
          }
        }
      }, 0);
    },
    [index, step, subStep, steps, subStepsMap, total]
  );

  if (!isOpen) return null;
  const motionTransition: Transition = prefersReducedMotion()
    ? { duration: 0 }
    : { type: "spring", stiffness: 300, damping: 30 };

  const variants = {
    enter: (direction: 1 | -1) => ({ x: direction * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({ x: direction * -60, opacity: 0 }),
  } as const;

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
          className="absolute inset-0 bg-coffee-brown/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-title"
          tabIndex={-1}
          ref={dialogRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={motionTransition}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white shadow-2xl border border-coffee-brown/15 mx-4 sm:mx-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-coffee-cream/80 hover:bg-coffee-cream text-coffee-brown transition-colors"
            aria-label="Close subscription dialog"
          >
            ✕
          </button>

          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="mb-6">
              <div className="text-enzi-db/80 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase mb-2">
                SUBSCRIBE
              </div>
              <h2 id="subscription-title" className="text-xl sm:text-2xl md:text-3xl font-['GTAlpinaThin'] text-enzi-db">
                Build your coffee subscription
              </h2>
            </div>

            <div className="coffee-card bg-[#F7F3ED] rounded-3xl border border-coffee-brown/15 shadow-sm p-5 sm:p-7 md:p-8">
              <Progress stepIndex={index} total={total} />

              <div className="relative min-h-[320px]">
                <AnimatePresence mode="wait" custom={dir}>
                  {/* Slide 1: Cups per week */}
                  {step === "cups" && (
                    <motion.section
                      key="cups"
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <header className="mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-coffee-brown">
                          How many cups do you enjoy each day?
                        </h3>
                        <p className="mt-1 text-enzi-db text-sm">
                          Every journey starts with you. Tell us roughly how much coffee fuels your day.
                        </p>
                      </header>

                      <fieldset>
                        <legend className="sr-only">Cups per week</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CUP_OPTIONS.map((opt) => (
                            <RadioCard
                              key={opt}
                              name="cupsRange"
                              value={opt}
                              checked={data.cupsRange === opt}
                              onChange={setFieldAndAutoNext("cupsRange")}
                              label={opt}
                            />
                          ))}
                        </div>
                      </fieldset>

                      {data.cupsRange === "Others" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="flex items-center gap-3">
                            <label className="text-enzi-db text-sm whitespace-nowrap">How many cups per day?</label>
                            <input
                              type="number"
                              min="1"
                              value={data.customCups || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setData((d) => ({ ...d, customCups: isNaN(value) ? undefined : value }));
                              }}
                              className="w-20 px-2 py-1 border border-coffee-brown/20 rounded-md bg-white text-enzi-db text-sm outline-none focus:ring-2 focus:ring-coffee-gold/50"
                              placeholder="5"
                            />
                          </div>
                        </motion.div>
                      )}

                    </motion.section>
                  )}

                  {/* Slide 2: Brew & Taste */}
                  {step === "brew" && (
                    <motion.section
                      key="brew"
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <header className="mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-coffee-brown">
                          {subStep === "brewMethod"
                            ? "How do you like to brew your coffee?"
                            : "What's your preferred grind?"}
                        </h3>
                        <p className="mt-1 text-enzi-db text-sm">
                          {subStep === "brewMethod"
                            ? "Tell us how you brew and we'll select the perfect roast and grind on your behalf. You're one step away from a cup that feels made just for you."
                            : "Choose between whole beans for maximum freshness or pre-ground coffee matched to your brewing method."}
                        </p>
                      </header>

                      <div className="space-y-6">
                        <AnimatePresence mode="wait" custom={dir}>
                          {subStep === "brewMethod" && (
                            <motion.fieldset
                              key="brewMethod"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                              <legend className="block text-enzi-db text-sm mb-2">Brew method</legend>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {BREW_OPTIONS.map((opt) => (
                                  <RadioCard
                                    key={opt}
                                    name="brewMethod"
                                    value={opt}
                                    checked={data.brewMethod === opt}
                                    onChange={setFieldAndAutoNext("brewMethod")} 
                                    label={opt}
                                  />
                                ))}
                              </div>
                            </motion.fieldset>
                          )}

                          {subStep === "grind" && (
                            <motion.fieldset
                              key="grind"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                              <legend className="block text-enzi-db text-sm mb-2">Grind preference</legend>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                                {GRIND_OPTIONS.map((opt) => (
                                  <RadioCard
                                    key={opt}
                                    name="grindPref"
                                    value={opt}
                                    checked={data.grindPref === opt}
                                    onChange={setFieldAndAutoNext("grindPref")} 
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
                            </motion.fieldset>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.section>
                  )}

                  {/* Slide 3: Schedule, Size confirm, Contact + Summary */}
                  {step === "schedule" && (
                    <motion.section
                      key="schedule"
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <header className="mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-coffee-brown">
                          When should your coffee arrive?
                        </h3>
                        <p className="mt-1 text-enzi-db text-sm">
                          Freshness matters. Tell us how often you want your coffee delivered and we’ll roast it just in time.
                        </p>
                      </header>

                      <div className="space-y-6">
                        <AnimatePresence mode="wait" custom={dir}>
                          {subStep === "coffeeProduct" && (
                            <motion.fieldset
                              key="coffeeProduct"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                              <legend className="block text-enzi-db text-sm mb-2">Step 3 of 3: Choose your coffee</legend>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {COFFEE_OPTIONS.map((opt) => (
                                  <RadioCard
                                    key={opt.name}
                                    name="coffeeProduct"
                                    value={opt.name}
                                    checked={data.coffeeProduct === opt.name}
                                    onChange={setFieldAndAutoNext("coffeeProduct")}
                                    label={opt.name}
                                    description={`${opt.description} • ${opt.price}/250g`}
                                  />
                                ))}
                              </div>
                            </motion.fieldset>
                          )}

                          {subStep === "frequency" && (
                            <motion.fieldset
                              key="frequency"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                              <legend className="block text-enzi-db text-sm mb-2">When should your coffee arrive?</legend>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                                {SCHEDULE_OPTIONS.map((opt) => {
                                  const cupsPerDay = getCupsPerDay(data.cupsRange, data.customCups);
                                  const recommendedSize = calculateRecommendedSize(cupsPerDay, opt);
                                  const price = calculatePrice(cupsPerDay, opt, data.coffeeProduct);
                                  const smartLabel = `${opt} (${recommendedSize})`;
                                  const description = `${getSmartDescription(cupsPerDay)} • ${price}`;
                                  
                                  return (
                                    <RadioCard
                                      key={opt}
                                      name="schedule"
                                      value={opt}
                                      checked={data.schedule === opt}
                                      onChange={setFieldAndAutoNext("schedule")}
                                      label={smartLabel}
                                      description={description}
                                    />
                                  );
                                })}
                              </div>
                            </motion.fieldset>
                          )}

                          {subStep === "contact" && (
                            <motion.div
                              key="contact"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                              <div className="col-span-1 sm:col-span-2">
                                <div className={`${cardBase} bg-white`}>
                                  <label className="block text-enzi-db text-sm mb-2">Full Name *</label>
                                  <input
                                    type="text"
                                    value={data.fullName}
                                    onChange={(e) => setField("fullName")(e.target.value)}
                                    className="w-full bg-transparent outline-none text-enzi-db text-base min-h-[48px] px-1"
                                    placeholder="e.g., Asha N."
                                    aria-invalid={data.fullName.trim().length === 0}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className={`${cardBase} bg-white`}>
                                  <label className="block text-enzi-db text-sm mb-2">Email *</label>
                                  <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setField("email")(e.target.value)}
                                    className="w-full bg-transparent outline-none text-enzi-db text-base min-h-[48px] px-1"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    aria-invalid={!!data.email && !emailRegex.test(data.email)}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className={`${cardBase} bg-white`}>
                                  <label className="block text-enzi-db text-sm mb-2">Phone (optional)</label>
                                  <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setField("phone")(e.target.value)}
                                    className="w-full bg-transparent outline-none text-enzi-db text-base min-h-[48px] px-1"
                                    placeholder="+255 712 345 678"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    aria-invalid={!!data.phone && !phoneRegex.test(data.phone || "")}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {subStep === "summary" && (
                            <motion.div
                              key="summary"
                              custom={dir}
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              className="mt-2 bg-white border border-coffee-brown/20 rounded-2xl p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-coffee-brown">Summary</h4>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => toStep("cups")}
                                    className="text-sm underline text-enzi-db hover:text-enzi-db"
                                  >
                                    Edit cups
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toStep("brew")}
                                    className="text-sm underline text-enzi-db hover:text-enzi-db"
                                  >
                                    Edit brew & taste
                                  </button>
                                </div>
                              </div>
                              <ul className="text-sm text-enzi-db grid grid-cols-1 sm:grid-cols-2 gap-y-1">
                                <li><strong>Cups/week:</strong> {data.cupsRange === "Others" && data.customCups ? `${data.customCups} cups/day` : data.cupsRange || "—"}</li>
                                <li><strong>Brew:</strong> {data.brewMethod || "—"}</li>
                                <li><strong>Grind:</strong> {data.grindPref}{data.autoGrindNote ? ` — ${data.autoGrindNote}` : ""}</li>
                                <li><strong>Coffee:</strong> {data.coffeeProduct || "—"}</li>
                                <li><strong>Frequency:</strong> {data.schedule ? (() => {
                                  const cupsPerDay = getCupsPerDay(data.cupsRange, data.customCups);
                                  const recommendedSize = calculateRecommendedSize(cupsPerDay, data.schedule as Schedule);
                                  return `${data.schedule} (${recommendedSize})`;
                                })() : "—"}</li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav buttons */}
              <div className="mt-6 sm:mt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={index === 0 && subStepsMap[step].indexOf(subStep) === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-enzi-db/30 px-4 py-3 sm:px-5 sm:py-3 text-enzi-db disabled:opacity-40 bg-white min-h-[48px]"
                >
                  ← Back
                </button>

                <button
                  onClick={next}
                  disabled={
                    !isValid ||
                    (index === total - 1 &&
                      subStepsMap[step].indexOf(subStep) === subStepsMap[step].length - 1 &&
                      mutation.isPending)
                  }
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 sm:px-6 sm:py-3 font-semibold text-white bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50 min-h-[48px]"
                >
                  {index === total - 1 && subStepsMap[step].indexOf(subStep) === subStepsMap[step].length - 1
                    ? (mutation.isPending ? "Submitting…" : "Subscribe Now")
                    : "Next →"}
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-enzi-db/80 text-center">
              {/* You’re joining Harakati za Enzi, a movement that honours every hand along the way. Expect a confirmation email, and let us know if your tastes evolve; we’re here to guide you. */}
              Join Harakati za Enzi, a movement that honours every hand along the way.  
              <br />
              {/* With love, Harakati za Enzi */}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

