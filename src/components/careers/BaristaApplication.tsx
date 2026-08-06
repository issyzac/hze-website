import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BARISTA_OPENING,
  SECTIONS,
  flattenAnswers,
  isSectionComplete,
  progressStats,
  sectionErrors,
  visibleFields,
  type Answers,
} from "../../data/careers";
import { useJobApplication } from "../../hooks/useJobApplication";
import { waLink } from "../../lib/whatsapp";
import ProgressRail from "./ProgressRail";
import FormField from "./FormField";

const easeSoft = [0.25, 1, 0.5, 1] as const;
const STORAGE_KEY = "hze-barista-application-v1";
const REVIEW_STEP = SECTIONS.length;

const PRAISE = [
  "Safi! Tumekufahamu.",
  "Poa — ratiba iko wazi.",
  "Asante kwa ukweli.",
  "Umeonyesha kufikiri.",
  "Uwajibikaji unaonekana.",
  "Maneno yako yana uzito.",
  "Karibu mwisho!",
  "Umemaliza — hongera!",
];

interface Saved {
  answers: Answers;
  step: number;
  started: boolean;
}

const loadSaved = (): Saved | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Saved;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
};

const referenceCode = () => `HZE-${Date.now().toString(36).toUpperCase().slice(-6)}`;

const buildTranscript = (answers: Answers) =>
  [
    "HARAKATI ZA ENZI — BARISTA APPLICATION",
    new Date().toLocaleString(),
    "",
    ...flattenAnswers(answers).map((row) => `${row.n}. ${row.question}\n   ${row.answer}\n`),
  ].join("\n");

