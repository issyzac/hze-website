import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { waLink } from "../lib/whatsapp";
import { bagPrice, type CoffeeName } from "../data/pricing";

const easeSoft = [0.25, 1, 0.5, 1] as const;

type PersonalityKey = "mwanaharakati" | "mpole" | "msafiri" | "amka";

interface Personality {
  key: PersonalityKey;
  name: string;
  english: string;
  tagline: string;
  notes: [string, string, string];
  productName: string;
  brew: string;
  /** Which bag this personality is sold — the price follows from it. */
  coffee: CoffeeName;
  color: string;
}

/** Price per 250g of the bag a personality lands on. */
const personalityPrice = (p: Personality) => bagPrice(p.coffee);

export const PERSONALITIES: Record<PersonalityKey, Personality> = {
  mwanaharakati: {
    key: "mwanaharakati",
    name: "Mwanaharakati",
    english: "The Mover",
    tagline: "Nguvu ya harakati iko ndani yako",
    notes: ["Bold", "Dark chocolate", "French Press"],
    productName: "TUNU medium roast",
    brew: "French Press",
    coffee: "Tunu",
    color: "#B83528",
  },
  mpole: {
    key: "mpole",
    name: "Asubuhi Aste Aste",
    english: "The Gentle Morning",
    tagline: "Pole pole ndio mwendo",
    notes: ["Smooth", "Caramel & toffee", "Cappuccino"],
    productName: "NGUVU medium roast",
    brew: "Cappuccino at home",
    coffee: "Nguvu",
    color: "#B37542",
  },
  msafiri: {
    key: "msafiri",
    name: "Msaka Utamu",
    english: "The Flavor Traveler",
    tagline: "Kila kikombe ni safari",
    notes: ["Bright", "Blueberry", "V60 pour-over"],
    productName: "TUNU",
    brew: "V60 pour-over — taste the blueberry",
    coffee: "Tunu",
    color: "#2B7A6E",
  },
  amka: {
    key: "amka",
    name: "Stress Repeller",
    english: "The Warm Riser",
    tagline: "Amka, pumzika, furahia",
    notes: ["Bright", "Apricot & citrus", "Any time"],
    productName: "AMKA",
    brew: "Any time of day",
    coffee: "Amka",
    color: "#D19D71",
  },
};

interface Answer {
  label: string;
  emoji: string;
  points: Partial<Record<PersonalityKey, number>>;
}

interface Question {
  swahili: string;
  english: string;
  fact: string;
  answers: Answer[];
}

