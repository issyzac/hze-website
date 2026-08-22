import React, { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MIRUMBANI_BEATS,
  MIRUMBANI_CHERRY_PHOTO,
  MIRUMBANI_CODA,
  MIRUMBANI_FACTS,
  MIRUMBANI_PALETTE as C,
  MIRUMBANI_PORTRAIT,
  MIRUMBANI_SONG,
  MIRUMBANI_VOW,
  type MirumbaniPhoto,
  type StoryBeat,
} from "../data/mirumbani";
import { waShareLink } from "../lib/whatsapp";

const easeSoft = [0.25, 1, 0.5, 1] as const;

/* ---------------------------------------------------------------- share --- */

/** Canonical link to this coffee, with the panel already open. */
const shareUrl = () =>
  `${window.location.origin}${window.location.pathname}#mirumbani`;

const SHARE_TEXT =
  "Mirumbani — kahawa ya kurudi nyumbani. A seasonal Kigoma lot from Harakati za Enzi, and the song it is named for.";

/** Share controls, at the foot of the story. */
const ShareRow: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Don't leave "Copied" stuck on screen if the section unmounts mid-timeout.
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, denied permission) — select
      // instead so the reader can copy by hand.
      window.prompt("Copy this link", shareUrl());
    }
  }, []);

  const pill =
    "btn-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-4";
  const pillStyle = {
    border: `1px solid ${C.kangaCream}59`,
    color: `${C.kangaCream}E0`,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className="font-sans text-[10px] uppercase tracking-[0.28em]"
        style={{ color: `${C.kangaCream}8A` }}
      >
        Sambaza · Share
      </span>

      <a
        href={waShareLink(`${SHARE_TEXT} ${shareUrl()}`)}
        target="_blank"
        rel="noreferrer"
        className={pill}
        style={pillStyle}
        aria-label="Share Mirumbani on WhatsApp"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
        WhatsApp
      </a>

      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(
          SHARE_TEXT
        )}&url=${encodeURIComponent(shareUrl())}`}
        target="_blank"
        rel="noreferrer"
        className={pill}
        style={pillStyle}
        aria-label="Share Mirumbani on X"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 2.5h3.3l-7.2 8.2 8.5 11.2h-6.7l-5.2-6.8-6 6.8H2.3l7.7-8.8L1.9 2.5h6.8l4.7 6.2 5.5-6.2Zm-1.2 17.5h1.8L7.4 4.4H5.5l12.2 15.6Z" />
        </svg>
        X
      </a>

      <button
        type="button"
        onClick={copy}
        className={pill}
        style={pillStyle}
        aria-label="Copy link to Mirumbani"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {copied ? "Imenakiliwa · Copied" : "Copy link"}
      </button>
    </div>
  );
};

/* ---------------------------------------------------------------- photo --- */

/**
 * A photo held the way the label holds the Mrumba tree — arched top for
 * portraits, a plain cream keyline for the wider frames.
 */
const FramedPhoto: React.FC<{
  photo: MirumbaniPhoto;
  className?: string;
}> = ({ photo, className = "" }) => {
  const arched = photo.orientation === "portrait";

  return (
    <figure className={className}>
      <div
        style={{
          border: `1px solid ${C.kangaCream}80`,
          borderRadius: arched ? "999px 999px 6px 6px" : "6px",
          padding: "0.5rem",
        }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="block w-full object-cover"
          style={{
            aspectRatio: arched ? "188 / 258" : "4 / 3",
            borderRadius: arched ? "999px 999px 4px 4px" : "4px",
            background: `${C.kangaCream}1A`,
          }}
        />
      </div>
      <figcaption
        className="mt-3 font-sans text-sm leading-6"
        style={{ color: `${C.kangaCream}9E` }}
      >
        {photo.caption}
      </figcaption>
    </figure>
  );
};

/* ----------------------------------------------------------------- beat --- */

/** One chapter of the story: eyebrow, prose, and the photo that belongs to it. */
const Beat: React.FC<{ beat: StoryBeat; flip: boolean }> = ({ beat, flip }) => (
  <div className="grid items-start gap-8 border-t pt-10 lg:grid-cols-2 lg:gap-12"
    style={{ borderColor: `${C.kangaCream}2E` }}
  >
    <div className={flip ? "lg:order-2" : "lg:order-1"}>
      <p
        className="font-sans text-[10px] uppercase tracking-[0.28em]"
        style={{ color: `${C.kangaCream}8A` }}
      >
        {beat.eyebrow}
      </p>
      <div className="mt-4 space-y-5">
        {beat.paragraphs.map((para) => (
          <p
            key={para.slice(0, 24)}
            className="font-sans text-[17px] leading-8"
            style={{ color: `${C.kangaCream}D1` }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>

    {beat.photo && (
      <FramedPhoto
        photo={beat.photo}
        className={`${flip ? "lg:order-1" : "lg:order-2"} ${
          beat.photo.orientation === "portrait" ? "mx-auto max-w-[18rem]" : ""
        }`}
      />
    )}
  </div>
);

/* ---------------------------------------------------------------- story --- */

/**
 * The back label, told at page scale.
 *
 * Kigoma green ground with cream type, the family held in the same arch the bag
 * uses, and the lake kept to a teal rule along the bottom edge. The song and the
 * opening beat read straight away; the rest of the estate story sits behind a
 * "meet the family" disclosure so the buy panel stays short for anyone who only
 * came to order.
 */
const MirumbaniStory: React.FC<{ reduceMotion: boolean | null }> = ({
  reduceMotion,
}) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <motion.section
      className="relative overflow-hidden"
      style={{ background: C.kigomaGreen, color: C.kangaCream }}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.5, ease: easeSoft, delay: 0.2 }}
      aria-labelledby="mirumbani-story-title"
    >
      <div
        className="pattern-cream absolute inset-0"
        style={{ opacity: 0.05, mixBlendMode: "overlay" }}
        aria-hidden
      />

      <div className="relative px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
        {/* Song + portrait */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p
              className="font-sans text-[10px] uppercase tracking-[0.32em]"
              style={{ color: `${C.kangaCream}A6` }}
            >
              The story panel
            </p>

            <h4
              id="mirumbani-story-title"
              className="mt-3 text-3xl uppercase leading-none sm:text-4xl"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              Kahawa ya Kurudi Nyumbani
            </h4>
            <p
              className="mt-2 font-display text-lg font-light italic"
              style={{ color: `${C.kangaCream}B8` }}
            >
              The coffee of returning home
            </p>

            <blockquote
              className="mt-8"
              style={{ borderLeft: `2px solid ${C.cherryRed}`, paddingLeft: "1.25rem" }}
            >
              <p className="font-display text-xl italic leading-snug sm:text-2xl">
                {MIRUMBANI_SONG.swahili}
              </p>
              <cite
                className="mt-2 block font-sans text-[15px] not-italic"
                style={{ color: `${C.kangaCream}9E` }}
              >
                {MIRUMBANI_SONG.english}
              </cite>
            </blockquote>
          </div>

          <FramedPhoto photo={MIRUMBANI_PORTRAIT} className="mx-auto w-full max-w-[26rem]" />
        </div>

        {/* Learn more */}
        <div className="mt-12">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="btn-press inline-flex min-h-[48px] items-center gap-3 rounded-full px-7 py-3 font-sans text-base font-medium transition-colors focus:outline-none focus-visible:ring-4"
            style={{
              background: open ? "transparent" : C.kangaCream,
              color: open ? C.kangaCream : C.kigomaGreen,
              border: `1px solid ${C.kangaCream}`,
            }}
          >
            {open ? "Funga hadithi · Close the story" : "Kutana na familia · Meet the family"}
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3, ease: easeSoft }}
            >
              <path
                d="M2 5l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="story"
              initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: easeSoft }}
              className="overflow-hidden"
            >
              <div className="mt-12 space-y-12">
                {MIRUMBANI_BEATS.map((beat, i) => (
                  <Beat key={beat.id} beat={beat} flip={i % 2 === 1} />
                ))}

                {/* The vow, with the cherry portrait beside it */}
                <div
                  className="grid items-center gap-8 border-t pt-10 lg:grid-cols-2 lg:gap-12"
                  style={{ borderColor: `${C.kangaCream}2E` }}
                >
                  <FramedPhoto
                    photo={MIRUMBANI_CHERRY_PHOTO}
                    className="mx-auto w-full max-w-[18rem] lg:order-1"
                  />
                  <div className="lg:order-2">
                    <p className="font-display text-2xl italic leading-snug sm:text-3xl">
                      {MIRUMBANI_VOW}
                    </p>

                    <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      {MIRUMBANI_FACTS.map((fact) => (
                        <div
                          key={fact.label}
                          style={{
                            borderTop: `1px solid ${C.kangaCream}59`,
                            paddingTop: "0.75rem",
                          }}
                        >
                          <dt
                            className="font-sans text-[10px] uppercase tracking-[0.2em]"
                            style={{ color: `${C.kangaCream}8A` }}
                          >
                            {fact.label}
                          </dt>
                          <dd
                            className="mt-1 font-sans text-[15px] leading-6"
                            style={{ color: `${C.kangaCream}D1` }}
                          >
                            {fact.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <p
                  className="font-sans text-[11px] uppercase tracking-[0.3em]"
                  style={{ color: `${C.kangaCream}8A` }}
                >
                  {MIRUMBANI_CODA.join(" ")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="mt-12 border-t pt-8"
          style={{ borderColor: `${C.kangaCream}2E` }}
        >
          <ShareRow />
        </div>
      </div>

      {/* Ziwa Tanganyika — present, but distant */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "6px", background: C.ziwaTeal }}
        aria-hidden
      />
    </motion.section>
  );
};

export default MirumbaniStory;