export default function BaristaApplication() {
  const reduceMotion = useReducedMotion();
  const mutation = useJobApplication();

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gate, setGate] = useState({ email: "", phone: "" });
  const [gateErrors, setGateErrors] = useState<{ email?: string; phone?: string }>({});
  const [celebrating, setCelebrating] = useState<number | null>(null);
  const [resumed, setResumed] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [failedOffline, setFailedOffline] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const scrollAfterStep = useRef(false);

  // Restore an application in progress.
  useEffect(() => {
    const saved = loadSaved();
    if (saved?.started) {
      setAnswers(saved.answers);
      setStep(Math.min(saved.step, REVIEW_STEP));
      setStarted(true);
      setResumed(true);
    }
  }, []);

  // Autosave.
  useEffect(() => {
    if (!started || submitted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step, started } satisfies Saved));
    } catch {
      /* storage full or blocked — the form still works, it just won't resume */
    }
  }, [answers, step, started, submitted]);

  const stats = useMemo(() => progressStats(answers), [answers]);
  const readable = useMemo(
    () => new Map(flattenAnswers(answers).map((row) => [row.id, row.answer])),
    [answers],
  );
  const completedSections = useMemo(
    () => SECTIONS.filter((s) => isSectionComplete(s, answers)).map((s) => s.id),
    [answers],
  );

  const setAnswer = (id: string, value: Answers[string]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const scrollToTop = () => {
    const el = topRef.current;
    if (!el) return;
    const header = document.querySelector("header");
    const offset = (header ? (header as HTMLElement).offsetHeight : 0) + 12;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (scrollAfterStep.current) {
      scrollAfterStep.current = false;
      scrollToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // --- Gate -----------------------------------------------------------------

  const openForm = () => {
    const next: { email?: string; phone?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gate.email.trim())) {
      next.email = "We need a valid email to reach you.";
    }
    if (!/^[+]?[\d ()-]{9,20}$/.test(gate.phone.trim())) {
      next.phone = "We need a valid phone number.";
    }
    setGateErrors(next);
    if (Object.keys(next).length) return;

    setAnswers((prev) => ({ ...prev, email: gate.email.trim(), phone: gate.phone.trim() }));
    setStarted(true);
    scrollAfterStep.current = true;
    setStep(0);
    requestAnimationFrame(scrollToTop);
    toast.success("Karibu! Fomu imefunguka — the form is open.", {
      position: "top-center",
      style: { background: "#2B7A6E", color: "#FBF7EE" },
    });
  };

  // --- Navigation -----------------------------------------------------------

  const goNext = () => {
    const section = SECTIONS[step];
    const found = sectionErrors(section, answers);
    if (Object.keys(found).length) {
      setErrors(found);
      const firstId = Object.keys(found)[0];
      requestAnimationFrame(() => {
        const el = document.getElementById(firstId) || document.getElementById(`${firstId}-error`);
        el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      });
      toast.error("Bado kidogo — a few answers still need you.", { position: "top-center" });
      return;
    }
    setErrors({});
    setCelebrating(step);
    window.setTimeout(() => setCelebrating(null), 1500);
    scrollAfterStep.current = true;
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setErrors({});
    scrollAfterStep.current = true;
    setStep((s) => Math.max(0, s - 1));
  };

  const jumpTo = (index: number) => {
    if (!started) return;
    setErrors({});
    scrollAfterStep.current = true;
    setStep(index);
  };

  // --- Submit ---------------------------------------------------------------

  const submit = () => {
    const blocking = SECTIONS.find((s) => !isSectionComplete(s, answers));
    if (blocking) {
      const index = SECTIONS.indexOf(blocking);
      setErrors(sectionErrors(blocking, answers));
      jumpTo(index);
      toast.error(`Section ${index + 1} still needs a few answers.`, { position: "top-center" });
      return;
    }

    mutation.mutate(
      { role: BARISTA_OPENING.title, answers },
      {
        onSuccess: () => {
          setSubmitted(referenceCode());
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            /* ignore */
          }
          requestAnimationFrame(scrollToTop);
        },
        onError: (error) => {
          console.error("Job application submission error:", error);
          setFailedOffline(true);
          toast.error("We could not send it just now. Your answers are saved — try again below.", {
            duration: 9000,
            position: "top-center",
          });
        },
      },
    );
  };

  const downloadTranscript = () => {
    const blob = new Blob([buildTranscript(answers)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hze-barista-application.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Success --------------------------------------------------------------

  if (submitted) {
    return (
      <div ref={topRef} className="scroll-mt-32">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeSoft }}
          className="bg-white border-2 border-hze-teal/30 shadow-sm p-8 sm:p-12 text-center"
        >
          <div className="text-5xl mb-4" aria-hidden>
            ☕
          </div>
          <h3
            className="uppercase text-ink text-4xl sm:text-5xl leading-[0.95] mb-3"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Ombi lako limepokelewa
          </h3>
          <p className="font-display font-light italic text-bronze-deep text-xl mb-6">
            Your application is in. We read every single one.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-dashed border-bronze-deep/30 mb-8">
            <span className="font-sans text-xs uppercase tracking-[0.18em] text-ink/50">Reference</span>
            <span className="font-sans font-medium text-lg text-coffee-dark tabular-nums">{submitted}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {SECTIONS.map((s) => (
              <span
                key={s.id}
                className="h-11 w-11 flex items-center justify-center text-lg border-2 border-hze-teal/50 bg-hze-teal/10"
                style={{ transform: "rotate(-5deg)" }}
                title={s.title}
              >
                <span aria-hidden>{s.stamp}</span>
              </span>
            ))}
          </div>

          <p className="font-sans text-ink/70 leading-relaxed max-w-lg mx-auto mb-8">
            Shortlisted applicants are called for an interview and a practical assessment behind the bar.
            Keep your phone on — we call from a Dar es Salaam number.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={downloadTranscript}
              className="btn-press inline-flex items-center justify-center px-6 py-3.5 border-2 border-bronze-deep/30 text-coffee-dark font-sans hover:border-enzi-db transition-colors min-h-[52px]"
            >
              Download my answers
            </button>
            <a
              href={waLink("Habari HZE! Nimetuma ombi la kazi ya ubarista. Kumbukumbu: " + submitted)}
              target="_blank"
              rel="noreferrer"
              className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-hze-teal text-white font-sans font-medium rounded-full hover:bg-[#236458] transition-colors min-h-[52px]"
            >
              Message us on WhatsApp <span aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Gate -----------------------------------------------------------------

  if (!started) {
    return (
      <div ref={topRef} className="scroll-mt-32">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeSoft }}
          className="relative bg-white border-2 border-bronze-deep/20 shadow-sm overflow-hidden"
        >
          {/* Ticket stub header */}
          <div className="bg-coffee-dark text-coffee-cream px-6 sm:px-10 py-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs tracking-[0.22em] uppercase text-coffee-gold mb-1">
                Application · Ombi la kazi
              </p>
              <h3
                className="uppercase text-3xl sm:text-4xl leading-none"
                style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
              >
                Barista — 2 openings
              </h3>
            </div>
            <span className="stamp text-coffee-gold text-sm">Tuko wazi</span>
          </div>

          <div className="px-6 sm:px-10 py-8 sm:py-10">
            <div className="max-w-2xl">
              <p className="font-display text-xl sm:text-2xl text-coffee-dark leading-relaxed mb-4">
                Harakati za ENZI is more than a coffee shop. We are building Tanzania&rsquo;s most trusted
                coffee movement — one cup, one customer, and one community at a time.
              </p>
              <p className="font-sans text-ink/70 leading-relaxed mb-3">
                We are looking for baristas who are dependable, curious, warm with people, willing to learn,
                and able to take ownership without waiting to be chased.
              </p>
              <p className="font-sans text-ink/70 leading-relaxed">
                Coffee experience is valuable, but it is not the only thing we consider. Please answer honestly
                and in your own words. Shortlisted applicants will be invited for an interview and a practical
                assessment.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 font-sans text-sm text-ink/55">
                <span>⏱ 10–15 minutes</span>
                <span>💾 Saves as you go</span>
                <span>📝 45 questions, 8 short sections</span>
              </div>
            </div>

            {/* Perforation */}
            <div className="my-8 border-t-2 border-dashed border-bronze-deep/25" />

            <div className="max-w-xl">
              <h4 className="font-display text-2xl text-coffee-dark mb-1">Start with two details</h4>
              <p className="font-sans text-sm text-ink/55 mb-6">
                Namba na barua pepe — so we can reach you even if you stop halfway.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="gate-email" className="block font-sans text-sm font-medium text-ink mb-2">
                    Email address
                  </label>
                  <input
                    id="gate-email"
                    type="email"
                    autoComplete="email"
                    value={gate.email}
                    onChange={(e) => setGate((g) => ({ ...g, email: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && openForm()}
                    placeholder="wewe@example.com"
                    aria-invalid={!!gateErrors.email}
                    className="w-full px-4 py-3.5 bg-white border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans"
                  />
                  {gateErrors.email && (
                    <p role="alert" className="mt-1.5 font-sans text-sm text-hze-red">
                      {gateErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gate-phone" className="block font-sans text-sm font-medium text-ink mb-2">
                    Phone number
                  </label>
                  <input
                    id="gate-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={gate.phone}
                    onChange={(e) => setGate((g) => ({ ...g, phone: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && openForm()}
                    placeholder="07XX XXX XXX"
                    aria-invalid={!!gateErrors.phone}
                    className="w-full px-4 py-3.5 bg-white border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans"
                  />
                  {gateErrors.phone && (
                    <p role="alert" className="mt-1.5 font-sans text-sm text-hze-red">
                      {gateErrors.phone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={openForm}
                  className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-hze-teal text-white font-sans font-medium text-lg rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
                >
                  Fungua fomu — open the application <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Form -----------------------------------------------------------------

  const isReview = step === REVIEW_STEP;
  const section = SECTIONS[Math.min(step, SECTIONS.length - 1)];

  return (
    <div ref={topRef} className="scroll-mt-32">
      <div className="bg-white border-2 border-bronze-deep/20 shadow-sm">
        <ProgressRail
          percent={stats.percent}
          answered={stats.answered}
          total={stats.total}
          currentStep={Math.min(step, SECTIONS.length - 1)}
          completedSections={completedSections}
          onJump={jumpTo}
        />

        {resumed && (
          <div className="px-6 sm:px-10 pt-5">
            <div className="flex items-start justify-between gap-4 bg-cream-aged/60 border border-bronze-deep/20 px-4 py-3">
              <p className="font-sans text-sm text-ink/70">
                Karibu tena — we picked up where you left off.
              </p>
              <button
                type="button"
                onClick={() => setResumed(false)}
                className="font-sans text-sm text-enzi-db hover:underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="px-5 sm:px-10 py-8 sm:py-10 relative">
          {/* Section-complete celebration */}
          <AnimatePresence>
            {celebrating !== null && !reduceMotion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center"
              >
                <div className="relative bg-hze-teal text-white px-6 py-3 rounded-full font-sans font-medium shadow-lg">
                  <span className="mr-2" aria-hidden>
                    {SECTIONS[celebrating]?.stamp}
                  </span>
                  {PRAISE[celebrating] || "Vizuri!"}
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="absolute left-1/2 top-1/2 text-lg"
                      initial={{ opacity: 1, x: 0, y: 0 }}
                      animate={{
                        opacity: 0,
                        x: (i - 2.5) * 40,
                        y: -60 - Math.abs(i - 2.5) * 12,
                        rotate: (i - 2.5) * 60,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      ☕
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isReview ? (
              <motion.div
                key="review"
                initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: easeSoft }}
              >
                <p className="font-sans text-xs tracking-[0.22em] uppercase text-enzi-db mb-2">
                  Hatua ya mwisho — last step
                </p>
                <h3
                  className="uppercase text-ink text-4xl sm:text-5xl leading-[0.95] mb-2"
                  style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                >
                  Read it back
                </h3>
                <p className="font-sans text-ink/60 mb-8 max-w-xl">
                  This is exactly what lands on our desk. Tap any section to change an answer.
                </p>

                <div className="space-y-6">
                  {SECTIONS.map((s, i) => (
                    <div key={s.id} className="border border-bronze-deep/20">
                      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-cream-aged/50 border-b border-bronze-deep/15">
                        <h4 className="font-sans font-medium text-coffee-dark flex items-center gap-2">
                          <span aria-hidden>{s.stamp}</span> {s.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => jumpTo(i)}
                          className="font-sans text-sm text-enzi-db hover:underline shrink-0"
                        >
                          Edit
                        </button>
                      </div>
                      <dl className="divide-y divide-bronze-deep/10">
                        {visibleFields(s, answers).map((f) => (
                          <div key={f.id} className="px-4 py-3">
                            <dt className="font-sans text-sm text-ink/55 leading-snug">
                              {f.n}. {f.label}
                            </dt>
                            <dd className="font-sans text-ink mt-1 whitespace-pre-wrap leading-relaxed">
                              {readable.get(f.id) || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>

                {failedOffline && (
                  <div className="mt-8 border-2 border-hze-red/40 bg-hze-red/5 p-5">
                    <p className="font-sans text-ink/80 leading-relaxed mb-3">
                      The application did not reach us — most likely the network. Your answers are still saved
                      on this device. Try again, or download a copy and send it to us on WhatsApp.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={downloadTranscript}
                        className="btn-press px-5 py-3 border-2 border-bronze-deep/30 font-sans hover:border-enzi-db transition-colors"
                      >
                        Download my answers
                      </button>
                      <a
                        href={waLink("Habari HZE! Nina ombi la kazi ya ubarista, fomu haikutuma. Naomba msaada.")}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-press px-5 py-3 bg-hze-teal text-white font-sans rounded-full hover:bg-[#236458] transition-colors"
                      >
                        WhatsApp us
                      </a>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="btn-press w-full sm:w-auto px-6 py-4 border-2 border-bronze-deep/25 text-coffee-dark font-sans hover:border-enzi-db transition-colors min-h-[56px]"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={mutation.isPending}
                    className="btn-press w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-coffee-dark text-coffee-cream font-sans font-medium text-lg rounded-full hover:bg-bronze-deep transition-colors min-h-[56px] disabled:opacity-60"
                  >
                    {mutation.isPending ? "Inatuma…" : "Tuma ombi — send my application"}
                    {!mutation.isPending && <span aria-hidden>→</span>}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={section.id}
                initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: easeSoft }}
              >
                <header className="mb-8">
                  <p className="font-sans text-xs tracking-[0.22em] uppercase text-enzi-db mb-2">
                    Sehemu {step + 1} ya {SECTIONS.length} — {section.swahili}
                  </p>
                  <h3
                    className="uppercase text-ink text-4xl sm:text-5xl leading-[0.95] mb-3"
                    style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                  >
                    {section.title}
                  </h3>
                  <p className="font-display font-light italic text-bronze-deep text-lg sm:text-xl max-w-2xl leading-relaxed">
                    {section.blurb}
                  </p>
                  {section.note && (
                    <p className="mt-4 border-l-4 border-coffee-gold bg-cream-aged/50 px-4 py-3 font-sans text-sm text-ink/75 max-w-2xl">
                      {section.note}
                    </p>
                  )}
                </header>

                <div className="space-y-8">
                  {visibleFields(section, answers).map((field, i) => (
                    <FormField
                      key={field.id}
                      field={field}
                      answers={answers}
                      error={errors[field.id]}
                      onChange={setAnswer}
                      index={i}
                    />
                  ))}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="btn-press w-full sm:w-auto px-6 py-4 border-2 border-bronze-deep/25 text-coffee-dark font-sans hover:border-enzi-db transition-colors min-h-[56px]"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={goNext}
                    className="btn-press w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-hze-teal text-white font-sans font-medium text-lg rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
                  >
                    {step === SECTIONS.length - 1 ? "Review my application" : "Endelea — continue"}
                    <span aria-hidden>→</span>
                  </button>
                </div>

                <p className="mt-4 text-center font-sans text-xs text-ink/45">
                  Imehifadhiwa kwenye kifaa chako — your answers save automatically on this device.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