const QUESTIONS: Question[] = [
  {
    swahili: "Asubuhi yako inaanzaje?",
    english: "How does your morning start?",
    fact: "Coffee cherries are picked at sunrise in Kilimanjaro — cooler beans, better flavor.",
    answers: [
      { label: "Kabla ya jua — up before the sun", emoji: "🌅", points: { mwanaharakati: 2 } },
      { label: "Pole pole, na muziki — slow, with music", emoji: "🎵", points: { mpole: 2 } },
      { label: "Mbio mbio, natafuta usafiri", emoji: "🚌", points: { mwanaharakati: 1, msafiri: 1 } },
      { label: "Weekend ndio asubuhi yangu", emoji: "😴", points: { amka: 2 } },
    ],
  },
  {
    swahili: "Mgeni amekuja Dar. Unampeleka wapi kwanza?",
    english: "A guest visits Dar — where first?",
    fact: "Dar drinks more chai than kahawa — we're here to change that.",
    answers: [
      { label: "Coco Beach at sunset", emoji: "🌊", points: { mpole: 1, amka: 1 } },
      { label: "Kariakoo — into the noise", emoji: "🛍️", points: { mwanaharakati: 2 } },
      { label: "A quiet bookshop café", emoji: "📚", points: { mpole: 2 } },
      { label: "Wherever the music is tonight", emoji: "🎶", points: { msafiri: 2 } },
    ],
  },
  {
    swahili: "Chagua ladha.",
    english: "Pick a flavor lane.",
    fact: "TUNU from Karatu really does taste of blackcurrant — washed processing does that.",
    answers: [
      { label: "Caramel & toffee — sweet comfort", emoji: "🍮", points: { mpole: 2 } },
      { label: "Blueberry & blackcurrant — bright surprise", emoji: "🫐", points: { msafiri: 2 } },
      { label: "Dark chocolate — deep and serious", emoji: "🍫", points: { mwanaharakati: 2 } },
      { label: "Apricot & citrus zest — bright starter", emoji: "🍑", points: { amka: 2 } },
    ],
  },
  {
    swahili: "Kikombe chako kinakaaje?",
    english: "How do you take your cup?",
    fact: "Espresso has less caffeine per cup than filter — the water contact time is shorter.",
    answers: [
      { label: "Black, no negotiations", emoji: "⚫", points: { mwanaharakati: 2 } },
      { label: "Milky and gentle", emoji: "🥛", points: { mpole: 2 } },
      { label: "Iced, always", emoji: "🧊", points: { msafiri: 1, amka: 1 } },
      { label: "Depends on my mood, honestly", emoji: "🎲", points: { msafiri: 1, amka: 1 } },
    ],
  },
  {
    swahili: "Kwenye harakati zako, wewe ni nani?",
    english: "In the movement, who are you?",
    fact: "Every HZE cup supports dignified work in Tanzanian coffee — karibu kwenye harakati.",
    answers: [
      { label: "The one organizing everyone", emoji: "📣", points: { mwanaharakati: 2 } },
      { label: "The one with the book", emoji: "📖", points: { mpole: 2 } },
      { label: "The one who knows everyone", emoji: "🤝", points: { amka: 2 } },
      { label: "The one trying every new thing", emoji: "✨", points: { msafiri: 2 } },
    ],
  },
];

// ---------- Share-card drawing ----------

const ESPRESSO = "#4A2E1B";
const TEAL = "#2B7A6E";
const BRICK = "#B83528";
const CREAM = "#EDE5CF";
const OFFWHITE = "#FBF7EE";
const COFFEE_BROWN = "#7A4E1E";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const titleCase = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");

