import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { RoastedCoffeeBeanProduct } from "../types";
import { waLink } from "../lib/whatsapp";
import CoffeeBag, { type BagPalette } from "./CoffeeBag";
import MirumbaniStory from "./MirumbaniStory";

const easeSoft = [0.25, 1, 0.5, 1] as const;

type BeanStyle = {
  accent: string;
  mood: string;
  eyebrow: string;
  /** Which side the bag sits on in the expanded panel. */
  imageSide: "left" | "right";
  /** Brand pattern helper class used behind the panel + tile. */
  pattern: string;
  /** Panel base colour, under the pattern. */
  panelBg: string;
  /** Gusset colours + printed region for the drawn bag. */
  bag: BagPalette;
};

const BEAN_STYLES: Record<string, BeanStyle> = {
  Nguvu: {
    accent: "#2B7A6E",
    mood: "nguvu ya asubuhi — morning strength.",
    eyebrow: "Single-origin · 100% Arabica",
    imageSide: "left",
    pattern: "",
    panelBg: "#F5EFE7",
    bag: {
      gussetFrom: "#3D9184",
      gussetVia: "#2B7A6E",
      gussetTo: "#1E5A51",
      region: "KILIMANJARO",
      accent: "#2B7A6E",
    },
  },
  Tunu: {
    accent: "#B37542",
    mood: "zawadi ya ladha — a gift of flavor.",
    eyebrow: "Single-origin · 100% Arabica",
    imageSide: "right",
    pattern: "pattern-cream",
    panelBg: "#F3EDE5",
    bag: {
      gussetFrom: "#C68F5D",
      gussetVia: "#B37542",
      gussetTo: "#8F5C30",
      region: "KARATU",
      accent: "#B37542",
    },
  },
  Amka: {
    accent: "#7A4E1E",
    mood: "amka bila wasiwasi — rise easy.",
    eyebrow: "Single-origin · 100% Arabica",
    imageSide: "right",
    pattern: "",
    panelBg: "#F6F1EA",
    bag: {
      gussetFrom: "#95693A",
      gussetVia: "#7A4E1E",
      gussetTo: "#5E3B16",
      region: "SOUTHERN HIGHLANDS",
      accent: "#7A4E1E",
    },
  },
  Mirumbani: {
    accent: "#2E4B34",
    mood: "kahawa ya kurudi nyumbani — the coffee of returning home.",
    eyebrow: "Seasonal · Single-origin Kigoma",
    imageSide: "left",
    pattern: "",
    panelBg: "#F4EDDC",
    bag: {
      gussetFrom: "#3E6446",
      gussetVia: "#2E4B34",
      gussetTo: "#1F3324",
      region: "KIGOMA",
      accent: "#2E4B34",
      labelStyle: "kigoma",
    },
  },
};

const FALLBACK_STYLE: BeanStyle = {
  accent: "#B37542",
  mood: "",
  eyebrow: "Single-origin · 100% Arabica",
  imageSide: "right",
  pattern: "pattern-cream",
  panelBg: "#F3EDE5",
  bag: {
    gussetFrom: "#9B9288",
    gussetVia: "#8F7864",
    gussetTo: "#7D6754",
    region: "TANZANIA",
    accent: "#B37542",
  },
};

const styleFor = (name: string): BeanStyle => BEAN_STYLES[name] ?? FALLBACK_STYLE;

/** Panels are addressable as #<name> so a shared link opens the right bean. */
export const beanSlug = (name: string) => name.toLowerCase();

/* ---------------------------------------------------------------- tile --- */

const BagTile: React.FC<{
  product: RoastedCoffeeBeanProduct;
  index: number;
  onOpen: () => void;
  reduceMotion: boolean | null;
}> = ({ product, index, onOpen, reduceMotion }) => {
  const { accent, pattern, panelBg, bag } = styleFor(product.name);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`View ${product.name}`}
      className={`group relative flex items-center justify-center overflow-hidden border-2 border-bronze-deep/20 min-h-[22rem] py-10 px-6 ${pattern} cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-bronze-deep/30`}
      style={{ backgroundColor: panelBg }}
      initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: easeSoft, delay: index * 0.1 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
      <motion.div
        layoutId={`bag-${product.id}`}
        className="w-[62%] max-w-[15rem] transition-transform duration-500 motion-safe:group-hover:scale-[1.05]"
      >
        <CoffeeBag product={product} palette={bag} />
      </motion.div>

      {product.seasonal && (
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-white"
          style={{ backgroundColor: accent }}
        >
          Msimu · Seasonal
        </span>
      )}

      {/* Name reveals on hover / keyboard focus */}
      <span
        className="absolute bottom-5 left-0 right-0 text-center font-sans text-[11px] uppercase tracking-[0.25em] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ color: accent }}
        aria-hidden
      >
        {product.name}
      </span>
    </motion.button>
  );
};

/* ------------------------------------------------------------ scroll cue --- */

/**
 * Sits at the foot of the buy panel when a story follows it. Without this the
 * story reads as the end of the page — the section below is only a sliver of
 * green until you scroll.
 */
