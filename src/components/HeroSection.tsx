import { motion, useReducedMotion } from "framer-motion";
import { waLink } from "../lib/whatsapp";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  productImages?: string[];
  backgroundImageUrl?: string;
  onSubscribe?: () => void;
}

const easeSoft = [0.25, 1, 0.5, 1] as const;

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const header = document.querySelector("header");
    const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
  }
};

export default function HeroSection({
  subtitle = "Specialty coffee roasted with precision, creating dignified work and places to belong.",
  ctaText = "Find my coffee",
  productImages = [],
  backgroundImageUrl,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const photo =
    backgroundImageUrl ||
    productImages[0] ||
    "/assets/images/community/community-is-our-favorite-blend.jpg";

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: easeSoft, delay },
        };

  return (
    <section id="home" className="bg-white pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: message */}
          <div className="lg:col-span-7">
            <motion.p
              className="font-sans text-sm tracking-[0.2em] uppercase text-enzi-db mb-6"
              {...fadeUp(0)}
            >
              Tanzanian specialty coffee — Dar es Salaam
            </motion.p>

            <motion.h1
              className="text-ink leading-[0.95] text-6xl sm:text-7xl lg:text-8xl mb-4 uppercase"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
              {...fadeUp(0.1)}
            >
              Karibu kwenye
              <br />
              <span style={{ color: "#b37542a3" }}>Harakati</span>
            </motion.h1>

            <motion.p
              className="font-display font-light italic text-coffee-dark/80 text-2xl sm:text-3xl mb-6"
              {...fadeUp(0.15)}
            >
              Taste Tanzania. Join the movement.
            </motion.p>

            <motion.p
              className="font-sans text-lg sm:text-xl text-coffee-dark/70 leading-relaxed max-w-xl mb-10"
              {...fadeUp(0.2)}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
              {...fadeUp(0.3)}
            >
              <button
                onClick={() => scrollToSection("safari")}
                className="inline-flex items-center justify-center px-8 py-4 bg-enzi-db text-white font-sans font-medium text-base hover:bg-coffee-bean transition-colors min-h-[56px] rounded-full"
              >
                {ctaText}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center gap-2 font-sans font-medium text-base text-coffee-dark hover:text-enzi-db transition-colors min-h-[56px] px-2 group"
              >
                Visit the café
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </motion.div>

            <motion.a
              href={waLink("Nataka kujiunga na coffee subscription. Nielezeni zaidi.")}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-8 font-sans text-sm text-coffee-dark/50 hover:text-enzi-db underline underline-offset-4 transition-colors min-h-[44px]"
              {...fadeUp(0.4)}
            >
              Or build a coffee ritual — subscribe on WhatsApp
            </motion.a>
          </div>

          {/* Right: photo with pattern accent */}
          <motion.div
            className="lg:col-span-5 relative"
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 1.0, ease: easeSoft, delay: 0.2 },
                })}
          >
            <div
              aria-hidden
              className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-2/3 h-2/3 pattern-beige"
            />
            <div className="relative overflow-hidden aspect-[4/5]">
              <motion.img
                src={photo}
                alt="Friends sharing coffee and conversation at the Harakati za Enzi café"
                className="w-full h-full object-cover"
                fetchPriority="high"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { scale: 1.12, clipPath: "inset(100% 0 0 0)" },
                      animate: { scale: 1, clipPath: "inset(0% 0 0 0)" },
                      transition: { duration: 1.1, ease: easeSoft, delay: 0.25 },
                    })}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
