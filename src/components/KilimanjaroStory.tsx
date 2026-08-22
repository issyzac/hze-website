import React from "react";
import { motion } from "framer-motion";
import {
  KILI_CODA,
  KILI_FACTS,
  KILI_INTRO,
  KILI_PALETTE as K,
  KILI_PHOTOS,
  KILI_PROVERB,
  KILI_STOPS,
} from "../data/kilimanjaro";

const easeSoft = [0.25, 1, 0.5, 1] as const;

/**
 * The Kilimanjaro field journal, cut to a single band.
 *
 * Deliberately shorter than the Mirumbani panel: the proverb, the descent as
 * five stops, four figures from the journal, and the admission it closes on.
 * Set on the journal's ink ground so it reads as a page torn from it rather
 * than a second version of the Mirumbani story.
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
    <div className="relative px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
      {/* Masthead */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p
          className="font-sans text-[10px] uppercase tracking-[0.32em]"
          style={{ color: `${K.cream}8A` }}
        >
          HZE Journal · Toleo № 01
        </p>
        <p
          className="font-sans text-[10px] uppercase tracking-[0.28em]"
          style={{ color: K.gold }}
        >
          Descent · 1,800 m → sea level
        </p>
      </div>

      <div
        className="mt-6"
        style={{ borderTop: `1px solid ${K.cream}2E`, paddingTop: "2rem" }}
      >
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <h4
              id="kilimanjaro-story-title"
              className="text-3xl uppercase leading-[0.95] sm:text-5xl"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              Haraka haraka
              <br />
              haina kahawa.
            </h4>
            <p
              className="mt-4 font-display text-lg font-light italic"
              style={{ color: K.gold }}
            >
              {KILI_PROVERB.english}
            </p>
          </div>

          <div className="space-y-5">
            {KILI_INTRO.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="font-sans text-[17px] leading-8"
                style={{ color: `${K.cream}CC` }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* The descent */}
      <ol className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-5"
        style={{ background: `${K.cream}1F` }}
      >
        {KILI_STOPS.map((stop) => (
          <li key={stop.n} className="p-6" style={{ background: K.ink }}>
            <div className="flex items-baseline justify-between gap-3">
              <span
                className="font-display text-lg font-light"
                style={{ color: K.gold }}
              >
                {stop.n}
              </span>
              <span
                className="font-sans text-[10px] uppercase tracking-[0.2em]"
                style={{ color: `${K.cream}70` }}
              >
                {stop.altitude}
              </span>
            </div>
            <h5 className="mt-3 font-display text-xl">{stop.swahili}</h5>
            <p
              className="mt-1 font-sans text-[11px] uppercase tracking-[0.18em]"
              style={{ color: `${K.cream}70` }}
            >
              {stop.english}
            </p>
            <p
              className="mt-4 font-sans text-[15px] leading-7"
              style={{ color: `${K.cream}BF` }}
            >
              {stop.line}
            </p>
          </li>
        ))}
      </ol>

      {/* Figures, as a contact sheet */}
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {KILI_PHOTOS.map((photo) => (
          <figure key={photo.src}>
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="block w-full object-cover"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "3px",
                background: `${K.cream}14`,
              }}
            />
            <figcaption className="mt-3">
              <span
                className="font-sans text-[10px] uppercase tracking-[0.2em]"
                style={{ color: K.gold }}
              >
                {photo.fig}
              </span>
              <span
                className="mt-1 block font-sans text-sm leading-6"
                style={{ color: `${K.cream}9E` }}
              >
                {photo.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* The admission */}
      <div className="mt-16 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <p className="font-sans text-[17px] leading-8" style={{ color: `${K.cream}CC` }}>
            {KILI_CODA.lead}
          </p>
          <p className="mt-3 font-display text-2xl italic leading-snug sm:text-3xl">
            {KILI_CODA.turn}
          </p>
          <p
            className="mt-5 max-w-xl font-sans text-[15px] leading-7"
            style={{ color: `${K.cream}A6` }}
          >
            {KILI_CODA.tail}
          </p>
        </div>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:content-start">
          {KILI_FACTS.map((fact) => (
            <div
              key={fact.label}
              style={{ borderTop: `1px solid ${K.cream}45`, paddingTop: "0.75rem" }}
            >
              <dt
                className="font-sans text-[10px] uppercase tracking-[0.2em]"
                style={{ color: `${K.cream}8A` }}
              >
                {fact.label}
              </dt>
              <dd
                className="mt-1 font-sans text-[15px] leading-6"
                style={{ color: `${K.cream}D1` }}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    {/* Filed from the mountain, finished kwa ground */}
    <div
      className="flex items-center justify-center py-4"
      style={{ background: K.inkDeep }}
    >
      <p
        className="font-sans text-[10px] uppercase tracking-[0.3em]"
        style={{ color: `${K.cream}70` }}
      >
        Shambani · via Harakati za Enzi · Kikombeni
      </p>
    </div>
  </motion.section>
);

export default KilimanjaroStory;