const StoryScrollCue: React.FC<{
  accent: string;
  reduceMotion: boolean | null;
  onJump: () => void;
}> = ({ accent, reduceMotion, onJump }) => (
  <div className="flex justify-center pb-10">
    <button
      type="button"
      onClick={onJump}
      className="btn-press inline-flex min-h-[44px] flex-col items-center gap-1 rounded-full px-6 py-2 font-sans transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-4 focus-visible:ring-bronze-deep/30"
      style={{ color: accent }}
    >
      <span className="text-[11px] uppercase tracking-[0.28em]">
        Soma hadithi · Scroll for the story
      </span>
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden
        animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
      >
        <path
          d="M4 7l5 5 5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  </div>
);

/* --------------------------------------------------------------- panel --- */

const BeanPanelBody: React.FC<{
  product: RoastedCoffeeBeanProduct;
  onClose: () => void;
  reduceMotion: boolean | null;
}> = ({ product, onClose, reduceMotion }) => {
  const { accent, mood, eyebrow, imageSide } = styleFor(product.name);
  const imageFirst = imageSide === "left";

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close and return to all beans"
        className="btn-press absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border-2 bg-white/70 backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-bronze-deep/30"
        style={{ borderColor: accent, color: accent }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M2 2l14 14M16 2L2 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="grid items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-20">
        {/* Copy */}
        <motion.div
          className={imageFirst ? "lg:order-2" : "lg:order-1"}
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeSoft, delay: 0.12 }}
        >
          <p
            className="font-sans text-[11px] font-medium uppercase tracking-[0.3em] sm:text-xs"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>

          <h3 className="mt-4 font-display text-5xl font-normal leading-none text-ink sm:text-6xl lg:text-7xl">
            {product.name}
          </h3>

          {mood && (
            <p
              className="mt-4 font-display text-xl font-light italic sm:text-2xl"
              style={{ color: accent }}
            >
              {mood}
            </p>
          )}

          {product.description && (
            <p className="mt-6 max-w-xl font-sans text-base leading-8 text-ink/75 sm:text-lg">
              {product.description}
            </p>
          )}

          {Array.isArray(product.flavorNotes) && product.flavorNotes.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {product.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border bg-white px-4 py-2 font-sans text-sm capitalize text-ink"
                  style={{ borderColor: `${accent}55` }}
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={waLink(
                `Habari HZE! Nataka kuagiza ${product.name} (${product.weight}) — TZS ${product.price}. Jina langu ni ___.`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-press inline-flex min-h-[48px] items-center justify-center rounded-full px-8 py-3 font-sans text-base font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Shop {product.name}
            </a>
            <span className="font-sans text-sm text-ink/55">
              TZS {product.price} · {product.weight} · whole bean
            </span>
          </div>

          {product.seasonal && product.releaseSize && (
            <p
              className="mt-5 font-sans text-sm"
              style={{ color: accent }}
            >
              Msimu huu tumevuna {product.releaseSize} tu — one harvest, then we
              wait for the hills.
            </p>
          )}
        </motion.div>

        {/* Bag */}
        <div
          className={`flex items-center justify-center ${
            imageFirst ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <motion.div
            layoutId={`bag-${product.id}`}
            className="w-full max-w-[20rem] sm:max-w-[22rem]"
          >
            <CoffeeBag product={product} palette={styleFor(product.name).bag} />
          </motion.div>
        </div>
      </div>

      {product.name === "Mirumbani" && (
        <>
          <StoryScrollCue
            accent={accent}
            reduceMotion={reduceMotion}
            onJump={() =>
              document
                .getElementById("mirumbani-story-title")
                ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
            }
          />
          <MirumbaniStory reduceMotion={reduceMotion} />
        </>
      )}
    </>
  );
};

/* -------------------------------------------------------------- section --- */

const ProductHighlights: React.FC<{
  products: RoastedCoffeeBeanProduct[];
  onOrderClick?: (productId: string) => void;
}> = ({ products = [] }) => {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const openProduct = products.find((p) => p.id === openId) ?? null;

  // A shared link (#mirumbani) lands on the open panel rather than the grid.
  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      if (!slug) return;
      const match = products.find((p) => beanSlug(p.name) === slug);
      if (match) setOpenId(match.id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [products]);

  // Keep the address bar in step so the share buttons copy a working link.
  useEffect(() => {
    const slug = openProduct ? `#${beanSlug(openProduct.name)}` : "";
    const target = window.location.pathname + window.location.search + slug;
    if (window.location.hash !== slug) {
      window.history.replaceState(null, "", target);
    }
  }, [openProduct]);

  // Escape closes the expanded panel.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <section id="products" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <h2
            className="text-4xl uppercase leading-none text-ink sm:text-5xl"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Kahawa Zetu
          </h2>
          <p className="mt-2 font-display text-lg font-light italic text-bronze-deep sm:text-xl">
            {openProduct ? "tap the ✕ to see all beans" : "tap a bag to meet the bean"}
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false}>
          {openProduct ? (
            <motion.div
              key="panel"
              className={`relative overflow-hidden border-2 border-bronze-deep/20 ${
                styleFor(openProduct.name).pattern
              }`}
              style={{ backgroundColor: styleFor(openProduct.name).panelBg }}
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: easeSoft }}
            >
              <BeanPanelBody
                product={openProduct}
                onClose={() => setOpenId(null)}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3, ease: easeSoft }}
            >
              {products.map((product, index) => (
                <BagTile
                  key={product.id}
                  product={product}
                  index={index}
                  reduceMotion={reduceMotion}
                  onOpen={() => setOpenId(product.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductHighlights;
