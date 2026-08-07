import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BARISTA_OPENING } from "../data/careers";
import { waLink } from "../lib/whatsapp";
import { navigate } from "../lib/router";
import BaristaApplication from "./careers/BaristaApplication";

const easeSoft = [0.25, 1, 0.5, 1] as const;

// Drop the team photo here to light up the hero. If the file is absent the
// whole figure is skipped rather than rendering a broken image.
const TEAM_PHOTO = "/assets/images/careers/barista-team.jpg";

const scrollToApply = () => {
  const el = document.getElementById("apply");
  if (!el) return;
  const header = document.querySelector("header");
  const offset = header ? (header as HTMLElement).offsetHeight : 0;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.pageYOffset - offset - 8,
    behavior: "smooth",
  });
};

const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-1 text-hze-teal">
    <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CareersPage() {
  const reduceMotion = useReducedMotion();
  const [openTrait, setOpenTrait] = useState<number | null>(0);
  const [photoFailed, setPhotoFailed] = useState(false);
  const role = BARISTA_OPENING;

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? undefined : { opacity: 0, y: 22 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: easeSoft, delay },
  });

  return (
    <main id="main-content" className="pt-16 sm:pt-20">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative bg-coffee-dark text-coffee-cream overflow-hidden">
        <div aria-hidden className="absolute inset-0 pattern-tan opacity-[0.07]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="font-sans text-sm text-coffee-cream/60 hover:text-coffee-gold transition-colors mb-8 inline-flex items-center gap-2"
          >
            <span aria-hidden>←</span> Back to hze
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <motion.div {...fadeUp()} className="lg:col-span-7">
              <p className="font-sans text-xs sm:text-sm tracking-[0.24em] uppercase text-coffee-gold mb-4">
                Kazi — work with us
              </p>
              <h1
                className="uppercase text-5xl sm:text-7xl leading-[0.9] mb-6"
                style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
              >
                Join the HZE
                <br />
                Barista Team
              </h1>
              <p className="font-display font-light text-xl sm:text-2xl text-coffee-cream/85 leading-relaxed max-w-2xl">
                We are looking for people who care about coffee, people, and doing excellent work
                consistently.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={scrollToApply}
                  className="btn-press inline-flex items-center justify-center gap-2 px-8 py-4 bg-coffee-gold text-coffee-dark font-sans font-medium text-lg rounded-full hover:bg-enzi-lb transition-colors min-h-[56px]"
                >
                  Apply now <span aria-hidden>→</span>
                </button>
                <span className="font-sans text-coffee-cream/60 text-sm">
                  2 nafasi wazi · 10–15 minutes to apply
                </span>
              </div>
            </motion.div>

            {/* Team photo — hidden entirely if the asset is missing */}
            {!photoFailed && (
              <motion.figure {...fadeUp(0.15)} className="lg:col-span-5 relative">
                <div className="relative bg-cream-aged p-3 shadow-2xl" style={{ rotate: "1.5deg" }}>
                  <img
                    src={TEAM_PHOTO}
                    alt="Three HZE baristas laughing together behind the café counter"
                    onError={() => setPhotoFailed(true)}
                    className="w-full h-auto object-cover aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
                    loading="lazy"
                  />
                  <figcaption className="font-sans text-xs text-ink/60 text-center pt-3 pb-1">
                    Timu ya HZE — the team you would be joining.
                  </figcaption>
                </div>
                <span
                  aria-hidden
                  className="stamp absolute -top-3 -left-3 text-hze-red text-sm bg-cream-aged"
                >
                  Karibu
                </span>
              </motion.figure>
            )}
          </div>
        </div>

        <div aria-hidden className="khanga-divider" />
      </section>

      {/* ------------------------------------------------------- Current opening */}
      <section className="py-16 sm:py-20 px-4 bg-[#FBF7EE]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-10">
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-enzi-db">
              Nafasi zilizopo
            </span>
            <h2
              className="uppercase text-ink text-4xl sm:text-5xl leading-[0.95] mt-1"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              Current openings
            </h2>
          </motion.div>

          <motion.article
            {...fadeUp(0.1)}
            className="bg-white border-2 border-bronze-deep/20 shadow-sm overflow-hidden"
          >
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-3xl sm:text-4xl text-coffee-dark">
                    {role.title}
                  </h3>
                  <p className="font-display font-light italic text-bronze-deep text-lg mt-1">
                    {role.swahili}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-5 py-3 bg-hze-teal/10 border-2 border-hze-teal/30">
                    <span className="block font-display text-3xl text-hze-teal leading-none">
                      {role.positions}
                    </span>
                    <span className="block font-sans text-[11px] tracking-[0.14em] uppercase text-hze-teal/80 mt-1">
                      openings
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {[role.type, ...role.locations, "Dar es Salaam"].map((chip) => (
                  <span
                    key={chip}
                    className="font-sans text-sm px-3.5 py-1.5 bg-cream-aged/70 border border-bronze-deep/20 text-ink/75"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <p className="font-display text-xl sm:text-2xl text-coffee-dark leading-relaxed mt-8 max-w-3xl">
                {role.summary}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                {/* Who we're looking for */}
                <div>
                  <h4 className="font-sans text-sm tracking-[0.18em] uppercase text-enzi-db mb-4">
                    Who we are looking for
                  </h4>
                  <div className="space-y-2">
                    {role.lookingFor.map((trait, i) => {
                      const open = openTrait === i;
                      return (
                        <div key={trait.title} className="border-2 border-bronze-deep/15">
                          <button
                            type="button"
                            onClick={() => setOpenTrait(open ? null : i)}
                            aria-expanded={open}
                            className={`w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left font-sans font-medium transition-colors min-h-[52px] ${
                              open ? "bg-enzi-db/8 text-coffee-dark" : "text-ink/80 hover:bg-enzi-db/5"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="font-display text-enzi-db/60 text-sm tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              {trait.title}
                            </span>
                            <span
                              aria-hidden
                              className={`text-enzi-db transition-transform ${open ? "rotate-45" : ""}`}
                            >
                              +
                            </span>
                          </button>
                          <motion.div
                            initial={false}
                            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                            transition={{ duration: 0.28, ease: easeSoft }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 font-sans text-ink/70 leading-relaxed">
                              {trait.detail}
                            </p>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Essentials + nice-to-haves */}
                <div>
                  <h4 className="font-sans text-sm tracking-[0.18em] uppercase text-enzi-db mb-4">
                    Essentials
                  </h4>
                  <ul className="space-y-2.5">
                    {role.essentials.map((item) => (
                      <li key={item} className="flex gap-2.5 font-sans text-ink/80 leading-relaxed">
                        <Tick />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-sans text-sm tracking-[0.18em] uppercase text-enzi-db mt-8 mb-3">
                    Helpful, not required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {role.helpful.map((item) => (
                      <span
                        key={item}
                        className="font-sans text-sm px-3 py-1.5 border border-dashed border-bronze-deep/30 text-ink/65"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-sm text-ink/55 mt-4">
                    No café experience? Apply anyway. We train, and we have hired people who had never
                    touched an espresso machine.
                  </p>
                </div>
              </div>
            </div>

            {/* Process */}
            <div className="ticket-edge bg-cream-aged/40 px-6 sm:px-10 py-8">
              <h4 className="font-sans text-sm tracking-[0.18em] uppercase text-enzi-db mb-6">
                How hiring works
              </h4>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {role.process.map((stage, i) => (
                  <li key={stage.step} className="relative">
                    <span className="font-display text-4xl text-enzi-db/25 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h5 className="font-sans font-medium text-coffee-dark mt-1">{stage.step}</h5>
                    <p className="font-sans text-sm text-ink/65 leading-relaxed mt-1">{stage.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.article>
        </div>
      </section>

      {/* ------------------------------------------------------------ Application */}
      <section id="apply" className="py-14 sm:py-20 px-4 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <BaristaApplication />
        </div>
      </section>

      {/* ---------------------------------------------------------------- CV drop */}
      <section className="py-14 sm:py-16 px-4 bg-[#F7F3ED]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="uppercase text-ink text-3xl sm:text-4xl leading-[0.95] mb-3"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Not the right role today?
          </h2>
          <p className="font-sans text-ink/70 leading-relaxed max-w-xl mx-auto mb-7">
            Send us your CV and we will keep it on file. When we open a role for kitchen, roastery, events, or
            supervision, we look here first.
          </p>
          <a
            href={waLink(
              "Habari HZE! Ningependa kutuma CV yangu kwa nafasi zijazo. Jina langu ni ___.",
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-press inline-flex items-center justify-center gap-2 px-7 py-4 bg-hze-teal text-white font-sans font-medium rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
          >
            Submit your CV on WhatsApp <span aria-hidden>→</span>
          </a>
          <p className="font-sans text-sm text-ink/45 mt-4">
            Attach your CV to the chat — PDF or photo is fine.
          </p>
        </div>
      </section>
    </main>
  );
}
