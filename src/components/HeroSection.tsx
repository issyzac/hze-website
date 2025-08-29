 
import React from "react";
import heroBg from "/assets/images/hero_bg.png";  

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  productImages?: string[];
  backgroundImageUrl?: string;
}

export default function HeroSection({
  title = "Kahawa na Harakati",
  subtitle,
  ctaText = "Shop Now",
  productImages = [],
  backgroundImageUrl,
}: HeroSectionProps) {
  const bg = backgroundImageUrl || productImages[0] || heroBg;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="relative pt-48 mt-12 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] shadow-sm border border-coffee-brown/15"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "62vh",
          }}
        >
          <div className="absolute inset-0 bg-coffee-brown/70" />

          <div className="relative z-10 flex flex-col items-center text-center justify-center min-h-[62vh] p-6 sm:p-10">
            <h1 className="text-white font-['GTAlpinaThin'] leading-tight drop-shadow-sm text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg lg:text-xl font-['RoobertRegular']">
                {subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => scrollTo("products")}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-['RoobertRegular'] text-white bg-coffee-gold hover:bg-coffee-gold/90 rounded-2xl shadow-sm transition-colors"
              >
                {ctaText}
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-['RoobertRegular'] border-2 border-white/80 text-white hover:bg-white/10 rounded-2xl transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-7 h-12 border-2 border-coffee-brown/60 rounded-full flex justify-center items-start">
            <div className="w-1.5 h-3 mt-2 bg-coffee-brown/80 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
