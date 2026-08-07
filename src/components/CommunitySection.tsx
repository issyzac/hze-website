import { motion, useReducedMotion } from "framer-motion";

interface CommunityPhoto {
  src: string;
  alt: string;
  caption: string;
}

const photos: CommunityPhoto[] = [
  {
    src: "/assets/images/community/not-just-a-cafe-its-a-living-room-with-better-coffee.jpg",
    alt: "Guests relaxing together on hand-painted benches in the Harakati za Enzi café",
    caption: "Not just a café — a living room with better coffee.",
  },
  {
    src: "/assets/images/community/coffee-conversations-connection.jpg",
    alt: "Friends playing a word-tile game over takeaway Enzi cups",
    caption: "Coffee. Conversations. Connection.",
  },
  {
    src: "/assets/images/community/plot-twists-hit-better-with-a-capuccino.jpg",
    alt: "A reader enjoying a book beside a Harakati za Enzi cappuccino",
    caption: "Plot twists hit better with a cappuccino.",
  },
  {
    src: "/assets/images/community/bring-your-laptop-well-bring-great-coffee.jpg",
    alt: "Two people working on laptops at a shared café table",
    caption: "Bring your laptop. We'll bring great coffee.",
  },
  {
    src: "/assets/images/community/every-ride-deserves-a-reward.jpg",
    alt: "A barista handing iced coffees across the counter to a cyclist",
    caption: "Every ride deserves a reward.",
  },
  {
    src: "/assets/images/community/high-stakes-strong-coffee.jpg",
    alt: "Friends stacking a colorful block tower next to Enzi lattes",
    caption: "High stakes, strong coffee.",
  },
];

const easeSoft = [0.25, 1, 0.5, 1] as const;

export default function CommunitySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="community" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <span className="text-enzi-db/80 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase">
            Café as Community
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10">
          <h2 className="lg:col-span-7 text-coffee-brown font-['GTAlpinaThin'] leading-tight text-4xl sm:text-5xl md:text-6xl">
            What happens when people gather
          </h2>
          <p className="lg:col-span-5 text-enzi-db text-lg sm:text-xl leading-8 font-['RoobertRegular']">
            Games, books, laptops, long conversations, and quiet rituals — this
            is the movement in motion, one table at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {photos.map((photo, i) => (
            <motion.figure
              key={photo.src}
              className="group relative overflow-hidden bg-coffee-cream/40 border border-coffee-brown/10"
              initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: easeSoft, delay: (i % 3) * 0.08 }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coffee-dark/85 to-transparent px-5 pt-12 pb-4">
                <span className="text-coffee-cream font-['RoobertRegular'] text-sm sm:text-base">
                  {photo.caption}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("events");
              if (el) {
                const header = document.querySelector("header");
                const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
                const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
              }
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-coffee-dark text-coffee-cream hover:bg-coffee-brown transition-colors font-['RoobertMedium'] text-base tracking-wide min-h-[56px]"
          >
            See what is brewing — join a gathering
          </a>
        </div>
      </div>
    </section>
  );
}
