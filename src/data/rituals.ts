// Kahawa Kama Kawa — the coffee ritual (subscription) page.
//
// Content and the quiz engine live here so the page component stays a view.
// The quiz is adaptive: answering "It's an office, actually" ends the flow
// early, and "Same coffee, always" adds a coffee-picker question.

// ---------------------------------------------------------------------------
// Coffees
// ---------------------------------------------------------------------------

export interface Coffee {
  name: string;
  notes: string;
  /** Price per 250g, TZS. */
  price: number;
}

export const COFFEES: Coffee[] = [
  { name: "Amka", notes: "apricot, citrus zest, caramel", price: 18000 },
  { name: "Nguvu", notes: "milk chocolate, caramel, smooth", price: 20000 },
  { name: "Tunu", notes: "stone fruit, chocolate, full body", price: 25000 },
];

const PRICE_BY_COFFEE: Record<string, number> = Object.fromEntries(
  COFFEES.map((c) => [c.name, c.price]),
);

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

export const HOW_IT_WORKS = [
  {
    step: "01",
    color: "#2B7A6E",
    title: "Find your coffee",
    detail:
      "Take Safari ya Ladha, or pick the bag you already love. Amka. Nguvu. Tunu.",
  },
  {
    step: "02",
    color: "#B83528",
    title: "Tell us your rhythm",
    detail: "How much. How often. How you brew. Four questions, one minute.",
  },
  {
    step: "03",
    color: "#C06030",
    title: "We roast. You drink.",
    detail:
      "Roasted to order the week it ships. Pickup at Victoria, or delivery across Dar.",
  },
] as const;

// ---------------------------------------------------------------------------
// The three rituals
// ---------------------------------------------------------------------------

export interface RitualPlan {
  name: string;
  english: string;
  /** Header band background. */
  band: string;
  /** Bullet marker colour. */
  accent: string;
  blurb: string;
  points: [string, string, string];
  price: string;
}

export const RITUAL_PLANS: RitualPlan[] = [
  {
    name: "Kawaida Yangu",
    english: "The regular",
    band: "#2B7A6E",
    accent: "#2B7A6E",
    blurb: "Your coffee. Your schedule. Replenished before it runs out.",
    points: [
      "The same bag you love, on repeat",
      "Grind matched to your brew method",
      "WhatsApp reminder before each delivery",
    ],
    price: "From TZS 18,000 per delivery",
  },
  {
    name: "Nishangaze",
    english: "Surprise me",
    band: "#B83528",
    accent: "#B83528",
    blurb:
      "We choose for you. New origins and seasonal lots, matched to your profile.",
    points: [
      "A different Tanzanian lot each delivery",
      "Tasting card with every bag",
      "First access to microlots and releases",
    ],
    price: "From TZS 20,000 per delivery",
  },
  {
    name: "Kawaida ya Ofisi",
    english: "For teams",
    band: "#1C1408",
    accent: "#C06030",
    blurb: "Built for offices. Coffee that shows up before Monday does.",
    points: [
      "Higher volumes, sized to your team",
      "Simple invoicing, one contact person",
      "Brew training for the office kit",
    ],
    price: "Priced by volume",
  },
];

// ---------------------------------------------------------------------------
// Pricing column
// ---------------------------------------------------------------------------

export const PAYMENT_MODES = [
  {
    title: "LIPA KILA DELIVERY",
    detail:
      "We remind you on WhatsApp, you pay by mobile money. No standing debit.",
  },
  {
    title: "PREPAY 3 RITUALS",
    detail:
      "Three deliveries, one payment. Good for gifts and forgetful people.",
  },
  {
    title: "AUTO-RENEW",
    detail: "Set it once, forget it exists. For the fully committed.",
  },
];

// ---------------------------------------------------------------------------
// WhatsApp remote
// ---------------------------------------------------------------------------

export const REMOTE_COMMANDS = [
  { word: "SKIP", color: "#3A9585", detail: "Skip the next delivery. It waits." },
  { word: "PAUSE", color: "#C9A87A", detail: "Stop everything until you say otherwise." },
  { word: "SWAP", color: "#C06030", detail: "Change the coffee. Amka to Tunu, done." },
  { word: "MORE", color: "#EDE5CF", detail: "Bigger bag, or more often. Guests happen." },
  { word: "LESS", color: "#B83528", detail: "Smaller, or slower. Also fine." },
];

