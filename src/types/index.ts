// Core product interface for roasted coffee beans
export interface RoastedCoffeeBeanProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: 'original' | 'hazelnut' | 'vanilla' | 'decaf';
  roastLevel: 'light' | 'medium' | 'dark';
  origin: string;
  flavorNotes: string[];
  weight: string; // e.g., "12oz", "1lb"
  grindType: 'whole-bean' | 'ground';
  caffeineContent: 'regular' | 'decaf';
  processingMethod: string; // e.g., "washed", "natural", "honey"
  roastDate?: string;
  certifications?: string[]; // e.g., ["organic", "fair-trade"]
}

// Bundle item interface
export interface BundleItem {
  name: string;
  quantity: number;
  type: string;
}

// Bundle interface
export interface Bundle {
  id: string;
  name: string;
  items: BundleItem[];
  totalPrice: number;
  discountPercentage: number;
  images: string[];
}

// Customer review interface
export interface CustomerReview {
  id: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewText: string;
  productReviewed?: string;
  date: string;
}

// Component prop interfaces

// Header component props
export interface HeaderProps {
  isScrolled: boolean;
}

// Hero section props
export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  productImages: string[];
}

// Product highlight interface
export interface ProductHighlight {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Product highlights component props
export interface ProductHighlightsProps {
  products: ProductHighlight[];
}

// Super feature interface
export interface SuperFeature {
  title: string;
  description: string;
  icon?: string;
}

// What makes it super component props
export interface WhatMakesItSuperProps {
  features: SuperFeature[];
  mainImage: string;
  ctaText: string;
}

// Reviews section component props
export interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

// Bundle section component props
export interface BundleSectionProps {
  bundleItems: BundleItem[];
  price: string;
  discountText: string;
  productImages: string[];
}

// Social link interface
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

// Footer component props
export interface FooterProps {
  companyInfo: string;
  socialLinks: SocialLink[];
  partnerLogos: string[];
}