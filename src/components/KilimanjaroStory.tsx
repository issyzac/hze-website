import React from "react";
import { motion } from "framer-motion";
import {
  KILI_CODA,
  KILI_ESTATE,
  KILI_FACTS,
  KILI_INTRO,
  KILI_PALETTE as K,
  KILI_PHOTOS,
  KILI_PROVERB,
} from "../data/kilimanjaro";

const easeSoft = [0.25, 1, 0.5, 1] as const;

/**
 * Kilimanjaro, in one band.
 *
 * A note from the field journal rather than a retelling of it: the estate
 * named, the proverb, four figures, and the admission it closes on. Kept
 * deliberately short — the long form lives in the journal, and this sits under
 * a buy panel, not on a page of its own.
 */
const KilimanjaroStory: React.FC<{ reduceMotion: boolean | null }> = ({
  reduceMotion,
}) => (
  <motion.section
    className="relative overflow-hidden"
    style={{ background: K.ink, color: K.cream }}
    initial={reduceMotion ? undefined : { opacity: 0 }}
    animate={reduceMotion ? undefined : { opacity: 1 }}
    transition={{ duration: 0.5, ease: easeSoft, delay: 0.2 }}
    aria-labelledby="kilimanjaro-story-title"
  >
    <div className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      {/* Masthead */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p
          className="font-sans text-[10px] uppercase tracking-[0.3em]"
          style={{ color: `${K.cream}8A` }}
        >
          HZE Journal · Toleo № 01
        </p>
        <p
          className="font-sans text-[10px] uppercase tracking-[0.26em]"
          style={{ color: K.gold }}
        >
          {KILI_ESTATE.name} · {KILI_ESTATE.where}
        </p>
      </div>

      {/* Proverb + the note */}
      <div
        className="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
        style={{ borderTop: `1px solid ${K.cream}2E`, paddingTop: "1.5rem" }}
      >
        <div>
          <h4
            id="kilimanjaro-story-title"
            className="text-2xl uppercase leading-[0.95] sm:text-3xl"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Haraka haraka
            <br />
            haina kahawa.
          </h4>
          <p
            className="mt-2 font-display text-base font-light italic"
            style={{ color: K.gold }}
          >
            {KILI_PROVERB.english}
          </p>
        </div>

        <p className="font-sans text-[15px] leading-7" style={{ color: `${K.cream}C4` }}>
          {KILI_INTRO}
        </p>
      </div>

      {/* Figures */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {KILI_PHOTOS.map((photo) => (
          <figure key={photo.src}>
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="block w-full object-cover"
              style={{
                aspectRatio: "4 / 3",
                borderRadius: "3px",
                background: `${K.cream}14`,
              }}
            />
            <figcaption
              className="mt-2 font-sans text-xs leading-5"
              style={{ color: `${K.cream}94` }}
            >
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* The admission, and the estate stated plainly */}
      <div
        className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
        style={{ borderTop: `1px solid ${K.cream}2E`, paddingTop: "1.5rem" }}
      >
        <div>
          <p className="font-display text-xl italic leading-snug sm:text-2xl">
            {KILI_CODA.turn}
          </p>
          <p
            className="mt-2 font-sans text-sm leading-6"
            style={{ color: `${K.cream}9E` }}
          >
            {KILI_CODA.tail}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:content-start">
          {KILI_FACTS.map((fact) => (
            <div key={fact.label}>
              <dt
                className="font-sans text-[9px] uppercase tracking-[0.2em]"
                style={{ color: `${K.cream}80` }}
              >
                {fact.label}
              </dt>
              <dd
                className="mt-0.5 font-sans text-[13px] leading-5"
                style={{ color: `${K.cream}D1` }}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </motion.section>
);

export default KilimanjaroStory;
