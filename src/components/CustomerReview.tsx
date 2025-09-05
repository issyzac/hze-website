import { useEffect, useRef, useState } from "react";

// ---- Branded Carousel (Option A) ----
export interface ReviewItem {
  id: string;
  author: string;
  rating: number; // 1-5
  date?: string;
  text: string;
  sourceUrl?: string; // TripAdvisor review permalink
}

interface ReviewsCarouselProps {
  title?: string;
  eyebrow?: string;
  reviews: ReviewItem[];
}

export function ReviewsCarousel({
  title = "Customer Reviews",
  eyebrow = "REVIEWS",
  reviews,
}: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = reviews.length;
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);  
    return () => clearInterval(interval);
  }, [total]);

  // keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement;
    if (child) {
      const containerWidth = el.clientWidth;
      const childLeft = child.offsetLeft;
      const childWidth = child.clientWidth;
      const scrollLeft = childLeft - (containerWidth - childWidth) / 2;
      el.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [index]);

  return (
    <section id="reviews" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-enzi-db/80 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase mb-8">{eyebrow}</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-['GTAlpinaThin'] text-enzi-db">{title}</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-enzi-db/80 hover:text-enzi-db font-['RoobertRegular']"
          >
            View All <span aria-hidden>→</span>
          </a>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            aria-label="Previous review"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 border border-enzi-db/30 bg-white/70 backdrop-blur px-4 py-3 hover:bg-white min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            ‹
          </button>
          <button
            aria-label="Next review"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 border border-enzi-db/30 bg-white/70 backdrop-blur px-4 py-3 hover:bg-white min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[85%] lg:auto-cols-[60%] gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}
          >
            {reviews.map((r) => (
              <figure
                key={r.id}
                className="coffee-card snap-center p-8 bg-[#F7F3ED] border border-coffee-brown/15 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < r.rating ? "currentColor" : "none"} stroke="currentColor" className={i < r.rating ? "text-coffee-gold" : "text-enzi-db/30"}>
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <figcaption className="text-enzi-db font-['RoobertRegular'] text-sm font-bold mb-2">{r.author}{r.date ? ` • ${r.date}` : ""}</figcaption>
                </div>
                <blockquote className="text-enzi-db text-lg leading-8 font-['RoobertRegular']">
                  “{r.text}”
                </blockquote>
                {r.sourceUrl && (
                  <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-coffee-brown hover:underline text-sm">
                    View on TripAdvisor →
                  </a>
                )}
              </figure>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 ${i === index ? "bg-coffee-gold" : "bg-enzi-db/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Convenience wrapper with sample data. Replace with your curated TripAdvisor quotes.
export default function ReviewsSection() {
  const reviews: ReviewItem[] = [
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
      text: "Great beans and friendly baristas. I’ll be back for the pour-over.",
      sourceUrl:
        "https://www.tripadvisor.com/Restaurant_Review-g293748-d26587714-Reviews-Enzi_Coffee-Dar_es_Salaam_Dar_Es_Salaam_Region.html",
    },
  ];

  return <ReviewsCarousel reviews={reviews} />;
}
