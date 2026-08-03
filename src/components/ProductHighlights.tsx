import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { RoastedCoffeeBeanProduct } from "../types";
import SafariYaLadha from "./SafariYaLadha";
import { waLink } from "../lib/whatsapp";

const easeSoft = [0.25, 1, 0.5, 1] as const;

// Per-bean accent colors from the movement palette
const BEAN_ACCENTS: Record<string, string> = {
  Nguvu: "#B37542",
  Tunu: "#2B7A6E",
  Amka: "#D19D71",
};

const BEAN_MOODS: Record<string, string> = {
  Nguvu: "Nguvu ya asubuhi — morning strength",
  Tunu: "Zawadi ya ladha — a gift of flavor",
  Amka: "Amka bila wasiwasi — rise easy",
};

const ProductHighlights: React.FC<{
  products: RoastedCoffeeBeanProduct[];
  onOrderClick?: (productId: string) => void;
}> = ({ products = [] }) => {
  const reduceMotion = useReducedMotion();
  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Safari ya Ladha — the discovery game */}
        <SafariYaLadha />

        {/* Browse header */}
        <motion.div
          className="mb-8 text-center"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <h2
            className="uppercase text-ink text-3xl sm:text-4xl leading-none"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            …au chagua mwenyewe
          </h2>
          <p className="mt-2 font-display font-light italic text-bronze-deep text-lg sm:text-xl">
            or browse the beans — roasted in Dar es Salaam
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const name = (product as any).name as string;
            const accent = BEAN_ACCENTS[name] ?? "#B37542";
            const mood = BEAN_MOODS[name];
            return (
              <motion.article
                key={(product as any).id ?? name}
                className="group bg-cream-aged border-2 border-bronze-deep/25 flex flex-col overflow-hidden"
                initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: easeSoft, delay: index * 0.1 }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
              >
                {/* Header strip */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ backgroundColor: accent }}
                >
                  <h3
                    className="uppercase text-white text-3xl leading-none"
                    style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                  >
                    {name}
                  </h3>
                  <span className="font-sans text-[11px] font-medium uppercase tracking-widest text-white/90 border border-white/50 rounded-full px-2.5 py-1">
                    {(product as any).caffeineContent === "decaf"
                      ? "Decaf"
                      : `${(product as any).roastLevel} roast`}
                  </span>
                </div>

                {/* Image */}
                <div className="flex items-center justify-center py-8 px-5 bg-white">
                  <img
                    src={(product as any).image}
                    alt={`${name} — 250g bag of Tanzanian specialty coffee`}
                    className="max-h-52 object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.06] motion-safe:group-hover:-rotate-2"
                    loading="lazy"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.opacity = "0.4";
                      t.alt = "Image unavailable";
                    }}
                  />
                </div>

                {/* Taste */}
                <div className="px-5 pb-5 bg-white flex-1">
                  {mood && (
                    <p className="font-display font-light italic text-bronze-deep text-lg mb-1">
                      {mood}
                    </p>
                  )}
                  {(product as any).description && (
                    <p className="font-sans text-ink/70 text-sm leading-6 mb-3">
                      {(product as any).description}
                    </p>
                  )}
                  {Array.isArray((product as any).flavorNotes) && (
                    <div className="flex flex-wrap gap-2">
                      {(product as any).flavorNotes.map((note: string) => (
                        <span
                          key={note}
                          className="px-3 py-1 rounded-full text-xs font-sans font-medium capitalize text-ink border-2"
                          style={{ borderColor: accent }}
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ticket stub: price + order */}
                <div className="ticket-edge bg-cream-aged px-5 py-4 flex items-center justify-between gap-3">
                  <div>
                    <span
                      className="block text-ink text-2xl leading-none"
                      style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                    >
                      TZS {(product as any).price}
                    </span>
                    <span className="font-sans text-xs text-ink/50">
                      {(product as any).weight ?? "250g"} · whole bean
                    </span>
                  </div>
                  <a
                    href={waLink(
                      `Habari HZE! Nataka kuagiza ${name} (${(product as any).weight ?? "250g"}) — TZS ${(product as any).price}. Jina langu ni ___.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-press inline-flex items-center justify-center px-5 py-3 text-white font-sans font-medium text-sm rounded-full transition-opacity hover:opacity-90 min-h-[48px] whitespace-nowrap"
                    style={{ backgroundColor: accent }}
                    aria-label={`Order ${name} on WhatsApp`}
                  >
                    Agiza {name} <span aria-hidden className="ml-1.5">→</span>
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
