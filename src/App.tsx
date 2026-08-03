import { useState, useEffect } from 'react';
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductHighlights from './components/ProductHighlights'
import OurStory from './components/OurStory'
import OurValues from './components/OurValues'
import SubscriptionWizard from './components/Subscription'
import MobileSubscriptionFlow from './components/MobileSubscriptionFlow'
import OrderFlow from './components/OrderFlow'

import { mockHeroData, mockProducts } from './data/mockData'
import { useIsMobile } from './hooks/useIsMobile'
import ProblemStatement from './components/ProblemStatement';
import ContactUs from './components/ContactUs'
import EventsSection from './components/EventsSection'
import CommunitySection from './components/CommunitySection'
import Footer from './components/Footer'
import Marquee from './components/Marquee'
import WhatsAppFloat from './components/WhatsAppFloat'


function App() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const isMobile = useIsMobile();

  // Check URL params on mount to auto-open subscription dialog
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscribe') === 'true' || params.has('subscribe')) {
      setIsSubscriptionModalOpen(true); 
    }
  }, []);

  const openSubscriptionModal = () => {
    setIsSubscriptionModalOpen(true);
  };

  const openOrderModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-coffee-cream">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection
          title={mockHeroData.title}
          subtitle={mockHeroData.subtitle}
          ctaText={mockHeroData.ctaText}
          productImages={mockHeroData.productImages}
          onSubscribe={openSubscriptionModal}
        />

        <Marquee />

        {/* Problem Statement Section */}
        <ProblemStatement />

        {/* Our Story Section */}
        <OurStory />

        {/* Our Values Section */}
        <OurValues />

        {/* Products Section */}
        <ProductHighlights products={mockProducts} onOrderClick={openOrderModal} />

        <div aria-hidden className="khanga-divider" />

        {/* Community Section */}
        <CommunitySection />

        <div aria-hidden className="khanga-divider" />

        {/* Events Section */}
        <EventsSection />

        {/* Contact + Reviews Section */}
        <ContactUs />
      </main>

      <Footer />
      <WhatsAppFloat />

      {/* Subscription Modals */}
      {isMobile ? (
        <MobileSubscriptionFlow
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      ) : (
        <SubscriptionWizard
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      )}

      {/* Order Modal */}
      <OrderFlow
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialProductId={selectedProductId}
      />
    </div>
  );
}

export default App
