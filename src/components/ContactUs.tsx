import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { openWhatsApp } from "../lib/whatsapp";

const easeSoft = [0.25, 1, 0.5, 1] as const;

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date?: string;
  text: string;
  sourceUrl?: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "enzi-1",
    author: "TripAdvisor reviewer",
    rating: 5,
    date: "2025",
    text: "Simply the best coffee shop in Dar, they have very nice coffee and the environment is great for working or casual meetings.",
    sourceUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g293748-d26587714-Reviews-Enzi_Coffee-Dar_es_Salaam_Dar_Es_Salaam_Region.html",
  },
  {
    id: "enzi-2",
    author: "TripAdvisor reviewer",
    rating: 5,
    date: "2025",
    text: "Beautiful space and the cappuccino was perfect—velvety and rich.",
    sourceUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g293748-d26587714-Reviews-Enzi_Coffee-Dar_es_Salaam_Dar_Es_Salaam_Region.html",
  },
  {
    id: "enzi-3",
    author: "TripAdvisor reviewer",
    rating: 4,
    date: "2025",
    text: "Great beans and friendly baristas. I'll be back for the pour-over.",
    sourceUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g293748-d26587714-Reviews-Enzi_Coffee-Dar_es_Salaam_Dar_Es_Salaam_Region.html",
  },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        className={i < rating ? "text-coffee-gold" : "text-enzi-db/30"}
      >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

export default function ContactUs() {
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);

  // Gentle auto-rotation for the guest reviews
  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Habari HZE! ${message.trim() || "Nataka kuwasiliana nanyi."} — ${name.trim() || "___"}`;
    openWhatsApp(text);
  };

  const review = REVIEWS[index];

  return (
    <section id="contact" className="py-16 px-4 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeSoft }}
        >
          <h2
            className="uppercase text-ink text-5xl sm:text-6xl leading-[0.95] mb-3"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Karibu — Visit Us
          </h2>
          <p className="font-display font-light italic text-bronze-deep text-xl">
            HZE Mbezi &amp; HZE Victoria, Dar es Salaam · Monday – Saturday, 7:30 AM – 10:00 PM
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left: WhatsApp form */}
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeSoft, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/80 border border-bronze-deep/20 shadow-sm p-6 sm:p-8 space-y-5"
            >
              <div>
                <label htmlFor="contact-name" className="block text-sm font-sans font-medium text-ink mb-2">
                  Jina lako — your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Andika jina lako"
                  className="w-full px-4 py-3 border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-sans font-medium text-ink mb-2">
                  Ujumbe wako — your message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Kahawa, events, wholesale — chochote!"
                  className="w-full px-4 py-3 border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans resize-vertical"
                />
              </div>

              <button
                type="submit"
                className="btn-press w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-hze-teal text-white font-sans font-medium text-lg rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
              >
                Endelea kwa WhatsApp <span aria-hidden>→</span>
              </button>

              <p className="text-center font-sans text-sm text-ink/50">
                Inafungua WhatsApp na ujumbe wako tayari umeandikwa.
              </p>
            </form>
          </motion.div>

          {/* Right: guest reviews */}
          <motion.div
            id="reviews"
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeSoft, delay: 0.2 }}
          >
            <div className="mb-5">
              <span className="text-enzi-db text-sm font-sans tracking-[0.2em] uppercase">
                Wanasema nini
              </span>
              <h3 className="mt-1 font-display font-light italic text-coffee-dark text-2xl sm:text-3xl">
                What guests say
              </h3>
            </div>

            <div className="relative min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={review.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: easeSoft }}
                  className="bg-white border border-bronze-deep/20 shadow-sm p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Stars rating={review.rating} />
                    <figcaption className="font-sans text-sm font-medium text-ink/60">
                      {review.author}
                      {review.date ? ` · ${review.date}` : ""}
                    </figcaption>
                  </div>
                  <blockquote className="font-display font-light text-coffee-dark text-xl sm:text-2xl leading-9">
                    “{review.text}”
                  </blockquote>
                  {review.sourceUrl && (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block font-sans text-sm text-enzi-db hover:underline"
                    >
                      View on TripAdvisor →
                    </a>
                  )}
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center gap-3">
              {REVIEWS.map((r, i) => (
                <button
                  key={r.id}
                  aria-label={`Review ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i === index ? "bg-enzi-db" : "bg-bronze-deep/25 hover:bg-bronze-deep/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
