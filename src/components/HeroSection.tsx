import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  productImages: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  productImages
}) => {
  const handleCtaClick = () => {
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-coffee-cream">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-coffee-dark mb-6 leading-tight">
              <span className="block font-family-inter font-thin">Harakati za Enzi</span>
              <span className="block text-coffee-brown font-light">Coffee</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-coffee-dark mb-4 max-w-2xl mx-auto lg:mx-0">
              {title}
            </p>

            <p className="text-base sm:text-lg text-coffee-brown mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {subtitle}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleCtaClick}
                className="coffee-btn text-lg px-8 py-4 font-semibold"
              >
                {ctaText}
              </button>

              <button
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-transparent border-2 border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white px-8 py-4 font-semibold text-lg transition-colors duration-200"
              >
                Learn More
              </button>
            </div>


          </div>

          {/* Product Showcase Section */}
          <div className="relative">
            {/* Product images grid */}
            <div className="grid grid-cols-2 gap-4">
              {productImages.slice(0, 4).map((_, index) => (
                <div
                  key={index}
                  className="coffee-card p-4"
                >
                  {/* Placeholder for product image */}
                  <div className="aspect-square bg-coffee-bean flex items-center justify-center text-white font-semibold text-sm text-center p-2">
                    Coffee Bag {index + 1}
                    <br />
                    <span className="text-xs">Premium Roast</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-coffee-brown flex justify-center">
          <div className="w-1 h-3 bg-coffee-brown mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;