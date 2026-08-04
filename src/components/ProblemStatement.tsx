import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SubscriptionWizard from "./Subscription";
import MobileSubscriptionFlow from "./MobileSubscriptionFlow";
import { useIsMobile } from "../hooks/useIsMobile";

const easeSoft = [0.25, 1, 0.5, 1] as const;

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const header = document.querySelector("header");
    const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - headerHeight - 20, behavior: "smooth" });
  }
};

export default function ProblemStatement() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [showSubscription, setShowSubscription] = useState(false);

  const steps = [
    {
      title: "Discover",
      description: "Find the flavors that fit you.",
      action: () => scrollToSection("products"),
    },
    {
      title: "Choose",
      description: "A roast or a subscription — your ritual.",
      action: () => setShowSubscription(true),
    },
    {
      title: "Enjoy",
      description: "Fresh beans, delivered or brewed in our café.",
      action: () => scrollToSection("products"),
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-coffee-cream/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-10"
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <h2 className="font-display font-light text-coffee-dark text-3xl sm:text-4xl leading-tight">
            Coffee, <em className="italic text-enzi-db">honestly.</em>
          </h2>
          <p className="mt-3 font-sans text-coffee-dark/70 text-lg">
            Sourced with integrity. Roasted with precision. Served with warmth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-coffee-brown/15 border border-coffee-brown/15">
          {steps.map((step, i) => (
            <motion.button
              key={step.title}
              onClick={step.action}
              className="group text-left bg-white hover:bg-coffee-cream/40 transition-colors p-6 sm:p-8 min-h-[120px]"
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeSoft, delay: i * 0.08 }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display font-light text-enzi-db text-lg">
                  0{i + 1}
                </span>
                <span
                  aria-hidden
                  className="font-sans text-enzi-db opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </span>
              </div>
              <h3 className="mt-2 font-display font-light text-coffee-dark text-2xl">
                {step.title}
              </h3>
              <p className="mt-1 font-sans text-coffee-dark/60 text-base">
                {step.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {isMobile ? (
        <MobileSubscriptionFlow
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
        />
      ) : (
        <SubscriptionWizard
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
        />
      )}
    </section>
  );
}