export const REMOTE_THREAD: { from: "user" | "hze"; text: string }[] = [
  { from: "user", text: "SKIP" },
  { from: "hze", text: "Sawa. The 3 October delivery is skipped. Next one: 24 October." },
  { from: "user", text: "SWAP to Tunu" },
  { from: "hze", text: "Done — Tunu, 500g, every 3 weeks. Same rhythm, new cup." },
  { from: "hze", text: "Karibu kwenye harakati." },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
  /** Accent for the card's index number. */
  color: string;
  /** The answer in three words, for readers who are skimming. */
  short: string;
}

export const RITUAL_FAQ: FaqItem[] = [
  {
    q: "When is the coffee roasted?",
    a: "To order, at the roastery, the same week your delivery ships. The roast date is on the bag.",
    color: "#2B7A6E",
    short: "The week it ships",
  },
  {
    q: "Where do you deliver?",
    a: "Across Dar es Salaam, included in the price. Elsewhere in Tanzania — message us and we will work it out.",
    color: "#B83528",
    short: "All of Dar, free",
  },
  {
    q: "How do I pay?",
    a: "Mobile money per delivery after a WhatsApp reminder, prepay three deliveries at once, or auto-renew. Your choice, changeable anytime.",
    color: "#C06030",
    short: "Mobile money",
  },
  {
    q: "Can I change coffee, size, or timing?",
    a: "One WhatsApp message: SWAP, MORE, or LESS. It applies from the next delivery.",
    color: "#B37542",
    short: "One message",
  },
  {
    q: "What if I travel?",
    a: "PAUSE. The ritual waits for you. Safari njema.",
    color: "#7A4E1E",
    short: "It waits for you",
  },
  {
    q: "What if I want to stop?",
    a: "Then you stop. Reply STOP. No forms, no fees, no guilt trip.",
    color: "#1B5248",
    short: "Then you stop",
  },
];

export const FAQ_MESSAGE =
  "Habari HZE! I have a question about the Coffee Ritual that isn't on the page.";

// ---------------------------------------------------------------------------
// The rhythm quiz
// ---------------------------------------------------------------------------

export type AnswerKey = "brew" | "drinkers" | "cups" | "style" | "coffee";

export type Answers = Partial<Record<AnswerKey, string>>;

export interface Question {
  key: AnswerKey;
  title: string;
  sub: string;
  options: { label: string; note?: string }[];
}

export const OFFICE_ANSWER = "It's an office, actually";
export const SAME_COFFEE_ANSWER = "Same coffee, always";

/**
 * The question list for a given set of answers. Length changes as answers come
 * in, which is why the progress dots and "question N of M" read off this.
 */
export const questionsFor = (answers: Answers): Question[] => {
  const questions: Question[] = [
    {
      key: "brew",
      title: "How do you brew?",
      sub: "We match roast and grind to the method.",
      options: [
        { label: "Espresso" },
        { label: "Pour-over" },
        { label: "French press" },
        { label: "Cold brew" },
      ],
    },
    {
      key: "drinkers",
      title: "Who drinks it?",
      sub: "Coffee drinkers in the house.",
      options: [
        { label: "Just me" },
        { label: "Two of us" },
        { label: "Three or more" },
        { label: OFFICE_ANSWER },
      ],
    },
    {
      key: "cups",
      title: "Cups a day, between you?",
      sub: "Rough is fine. We build in a buffer.",
      options: [
        { label: "One" },
        { label: "Two" },
        { label: "Three or four" },
        { label: "Five or more" },
      ],
    },
  ];

  // An office skips the personal-taste branch — volume and invoicing are the
  // real questions, and those happen on WhatsApp.
  if (answers.drinkers === OFFICE_ANSWER) return questions;

  questions.push({
    key: "style",
    title: "Familiar or new?",
    sub: "This decides your ritual.",
    options: [
      { label: SAME_COFFEE_ANSWER, note: "Kawaida Yangu — your regular, on repeat" },
      { label: "Surprise me", note: "Nishangaze — we choose new lots for you" },
    ],
  });

  if (answers.style === SAME_COFFEE_ANSWER) {
    questions.push({
      key: "coffee",
      title: "Which coffee?",
      sub: "Price per 250g.",
      options: COFFEES.map((c) => ({
        label: c.name,
        note: `${c.notes.split(",").slice(0, 2).join(",")} — TZS ${c.price.toLocaleString("en-US")}`,
      })),
    });
  }

  return questions;
};

