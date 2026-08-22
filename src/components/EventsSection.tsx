import { motion, useReducedMotion } from "framer-motion";
import { waLink } from "../lib/whatsapp";

const easeSoft = [0.25, 1, 0.5, 1] as const;

type HZEEvent = {
  title: string;
  variant?: string;
  dateISO: string;
  category?: string;
  venue: string;
  blurb: string;
};

// EDIT EVENTS HERE
const EVENTS: HZEEvent[] = [
  {
    title: "Cupping",
    variant: "Slurp & Score Edition",
    dateISO: "2026-09-05",
    venue: "HZE Mbezi",
    blurb: "Taste side by side the way graders do — slurp, score, and find the cup that's yours.",
  },
  {
    title: "Brew Better at Home",
    variant: "Bring Your Gadgets Edition",
    dateISO: "2026-09-19",
    category: "brew-class",
    venue: "HZE Mbezi",
    blurb: "Bring your own kit — grinder, dripper, press — and we'll dial it in together.",
  },
  {
    title: "Book Swap",
    dateISO: "2026-09-26",
    category: "book-swap",
    venue: "HZE Mbezi",
    blurb: "Bring a book, take a book. Literary exchange over good coffee.",
  },
  {
    title: "Brew Better at Home",
    variant: "Cupping",
    dateISO: "2026-10-14",
    category: "brew-class",
    venue: "HZE Mbezi",
    blurb: "Taste side by side and learn how a coffee gets scored — slurp included.",
  },
  {
    title: "Brew Better at Home",
    variant: "Bring Your Gadgets Edition",
    dateISO: "2026-11-20",
    category: "brew-class",
    venue: "HZE Mbezi",
    blurb: "Bring your own kit — grinder, dripper, press — and we'll dial it in together.",
  },
  {
    title: "Brew Better at Home",
    variant: "Class",
    dateISO: "2026-12-12",
    category: "brew-class",
    venue: "HZE Mbezi",
    blurb: "Pour-over, French press, and fixing your home brew — hands on.",
  },
  {
    title: "HZE Christmas Carols Party",
    dateISO: "2026-12-19",
    category: "carols",
    venue: "HZE Mbezi",
    blurb: "Carols, kahawa, and the whole HZE community closing out the year together.",
  },
];

const CATEGORIES: Record<
  string,
  { label: string; emoji: string; color: string; text: string }
> = {
  worship: { label: "Worship Night", emoji: "🙏", color: "#7A4E1E", text: "#FFFFFF" },
  aerobics: { label: "Aerobics", emoji: "💪", color: "#B83528", text: "#FFFFFF" },
  "book-swap": { label: "Book Swap", emoji: "📚", color: "#2B7A6E", text: "#FFFFFF" },
  "brew-class": { label: "Brew Class", emoji: "☕", color: "#B37542", text: "#FFFFFF" },
  "games-night": { label: "Games Night", emoji: "🎲", color: "#D19D71", text: "#1C1408" },
  carols: { label: "Carols Party", emoji: "🎄", color: "#B83528", text: "#FFFFFF" },
};

const RHYTHMS = [
  { when: "Every Saturday 7:00", what: "Aerobics at Mbezi", category: "aerobics" },
  { when: "Every Wednesday 17:00", what: "Kahawa Pole Pole (slow cup hour)", category: "brew-class" },
  { when: "First Saturday", what: "Book Swap", category: "book-swap" },
  { when: "Third Saturday", what: "Brew Better at Home", category: "brew-class" },
  { when: "Last Friday", what: "Worship Experience", category: "worship" },
];

const SWAHILI_MONTHS = [
  "Januari", "Februari", "Machi", "Aprili", "Mei", "Juni",
  "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba",
];

// Not a slice(0, 3) of the above — "Agosti" would abbreviate to "AGO", which
// reads as English "ago" on a card about an upcoming event.
const MONTH_ABBR = [
  "Jan", "Feb", "Mac", "Apr", "Mei", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Des",
];

const daysUntil = (dateISO: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateISO + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
};

const countdownLabel = (days: number) => {
  if (days === 0) return "leo!";
  if (days === 1) return "kesho";
  return `in ${days} days`;
};

