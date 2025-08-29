
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductHighlights from './components/ProductHighlights'
import WhoWeAre from './components/WhoWeAre'
import OurStory from './components/OurStory'
import AboutUs from './components/AboutUs'
import ImpactSection from './components/Impact'
import CustomerReviews from './components/CustomerReview'

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

        {/* About Us Section */}
        <AboutUs />

        {/* Products Section */}
        <ProductHighlights products={mockProductHighlights} /> 

        {/* About Section */}
        <ImpactSection />

        {/* Reviews Section */}
        <CustomerReviews />

         

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-['GTAlpinaThin'] text-coffee-dark mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-coffee-brown font-['RoobertRegular'] mb-8">
              Get in touch with Harakati za Enzi Roastery
            </p>
            <div className="coffee-card p-8 max-w-2xl mx-auto">
              <p className="text-coffee-dark leading-relaxed mb-4 font-['RoobertRegular']">
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
