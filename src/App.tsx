
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductHighlights from './components/ProductHighlights'
import WhoWeAre from './components/WhoWeAre'
import OurStory from './components/OurStory'
import { mockHeroData, mockProductHighlights } from './data/mockData'

function App() {
  return (
    <div className="min-h-screen bg-coffee-cream">
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main>
        {/* Hero Section */}
        <HeroSection
          title={mockHeroData.title}
          subtitle={mockHeroData.subtitle}
          ctaText={mockHeroData.ctaText}
          productImages={mockHeroData.productImages}
        />

        {/* Who We Are Section */}
        <WhoWeAre />

        {/* Our Story Section */}
        <OurStory />

        {/* Products Section */}
        <ProductHighlights products={mockProductHighlights} /> 

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-coffee-cream">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee-dark mb-6">
              What Makes It Super?
            </h2>
            <p className="text-lg text-coffee-brown mb-8">
              Learn about our unique roasting process and quality
            </p>
            <div className="coffee-card p-8 max-w-2xl mx-auto">
              <p className="text-coffee-dark leading-relaxed">
                Our coffee beans are sourced directly from Tanzanian highlands and roasted in small batches 
                to ensure maximum freshness and flavor. Each blend is carefully crafted to deliver a unique 
                taste experience that represents the rich coffee heritage of Tanzania.
              </p>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee-dark mb-6">
              Customer Reviews
            </h2>
            <p className="text-lg text-coffee-brown mb-8">
              See what our customers say about our coffee
            </p>
            <div className="coffee-card p-8 max-w-2xl mx-auto">
              <p className="text-coffee-dark leading-relaxed">
                "The best coffee I've ever tasted! The Original Blend has become my daily go-to. 
                You can really taste the quality and care that goes into every batch."
              </p>
              <p className="text-coffee-brown mt-4 font-medium">- Sarah Johnson</p>
            </div>
          </div>
        </section>

        {/* Bundle Section */}
        <section id="bundle" className="py-16 px-4 bg-coffee-cream">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee-dark mb-6">
              Coffee Bundles
            </h2>
            <p className="text-lg text-coffee-brown mb-8">
              Special deals and bundle offers
            </p>
            <div className="coffee-card p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-coffee-dark mb-4">12-Pack Discovery Bundle</h3>
              <p className="text-coffee-brown mb-4">
                Try all four of our signature blends with our special discovery bundle. 
                Perfect for finding your new favorite or sharing with friends.
              </p>
              <button className="coffee-btn">
                View Bundle Details
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-coffee-dark mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-coffee-brown mb-8">
              Get in touch with Harakati za Enzi Roastery
            </p>
            <div className="coffee-card p-8 max-w-2xl mx-auto">
              <p className="text-coffee-dark leading-relaxed mb-4">
                Have questions about our coffee or want to place a custom order? 
                We'd love to hear from you!
              </p>
              <button className="coffee-btn">
                Send Message
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