export async function drawShareCard(
  canvas: HTMLCanvasElement,
  p: Personality,
  rawName: string
) {
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const [mug, board] = await Promise.all([
    loadImage("/assets/images/share/mug-vector.png"),
    loadImage("/assets/images/share/daladala-board.png"),
  ]);
  try {
    await Promise.all([
      document.fonts.load('700 120px "GT Alpina Condensed"'),
      document.fonts.load('300 italic 48px "GT Alpina"'),
      document.fonts.load('500 46px "Circular Std"'),
    ]);
  } catch {
    // draw with fallbacks
  }

  // Warm cream background with subtle paper grain
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(74, 46, 27, 0.045)";
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 1.4 + 0.3;
    ctx.fillRect(x, y, r, r);
  }

  // Restrained kitenge border bands (top + bottom)
  const drawKitengeBand = (yTip: number, yBase: number) => {
    const triW = 26;
    const inset = 64;
    let i = 0;
    for (let x = inset; x + triW <= W - inset; x += triW + 10, i++) {
      ctx.fillStyle = i % 3 === 2 ? BRICK : TEAL;
      ctx.beginPath();
      ctx.moveTo(x, yBase);
      ctx.lineTo(x + triW / 2, yTip);
      ctx.lineTo(x + triW, yBase);
      ctx.closePath();
      ctx.fill();
    }
  };
  drawKitengeBand(58, 40); // top band, triangles pointing down
  drawKitengeBand(H - 58, H - 40); // bottom band, pointing up

  ctx.textAlign = "center";

  // 1. Brand line — wide letterspacing
  ctx.fillStyle = ESPRESSO;
  ctx.font = '500 30px "Circular Std", sans-serif';
  ctx.fillText("H A R A K A T I   Z A   E N Z I", W / 2, 132);

  // 2. Artisan cup illustration (523×637 art)
  if (mug) {
    const mh = 330;
    const mw = (523 / 637) * mh;
    ctx.drawImage(mug, (W - mw) / 2, 172, mw, mh);
  }

  // 3. "Mimi, {Name} ni" / "Mimi ni"
  const name = titleCase(rawName);
  ctx.fillStyle = ESPRESSO;
  ctx.font = '500 46px "Circular Std", sans-serif';
  ctx.fillText(name ? `Mimi, ${name} ni` : "Mimi ni", W / 2, 596);

  // 4. Personality name — the largest text on the card
  const big = p.name.toUpperCase();
  let size = 124;
  ctx.font = `700 ${size}px "GT Alpina Condensed", sans-serif`;
  while (ctx.measureText(big).width > W - 150 && size > 56) {
    size -= 4;
    ctx.font = `700 ${size}px "GT Alpina Condensed", sans-serif`;
  }
  ctx.fillStyle = p.color;
  ctx.fillText(big, W / 2, 700);

  // 5. Poetic subhead
  ctx.fillStyle = COFFEE_BROWN;
  ctx.font = '300 italic 48px "GT Alpina", Georgia, serif';
  ctx.fillText(p.tagline, W / 2, 772);

  // 6. Flavour intro
  ctx.fillStyle = ESPRESSO;
  ctx.font = '500 34px "Circular Std", sans-serif';
  ctx.fillText("I like my coffee...", W / 2, 852);

  // 7. Flavour pills — tactile stamps
  ctx.font = '500 32px "Circular Std", sans-serif';
  const pillH = 72;
  const pillY = 884;
  const gap = 22;
  const widths = p.notes.map((n) => ctx.measureText(n).width + 72);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  let px = (W - totalW) / 2;
  p.notes.forEach((note, i) => {
    const w = widths[i];
    ctx.fillStyle = OFFWHITE;
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(px, pillY, w, pillH, 36);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = ESPRESSO;
    ctx.fillText(note, px + w / 2, pillY + 47);
    px += w + gap;
  });

  // 8. Daladala destination board — the footer signature (905×264 art)
  if (board) {
    const bw = 700;
    const bh = (264 / 905) * bw;
    ctx.drawImage(board, (W - bw) / 2, 1040, bw, bh);
  }

  // 9. Small secondary footer
  ctx.fillStyle = COFFEE_BROWN;
  ctx.font = '400 26px "Circular Std", sans-serif';
  ctx.fillText("Safari ya Ladha · @harakatizaenzi · Kahawa Kama Kawa", W / 2, 1272);
}

// ---------- Component ----------

type Stage = "invite" | "quiz" | "result";

