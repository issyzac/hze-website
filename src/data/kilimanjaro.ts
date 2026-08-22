/**
 * Kilimanjaro — the seasonal lot behind Nguvu.
 *
 * Condensed from the HZE field journal, Toleo № 01. The journal runs five
 * stops from seed to cup; the site keeps only the proverb, a few figures and
 * the closing admission, and leaves the long form to the journal.
 */

/** The journal's own ink-and-cream palette, distinct from Mirumbani's green. */
export const KILI_PALETTE = {
  /** Ground the journal prints on. */
  ink: "#2E2010",
  /** Type on ink. */
  cream: "#EDE5CF",
  /** Figure numbers and rules. */
  gold: "#C18C5B",
} as const;

/** The proverb the journal is built around. */
export const KILI_PROVERB = {
  swahili: "Haraka haraka haina kahawa.",
  english: "The coffee is ready when the coffee is ready.",
} as const;

/** Where the coffee actually comes from, named. */
export const KILI_ESTATE = {
  name: "Kilimanjaro Coffee Plantation",
  where: "Southern slopes · Kilimanjaro, Tanzania",
};

export const KILI_INTRO =
  "This coffee grows at Kilimanjaro Coffee Plantation, on the southern slopes — coffee since the 1950s, inside a landscape that has grown it for a century. Three of us went up to see it, and came back with one question answered: what we are asking you to taste when we write Kilimanjaro on a bag.";

export type KiliPhoto = { src: string; alt: string; fig: string; caption: string };

/** The journal's own figures, in the order the descent runs. */
export const KILI_PHOTOS: KiliPhoto[] = [
  {
    src: "/assets/images/kilimanjaro/midwives.jpg",
    alt: "Nursery workers kneeling over long seed beds under shade netting, pressing coffee seeds into volcanic soil",
    fig: "FIG. 02",
    caption: "The midwives. The first step.",
  },
  {
    src: "/assets/images/kilimanjaro/founders-nursery.jpg",
    alt: "Three HZE founders standing arm in arm among thousands of coffee seedlings under nursery shade netting",
    fig: "FIG. 04",
    caption: "Ben Owden, Isaya Mollel, Fred Sabuni — looking useful.",
  },
  {
    src: "/assets/images/kilimanjaro/turning-cherries.jpg",
    alt: "Three men raking and turning a vast bed of drying red coffee cherries inside a covered drying house",
    fig: "FIG. 08",
    caption: "Performative coffee bros, briefly employed.",
  },
  {
    src: "/assets/images/kilimanjaro/grading-lab.jpg",
    alt: "Men at a grading bench sorting green coffee across stacked screens in the estate lab",
    fig: "FIG. 12",
    caption: "The lab. Opinions meet evidence.",
  },
];

/** The admission the journal closes on. */
export const KILI_CODA = {
  turn: "We roast the coffee. But we do not begin the coffee.",
  tail: "Most of its story has already happened by the time it reaches us. Our job is to carry it well.",
};

/** The estate, stated plainly. */
export const KILI_FACTS: { label: string; value: string }[] = [
  { label: "Mwinuko · Altitude", value: "1,400–1,800 m, southern slopes" },
  { label: "Aina · Varieties", value: "N39 · KP · Batian" },
  { label: "Mchakato · Process", value: "Washed · sun-dried" },
  { label: "Shamba · Estate", value: "Kilimanjaro Coffee Plantation" },
  { label: "Ukubwa · Scale", value: "565 ha · over a million trees" },
];
