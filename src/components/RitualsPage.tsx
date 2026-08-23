import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BARISTA_MESSAGE,
  COFFEES,
  FAQ_MESSAGE,
  GIFT_MESSAGE,
  HOW_IT_WORKS,
  PAYMENT_MODES,
  REMOTE_COMMANDS,
  REMOTE_THREAD,
  RITUAL_FAQ,
  RITUAL_PLANS,
  computeResult,
  questionsFor,
  type Answers,
} from "../data/rituals";
import { fromPrice, money, priceForGrams } from "../data/pricing";
import { WA_NUMBER, waLink } from "../lib/whatsapp";
import { navigate } from "../lib/router";

const easeSoft = [0.25, 1, 0.5, 1] as const;

const HERO_PHOTO = "/assets/images/rituals/ritual-hero.jpg";
const BAG_PHOTO = "/assets/images/coffee-bag-WEaa66D-600.png";

const WA_DISPLAY = `+${WA_NUMBER.slice(0, 3)} ${WA_NUMBER.slice(3, 6)} ${WA_NUMBER.slice(6, 9)} ${WA_NUMBER.slice(9)}`;

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.querySelector("header");
  const offset = header ? (header as HTMLElement).offsetHeight : 0;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.pageYOffset - offset - 8,
    behavior: "smooth",
  });
};

const Diamond = ({ color }: { color: string }) => (
  <span aria-hidden style={{ color }} className="leading-none">
    ✦
  </span>
);

// ---------------------------------------------------------------------------
// The rhythm quiz — question card, then the ticket
// ---------------------------------------------------------------------------

