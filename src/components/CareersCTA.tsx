import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navigate } from "../lib/router";
import { BARISTA_OPENING } from "../data/careers";

const easeSoft = [0.25, 1, 0.5, 1] as const;

const TRAITS = [
  { key: "coffee", label: "I care about coffee", swahili: "Napenda kahawa", emoji: "☕" },
  { key: "people", label: "I care about people", swahili: "Napenda watu", emoji: "🤝" },
  { key: "work", label: "I do excellent work, consistently", swahili: "Kazi safi, kila siku", emoji: "✨" },
];

export default function CareersCTA() {
  const reduceMotion = useReducedMotion();
  const [picked, setPicked] = useState<string[]>([]);
  const allPicked = picked.length === TRAITS.length;

  const toggle = (key: string) =>
    setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <section id="careers" className="relative bg-coffee-dark text-coffee-cream overflow-hidden">
      <div aria-hidden className="absolute inset-0 pattern-tan opacity-[0.07]" />

      {/* Drifting beans */}
      {!reduceMotion && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {[12, 34, 58, 79, 91].map((left, i) => (
            <motion.span
              key={left}
              className="absolute text-2xl opacity-[0.08]"
              style={{ left: `${left}%`, top: "-10%" }}
              animate={{ y: ["0%", "1200%"], rotate: [0, 220] }}
              transition={{
                duration: 26 + i * 6,
                repeat: Infinity,
                ease: "linear",
                delay: i * 3,
              }}
            >
              ☕
            </motion.span>
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — pitch */}
          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-hze-teal opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hze-teal" />
              </span>
              <span className="font-sans text-xs sm:text-sm tracking-[0.24em] uppercase text-coffee-gold">
                Tunaajiri — we are hiring
              </span>
            </div>

            <h2
              className="uppercase text-4xl sm:text-6xl lg:text-7xl leading-[0.9] mb-5"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              Join the HZE
              <br />
              Barista Team
            </h2>

            <p className="font-display font-light text-xl sm:text-2xl text-coffee-cream/85 leading-relaxed max-w-xl">
              We are looking for people who care about coffee, people, and doing excellent work
              consistently.
            </p>

            {/* Three-tap self-check */}
            <p className="font-sans text-sm text-coffee-cream/55 mt-8 mb-3">
              Tap the ones that sound like you:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {TRAITS.map((trait) => {
                const on = picked.includes(trait.key);
                return (
                  <motion.button
                    key={trait.key}
                    type="button"
                    onClick={() => toggle(trait.key)}
                    aria-pressed={on}
                    whileTap={{ scale: 0.96 }}
                    className={`inline-flex items-center gap-2.5 px-4 py-3 border-2 font-sans text-sm sm:text-base transition-colors min-h-[52px] ${
                      on
                        ? "border-hze-teal bg-hze-teal/20 text-coffee-cream"
                        : "border-coffee-cream/25 text-coffee-cream/70 hover:border-coffee-gold hover:text-coffee-cream"
                    }`}
                  >
                    <span aria-hidden className="text-lg">
                      {on ? "✓" : trait.emoji}
                    </span>
                    <span className="text-left leading-tight">
                      {trait.label}
                      <span className="block text-xs opacity-60">{trait.swahili}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <motion.button
                type="button"
                onClick={() => navigate("careers")}
                animate={
                  allPicked && !reduceMotion
                    ? { scale: [1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.5 }}
                className={`btn-press inline-flex items-center justify-center gap-2 px-8 py-4 font-sans font-medium text-lg rounded-full transition-colors min-h-[56px] ${
                  allPicked
                    ? "bg-hze-teal text-white hover:bg-[#236458]"
                    : "bg-coffee-gold text-coffee-dark hover:bg-enzi-lb"
                }`}
              >
                {allPicked ? "Then we should talk" : "See the openings"}
                <span aria-hidden>→</span>
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.p
                  key={allPicked ? "all" : "some"}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-sans text-sm text-coffee-cream/60"
                >
                  {allPicked
                    ? "Karibu — that is exactly the profile we are hiring for."
                    : "No café experience needed. We train."}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right — vacancy ticket */}
          <motion.div
            className="lg:col-span-5"
            initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeSoft, delay: 0.12 }}
          >
            <button
              type="button"
              onClick={() => navigate("careers")}
              className="group w-full text-left bg-cream-aged text-coffee-dark p-7 sm:p-8 shadow-lg transition-transform hover:-translate-y-1 focus-visible:-translate-y-1"
              style={{ rotate: "-1.2deg" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-[11px] tracking-[0.24em] uppercase text-bronze-deep/70">
                    Nafasi wazi · vacancy
                  </p>
                  <h3
                    className="uppercase text-4xl sm:text-5xl leading-none mt-2"
                    style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                  >
                    Barista
                  </h3>
                </div>
                <span className="stamp text-hze-red text-sm shrink-0">Wazi</span>
              </div>

              <div className="my-6 border-t-2 border-dashed border-bronze-deep/30" />

              <dl className="space-y-3 font-sans text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Openings</dt>
                  <dd className="font-medium">{BARISTA_OPENING.positions} positions</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Cafés</dt>
                  <dd className="font-medium text-right">{BARISTA_OPENING.locations.join(" · ")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Type</dt>
                  <dd className="font-medium text-right">{BARISTA_OPENING.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">To apply</dt>
                  <dd className="font-medium">10–15 minutes</dd>
                </div>
              </dl>

              <div className="my-6 border-t-2 border-dashed border-bronze-deep/30" />

              <span className="inline-flex items-center gap-2 font-sans font-medium text-hze-teal">
                Open the job page
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
