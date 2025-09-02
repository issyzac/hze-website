 
import heroBg from "/assets/images/hero_bg.png";  

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  productImages?: string[];
  backgroundImageUrl?: string;
  onSubscribe?: () => void;
}

export default function HeroSection({
  title = "Kahawa na Harakati",
  subtitle,
  ctaText = "Shop Now",
  productImages = [],
  backgroundImageUrl,
  onSubscribe,
}: HeroSectionProps) {
  const bg = backgroundImageUrl || productImages[0] || heroBg;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-30 sm:pt-48 mt-12 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden shadow-sm border border-coffee-brown/15 scale-[1.10]"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "62vh",
          }}
        >
          <div className="absolute inset-0 bg-coffee-brown/70" />

          <div className="relative z-10 flex flex-col items-center text-center justify-center min-h-[62vh] p-6 sm:p-10">
            <h1 className="text-white font-['GTAlpinaThin'] leading-tight drop-shadow-sm text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg lg:text-xl font-['RoobertRegular']">
                {subtitle}
              </p>
            )}

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onSubscribe}
                className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-['RoobertRegular'] text-white bg-coffee-gold hover:bg-coffee-gold/90 shadow-sm transition-colors min-h-[56px] w-full sm:w-auto"
              >
                {ctaText}
              </button>

              <button
                onClick={() => {
                      const el = document.getElementById("products");
                      if (el) {
                        const header = document.querySelector('header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
                      }
                    }}
                    
                className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-4 text-base sm:text-lg font-['RoobertRegular'] border-2 border-white/80 text-white hover:bg-white/10 transition-colors min-h-[56px] w-full sm:w-auto"
              >
                Discover Your Flavor
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-7 h-12 border-2 border-coffee-brown/60 flex justify-center items-start">
            <div className="w-1.5 h-3 mt-2 bg-coffee-brown/80 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
