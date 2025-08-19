import React from 'react';
import type { ProductHighlightsProps } from '../types';

const ProductHighlights: React.FC<ProductHighlightsProps> = ({ products }) => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee-dark mb-4">
            Our Coffee Varieties
          </h2>
          <p className="text-lg text-coffee-brown max-w-2xl mx-auto">
            Discover our carefully curated selection of premium Tanzanian coffee blends, 
            each roasted to perfection with unique flavor profiles.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="coffee-card group cursor-pointer"
            >
              {/* Product Image */}
              <div className="h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#F5F5DC"/>
                        <rect x="50%" y="50%" width="100" height="100" fill="#8B4513" transform="translate(-50,-50)"/>
                        <text x="50%" y="60%" text-anchor="middle" fill="#2C1810" font-family="Arial" font-size="14">Coffee Image</text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>

              {/* Product Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-coffee-dark mb-3 group-hover:text-coffee-brown transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-coffee-brown text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                
                {/* Learn More Link */}
                <div className="mt-4">
                  <span className="text-coffee-brown font-medium text-sm hover:text-coffee-dark transition-colors duration-200 cursor-pointer">
                    Learn More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="coffee-btn">
            Shop All Coffee
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;