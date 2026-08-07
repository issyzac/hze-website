import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface ValueItem {
  title: string;
  swahili?: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Shown until the primary image file is added to the project */
  fallback?: string;
}

const withFallback = (fallback?: string) =>
  fallback
    ? (e: React.SyntheticEvent<HTMLImageElement>) => {
        const t = e.target as HTMLImageElement;
        if (!t.src.endsWith(fallback)) t.src = fallback;
      }
    : undefined;

interface OurValuesProps {
  eyebrow?: string;
  heading?: string;
  values?: ValueItem[];
}

const easeSoft = [0.25, 1, 0.5, 1] as const;

const defaultValues: ValueItem[] = [
  {
    title: "People over Profit",
    swahili: "Utu Kwanza",
    description:
      "We exist to create dignified work, especially for those excluded from opportunity. Every decision — sourcing, roasting, customer service — is made with people in mind.",
    image: "/assets/images/community/when-the-coffee-break-turns-into-a-chill-session.jpg",
    imageAlt: "Two guests relaxing together over iced coffee in the Harakati za Enzi café",
  },
  {
    title: "Movement, Not Just a Brand",
    swahili: "Harakati",
    description:
      "Excellence is an ethic, not a performance. We see coffee as a community platform, whether at Mbezi, Victoria, or a pop-up.",
    image: "/assets/images/community/cupping-tasting.jpg",
    imageAlt: "Guests tasting coffee from traditional cupping bowls at a Harakati za Enzi session",
    fallback: "/assets/images/community/just-drink-it.jpg",
  },
  {
    title: "Community Is the Culture",
    swahili: "Ujamaa ndio utamaduni",
    description:
      "Our cafés are neighbourhood living rooms. We believe a well-poured cup is an act of care, and conversation around a table can spark change.",
    image: "/assets/images/community/women-circle-conversation.jpg",
    imageAlt: "A women's circle in deep conversation over coffee at the Harakati za Enzi café",
    fallback: "/assets/images/community/not-just-a-cafe-its-a-living-room-with-better-coffee.jpg",
  },
];

export default function OurValues({
  eyebrow = "OUR VALUES",
  heading = "A movement, not just a brand.",
  values = defaultValues,
}: OurValuesProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="our-values" className="relative py-16 sm:py-20 lg:py-24 bg-coffee-cream/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: accordion */}
          <div className="lg:col-span-6">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: easeSoft }}
            >
              <span className="text-enzi-db text-sm font-sans tracking-[0.2em] uppercase">
                {eyebrow}
              </span>
              <h2 className="mt-3 mb-8 text-coffee-dark font-display font-light leading-tight text-4xl sm:text-5xl">
                {heading}
              </h2>
            </motion.div>

            <div className="border-y border-coffee-brown/15 divide-y divide-coffee-brown/15">
              {values.map((item, index) => {
                const isOpen = index === active;
                return (
                  <motion.div
                    key={item.title}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: easeSoft, delay: index * 0.08 }}
                  >
                    <button
                      onClick={() => setActive(index)}
                      aria-expanded={isOpen}
                      className="w-full text-left py-5 flex items-center justify-between gap-4 min-h-[56px] group"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`font-display font-light text-lg transition-colors ${
                            isOpen ? "text-enzi-db" : "text-coffee-dark/40"
                          }`}
                        >
                          0{index + 1}
                        </span>
                        <span
                          className={`font-sans font-medium text-lg sm:text-xl transition-colors ${
                            isOpen ? "text-coffee-dark" : "text-coffee-dark/60 group-hover:text-coffee-dark"
                          }`}
                        >
                          {item.title}
                        </span>
                      </span>
                      <motion.span
                        aria-hidden
                        className="text-enzi-db text-2xl font-light shrink-0"
                        animate={reduceMotion ? undefined : { rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: easeSoft }}
                      >
                        +
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: easeSoft }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pr-10">
                            {item.swahili && (
                              <p className="font-display font-light italic text-enzi-db text-lg mb-2">
                                {item.swahili}
                              </p>
                            )}
                            <p className="font-sans text-coffee-dark/70 text-base sm:text-lg leading-7">
                              {item.description}
                            </p>

                            {/* Mobile: value image inline */}
                            <div className="mt-5 lg:hidden overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.imageAlt}
                                loading="lazy"
                                className="w-full aspect-[4/3] object-cover"
                                onError={withFallback(item.fallback)}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: synced image (desktop) */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div
              aria-hidden
              className="absolute -bottom-8 -left-8 w-2/3 h-2/3 pattern-beige"
            />
            <div className="relative aspect-[4/5] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={values[active].image}
                  src={values[active].image}
                  alt={values[active].imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 1.04 }}
                  animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeSoft }}
                  onError={withFallback(values[active].fallback)}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