const formatDate = (dateISO: string) => {
  const d = new Date(dateISO + "T00:00:00");
  return `${d.getDate()} ${SWAHILI_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const Chip = ({ category }: { category: string }) => {
  const c = CATEGORIES[category] ?? CATEGORIES["brew-class"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-xs font-medium"
      style={{ backgroundColor: c.color, color: c.text }}
    >
      <span aria-hidden>{c.emoji}</span> {c.label}
    </span>
  );
};

const EventsSection = () => {
  const reduceMotion = useReducedMotion();

  const upcoming = EVENTS
    .map((e) => ({ ...e, days: daysUntil(e.dateISO) }))
    .filter((e) => e.days >= 0)
    .sort((a, b) => a.days - b.days);

  return (
    <section className="py-16 sm:py-24 bg-cream-aged relative" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <h2
            className="uppercase text-ink text-5xl sm:text-7xl leading-[0.95]"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Events Zinazokuja
          </h2>
          <p className="mt-2 font-display font-light italic text-bronze-deep text-xl sm:text-2xl">
            Our Events Calendar
          </p>
        </motion.div>

        {/* Featured upcoming events — daladala tickets */}
        {upcoming.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {upcoming.map((event, i) => {
              const d = new Date(event.dateISO + "T00:00:00");
              return (
                <motion.article
                  key={event.title + event.dateISO}
                  className="bg-white border-2 border-bronze-deep/25 flex flex-col"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, ease: easeSoft, delay: i * 0.08 }}
                >
                  <div className="flex items-stretch">
                    {/* Date block */}
                    <div className="bg-ink text-cream-aged px-5 py-4 flex flex-col items-center justify-center min-w-[96px]">
                      <span
                        className="text-5xl leading-none"
                        style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                      >
                        {String(d.getDate()).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-xs uppercase tracking-widest mt-1">
                        {MONTH_ABBR[d.getMonth()]}
                      </span>
                    </div>
                    <div className="p-4 flex-1">
                      {event.category && <Chip category={event.category} />}
                      <h3
                        className="mt-2 uppercase text-ink text-2xl leading-none"
                        style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
                      >
                        {event.title}
                      </h3>
                      {event.variant && (
                        <p className="font-display font-light italic text-bronze-deep text-sm leading-tight mt-0.5">
                          {event.variant}
                        </p>
                      )}
                      <p className="font-sans text-xs text-ink/50 mt-1">
                        {event.venue} · <span className="text-hze-red font-medium">{countdownLabel(event.days)}</span>
                      </p>
                    </div>
                  </div>
                  <p className="px-4 pb-4 font-sans text-sm text-ink/70">{event.blurb}</p>
                  <div className="ticket-edge bg-cream-aged/60 mt-auto p-4 text-center">
                    <a
                      href={waLink(`Nataka kujisajili: ${event.title}${event.variant ? ` (${event.variant})` : ""} — ${formatDate(event.dateISO)}. Jina langu ni ___`)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-press inline-flex items-center justify-center w-full px-5 py-3 bg-hze-teal text-white font-sans font-medium text-sm rounded-full hover:bg-[#236458] transition-colors min-h-[48px]"
                    >
                      RSVP kwa WhatsApp
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Weekly rhythms */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <h3
            className="uppercase text-ink text-2xl sm:text-3xl mb-5"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Kila mwezi — monthly rhythm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {RHYTHMS.map((r) => (
              <a
                key={r.what + r.when}
                href={waLink(`Nataka kujisajili: ${r.what} (${r.when}). Jina langu ni ___`)}
                target="_blank"
                rel="noreferrer"
                className="btn-press bg-white border border-bronze-deep/20 hover:border-enzi-db p-4 transition-colors flex flex-col gap-2 min-h-[110px]"
              >
                <Chip category={r.category} />
                <span className="font-sans font-medium text-ink text-sm leading-snug">{r.what}</span>
                <span className="font-sans text-xs text-ink/50 mt-auto">{r.when}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Calendar banner */}
        <motion.div
          className="mt-12 bg-bronze-deep text-cream-aged p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeSoft }}
        >
          <p
            className="uppercase text-2xl sm:text-3xl text-center sm:text-left"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Pata kalenda ya events kwenye WhatsApp
          </p>
          <a
            href={waLink("Nitumieni kalenda ya events za mwezi huu 🙏")}
            target="_blank"
            rel="noreferrer"
            className="btn-press shrink-0 inline-flex items-center justify-center px-8 py-4 bg-cream-aged text-bronze-deep font-sans font-medium rounded-full hover:bg-white transition-colors min-h-[56px]"
          >
            Get the calendar
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
