 

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SubscriptionWizard from './Subscription';
import MobileSubscriptionFlow from './MobileSubscriptionFlow';
import { useIsMobile } from '../hooks/useIsMobile';

interface ProblemStatementProps {
  problemStatement?: string;
  actionPlanTitle?: string;
  steps?: Array<{
    title: string;
    description: string;
    action?: () => void;
  }>;
}

// --- Aesthetic primitives ---------------------------------------------------- 
const easeSoft = [0.25, 1, 0.5, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.22,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(2px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeSoft },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: easeSoft },
  },
};

const shorten = (text: string, words = 5) => {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length <= words) return text;
  return parts.slice(0, words).join(" ") + "…";
};

const Bean = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden className={props.className}>
    <path fill="currentColor" d="M12 3c-4.4 0-8 3.6-8 8 0 4.1 3 7.5 6.9 8 .4-1.5 1.5-3.2 3.3-4.3C17 13.1 19 10.7 19 8.1 19 5 15.9 3 12 3zm-1.1 14.7C7.8 17.1 6 14.8 6 11.9c0-3.3 2.7-6 6-6 2.4 0 4.3 1.1 4.3 2.8 0 1.9-1.6 3.6-3.9 5-1.7 1-2.9 2.5-3.5 3.9z"/>
  </svg>
);

export default function ProblemStatement({
  problemStatement = "Coffee, honestly.",
  actionPlanTitle = "Sourced with integrity. Roasted with precision. Served with warmth.",
  steps,
}: ProblemStatementProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [showSubscription, setShowSubscription] = useState(false);
  const [showDiscoverDialog, setShowDiscoverDialog] = useState(false);

  const defaultSteps = [
    {
      title: "Discover",
      description: "Explore the flavor wheel and find your notes.",
      action: () => setShowDiscoverDialog(true),
    },
    {
      title: "Choose",
      description: "Select a roast or subscription that fits your ritual.",
      action: () => setShowSubscription(true),
    },
    {
      title: "Enjoy",
      description: "Freshly roasted beans, delivered or brewed in our cafés.",
      action: () => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementPosition = productsSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - headerHeight - 20, behavior: 'smooth' });
        }
      },
    },
  ];

  const stepsToUse = steps || defaultSteps;

  const headline = shorten(problemStatement, 4); 

  return (
    <motion.section
      className="relative py-12 sm:py-16 bg-[#F7F3ED]"
      initial={reduceMotion ? undefined : { opacity: 0 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: easeSoft }}
    >
       <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 40%, rgba(0,0,0,0) 60%), url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'140\\' height=\\'140\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.04\\'/></svg>')",
          backgroundBlendMode: "multiply",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-xl sm:max-w-2xl text-center"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.div className="flex items-center justify-center gap-2 text-coffee-brown/70" variants={fadeUp}>
            <Bean className="w-4 h-4" />
            <span className="tracking-[0.2em] text-xs uppercase">Harakati za Enzi</span>
            <Bean className="w-4 h-4" />
          </motion.div>

          <motion.h2
            className="mt-3 text-3xl sm:text-4xl font-['GTAlpinaThin'] text-coffee-brown leading-tight"
            variants={fadeUp}
          >
            {headline}
          </motion.h2>

          <motion.p
            className="mt-3 sm:mt-4 text-base sm:text-lg font-['RoobertRegular'] text-coffee-brown/80 leading-relaxed"
            variants={fadeUp}
          >
            {actionPlanTitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {stepsToUse.map((step, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-coffee-brown/20 bg-white/70 backdrop-blur-[2px] shadow-[0_6px_20px_rgba(70,42,32,0.08)] px-5 py-5 sm:px-6 sm:py-6"
              variants={cardReveal}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.35, ease: easeSoft as any }}
            >
              <div
                aria-hidden
                className="absolute -top-6 -right-6 w-28 h-28 rounded-full border-2 border-coffee-brown/20 rotate-12 opacity-30"
              />

              <div className="flex items-center gap-3 text-coffee-brown">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coffee-gold text-white font-['RoobertBold'] shadow-md">
                  {i + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-['RoobertMedium']">{step.title}</h3>
              </div>

              <p className="mt-2 text-sm sm:text-base text-coffee-brown/70 leading-relaxed">
                {step.description}
              </p>

              <motion.button
                onClick={step.action}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-coffee-brown px-4 py-3 text-white text-sm sm:text-base font-['RoobertMedium'] shadow-sm active:shadow-none"
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                transition={{ duration: 0.2 }}
              >
                {step.title}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
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

      {showDiscoverDialog && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDiscoverDialog(false)}
        >
          <motion.div
            className="relative max-w-md w-full mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-coffee-brown/20 shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: easeSoft }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative background element */}
            <div
              aria-hidden
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 border-coffee-brown/10 rotate-12"
            />

            <div className="relative p-6 sm:p-8">
              {/* Header with bean icons */}
              <div className="flex items-center justify-center gap-2 text-coffee-brown/70 mb-4">
                <Bean className="w-4 h-4" />
                <span className="tracking-[0.2em] text-xs uppercase font-['RoobertRegular']">Discover</span>
                <Bean className="w-4 h-4" />
              </div>

              {/* Main title */}
              <h2 className="text-2xl sm:text-3xl font-['GTAlpinaThin'] text-coffee-brown text-center leading-tight mb-4">
                Embark on a Coffee Journey
              </h2>

              {/* Message */}
              <p className="text-base sm:text-lg font-['RoobertRegular'] text-coffee-brown/80 text-center leading-relaxed mb-6">
                Get ready to explore the rich tapestry of coffee flavors, from bright and fruity notes to deep, chocolatey depths. Your perfect cup awaits discovery.
              </p>

              {/* Coming Soon Indicator */}
              <div className="mb-4">
                <div className="w-full h-px bg-coffee-brown/20 mb-3"></div>
                <p className="text-sm text-coffee-brown/60 text-center font-['RoobertRegular'] tracking-wide">
                  Coming Soon
                </p>
              </div>

              {/* CTA Button - Read Only */}
              <div className="relative">
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center rounded-xl bg-coffee-brown/40 px-6 py-4 text-white/70 text-base font-['RoobertMedium'] cursor-not-allowed"
                >
                  Start Exploring
                  <span className="ml-2 text-lg opacity-70">☕</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
