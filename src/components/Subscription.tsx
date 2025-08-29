import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// -----------------------------
// Types
// -----------------------------
interface SubscriptionData {
  coffeeMethod: string;
  roastLevel: string;
  grind: string;
  size: string;
  schedule: string;
  fullName: string;
  email: string;
  phone?: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// -----------------------------
// Helpers
// -----------------------------
const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneRegex = /^[+]?\d{6,15}$/;

const cardBase =
  "rounded-2xl border border-coffee-brown/20 bg-[#F7F3ED] px-4 py-3 md:px-6 md:py-4 transition transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-coffee-gold/50";

function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
  imageSrc,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (val: string) => void;
  label: string;
  imageSrc?: string;
}) {
  return (
    <label className={`${cardBase} cursor-pointer flex items-center gap-3`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5 accent-coffee-gold"
      />
      {imageSrc && <img src={imageSrc} alt="" className="h-6 w-6 object-contain" />}
      <span className="text-enzi-db font-medium">{label}</span>
    </label>
  );
}

function Progress({ stepIndex, total }: { stepIndex: number; total: number }) {
  const percent = ((stepIndex + 1) / total) * 100;
  return (
    <div className="w-full mb-6">
      <div className="h-2 w-full bg-enzi-db/10 rounded-full overflow-hidden">
        <motion.div
          className="h-2 bg-coffee-gold"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-3 text-sm text-enzi-db/70 tracking-wide">
        Step {stepIndex + 1} of {total}
      </div>
    </div>
  );
}

function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const steps = ["method", "roast", "grind", "size", "schedule", "contact"] as const;
  type StepKey = typeof steps[number];

  const [step, setStep] = useState<StepKey>("method");
  const [dir, setDir] = useState<1 | -1>(1);
  const [data, setData] = useState<SubscriptionData>({
    coffeeMethod: "",
    roastLevel: "",
    grind: "",
    size: "",
    schedule: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const total = steps.length;
  const index = steps.indexOf(step);

  const isValid = useMemo(() => {
    switch (step) {
      case "method": return !!data.coffeeMethod;
      case "roast": return !!data.roastLevel;
      case "grind": return !!data.grind;
      case "size": return !!data.size;
      case "schedule": return !!data.schedule;
      case "contact": {
        const nameOk = data.fullName.trim().length > 0;
        const emailOk = emailRegex.test(data.email);
        const phoneOk = !data.phone || phoneRegex.test(data.phone);
        return nameOk && emailOk && phoneOk;
      }
    }
  }, [step, data]);

  const next = () => {
    if (index < total - 1 && isValid) {
      setDir(1);
      setStep(steps[index + 1]);
    } else if (index === total - 1 && isValid) {
      console.log("Subscription submitted:", data);
      alert("Subscribed! Check console for JSON.");
      onClose();
    }
  };

  const back = () => {
    if (index > 0) {
      setDir(-1);
      setStep(steps[index - 1]);
    }
  };

  const variants = {
    enter: (direction: 1 | -1) => ({ x: direction * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({ x: direction * -60, opacity: 0 }),
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("method");
      setData({
        coffeeMethod: "",
        roastLevel: "",
        grind: "",
        size: "",
        schedule: "",
        fullName: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-coffee-brown/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-coffee-brown/15"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-coffee-cream/80 hover:bg-coffee-cream text-coffee-brown transition-colors"
          >
            ✕
          </button>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <div className="text-enzi-db/80 text-sm font-semibold tracking-[0.15em] uppercase mb-2">SUBSCRIBE</div>
              <h2 className="text-2xl md:text-3xl font-serif text-enzi-db">Build your coffee subscription</h2>
            </div>

            <div className="coffee-card bg-[#F7F3ED] rounded-3xl border border-coffee-brown/15 shadow-sm p-5 sm:p-7 md:p-8">
              <Progress stepIndex={index} total={total} />

              <div className="relative min-h-[280px]">
                <AnimatePresence mode="wait" custom={dir}>
                  {step === "method" && (
                    <motion.div key="method" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">How do you make your coffee?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Coffee Maker","Espresso","Aeropress","French Press","Cold Brew"].map((opt) => (
                          <RadioCard key={opt} name="coffeeMethod" value={opt} checked={data.coffeeMethod === opt} onChange={(val) => setData((d) => ({ ...d, coffeeMethod: val }))} label={opt} imageSrc="/icons/placeholder.png" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "roast" && (
                    <motion.div key="roast" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">What's your go-to roast level?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Light","Dark","Medium","Choose for me"].map((opt) => (
                          <RadioCard key={opt} name="roastLevel" value={opt} checked={data.roastLevel === opt} onChange={(val) => setData((d) => ({ ...d, roastLevel: val }))} label={opt} imageSrc="/icons/placeholder.png" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "grind" && (
                    <motion.div key="grind" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">What’s your grind preference?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Whole Bean","Ground"].map((opt) => (
                          <RadioCard key={opt} name="grind" value={opt} checked={data.grind === opt} onChange={(val) => setData((d) => ({ ...d, grind: val }))} label={opt} imageSrc="/icons/placeholder.png" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "size" && (
                    <motion.div key="size" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">Select Size</h3>
                      <div className="grid grid-cols-2 gap-3 max-w-xs">
                        {["250g","500g"].map((opt) => (
                          <RadioCard key={opt} name="size" value={opt} checked={data.size === opt} onChange={(val) => setData((d) => ({ ...d, size: val }))} label={opt} imageSrc="/icons/placeholder.png" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "schedule" && (
                    <motion.div key="schedule" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">Set your delivery schedule</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                        {["Every 2 weeks","Every 4 weeks"].map((opt) => (
                          <RadioCard key={opt} name="schedule" value={opt} checked={data.schedule === opt} onChange={(val) => setData((d) => ({ ...d, schedule: val }))} label={opt} imageSrc="/icons/placeholder.png" />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "contact" && (
                    <motion.div key="contact" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0">
                      <h3 className="text-xl md:text-2xl font-bold text-coffee-brown mb-4">Contact Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="col-span-1 sm:col-span-2">
                          <div className={`${cardBase} bg-white`}>
                            <label className="block text-enzi-db/70 text-sm mb-1">Full Name</label>
                            <input type="text" value={data.fullName} onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))} className="w-full bg-transparent outline-none text-enzi-db" placeholder="e.g., Asha N." />
                          </div>
                        </div>

                        <div>
                          <div className={`${cardBase} bg-white`}>
                            <label className="block text-enzi-db/70 text-sm mb-1">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} className="w-full bg-transparent outline-none text-enzi-db" placeholder="you@example.com" />
                          </div>
                        </div>

                        <div>
                          <div className={`${cardBase} bg-white`}>
                            <label className="block text-enzi-db/70 text-sm mb-1">Phone (optional)</label>
                            <input type="tel" value={data.phone} onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))} className="w-full bg-transparent outline-none text-enzi-db" placeholder="+255 712 345 678" />
                          </div>
                        </div>

                        <div className="sm:col-span-2 text-sm text-coffee-brown/80">
                          {!data.fullName && <div>• Name is required</div>}
                          {!!data.email && !emailRegex.test(data.email) && <div>• Enter a valid email</div>}
                          {!!data.phone && !phoneRegex.test(data.phone) && <div>• Enter a valid phone number</div>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button onClick={back} disabled={index === 0} className="inline-flex items-center gap-2 rounded-xl border border-enzi-db/30 px-5 py-3 text-enzi-db disabled:opacity-40 bg-white">
                  ← Back
                </button>

                {index < total - 1 ? (
                  <button onClick={next} disabled={!isValid} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50">
                    Next →
                  </button>
                ) : (
                  <button onClick={next} disabled={!isValid} className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-coffee-gold hover:bg-coffee-brown disabled:opacity-50">
                    Submit
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-enzi-db/60 text-center">By continuing you agree to receive emails about your subscription. You can unsubscribe anytime.</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface SubscriptionProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}

export default function Subscription({ isModalOpen, onOpenModal, onCloseModal }: SubscriptionProps) {
  const [showFAB, setShowFAB] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Show FAB when user has scrolled 40% of the page
      const showPoint = documentHeight * 0.4;

      if (scrollY > showPoint) {
        setShowFAB(true);
      } else {
        setShowFAB(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showFAB && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenModal}
            className="fixed bottom-6 right-6 z-40 px-6 py-3 bg-coffee-gold hover:bg-coffee-brown text-white rounded-full shadow-lg font-medium text-sm transition-colors"
            title="Subscribe to coffee"
          >
            Subscribe Now
          </motion.button>
        )}
      </AnimatePresence>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
      />
    </>
  );
}