export interface RitualResult {
  name: string;
  color: string;
  tag: string;
  rows: { k: string; v: string }[];
  ctaLabel: string;
  /** Prefilled WhatsApp message. */
  message: string;
}

const CUPS_PER_DAY: Record<string, number> = {
  One: 1,
  Two: 2,
  "Three or four": 3.5,
  "Five or more": 5,
};

/** Grams per cup — the roastery's working figure. */
const GRAMS_PER_CUP = 20;

const BAG_SIZES = [250, 500, 1000, 2000, 3000, 5000];

const formatSize = (grams: number) =>
  grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;

const formatTzs = (amount: number) => `TZS ${amount.toLocaleString("en-US")}`;

/**
 * Turn the answers into a named ritual: a bag size that lasts about three
 * weeks, the delivery cadence that implies, and the price for that bag.
 */
export const computeResult = (answers: Answers): RitualResult => {
  const office = answers.drinkers === OFFICE_ANSWER;
  const surprise = answers.style === "Surprise me";
  const brew = answers.brew ?? "your method";

  const cups = CUPS_PER_DAY[answers.cups ?? ""] ?? 2;
  const daily = cups * GRAMS_PER_CUP;
  // Smallest bag that covers roughly three weeks of drinking.
  const size = BAG_SIZES.find((s) => s >= daily * 21) ?? 5000;
  const weeks = Math.max(1, Math.min(4, Math.floor(size / daily / 7)));
  const rhythm = `Every ${weeks === 1 ? "week" : `${weeks} weeks`}`;
  const sizeLabel = formatSize(size);
  const bags = size / 250;

  if (office) {
    return {
      name: "Kawaida ya Ofisi",
      color: "#C06030",
      tag: "Coffee that shows up before Monday does.",
      rows: [
        { k: "Team", v: `${answers.cups ?? "A few"} cups a day` },
        { k: "Coffee", v: "Your pick, or ours" },
        { k: "Volume", v: `We size it together, from ${sizeLabel}` },
        { k: "Pricing", v: "By volume — quoted on WhatsApp" },
      ],
      ctaLabel: "Talk office coffee on WhatsApp",
      message: `Habari HZE! We're interested in Kawaida ya Ofisi — about ${(
        answers.cups ?? "several"
      ).toLowerCase()} cups a day, brewed by ${brew}. Can we talk?`,
    };
  }

  if (surprise) {
    const from = formatTzs(bags * 20000);
    return {
      name: "Nishangaze",
      color: "#B83528",
      tag: "We choose. You taste.",
      rows: [
        { k: "Coffee", v: "Roaster's pick — new lots, matched to you" },
        { k: "Bag", v: `${sizeLabel} · ${brew} grind or whole bean` },
        { k: "Rhythm", v: rhythm },
        { k: "Per delivery", v: `from ${from}` },
      ],
      ctaLabel: "Start my ritual on WhatsApp",
      message: `Habari HZE! I'd like to start Nishangaze — ${sizeLabel}, ${rhythm.toLowerCase()}, brewed by ${brew}. Surprise me. My name is ___`,
    };
  }

  const coffee = answers.coffee ?? "Nguvu";
  const price = formatTzs(bags * (PRICE_BY_COFFEE[coffee] ?? 20000));

  return {
    name: "Kawaida Yangu",
    color: "#2B7A6E",
    tag: "Your coffee. Your rhythm.",
    rows: [
      { k: "Coffee", v: answers.coffee ?? "Your regular" },
      { k: "Bag", v: `${sizeLabel} · ${brew} grind or whole bean` },
      { k: "Rhythm", v: rhythm },
      { k: "Per delivery", v: price },
    ],
    ctaLabel: "Start my ritual on WhatsApp",
    message: `Habari HZE! I'd like to start Kawaida Yangu — ${coffee}, ${sizeLabel}, ${rhythm.toLowerCase()} (${price} per delivery), brewed by ${brew}. My name is ___`,
  };
};

export const BARISTA_MESSAGE =
  "Habari HZE! I have a question about the Coffee Ritual (Kahawa Kama Kawa).";

export const GIFT_MESSAGE =
  "Habari HZE! I'd like to gift a ritual — Mtunuku Mtu Kahawa, three months of deliveries. Can you help me set it up?";
