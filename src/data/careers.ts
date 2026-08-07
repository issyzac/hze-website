// Careers — open roles and the barista application.
//
// The application is data-driven: sections and fields are declared here and
// rendered generically by BaristaApplication, so adding or reordering a
// question never touches the component.

// ---------------------------------------------------------------------------
// Open roles
// ---------------------------------------------------------------------------

export interface Opening {
  id: string;
  title: string;
  swahili: string;
  positions: number;
  type: string;
  locations: string[];
  summary: string;
  /** Day-to-day work — mirrors the "willing to do" checklist in the form. */
  theWork: string[];
  /** Behaviours the application is actually assessing. */
  lookingFor: { title: string; detail: string }[];
  /** Hard requirements. */
  essentials: string[];
  /** Valuable but not required. */
  helpful: string[];
  process: { step: string; detail: string }[];
}

export const BARISTA_OPENING: Opening = {
  id: "barista",
  title: "Barista",
  swahili: "Mtengeneza Kahawa",
  positions: 2,
  type: "Full-time · shift-based",
  locations: ["HZE Victoria", "HZE Mbezi"],
  summary:
    "Two baristas, one for each café. You will make the coffee, hold the counter, and carry the standard on the days nobody is watching.",
  theWork: [
    "Preparing coffee and other drinks",
    "Serving customers",
    "Cleaning equipment",
    "Cleaning customer areas",
    "Checking and cleaning toilets",
    "Washing dishes",
    "Receiving and counting stock",
    "Handling payments",
    "Selling coffee bags and merchandise",
    "Supporting events",
    "Opening or closing the café",
    "Learning about coffee outside service hours when training is scheduled",
  ],
  lookingFor: [
    {
      title: "Dependable",
      detail:
        "You arrive before the doors open when you are scheduled, and the team never has to wonder whether you are coming.",
    },
    {
      title: "Curious",
      detail:
        "You have taught yourself something hard before. Correction lands as information, not insult.",
    },
    {
      title: "Warm with people",
      detail:
        "The last customer of the night gets the same care as the first — including the difficult ones.",
    },
    {
      title: "Takes ownership",
      detail:
        "You fix what is reasonable to fix, then tell the right person. You do not wait to be chased.",
    },
    {
      title: "Good in a team",
      detail:
        "Problems go to the person concerned, not to gossip and not to silent resentment.",
    },
  ],
  essentials: [
    "Legally eligible to work in Tanzania",
    "Comfortable serving customers in Kiswahili, English, or both",
    "Able to stand and move for most of a shift",
    "Available across early mornings, evenings, weekends, and public holidays",
    "Able to reach Victoria or Mbezi reliably",
  ],
  helpful: [
    "Espresso machine",
    "Grinder calibration",
    "Milk steaming & latte art",
    "V60 · Chemex · French Press",
    "Batch brew",
    "Coffee cupping",
    "POS / cashier systems",
  ],
  process: [
    { step: "Apply", detail: "This form — 10 to 15 minutes, in your own words." },
    { step: "Shortlist", detail: "We read every application. Shortlisted people are called." },
    { step: "Interview", detail: "A conversation at the café you applied to." },
    { step: "Practical", detail: "A hands-on assessment behind the bar. Training provided." },
  ],
};

export const OPENINGS: Opening[] = [BARISTA_OPENING];

// ---------------------------------------------------------------------------
// Application form model
// ---------------------------------------------------------------------------

export type FieldType =
  | "short"
  | "paragraph"
  | "email"
  | "tel"
  | "date"
  | "radio"
  | "checkbox"
  | "yesno"
  | "consent"
  | "referee";

export type AnswerValue = string | string[] | Record<string, string>;
export type Answers = Record<string, AnswerValue | undefined>;

export interface Field {
  id: string;
  /** Question number as shown to the applicant. */
  n: number;
  label: string;
  helper?: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** Adds an "Other" option with a free-text box. */
  allowOther?: boolean;
  /** Maximum number of checkboxes selectable. */
  maxSelect?: number;
  /** Every option must be selected for the answer to count (Q38). */
  requireAll?: boolean;
  placeholder?: string;
  /** Soft target used by the answer-strength meter on paragraphs. */
  strongWords?: number;
  showIf?: (a: Answers) => boolean;
}

export interface Section {
  id: string;
  title: string;
  swahili: string;
  /** Single emoji used as the section stamp. */
  stamp: string;
  blurb: string;
  note?: string;
  fields: Field[];
}

