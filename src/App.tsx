
import { useState } from 'react';
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductHighlights from './components/ProductHighlights'
import WhoWeAre from './components/WhoWeAre'
import OurStory from './components/OurStory'
import OurValues from './components/OurValues'
import ImpactSection from './components/Impact'
import CustomerReviews from './components/CustomerReview'
import SubscriptionWizard from './components/Subscription'
import MobileSubscriptionFlow from './components/MobileSubscriptionFlow'

import { mockHeroData, mockProductHighlights } from './data/mockData'
import { useIsMobile } from './hooks/useIsMobile'
import axios from 'axios'
import type { SubscriptionData } from './components/MobileSubscriptionFlow'

function App() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isMobile = useIsMobile();

  const openSubscriptionModal = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionSubmit = async (data: SubscriptionData) => {
    try {
      console.log('Raw JSON data being sent:', JSON.stringify(data, null, 2)); 
      await axios.post('https://api.example.com/subscriptions', data);
      setIsSubscriptionModalOpen(false);
      setShowSuccessMessage(true); 
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error('Subscription submission failed:', error); 
      alert('Failed to submit subscription. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-coffee-cream">
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main>
        {/* Hero Section */}
        <HeroSection
          title={mockHeroData.title}
          subtitle={mockHeroData.subtitle}
          ctaText="Subscribe Now"
          productImages={mockHeroData.productImages}
          onSubscribe={openSubscriptionModal}
        />

        {/* Who We Are Section */}
        <WhoWeAre />

        {/* Our Story Section */}
        <OurStory />

        {/* Our Values Section */}
        <OurValues />

        {/* Products Section */}
        <ProductHighlights products={mockProductHighlights} /> 

        {/* About Section */}
        <ImpactSection />

        {/* Subscription Section */}
        {isMobile ? (
          <MobileSubscriptionFlow 
            isOpen={isSubscriptionModalOpen}
            onClose={() => setIsSubscriptionModalOpen(false)}
            onSubmit={handleSubscriptionSubmit}
          />
        ) : (
          <SubscriptionWizard 
            isOpen={isSubscriptionModalOpen}
            onClose={() => setIsSubscriptionModalOpen(false)}
            onSubmit={handleSubscriptionSubmit}
          />
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl border border-coffee-brown/15 p-8 max-w-md mx-auto text-center">
              <h3 className="text-xl font-bold text-coffee-brown mb-4">Welcome to Harakati za Enzi!</h3>
              <p className="text-enzi-db">
                You’re joining Harakati za Enzi, a movement that honours every hand along the way. Expect a confirmation email, and let us know if your tastes evolve; we’re here to guide you.
              </p>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className="mt-6 coffee-btn"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