function RhythmQuiz() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const questions = useMemo(() => questionsFor(answers), [answers]);
  const question = questions[Math.min(step, questions.length - 1)];
  const result = useMemo(() => (done ? computeResult(answers) : null), [done, answers]);

  const pick = (label: string) => {
    const next = { ...answers, [question.key]: label };
    setAnswers(next);
    const upcoming = questionsFor(next);
    if (step + 1 >= upcoming.length) {
      setStep(upcoming.length - 1);
      setDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  const cardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: easeSoft },
      };

  if (result) {
    const ticketNo = 101 + Object.keys(answers).length * 7;

    return (
      <motion.div
        key="result"
        {...cardMotion}
        className="bg-cream-aged border-2 border-bronze-deep/35 shadow-[0_8px_40px_rgba(28,20,8,0.22)]"
      >
        <div aria-hidden className="khanga-divider" />

        <div className="px-6 sm:px-10 pt-8 sm:pt-9 pb-7 text-center">
          <div className="flex justify-between font-sans text-[11px] tracking-[0.2em] uppercase text-bronze-deep">
            <span>Kahawa Kama Kawa</span>
            <span>Tiketi No. {ticketNo}</span>
          </div>

          <p className="font-sans text-[15px] text-ink/60 mt-6 mb-1">This is your ritual.</p>
          <h3
            className="font-condensed font-bold uppercase leading-[0.95] text-[clamp(38px,10vw,64px)] m-0"
            style={{ color: result.color }}
          >
            {result.name}
          </h3>
          <p className="font-display italic font-light text-[19px] sm:text-[21px] text-bronze-deep mt-2.5">
            {result.tag}
          </p>
          <div className="stamp text-[17px] mt-5" style={{ color: result.color }}>
            Kahawa Kama Kawa
          </div>
        </div>

        {/* Perforated stub. Not `.ticket-edge` — the notches here punch
            through to the teal section behind, not the card colour. */}
        <div className="relative border-t-2 border-dashed border-bronze-deep/40 bg-cream-pale px-6 sm:px-10 pt-7 pb-8">
          <span aria-hidden className="absolute -top-2.5 -left-[11px] w-5 h-5 rounded-full bg-teal-deep" />
          <span aria-hidden className="absolute -top-2.5 -right-[11px] w-5 h-5 rounded-full bg-teal-deep" />

          <dl className="flex flex-col gap-2.5 max-w-[460px] mx-auto">
            {result.rows.map((row) => (
              <div
                key={row.k}
                className="flex justify-between gap-5 border-b border-bronze-deep/20 pb-2.5"
              >
                <dt className="font-sans text-xs tracking-[0.16em] uppercase text-bronze-deep pt-1 whitespace-nowrap">
                  {row.k}
                </dt>
                <dd className="font-sans text-[15px] sm:text-base font-medium text-ink text-right m-0">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <a
              href={waLink(result.message)}
              target="_blank"
              rel="noreferrer"
              className="btn-press bg-hze-teal hover:bg-teal-deep text-white font-sans font-medium text-base px-7 py-4 rounded-full transition-colors min-h-[48px] flex items-center"
            >
              {result.ctaLabel}
            </a>
            <button
              type="button"
              onClick={restart}
              className="btn-press border-2 border-bronze-deep/35 hover:border-enzi-db text-ink font-sans font-medium text-base px-6 py-3 rounded-full transition-colors min-h-[48px]"
            >
              Change my answers
            </button>
          </div>

          <p className="text-center font-sans text-[13px] text-ink/55 mt-4.5">
            Change anything. Skip anytime. No forms.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`q-${step}-${question.key}`}
      {...cardMotion}
      className="bg-cream-aged border border-ink/20 p-6 sm:p-10 min-h-[380px] shadow-[0_8px_40px_rgba(28,20,8,0.22)]"
    >
      <div className="flex items-center justify-between gap-4 mb-7">
        {/* Coffee beans as progress dots */}
        <div className="flex items-center gap-2" role="presentation">
          {questions.map((q, i) => (
            <span
              key={q.key}
              className="inline-block w-[15px] h-[19px] rounded-full border-2 border-bronze-deep/50 -rotate-12"
              style={{ background: i <= step ? "#B37542" : "transparent" }}
            />
          ))}
        </div>
        <div className="font-sans text-[13px] tracking-[0.12em] uppercase text-ink/55">
          Question {step + 1} of {questions.length}
        </div>
      </div>

      <h3 className="font-condensed font-bold uppercase text-[28px] sm:text-[32px] leading-none text-ink m-0 mb-1.5">
        {question.title}
      </h3>
      <p className="font-sans text-[15px] text-ink/60 mb-6">{question.sub}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => pick(opt.label)}
            className="btn-press text-left bg-cream-pale border-2 border-bronze-deep/25 hover:border-enzi-db hover:bg-[#FBF6EA] px-4.5 py-4 min-h-[60px] cursor-pointer font-sans flex flex-col gap-0.5 transition-colors"
          >
            <span className="font-medium text-base text-ink">{opt.label}</span>
            {opt.note && <span className="text-[13px] text-ink/55">{opt.note}</span>}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          className="mt-6 font-sans text-sm text-ink/60 hover:text-enzi-db underline py-2 transition-colors"
        >
          ← Back a question
        </button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RitualsPage() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? undefined : { opacity: 0, y: 22 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, ease: easeSoft, delay },
  });

  return (
    <main id="main-content" className="relative bg-cream-aged text-ink pt-16 sm:pt-20">
      {/* Paper grain over the whole page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ------------------------------------------------------------- Hero */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-14">
        <div className="max-w-[1160px] mx-auto">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="font-sans text-sm text-ink/55 hover:text-enzi-db transition-colors mb-8 inline-flex items-center gap-2"
          >
            <span aria-hidden>←</span> Back to hze
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp()}>
              <p className="font-sans text-[15px] sm:text-[17px] font-medium tracking-[0.18em] uppercase text-hze-red mb-5">
                Hutakiwi kuishiwa kahawa nzuri hivi
              </p>
              <h1 className="font-condensed font-bold uppercase text-[clamp(44px,12vw,92px)] leading-[0.92] m-0 text-ink">
                Great coffee.
                <br />
                <span className="text-teal-deep">Before you run out.</span>
              </h1>
              <p className="font-display italic font-light text-[20px] sm:text-[23px] leading-[1.4] text-ink/75 mt-6 max-w-[480px]">
                Fresh Tanzanian coffee, matched to your taste and your rhythm. Roasted in
                Dar. Delivered before the bag goes quiet.
              </p>

              <div className="flex items-center gap-3.5 mt-8 flex-wrap">
                <button
                  type="button"
                  onClick={() => scrollTo("rhythm")}
                  className="btn-press bg-enzi-db hover:bg-bronze-deep text-white font-sans font-medium text-[17px] px-8 py-4 rounded-full transition-colors min-h-[48px]"
                >
                  Find my ritual →
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("how")}
                  className="btn-press border-2 border-bronze-deep/35 hover:border-enzi-db text-ink font-sans font-medium text-[17px] px-7 py-3.5 rounded-full transition-colors min-h-[48px]"
                >
                  How it works
                </button>
              </div>

              <p className="font-sans text-sm text-ink/55 mt-5">
                From {fromPrice()} per delivery · Pause, skip, swap anytime
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <div className="border-[10px] border-hze-teal bg-teal-deep shadow-[0_8px_40px_rgba(28,20,8,0.22)] -rotate-1">
                <img
                  src={HERO_PHOTO}
                  alt="Morning coffee ritual at home"
                  className="block w-full h-[300px] sm:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              <p className="font-display italic font-light text-lg text-ink/60 text-center mt-4.5">
                Morning. Kettle. HZE. Work.
              </p>
            </motion.div>
          </div>

          {/* Route band */}
          <div className="max-w-[1160px] mx-auto mt-12 sm:mt-14 flex flex-col sm:flex-row shadow-[0_4px_16px_rgba(28,20,8,0.18)]">
            <div className="flex-1 bg-teal-deep text-cream-aged flex items-center justify-center gap-3 px-6 py-4 font-condensed font-bold text-[22px] sm:text-[26px] tracking-[0.06em] uppercase">
              <span aria-hidden>←</span> At home
            </div>
            <div className="flex-[1.2] bg-cream-aged border-y border-ink/15 flex items-center justify-center px-6 py-4 font-display italic font-light text-lg text-ink/70 text-center">
              kahawa kama kawa — every rhythm has a route
            </div>
            <div className="flex-1 bg-hze-red text-cream-aged flex items-center justify-center gap-3 px-6 py-4 font-condensed font-bold text-[22px] sm:text-[26px] tracking-[0.06em] uppercase">
              HZE Roastery <span aria-hidden>→</span>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="khanga-divider" />

      {/* ----------------------------------------------------- How it works */}
      <section id="how" className="px-4 sm:px-8 py-16 sm:py-22">
        <div className="max-w-[1160px] mx-auto">
          <motion.div {...fadeUp()}>
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-hze-teal mb-3.5">
              How it works
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,56px)] leading-[0.95] m-0 mb-10 text-ink">
              Three steps. Then it just happens.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp(i * 0.08)}
                className="bg-cream-warm border border-ink/15 px-7 py-8"
              >
                <div
                  className="font-condensed font-bold text-[52px] leading-none"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="font-condensed font-bold uppercase text-2xl tracking-[0.03em] mt-3.5 mb-2.5 text-ink">
                  {item.title}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-ink/70 m-0">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- The quiz */}
      <section id="rhythm" className="bg-teal-deep px-4 sm:px-8 py-16 sm:py-22">
        <div className="max-w-[780px] mx-auto">
          <div className="text-center mb-10">
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-sand mb-3.5">
              Your ritual, worked out
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,56px)] leading-[0.95] m-0 text-cream-aged">
              Tell us your rhythm
            </h2>
            <p className="font-display italic font-light text-lg sm:text-xl text-cream-aged/75 mt-3.5">
              A few questions. Then a ritual with a name, a bag, and a schedule.
            </p>
          </div>

          <RhythmQuiz />
        </div>
      </section>

      {/* ---------------------------------------------------- The 3 rituals */}
      <section id="rituals" className="px-4 sm:px-8 py-16 sm:py-22">
        <div className="max-w-[1160px] mx-auto">
          <motion.div {...fadeUp()}>
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-hze-red mb-3.5">
              The rituals
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,56px)] leading-[0.95] m-0 mb-3 text-ink">
              Not twelve options. Three.
            </h2>
            <p className="font-display italic font-light text-lg sm:text-xl text-ink/65 m-0 mb-10">
              One question decides it: what kind of coffee person are you?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {RITUAL_PLANS.map((plan, i) => (
              <motion.article
                key={plan.name}
                {...fadeUp(i * 0.08)}
                className="border border-ink/20 bg-cream-warm flex flex-col"
              >
                <div className="text-cream-aged px-6 py-5" style={{ background: plan.band }}>
                  <h3 className="font-condensed font-bold uppercase text-[30px] leading-none m-0">
                    {plan.name}
                  </h3>
                  <p className="font-sans text-[13px] tracking-[0.14em] uppercase mt-2 opacity-80">
                    {plan.english}
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <p className="font-display italic font-light text-[19px] m-0 text-ink">
                    {plan.blurb}
                  </p>
                  <ul className="flex flex-col gap-2.5 font-sans text-[14.5px] text-ink/75 flex-1 m-0 p-0 list-none">
                    {plan.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <Diamond color={plan.accent} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="border-t border-ink/15 pt-3.5 font-sans text-[15px] font-medium m-0">
                    {plan.price}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Gift strip */}
          <motion.div
            {...fadeUp()}
            className="mt-5 bg-ink-deep flex items-center gap-6 sm:gap-8 px-6 sm:px-9 py-7 flex-wrap"
          >
            <img
              src={BAG_PHOTO}
              alt=""
              aria-hidden
              className="h-[92px] w-auto -rotate-4"
              loading="lazy"
            />
            <div className="flex-1 min-w-[260px]">
              <h3 className="font-condensed font-bold uppercase text-[30px] leading-none m-0 text-cream-aged">
                Mtunuku Mtu Kahawa
              </h3>
              <p className="font-display italic font-light text-[19px] text-sand mt-2 mb-0">
                Give someone three months of great mornings.
              </p>
            </div>
            <a
              href={waLink(GIFT_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="btn-press bg-sand hover:bg-cream-aged text-ink font-sans font-medium text-base px-7 py-3.5 rounded-full whitespace-nowrap transition-colors min-h-[48px] flex items-center"
            >
              Gift a ritual
            </a>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------------- Pricing */}
      <section
        id="pricing"
        className="bg-cream-warm border-y border-ink/15 px-4 sm:px-8 py-16 sm:py-22"
      >
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div {...fadeUp()}>
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-hze-teal mb-3.5">
              Pricing
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,52px)] leading-[0.95] m-0 mb-7 text-ink">
              The coffee, per 250g
            </h2>

            <div className="flex flex-col">
              {COFFEES.map((coffee, i) => (
                <div
                  key={coffee.name}
                  className={`flex justify-between items-baseline gap-5 py-4.5 border-t border-ink/15 ${
                    i === COFFEES.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div>
                    <span className="font-condensed font-bold uppercase text-[26px]">
                      {coffee.name}
                    </span>
                    <span className="font-display italic font-light text-base text-ink/60 ml-3">
                      {coffee.notes}
                    </span>
                  </div>
                  <span className="font-sans font-medium text-[17px] whitespace-nowrap">
                    {money(coffee.price)}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-sans text-[15px] leading-relaxed text-ink/70 mt-5.5">
              Your delivery price is simply bag size × coffee. Nothing hidden.
            </p>
            <p className="inline-block bg-teal-deep text-cream-aged font-sans text-sm px-4.5 py-2.5 mt-3.5">
              Example: 500g of Tunu every 3 weeks — {money(priceForGrams("Tunu", 500))} per
              delivery
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <h3 className="font-condensed font-bold uppercase text-2xl mt-1.5 mb-4.5">
              Pay how Dar pays
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {PAYMENT_MODES.map((mode) => (
                <div
                  key={mode.title}
                  className="border border-ink/20 bg-cream-aged px-5 py-4.5"
                >
                  <p className="font-sans font-bold text-[15px] tracking-[0.04em] m-0">
                    {mode.title}
                  </p>
                  <p className="font-sans text-sm text-ink/65 mt-1.5 mb-0">{mode.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------- WhatsApp remote */}
      <section id="remote" className="bg-ink px-4 sm:px-8 py-16 sm:py-22">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-sand mb-3.5">
              No apps. No account pages.
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,56px)] leading-[0.95] m-0 mb-3.5 text-cream-aged">
              The remote control is WhatsApp.
            </h2>
            <p className="font-display italic font-light text-lg sm:text-xl text-cream-aged/70 m-0 mb-8">
              One word. We handle the rest.
            </p>

            <dl className="flex flex-col gap-3.5 m-0">
              {REMOTE_COMMANDS.map((cmd) => (
                <div key={cmd.word} className="flex items-center gap-4.5">
                  <dt
                    className="font-condensed font-bold text-[22px] tracking-[0.06em] border-2 px-3.5 py-0.5 min-w-[74px] text-center"
                    style={{ color: cmd.color, borderColor: cmd.color }}
                  >
                    {cmd.word}
                  </dt>
                  <dd className="font-sans text-[15px] text-cream-aged/75 m-0">{cmd.detail}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="bg-ink-deep border border-cream-aged/15 rounded-lg p-6 flex flex-col gap-3"
          >
            <p className="font-sans text-xs tracking-[0.16em] uppercase text-cream-aged/50 text-center pb-2 border-b border-cream-aged/15 m-0">
              HZE · WhatsApp
            </p>
            {REMOTE_THREAD.map((msg, i) =>
              msg.from === "user" ? (
                <p
                  key={i}
                  className="self-end bg-cream-aged text-ink font-sans text-[15px] font-medium px-4 py-2.5 rounded-[14px_14px_3px_14px] max-w-[75%] m-0"
                >
                  {msg.text}
                </p>
              ) : (
                <p
                  key={i}
                  className="self-start bg-teal-deep text-cream-aged font-sans text-[15px] px-4 py-2.5 rounded-[14px_14px_14px_3px] max-w-[80%] m-0"
                >
                  {msg.text}
                </p>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section
        id="faq"
        className="bg-cream-warm border-t border-ink/15 px-4 sm:px-8 py-16 sm:py-22"
      >
        <div className="max-w-[1160px] mx-auto">
          <motion.div {...fadeUp()} className="max-w-[720px]">
            <p className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-clay mb-3.5">
              Everything, up front
            </p>
            <h2 className="font-condensed font-bold uppercase text-[clamp(34px,4.5vw,52px)] leading-[0.95] m-0 mb-3 text-ink">
              Questions, answered plainly
            </h2>
            <p className="font-display italic font-light text-lg sm:text-xl text-ink/65 m-0 mb-10">
              Nothing folded away. Read what you need and skip the rest.
            </p>
          </motion.div>

          {/* Answers are never hidden behind a toggle — the headline promises
              plain, so the section shows its work. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RITUAL_FAQ.map((item, i) => (
              <motion.article
                key={item.q}
                {...fadeUp(Math.min(i, 3) * 0.06)}
                className="group relative bg-cream-aged border border-ink/15 p-7 sm:p-8 transition-colors hover:border-ink/35"
              >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 h-[3px] w-14 transition-all duration-300 group-hover:w-full"
                  style={{ background: item.color }}
                />

                <div className="flex items-baseline gap-4">
                  <span
                    className="font-condensed font-bold text-[34px] leading-none shrink-0"
                    style={{ color: item.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase m-0"
                    style={{ color: item.color }}
                  >
                    {item.short}
                  </p>
                </div>

                <h3 className="font-condensed font-bold uppercase text-[25px] sm:text-[27px] leading-[1.05] tracking-[0.02em] text-ink mt-4 mb-3">
                  {item.q}
                </h3>
                <p className="font-sans text-[15px] leading-[1.7] text-ink/70 m-0">
                  {item.a}
                </p>
              </motion.article>
            ))}

            {/* The grid's odd cell out — anything the six didn't cover. */}
            <motion.div
              {...fadeUp(0.24)}
              className="md:col-span-2 bg-ink-deep flex items-center justify-between gap-6 px-7 sm:px-9 py-7 flex-wrap"
            >
              <div className="min-w-[240px]">
                <h3 className="font-condensed font-bold uppercase text-[27px] leading-none m-0 text-cream-aged">
                  Something we missed?
                </h3>
                <p className="font-display italic font-light text-[18px] text-sand mt-2 mb-0">
                  Ask a human. We answer in full sentences.
                </p>
              </div>
              <a
                href={waLink(FAQ_MESSAGE)}
                target="_blank"
                rel="noreferrer"
                className="btn-press bg-sand hover:bg-cream-aged text-ink font-sans font-medium text-base px-7 py-3.5 rounded-full whitespace-nowrap transition-colors min-h-[48px] flex items-center"
              >
                Ask on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Final CTA */}
      <section id="visit" className="bg-teal-deep px-4 sm:px-8 py-20 sm:py-24">
        <div className="max-w-[780px] mx-auto text-center">
          <h2 className="font-condensed font-bold uppercase text-[clamp(40px,5.5vw,68px)] leading-[0.95] m-0 text-cream-aged">
            Still not sure?
          </h2>
          <p className="font-display italic font-light text-lg sm:text-[21px] text-cream-aged/80 mt-4.5 mb-8">
            Talk to a barista. Your brew method, honest advice, no script.
          </p>

          <div className="flex justify-center gap-3.5 flex-wrap">
            <a
              href={waLink(BARISTA_MESSAGE)}
              target="_blank"
              rel="noreferrer"
              className="btn-press bg-cream-aged hover:bg-white text-teal-deep font-sans font-medium text-[17px] px-8 py-4 rounded-full transition-colors min-h-[48px] flex items-center"
            >
              Talk to a barista on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => scrollTo("rhythm")}
              className="btn-press border-2 border-cream-aged/50 hover:border-cream-aged text-cream-aged font-sans font-medium text-[17px] px-7 py-3.5 rounded-full transition-colors min-h-[48px]"
            >
              Find my ritual
            </button>
          </div>

          <p className="font-sans text-sm text-cream-aged/60 mt-6.5">
            Or come by: HZE Victoria · Mbezi Beach — the first cup is a conversation.
          </p>
          <p className="font-sans text-sm text-cream-aged/50 mt-2">
            WhatsApp {WA_DISPLAY}
          </p>
        </div>
      </section>
    </main>
  );
}
