 

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValue } from "framer-motion";
import heroBg from "/assets/images/hero_bg.png";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  productImages?: string[];
  backgroundImageUrl?: string;
  onSubscribe?: () => void;
}

const easeSoft = [0.25, 1, 0.5, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.0, ease: easeSoft },
  },
};

const bgReveal = {
  hidden: { opacity: 0, scale: 1.04 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: easeSoft },
  },
};

const overlayReveal = (targetOpacity: number) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: targetOpacity,
    transition: { duration: 1.2, ease: easeSoft },
  },
});

export default function HeroSection({
  title = "Kahawa na Harakati",
  subtitle,
  ctaText = "Shop Now",
  productImages = [],
  backgroundImageUrl,
  onSubscribe,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const bg = backgroundImageUrl || productImages[0] || heroBg;

  // Scroll direction detection
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const { scrollY } = useScroll();
  const y = useMotionValue(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      y.set(scrollY);
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, y]);

  // Transform scroll position to animation values
  const backgroundScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const overlayOpacity = useTransform(scrollY, [0, 500], [0.7, 0.9]);
  const contentY = useTransform(scrollY, [0, 300], [0, scrollDirection === 'down' ? -50 : -25]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, scrollDirection === 'down' ? 0.8 : 0.9]);

  return (
    <motion.section
      id="home"
      className="relative pt-30 sm:pt-48 mt-12 pb-16 bg-white"
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 1.0, ease: easeSoft }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden shadow-sm border border-coffee-brown/15 scale-[1.10]"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "62vh",
            scale: backgroundScale,
          }}
          variants={bgReveal}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="absolute inset-0 bg-coffee-brown/70"
            variants={overlayReveal(0.7)}
            style={{ opacity: overlayOpacity }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center text-center justify-center min-h-[62vh] p-6 sm:p-10"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <motion.h1
              className="text-white font-['GTAlpinaThin'] leading-tight drop-shadow-sm text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              variants={fadeUp}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg lg:text-xl font-['RoobertRegular']"
                variants={fadeUp}
              >
                {subtitle}
              </motion.p>
            )}

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4"
              variants={fadeUp}
            >
              <motion.button
                onClick={onSubscribe}
                className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-['RoobertRegular'] text-white bg-coffee-gold hover:bg-coffee-gold/90 shadow-sm transition-colors min-h-[56px] w-full sm:w-auto"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {ctaText}
              </motion.button>

              <motion.button
                onClick={() => {
                  const el = document.getElementById("products");
                  if (el) {
                    const header = document.querySelector("header");
                    const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
                    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-['RoobertRegular'] border-2 border-white/80 text-white hover:bg-white/10 transition-colors min-h-[56px] w-full sm:w-auto"
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                Discover Your Flavor
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <motion.div
            className="w-7 h-12 border-2 border-coffee-brown/60 flex justify-center items-start"
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: easeSoft }}
          >
            <motion.div
              className="w-1.5 h-3 mt-2 bg-coffee-brown/80"
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              transition={reduceMotion ? undefined : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
