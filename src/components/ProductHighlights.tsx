
import React from "react";
import type { ProductHighlightsProps } from "../types";
 
const ProductHighlights: React.FC<ProductHighlightsProps> = ({ products = [] }) => {
  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-['GTAlpinaThin'] text-enzi-db">Our Coffee</h2>
          <a
            href="#products"
            className="inline-flex items-center gap-2 text-enzi-db/80 hover:text-enzi-db font-['RoobertRegular']"
            aria-label="Explore all coffee"
          >
            Explore All
            <span aria-hidden className="translate-y-[1px]">→</span>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <article
              key={(product as any).id ?? (product as any).sku ?? (product as any).name}
              className="bg-[#F1EEE8] p-6 sm:p-7 md:p-8 flex flex-col shadow-sm"
            >
              {/* Title */}
              <h3 className="text-coffee-brown font-['GTAlpinaThin'] text-2xl md:text-[28px] leading-tight mb-4">
                {(product as any).name}
              </h3>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center py-6">
                <img
                  src={(product as any).image}
                  alt={(product as any).name}
                  className="max-h-60 object-contain scale-[1.02]"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.opacity = "0.4";
                    t.alt = "Image unavailable";
                  }}
                />
              </div>

              {/* Footer */}
              <div className="mt-4 grid grid-cols-12 items-center gap-4">
                <div className="col-span-6 md:col-span-4">
                  <div className="text-[13px] text-enzi-db/70 font-['RoobertRegular']">Blend</div>
                  <div className="text-enzi-db font-['RoobertRegular']">
                    {(product as any).blend ?? "Harakati"}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4 text-center">
                  <div className="text-[13px] text-enzi-db/70 font-['RoobertRegular']">Price</div>
                  <div className="text-enzi-db font-['RoobertRegular']">
                    {(product as any).price ?? "TZS 12,000"}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 md:justify-self-end">
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap border border-enzi-db/60 px-5 py-3 sm:px-4 sm:py-2 text-base sm:text-sm font-['RoobertRegular'] text-enzi-db hover:bg-white w-full md:w-auto min-h-[48px]"
                    onClick={() => {
                      const el = document.getElementById("products");
                      if (el) {
                        const header = document.querySelector('header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
                      }
                    }}
                    aria-label={`Order ${(product as any).name}`}
                  >
                    Order now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