const hasExperience = (a: Answers) =>
  typeof a.experience_level === "string" && a.experience_level !== "No";

// NOTE: salary bands are placeholders — replace with HZE's approved structure.
export const SALARY_BANDS = [
  "TZS 250,000 – 350,000",
  "TZS 350,000 – 450,000",
  "TZS 450,000 – 600,000",
  "TZS 600,000 – 750,000",
  "I would prefer to discuss this at interview",
];

export const ESSENTIAL_DUTIES = BARISTA_OPENING.theWork;

export const SECTIONS: Section[] = [
  {
    id: "about",
    title: "About you",
    swahili: "Kuhusu wewe",
    stamp: "👋",
    blurb: "The basics. Nothing here is a test — we just need to be able to reach you.",
    fields: [
      { id: "full_name", n: 1, label: "Full name", type: "short", required: true, placeholder: "Jina lako kamili" },
      { id: "phone", n: 2, label: "Phone number", type: "tel", required: true, placeholder: "07XX XXX XXX" },
      { id: "email", n: 3, label: "Email address", type: "email", required: true, placeholder: "wewe@example.com" },
      {
        id: "area",
        n: 4,
        label: "Which area of Dar es Salaam do you currently live in?",
        helper: "Just the area or neighbourhood — no need for a full home address.",
        type: "short",
        required: true,
        placeholder: "e.g. Kimara, Mikocheni, Tegeta",
      },
      {
        id: "preferred_location",
        n: 5,
        label: "Which HZE location would be easier for you to reach?",
        type: "radio",
        required: true,
        options: ["Victoria", "Mbezi", "Either location", "I would need more information"],
      },
      { id: "eligible", n: 6, label: "Are you legally eligible to work in Tanzania?", type: "yesno", required: true },
      {
        id: "languages",
        n: 7,
        label: "What languages can you comfortably use when serving customers?",
        type: "checkbox",
        required: true,
        options: ["Kiswahili", "English"],
        allowOther: true,
      },
    ],
  },
  {
    id: "availability",
    title: "Availability and reliability",
    swahili: "Upatikanaji na uaminifu",
    stamp: "⏰",
    blurb: "Cafés live and die by who turns up. Be honest here — it helps both of us.",
    fields: [
      {
        id: "shifts",
        n: 8,
        label: "Which shifts are you available to work?",
        type: "checkbox",
        required: true,
        options: [
          "Early mornings",
          "Day shifts",
          "Evening shifts",
          "Weekends",
          "Public holidays",
          "Flexible across different shifts",
        ],
      },
      {
        id: "early_arrival",
        n: 9,
        label: "Are you able to arrive before the café opens when scheduled?",
        type: "radio",
        required: true,
        options: ["Yes", "Usually, depending on transport", "No"],
      },
      {
        id: "travel_mode",
        n: 10,
        label: "How would you normally travel to work?",
        type: "radio",
        required: true,
        options: ["Public transport", "Motorcycle", "Personal car", "Walking"],
        allowOther: true,
      },
      {
        id: "journey_time",
        n: 11,
        label: "How long would your typical journey to Victoria or Mbezi take?",
        type: "radio",
        required: true,
        options: ["Less than 30 minutes", "30–60 minutes", "60–90 minutes", "More than 90 minutes"],
      },
      { id: "start_date", n: 12, label: "When would you be available to start?", type: "date", required: true },
      {
        id: "employed",
        n: 13,
        label: "Are you currently employed?",
        type: "radio",
        required: true,
        options: ["No", "Yes, full-time", "Yes, part-time", "Self-employed"],
      },
      {
        id: "notice_period",
        n: 14,
        label: "What notice period would you need to give?",
        type: "radio",
        required: true,
        options: ["Immediately available", "One week", "Two weeks", "One month", "More than one month"],
      },
    ],
  },
  {
    id: "experience",
    title: "Experience and learning",
    swahili: "Uzoefu na kujifunza",
    stamp: "☕",
    blurb:
      "Coffee experience is valuable, but it is not the only thing we consider. How you learn matters more.",
    fields: [
      {
        id: "experience_level",
        n: 15,
        label: "Have you worked as a barista before?",
        type: "radio",
        required: true,
        options: ["No", "Less than 6 months", "6–12 months", "1–2 years", "More than 2 years"],
      },
      {
        id: "equipment",
        n: 16,
        label: "Which coffee equipment or methods have you used?",
        type: "checkbox",
        required: true,
        showIf: hasExperience,
        options: [
          "Espresso machine",
          "Grinder calibration",
          "French Press",
          "V60",
          "Chemex",
          "Batch brew",
          "Milk steaming and latte art",
          "Coffee cupping",
          "POS or cashier system",
          "None of these confidently",
        ],
      },
      {
        id: "previous_work",
        n: 17,
        label: "Where did you previously work, and what were your main responsibilities?",
        type: "paragraph",
        required: true,
        showIf: hasExperience,
        strongWords: 30,
      },
      {
        id: "skill_confidence",
        n: 18,
        label: "What is one barista skill you are confident in, and one you still need to improve?",
        type: "paragraph",
        required: true,
        showIf: hasExperience,
        strongWords: 30,
      },
      {
        id: "self_taught",
        n: 19,
        label: "Tell us about something difficult you taught yourself or learned at work.",
        helper: "A real example beats a description of yourself.",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "correction_reaction",
        n: 20,
        label: "When someone corrects your work, what is your usual first reaction?",
        type: "radio",
        required: true,
        options: [
          "I listen, ask questions, and try again",
          "I explain why I did it that way",
          "I feel uncomfortable but eventually adjust",
          "I prefer to be left to work independently",
          "It depends on how the feedback is given",
        ],
      },
      {
        id: "feedback_example",
        n: 21,
        label: "Give an example of feedback that helped you improve.",
        type: "paragraph",
        required: true,
        strongWords: 30,
      },
    ],
  },
  {
    id: "service",
    title: "Behind the counter",
    swahili: "Nyuma ya kaunta",
    stamp: "🤝",
    blurb: "Five real shifts. There is no trick answer — tell us what you would actually do.",
    fields: [
      {
        id: "busy_complaint",
        n: 22,
        label:
          "A customer says their cappuccino does not taste right, but the café is very busy. What would you do?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "closing_regular",
        n: 23,
        label:
          "A regular customer walks in while you are cleaning and preparing to close. What would excellent service look like?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "unknown_question",
        n: 24,
        label: "A customer asks a question about coffee that you do not know how to answer. What would you say?",
        type: "radio",
        required: true,
        options: [
          "Give the most likely answer so they do not lose confidence",
          "Tell them you are not sure, then ask a colleague or find the correct answer",
          "Change the subject",
          "Tell them it is not part of your role",
        ],
      },
      {
        id: "triage",
        n: 25,
        label:
          "Two customers are waiting, the milk has run out at your station, and your teammate appears overwhelmed. What do you do first?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "rude_customer",
        n: 26,
        label: "A customer is rude to you. How would you respond?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
    ],
  },
  {
    id: "ownership",
    title: "Ownership and teamwork",
    swahili: "Uwajibikaji na ushirikiano",
    stamp: "🧹",
    blurb: "The part of the job nobody claps for.",
    fields: [
      {
        id: "toilet",
        n: 27,
        label: "You notice that the café toilet is not clean, but it is not your assigned area. What do you do?",
        type: "radio",
        required: true,
        options: [
          "Ignore it because it is not my responsibility",
          "Tell someone responsible and continue working",
          "Fix what I can immediately and inform the relevant person",
          "Wait until the manager notices",
        ],
      },
      {
        id: "shift_end",
        n: 28,
        label:
          "Your shift is ending, but the next team has not arrived and there are unfinished tasks. What would you do?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "initiative",
        n: 29,
        label: "Tell us about a time you noticed a problem and solved it without waiting to be told.",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "work_style",
        n: 30,
        label: "Which statement sounds most like you?",
        type: "radio",
        required: true,
        options: [
          "I perform best when instructions are very detailed",
          "I like understanding the standard, then taking responsibility for delivering it",
          "I prefer working alone because teams slow me down",
          "I work hardest when a manager is watching",
          "I enjoy improving how work is done",
        ],
      },
      {
        id: "late_teammate",
        n: 31,
        label: "A teammate repeatedly arrives late, making your work harder. What would you do?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
    ],
  },
  {
    id: "values",
    title: "HZE values and motivation",
    swahili: "Maadili na motisha",
    stamp: "✊",
    blurb:
      "We are building Tanzania's most trusted coffee movement — one cup, one customer, one community at a time.",
    fields: [
      {
        id: "why_hze",
        n: 32,
        label: "Why do you want to work at Harakati za ENZI?",
        helper: "Needing work is normal and honest. Tell us what else draws you here.",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "interests",
        n: 33,
        label: "Which part of working in a café interests you most?",
        helper: "Choose up to two.",
        type: "checkbox",
        required: true,
        maxSelect: 2,
        options: [
          "Learning coffee craft",
          "Serving and connecting with customers",
          "Working as part of a team",
          "Selling coffee and recommending products",
          "Events and community activities",
          "Growing into leadership",
          "Earning stable income",
          "Learning hospitality and business skills",
        ],
      },
      {
        id: "people_over_profit",
        n: 34,
        label: "HZE believes in “People over Profit.” What could that look like during an ordinary café shift?",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "movement",
        n: 35,
        label: "HZE is “a movement, not just a brand.” What do you think that means?",
        helper: "There is no single correct answer. Say it in your own words.",
        type: "paragraph",
        required: true,
        strongWords: 40,
      },
      {
        id: "best_workplace",
        n: 36,
        label: "What kind of workplace helps you do your best work?",
        type: "paragraph",
        required: true,
        strongWords: 30,
      },
      {
        id: "difficult_behaviour",
        n: 37,
        label: "What behaviour from teammates makes work difficult for you?",
        type: "paragraph",
        required: true,
        strongWords: 30,
      },
    ],
  },
  {
    id: "practical",
    title: "Practical expectations",
    swahili: "Matarajio halisi",
    stamp: "📋",
    blurb: "So there are no surprises on day one.",
    note: "Barista work includes cleaning, preparation, stock care, customer service, sales, and teamwork — not only making coffee.",
    fields: [
      {
        id: "duties",
        n: 38,
        label: "Which parts of café work are you willing to do?",
        helper: "All of these are part of the role. Select every one you are willing to do.",
        type: "checkbox",
        required: true,
        requireAll: true,
        options: ESSENTIAL_DUTIES,
      },
      {
        id: "standing",
        n: 39,
        label: "Are you comfortable standing and moving for much of your shift?",
        type: "yesno",
        required: true,
      },
      {
        id: "salary",
        n: 40,
        label: "What monthly salary range are you expecting?",
        helper: "Gross monthly salary. This is a conversation, not a filter.",
        type: "radio",
        required: true,
        options: SALARY_BANDS,
      },
      {
        id: "commitments",
        n: 41,
        label: "Do you have any planned commitments in the next six months that could affect your availability?",
        helper:
          "Studies, travel, family obligations — anything scheduled. You do not need to share private medical information. Write “None” if there are none.",
        type: "paragraph",
        required: true,
      },
    ],
  },
  {
    id: "references",
    title: "References and declaration",
    swahili: "Wadhamini na tamko",
    stamp: "🖊️",
    blurb: "Last step. One person who can speak for how you work.",
    fields: [
      {
        id: "referee",
        n: 42,
        label: "Provide one professional or character referee.",
        type: "referee",
        required: true,
      },
      {
        id: "may_contact",
        n: 43,
        label: "May we contact this person during the recruitment process?",
        type: "yesno",
        required: true,
      },
      {
        id: "confirm_accurate",
        n: 44,
        label: "I confirm that the information I have provided is accurate.",
        type: "consent",
        required: true,
      },
      {
        id: "understand_no_guarantee",
        n: 45,
        label: "I understand that completing this form does not guarantee employment.",
        type: "consent",
        required: true,
      },
    ],
  },
];

export const REFEREE_PARTS = [
  { key: "name", label: "Full name", placeholder: "Jina kamili" },
  { key: "relationship", label: "Relationship to you", placeholder: "e.g. Former supervisor" },
  { key: "organisation", label: "Organisation", placeholder: "Where they work" },
  { key: "phone", label: "Phone number", placeholder: "07XX XXX XXX" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const OTHER_SUFFIX = "__other";

export const visibleFields = (section: Section, answers: Answers): Field[] =>
  section.fields.filter((f) => !f.showIf || f.showIf(answers));

export const allVisibleFields = (answers: Answers): Field[] =>
  SECTIONS.flatMap((s) => visibleFields(s, answers));

export const countWords = (value: string): number =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

/** Returns an error message, or null when the answer is acceptable. */
export const validateField = (field: Field, answers: Answers): string | null => {
  const value = answers[field.id];

  if (field.type === "referee") {
    const parts = (value as Record<string, string>) || {};
    const missing = REFEREE_PARTS.filter((p) => !parts[p.key]?.trim());
    if (missing.length) return `Please complete: ${missing.map((m) => m.label.toLowerCase()).join(", ")}.`;
    return null;
  }

  if (field.type === "consent") {
    return value === "yes" ? null : "Please tick to continue.";
  }

  if (field.type === "checkbox") {
    const list = (value as string[]) || [];
    const otherText = (answers[field.id + OTHER_SUFFIX] as string) || "";
    if (field.requireAll && field.options) {
      const missing = field.options.filter((o) => !list.includes(o));
      if (missing.length) {
        return `Barista work includes all of these. ${missing.length} still unticked.`;
      }
      return null;
    }
    if (!list.length) return "Please select at least one.";
    if (field.maxSelect && list.length > field.maxSelect) return `Please choose no more than ${field.maxSelect}.`;
    if (field.allowOther && list.includes("Other") && !otherText.trim()) return "Please tell us which one.";
    return null;
  }

  const text = typeof value === "string" ? value.trim() : "";

  if (!field.required && !text) return null;
  if (!text) return "This one is required.";

  if (field.type === "radio" && field.allowOther && value === "Other") {
    const otherText = (answers[field.id + OTHER_SUFFIX] as string) || "";
    if (!otherText.trim()) return "Please tell us which one.";
  }

  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    return "Please enter a valid email address.";
  }

  if (field.type === "tel" && !/^[+]?[\d ()-]{9,20}$/.test(text)) {
    return "Please enter a valid phone number.";
  }

  // Only the reflective questions (the ones with a strength target) need a
  // real answer. "None." is a complete answer to the commitments question.
  if (field.type === "paragraph" && field.strongWords && countWords(text) < 5) {
    return "Please give us a little more — a sentence or two.";
  }

  return null;
};

export const isFieldAnswered = (field: Field, answers: Answers): boolean =>
  validateField(field, answers) === null &&
  answers[field.id] !== undefined &&
  answers[field.id] !== "" &&
  !(Array.isArray(answers[field.id]) && (answers[field.id] as string[]).length === 0);

export const sectionErrors = (section: Section, answers: Answers): Record<string, string> => {
  const errors: Record<string, string> = {};
  visibleFields(section, answers).forEach((field) => {
    const error = validateField(field, answers);
    if (error) errors[field.id] = error;
  });
  return errors;
};

export const isSectionComplete = (section: Section, answers: Answers): boolean =>
  Object.keys(sectionErrors(section, answers)).length === 0;

/** Beans earned = questions answered well. Used for the progress meter. */
export const progressStats = (answers: Answers) => {
  const fields = allVisibleFields(answers);
  const answered = fields.filter((f) => isFieldAnswered(f, answers)).length;
  return {
    answered,
    total: fields.length,
    percent: fields.length ? Math.round((answered / fields.length) * 100) : 0,
  };
};

/** Answer strength for paragraphs: 0–1, plus a Swahili label. */
export const answerStrength = (text: string, target = 40) => {
  const words = countWords(text);
  const ratio = Math.min(1, words / target);
  let label = "";
  if (words === 0) label = "";
  else if (words < 8) label = "Endelea — keep going";
  else if (words < target * 0.6) label = "Nzuri — good";
  else label = "Bora kabisa — strong answer";
  return { words, ratio, label };
};

/** Human-readable answers keyed by question, for the review step and payload. */
export const flattenAnswers = (answers: Answers) => {
  const out: { n: number; id: string; question: string; answer: string; section: string }[] = [];
  SECTIONS.forEach((section) => {
    visibleFields(section, answers).forEach((field) => {
      out.push({
        n: field.n,
        id: field.id,
        section: section.title,
        question: field.label,
        answer: formatAnswer(field, answers),
      });
    });
  });
  return out;
};

export const formatAnswer = (field: Field, answers: Answers): string => {
  const value = answers[field.id];
  const other = (answers[field.id + OTHER_SUFFIX] as string) || "";

  if (field.type === "referee") {
    const parts = (value as Record<string, string>) || {};
    return REFEREE_PARTS.map((p) => `${p.label}: ${parts[p.key] || "—"}`).join(" · ");
  }
  if (field.type === "consent") return value === "yes" ? "Confirmed" : "Not confirmed";
  if (Array.isArray(value)) {
    return value.map((v) => (v === "Other" && other ? `Other: ${other}` : v)).join(", ");
  }
  if (value === "Other" && other) return `Other: ${other}`;
  return (value as string) || "—";
};
