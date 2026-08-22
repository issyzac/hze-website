/**
 * Kilimanjaro — the seasonal lot behind Nguvu.
 *
 * Condensed from the HZE field journal, Toleo № 01. The journal runs five
 * stops from seed to cup; the site keeps the spine of it — the proverb, the
 * descent, and the closing admission — and leaves the long form to the journal.
 */

/** The journal's own ink-and-cream palette, distinct from Mirumbani's green. */
export const KILI_PALETTE = {
  /** Ground the journal prints on. */
  ink: "#2E2010",
  /** Deeper ink for the foot of the section. */
  inkDeep: "#1C1408",
  /** Type on ink. */
  cream: "#EDE5CF",
  /** Kituo numbers and rules. */
  gold: "#C18C5B",
  /** Nguvu's own teal, carried through from the bag. */
  teal: "#2B7A6E",
  /** Used once, for the proverb. */
  red: "#B83528",
} as const;

/** The proverb the journal is built around. */
export const KILI_PROVERB = {
  swahili: "Haraka haraka haina kahawa.",
  english: "The coffee is ready when the coffee is ready.",
} as const;

export const KILI_INTRO: string[] = [
  "Three coffee people went up a mountain. We held seedlings like newborns, raked drying cherries with considerably more confidence than competence, and asked the people who do this every day far too many questions.",
  "Underneath the performance was a serious question: what exactly are we asking you to taste when we write Kilimanjaro on a bag? So we followed the coffee backwards — from the cup to the bean to the cherry to the tree to the seed.",
];

export type Kituo = {
  n: string;
  altitude: string;
  swahili: string;
  english: string;
  line: string;
};

/** The five stops of the descent, each cut to a line. */
export const KILI_STOPS: Kituo[] = [
  {
    n: "01",
    altitude: "1,800 m",
    swahili: "Shule ya Mbegu",
    english: "The seed school",
    line: "It begins with someone sitting on the ground, pressing a seed into volcanic earth. Before flavour, there is record keeping: N39 · March 2026 · 1,548 seedlings.",
  },
  {
    n: "02",
    altitude: "1,700 m",
    swahili: "Kukua Polepole",
    english: "Growing, slowly",
    line: "You cannot motivational-speech a seedling into maturity. Roots first, then height. The plant does not care about your urgency.",
  },
  {
    n: "03",
    altitude: "1,500 m",
    swahili: "Chuma na Maji",
    english: "Iron and water",
    line: "Harvest arrives red. Water carries the cherry through the channels and the mill strips away everything that will not reach your cup. Most of coffee is subtraction.",
  },
  {
    n: "04",
    altitude: "1,450 m",
    swahili: "Jua na Subira",
    english: "Sun and patience",
    line: "Teams of up to a hundred people turn the beds until the coffee reaches 10.5% moisture. Then the lab: AA, AB, Peaberry — and the trays that do not care about anyone's feelings.",
  },
  {
    n: "05",
    altitude: "1,400 m",
    swahili: "Rudi Ardhini",
    english: "Back to the soil",
    line: "Pulp and parchment feed the vermicompost; mill water is recycled. The route does not end, it loops. Mbolea hurudi Kituo 01.",
  },
];

export type KiliPhoto = { src: string; alt: string; fig: string; caption: string };

/** The journal's own figures, in the order the descent runs. */
export const KILI_PHOTOS: KiliPhoto[] = [
  {
    src: "/assets/images/kilimanjaro/midwives.jpg",
    alt: "Nursery workers kneeling over long seed beds under shade netting, pressing coffee seeds into volcanic soil",
    fig: "FIG. 02",
    caption: "The legends responsible for the first step. The midwives.",
  },
  {
    src: "/assets/images/kilimanjaro/founders-nursery.jpg",
    alt: "Three HZE founders standing arm in arm among thousands of coffee seedlings under nursery shade netting",
    fig: "FIG. 04",
    caption:
      "Three of four HZE founders attempting to look useful — Ben Owden, Isaya Mollel, Fred Sabuni.",
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
  lead: "We roast the coffee. We brew the coffee. We serve the coffee.",
  turn: "But we do not begin the coffee.",
  tail: "By the time it reaches us, most of its story has already happened. Our job is not to overwrite that story. It is to carry it well.",
};

/** The estate, stated plainly. */
export const KILI_FACTS: { label: string; value: string }[] = [
  { label: "Mwinuko · Altitude", value: "1,400–1,800 m, southern slopes" },
  { label: "Aina · Varieties", value: "N39 · KP · Batian" },
  { label: "Mchakato · Process", value: "Washed · sun-dried, ~14 days" },
  { label: "Shamba · Estate", value: "565 ha, over a million trees" },
];
