/**
 * Mirumbani — the seasonal Kigoma lot.
 *
 * Copy and palette come from the "Chini ya Mti wa Mrumba" label concept and the
 * family's own account of the estates, so the site and the bag say the same
 * thing in the same words. Colours are named the way the concept names them,
 * not by hex, because the label prints them.
 */

/** Rangi · found in Kigoma. */
export const MIRUMBANI_PALETTE = {
  /** The field the label prints on. */
  kigomaGreen: "#2E4B34",
  /** Bark, and the type set on cream. */
  mrumbaBrown: "#5C3A21",
  /** Hills held at a distance behind the arch. */
  hillOlive: "#74804B",
  /** Ripe cherry — the accent, used sparingly. */
  cherryRed: "#B5402F",
  /** The arch itself. */
  kangaCream: "#F2E8D5",
  /** Lake Tanganyika, kept to a thin rule along the bottom edge. */
  ziwaTeal: "#2E7D6B",
} as const;

/** The lament the coffee is named for. */
export const MIRUMBANI_SONG = {
  swahili: "Ningekuwa kwetu Mirumbani, ningemlilia mama.",
  english: "If I were home in Mirumbani, I would cry for my mother.",
} as const;

export type MirumbaniPhoto = {
  src: string;
  alt: string;
  caption: string;
  /** Portraits get the arch frame; landscapes run full-width in the story. */
  orientation: "portrait" | "landscape";
};

/** The portrait held in the arch, above the fold of the story. */
export const MIRUMBANI_PORTRAIT: MirumbaniPhoto = {
  src: "/assets/images/mirumbani/family-cherries.jpg",
  alt: "Zitto crouching among the coffee with his daughters Josina and Alaa, looking closely at green cherries on a young tree",
  caption: "Zitto with Josina and Alaa, looking at the cherries in Kigoma.",
  orientation: "landscape",
};

/**
 * The story, told in order. Each beat may carry a photo, which the component
 * places alongside the prose.
 */
export type StoryBeat = {
  id: string;
  /** Swahili kicker · English gloss, set as the beat's eyebrow. */
  eyebrow: string;
  paragraphs: string[];
  photo?: MirumbaniPhoto;
};

export const MIRUMBANI_BEATS: StoryBeat[] = [
  {
    id: "wimbo",
    eyebrow: "Wimbo · The song",
    paragraphs: [
      "There is a song in Kigoma that almost disappeared. It rises from a long history of exploitation and the movement of people — sung by the Waha through the eras of slavery and forced labour migration, when home became a word for longing. Over time, the song began to be lost. Zitto's mother sang it to him when he was a child; today he sings it to his daughters, Josina and Alaa. When elders in Kigoma hear the name Mirumbani, the old memories return. This coffee carries the song's name in homage to the rich but haunting history of Kigoma and its people.",
    ],
    photo: {
      src: "/assets/images/mirumbani/daughters-rows.jpg",
      alt: "Josina and Alaa walking away from the camera between rows of young coffee trees on red soil",
      caption: "Josina and Alaa in the young rows.",
      orientation: "landscape",
    },
  },
  {
    id: "mwanzo",
    eyebrow: "Mwanzo · How it began",
    paragraphs: [
      "Zitto was born and raised in Kigoma. While serving as the area's Member of Parliament, he bought a small farm in Matyazo and joined the RUMAKO primary cooperative — and through his bond with home, Anna and the children were naturally drawn in; Kigoma is now home for the whole family.",
      "After years of public service for him and development work for her, the two coffee drinkers began asking where they would retire. One morning at home, over coffee, they talked about the small farm lying idle in Matyazo and decided to work on it. Why not Mirumbani Kahawa? Here they are.",
    ],
    photo: {
      src: "/assets/images/mirumbani/anna-zitto-ridge.jpg",
      alt: "Anna and Zitto standing on a ridge above the coffee, Zitto pointing across the valley",
      caption: "Anna and Zitto above the Matyazo hills.",
      orientation: "landscape",
    },
  },
  {
    id: "mashamba",
    eyebrow: "Mashamba · Two blocks, two daughters",
    paragraphs: [
      "The estates grow in two blocks, each named for a daughter — and each daughter named for a woman her parents admired and spoke of often. The Josina Block in Matyazo, growing slowly since 2007, honours Josina Machel, the Mozambican liberation heroine. The newer, more extensive Alaa Block in Kisozi honours Alaa Salah, the Sudanese democracy activist.",
      "Zitto and Anna hope the estates will always remind their daughters to pursue what they love, no matter how difficult — and that the pursuit comes with freedom, justice, and responsibility.",
    ],
    photo: {
      src: "/assets/images/mirumbani/anna-zitto-field.jpg",
      alt: "Anna and Zitto walking together through a newly planted block of coffee, hills rising behind them",
      caption: "Walking the newer block at Kisozi.",
      orientation: "landscape",
    },
  },
  {
    id: "kazi",
    eyebrow: "Kazi · The work, and the first harvest",
    paragraphs: [
      "At 1,200–1,300 metres, the cherries are hand-picked, washed, and sun-dried on raised beds. Nothing hurried, nothing erased. Mrumba trees stand on both estates; at the family home in Kibingo, another marks the place where a former Mwami — a chief of the Waha — used to rest while visiting his people.",
      "The first harvest came in 2026: nine acres, around 900 kilograms of cherry, and one very proud journey carrying the first sample to the tasters. In the cup: red berry, sweet orange, brown sugar.",
    ],
    photo: {
      src: "/assets/images/mirumbani/zitto-drying-beds.jpg",
      alt: "Zitto lifting a handful of drying parchment coffee from a raised bed, rows of beds stretching behind him",
      caption: "Turning parchment on the raised beds.",
      orientation: "portrait",
    },
  },
];

/** A second portrait, paired with the last beat. */
export const MIRUMBANI_CHERRY_PHOTO: MirumbaniPhoto = {
  src: "/assets/images/mirumbani/zitto-cherries.jpg",
  alt: "Zitto crouching beside a spread of freshly picked red coffee cherries, letting a handful fall from his hand",
  caption: "Ripe cherry, hand-sorted before washing.",
  orientation: "portrait",
};

/** The vow the whole thing rests on. */
export const MIRUMBANI_VOW =
  "This coffee carries the song's name as a vow — Kigoma's identity will no longer travel anonymously.";

/** First-harvest facts, set as a small spec run under the story. */
export const MIRUMBANI_FACTS: { label: string; value: string }[] = [
  { label: "Mwinuko · Altitude", value: "1,200–1,300 m" },
  { label: "Mchakato · Process", value: "Washed · sun-dried on raised beds" },
  { label: "Ushirika · Cooperative", value: "RUMAKO, Matyazo" },
  { label: "Mavuno ya kwanza · First harvest", value: "2026 · nine acres · ~900 kg cherry" },
];

/** Closing line from the label. */
export const MIRUMBANI_CODA = ["Planted.", "Roasted.", "Remembered."];
