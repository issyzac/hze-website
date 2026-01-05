import { useState, useEffect } from 'react';
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
import OrderFlow from './components/OrderFlow'

import { mockHeroData, mockProducts } from './data/mockData'
import { useIsMobile } from './hooks/useIsMobile'
import ProblemStatement from './components/ProblemStatement';
import ContactUs from './components/ContactUs'

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

        {/* Problem Statement Section */}
        <ProblemStatement />

        {/* Who We Are Section */}
        <WhoWeAre />

        {/* Our Story Section */}
        <OurStory />

        {/* Our Values Section */}
        <OurValues />

        {/* Products Section */}
        <ProductHighlights products={mockProducts} onOrderClick={openOrderModal} />

        {/* About Section */}
        <ImpactSection />

        {/* Reviews Section */}
        <CustomerReviews />

        {/* Contact Section */}
        <ContactUs />
      </main>

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