export default function SafariYaLadha() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("invite");
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState<Record<PersonalityKey, number>>({
    mwanaharakati: 0, mpole: 0, msafiri: 0, amka: 0,
  });
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const winner = (): Personality => {
    const order: PersonalityKey[] = ["msafiri", "mwanaharakati", "mpole", "amka"];
    let best: PersonalityKey = "msafiri";
    for (const k of order) {
      if (scores[k] > scores[best]) best = k;
    }
    return PERSONALITIES[best];
  };

  const answer = (a: Answer) => {
    setScores((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(a.points)) {
        next[k as PersonalityKey] += v ?? 0;
      }
      return next;
    });
    const fact = QUESTIONS[qIndex].fact;
    setToast(`☕ ${fact}`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);

    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(qIndex + 1);
    } else {
      setStage("result");
    }
  };

  const restart = () => {
    setScores({ mwanaharakati: 0, mpole: 0, msafiri: 0, amka: 0 });
    setQIndex(0);
    setStage("invite");
    setCardOpen(false);
  };

  useEffect(() => {
    if (cardOpen && canvasRef.current) {
      drawShareCard(canvasRef.current, winner(), name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOpen, name]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `safari-ya-ladha-${winner().key}.png`;
    a.click();
  };

  const shareCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "safari-ya-ladha.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Safari ya Ladha",
            text: `Mimi ni ${winner().name}! ☕ Kahawa Kama Kawa — @harakatizaenzi`,
          });
          return;
        } catch {
          // fall through to WhatsApp text link
        }
      }
      window.open(waLink(cardMsg), "_blank", "noopener,noreferrer");
    }, "image/png");
  };

  const copyCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      try {
        if (!blob || !navigator.clipboard || typeof ClipboardItem === "undefined") {
          throw new Error("no clipboard image support");
        }
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied("Kadi imenakiliwa — image copied!");
      } catch {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied("Link copied!");
        } catch {
          setCopied("Copy haikufaulu — try Download instead.");
        }
      }
      window.setTimeout(() => setCopied(null), 2500);
    }, "image/png");
  };

  const p = winner();
  const orderMsg = `Habari HZE! Nimemaliza Safari ya Ladha — mimi ni ${p.name}. Nataka kuagiza ${p.productName} (250g). Jina langu ni ${name.trim() || "___"}.`;
  const cardMsg = `Nimeshiriki kadi yangu ya ${p.name}! Niwekeni kwenye habari za events 🙌 — ${name.trim() || "___"}`;

  return (
    <div id="safari">
      <AnimatePresence mode="wait">
        {stage === "invite" && (
          <motion.div
            key="invite"
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.5, ease: easeSoft }}
            className="bg-cream-aged border border-bronze-deep/20 p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 khanga-divider" />
            <h3
              className="uppercase text-ink text-4xl sm:text-6xl leading-[0.95] mt-4"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              Safari ya Ladha
            </h3>
            <p className="mt-3 font-display font-light italic text-bronze-deep text-xl sm:text-2xl">
              Find your cup. Discover your coffee self.
            </p>
            <button
              onClick={() => setStage("quiz")}
              className="btn-press mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 bg-enzi-db text-white font-sans font-medium text-lg rounded-full hover:bg-bronze-deep transition-colors min-h-[56px]"
            >
              Anza Safari <span aria-hidden>→</span>
            </button>
            <p className="mt-4 font-sans text-sm text-ink/50">
              Maswali 5 · dakika 1 · kahawa yako inakusubiri
            </p>
          </motion.div>
        )}

        {stage === "quiz" && (
          <motion.div
            key={`q-${qIndex}`}
            initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: easeSoft }}
            className="bg-cream-aged border border-bronze-deep/20 p-6 sm:p-10"
          >
            {/* Bean progress */}
            <div className="flex items-center justify-center gap-2 mb-6" aria-label={`Swali ${qIndex + 1} kati ya ${QUESTIONS.length}`}>
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`inline-block w-4 h-5 rounded-[50%] -rotate-12 border-2 transition-colors ${
                    i <= qIndex ? "bg-enzi-db border-bronze-deep" : "bg-transparent border-bronze-deep/40"
                  }`}
                />
              ))}
            </div>

            <h3
              className="text-center uppercase text-ink text-2xl sm:text-4xl"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              {QUESTIONS[qIndex].swahili}
            </h3>
            <p className="text-center font-sans text-ink/60 mt-1 mb-8">
              {QUESTIONS[qIndex].english}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {QUESTIONS[qIndex].answers.map((a) => (
                <button
                  key={a.label}
                  onClick={() => answer(a)}
                  className="btn-press text-left bg-white border-2 border-bronze-deep/20 hover:border-enzi-db p-4 flex items-center gap-4 min-h-[64px] transition-colors"
                >
                  <span className="text-2xl" aria-hidden>{a.emoji}</span>
                  <span className="font-sans text-ink text-base">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeSoft }}
            className="max-w-2xl mx-auto"
          >
            {/* Daladala ticket */}
            <div className="bg-cream-aged border-2 border-bronze-deep/30 relative overflow-hidden">
              <div aria-hidden className="khanga-divider" />
              <div className="p-6 sm:p-10 text-center">
                <div className="flex items-center justify-between font-sans text-xs tracking-[0.2em] uppercase text-bronze-deep">
                  <span>Safari ya Ladha</span>
                  <span>Tiketi No. {Math.max(1, scores[p.key])}0{qIndex + 1}</span>
                </div>

                <p className="mt-6 font-sans text-ink/60">Wewe ni…</p>
                <h3
                  className="uppercase leading-[0.95] text-5xl sm:text-6xl mt-1"
                  style={{ fontFamily: "var(--font-condensed)", fontWeight: 700, color: p.color }}
                >
                  {p.name}
                </h3>
                <p className="font-sans text-ink/60 mt-1">{p.english}</p>
                <p className="mt-3 font-display font-light italic text-bronze-deep text-xl sm:text-2xl">
                  “{p.tagline}”
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  {p.notes.map((n) => (
                    <span
                      key={n}
                      className="px-4 py-2 rounded-full border-2 font-sans text-sm text-ink"
                      style={{ borderColor: p.color }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <div className="mt-6 stamp" style={{ color: p.color }}>
                  Kahawa Kama Kawa
                </div>
              </div>

              {/* Perforated recommendation stub */}
              <div className="ticket-edge bg-white p-6 sm:p-8 text-center">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-bronze-deep mb-2">
                  Kikombe chako
                </p>
                <p className="font-sans font-medium text-ink text-lg">
                  {p.productName} — {p.brew}
                </p>
                <p className="font-display font-light text-enzi-db text-2xl mt-1">{personalityPrice(p)}</p>

                <label className="block mt-6 mb-2 font-sans text-sm text-ink/60" htmlFor="safari-name">
                  Andika jina lako
                </label>
                <input
                  id="safari-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jina lako"
                  className="w-full max-w-xs mx-auto px-4 py-3 border-2 border-bronze-deep/30 focus:border-enzi-db focus:outline-none font-sans text-center"
                />

                <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 mt-6">
                  <a
                    href={waLink(orderMsg)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-press inline-flex items-center justify-center px-6 py-4 bg-hze-teal text-white font-sans font-medium rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
                  >
                    Agiza kwa WhatsApp
                  </a>
                  <button
                    onClick={() => setCardOpen(true)}
                    className="btn-press inline-flex items-center justify-center px-6 py-4 bg-enzi-db text-white font-sans font-medium rounded-full hover:bg-bronze-deep transition-colors min-h-[56px]"
                  >
                    Generate my Safari ya Ladha card
                  </button>
                  <button
                    onClick={restart}
                    className="btn-press inline-flex items-center justify-center px-6 py-4 border-2 border-bronze-deep/30 text-ink font-sans font-medium rounded-full hover:border-enzi-db transition-colors min-h-[56px]"
                  >
                    Anza tena
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kahawa fact toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-ink text-cream-aged font-sans text-sm sm:text-base px-5 py-3 rounded-full shadow-lg max-w-[90vw] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share-card modal */}
      <AnimatePresence>
        {cardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
            onClick={() => setCardOpen(false)}
          >
            <motion.div
              initial={reduceMotion ? undefined : { scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: easeSoft }}
              className="bg-cream-aged max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4
                  className="uppercase text-ink text-2xl"
                  style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                >
                  Kadi yako
                </h4>
                <button
                  onClick={() => setCardOpen(false)}
                  aria-label="Funga"
                  className="w-12 h-12 flex items-center justify-center text-ink hover:text-enzi-db text-2xl"
                >
                  ×
                </button>
              </div>
              <canvas
                ref={canvasRef}
                className="w-full h-auto border border-bronze-deep/20"
                aria-label={`Kadi ya ${p.name}`}
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={downloadCard}
                  className="btn-press px-4 py-3 bg-enzi-db text-white font-sans font-medium text-sm rounded-full hover:bg-bronze-deep transition-colors min-h-[48px]"
                >
                  Download PNG
                </button>
                <button
                  onClick={shareCard}
                  className="btn-press px-4 py-3 bg-hze-teal text-white font-sans font-medium text-sm rounded-full hover:bg-[#236458] transition-colors min-h-[48px]"
                >
                  Share to WhatsApp
                </button>
                <button
                  onClick={copyCard}
                  className="btn-press px-4 py-3 bg-ink text-cream-aged font-sans font-medium text-sm rounded-full hover:bg-black transition-colors min-h-[48px]"
                >
                  Copy image
                </button>
                <button
                  onClick={() => {
                    setCardOpen(false);
                    restart();
                  }}
                  className="btn-press px-4 py-3 border-2 border-bronze-deep/30 text-ink font-sans font-medium text-sm rounded-full hover:border-enzi-db transition-colors min-h-[48px]"
                >
                  Retake quiz
                </button>
              </div>
              {copied && (
                <p role="status" className="mt-3 text-center font-sans text-sm text-hze-teal">
                  {copied}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
