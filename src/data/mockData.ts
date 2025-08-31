import type { 
  RoastedCoffeeBeanProduct, 
  CustomerReview, 
  Bundle, 
  ProductHighlight,
  SuperFeature,
  SocialLink
} from '../types';

// Mock coffee products data
export const mockProducts: RoastedCoffeeBeanProduct[] = [
  {
    id: '1',
    name: 'Harakati Original Blend',
    description: 'Our signature medium roast with notes of chocolate and caramel',
    image: '/images/original-blend.jpg',
    price: 18.99,
    category: 'original',
    roastLevel: 'medium',
    origin: 'Tanzania',
    flavorNotes: ['chocolate', 'caramel', 'nutty'],
    weight: '12oz',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'washed',
    roastDate: '2024-01-15',
    certifications: ['organic', 'fair-trade']
  },
  {
    id: '2',
    name: 'Hazelnut Delight',
    description: 'Smooth medium roast infused with natural hazelnut flavoring',
    image: '/images/hazelnut-blend.jpg',
    price: 19.99,
    category: 'hazelnut',
    roastLevel: 'medium',
    origin: 'Tanzania',
    flavorNotes: ['hazelnut', 'vanilla', 'smooth'],
    weight: '12oz',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'natural',
    roastDate: '2024-01-15',
    certifications: ['organic']
  },
  {
    id: '3',
    name: 'Vanilla Dream',
    description: 'Rich dark roast with subtle vanilla undertones',
    image: '/images/vanilla-blend.jpg',
    price: 19.99,
    category: 'vanilla',
    roastLevel: 'dark',
    origin: 'Tanzania',
    flavorNotes: ['vanilla', 'rich', 'bold'],
    weight: '12oz',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'honey',
    roastDate: '2024-01-15',
    certifications: ['organic', 'fair-trade']
  },
  {
    id: '4',
    name: 'Decaf Harmony',
    description: 'Full-bodied decaffeinated blend without compromising taste',
    image: '/images/decaf-blend.jpg',
    price: 17.99,
    category: 'decaf',
    roastLevel: 'medium',
    origin: 'Tanzania',
    flavorNotes: ['balanced', 'smooth', 'mild'],
    weight: '12oz',
    grindType: 'whole-bean',
    caffeineContent: 'decaf',
    processingMethod: 'washed',
    roastDate: '2024-01-15',
    certifications: ['organic']
  }
];

// Mock customer reviews data
export const mockReviews: CustomerReview[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    rating: 5,
    reviewText: 'Absolutely love the Original Blend! The chocolate notes are perfect for my morning routine.',
    productReviewed: 'Harakati Original Blend',
    date: '2024-01-10'
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    rating: 5,
    reviewText: 'Best hazelnut coffee I\'ve ever had. The flavor is natural and not overpowering.',
    productReviewed: 'Hazelnut Delight',
    date: '2024-01-08'
  },
  {
    id: '3',
    customerName: 'Emily Rodriguez',
    rating: 4,
    reviewText: 'Great quality coffee with fast shipping. Will definitely order again!',
    productReviewed: 'Vanilla Dream',
    date: '2024-01-05'
  },
  {
    id: '4',
    customerName: 'David Thompson',
    rating: 5,
    reviewText: 'The decaf option is amazing - finally a decaf that doesn\'t taste watered down.',
    productReviewed: 'Decaf Harmony',
    date: '2024-01-03'
  },
  {
    id: '5',
    customerName: 'Lisa Park',
    rating: 5,
    reviewText: 'Exceptional quality and the packaging keeps the coffee fresh. Highly recommend!',
    productReviewed: 'Harakati Original Blend',
    date: '2024-01-01'
  },
  {
    id: '6',
    customerName: 'James Wilson',
    rating: 4,
    reviewText: 'Love supporting this local roastery. The vanilla blend is my new favorite.',
    productReviewed: 'Vanilla Dream',
    date: '2023-12-28'
  }
];

// Mock bundle data
export const mockBundle: Bundle = {
  id: 'bundle-1',
  name: '12-Pack Coffee Discovery Bundle',
  items: [
    { name: 'Harakati Original Blend', quantity: 3, type: '12oz bags' },
    { name: 'Hazelnut Delight', quantity: 3, type: '12oz bags' },
    { name: 'Vanilla Dream', quantity: 3, type: '12oz bags' },
    { name: 'Decaf Harmony', quantity: 3, type: '12oz bags' }
  ],
  totalPrice: 227.88,
  discountPercentage: 25,
  images: [
    '/images/bundle-showcase.jpg',
    '/images/coffee-variety.jpg',
    '/images/bundle-contents.jpg'
  ]
};

// Mock product highlights for the highlights section
export const mockProductHighlights: ProductHighlight[] = [
  {
    id: '1',
    name: 'Original Blend',
    description: 'Our signature medium roast with rich chocolate and caramel notes',
    image: '/assets/images/coffee-bag-WEaa66D-600.png'
  },
  {
    id: '2',
    name: 'Hazelnut Delight',
    description: 'Smooth medium roast with natural hazelnut flavoring',
    image: '/assets/images/coffee-bag-WEaa66D-600.png'
  },
  {
    id: '3',
    name: 'Vanilla Dream',
    description: 'Rich dark roast with subtle vanilla undertones',
    image: '/assets/images/coffee-bag-WEaa66D-600.png'
  },
  {
    id: '4',
    name: 'Decaf Harmony',
    description: 'Full-bodied decaf without compromising on taste',
    image: '/assets/images/coffee-bag-WEaa66D-600.png'
  }
];

// Mock super features for "What Makes It Super" section
export const mockSuperFeatures: SuperFeature[] = [
  {
    title: 'Single Origin Tanzanian Beans',
    description: 'Sourced directly from small farms in the highlands of Tanzania for exceptional quality and flavor',
    icon: '🌱'
  },
  {
    title: 'Small Batch Roasting',
    description: 'Each batch is carefully roasted to perfection, ensuring consistency and freshness in every cup',
    icon: '🔥'
  },
  {
    title: 'Fair Trade & Organic',
    description: 'Ethically sourced and certified organic beans that support sustainable farming practices',
    icon: '✅'
  },
  {
    title: 'Fresh Roasted Weekly',
    description: 'Roasted to order and shipped within days to guarantee maximum freshness and flavor',
    icon: '📦'
  }
];

// Mock social links for footer
export const mockSocialLinks: SocialLink[] = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/harakatizenzi',
    icon: '📷'
  },
  {
    platform: 'Facebook',
    url: 'https://facebook.com/harakatizenzi',
    icon: '📘'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/harakatizenzi',
    icon: '🐦'
  }
];

// Mock hero section data
export const mockHeroData = {
  title: 'Find your perfect cup of coffee',
  subtitle: 'At Harakati za Enzi, we help you discover coffee that fits your taste and your life.',
  ctaText: 'Subscribe Now',
  productImages: [
    '/assets/images/hero_bg.png',
  ]
};

// Mock bundle section data
export const mockBundleSection = {
  bundleItems: mockBundle.items,
  price: `$${mockBundle.totalPrice.toFixed(2)}`,
  discountText: `Take ${mockBundle.discountPercentage}% Off`,
  productImages: mockBundle.images
};

// Mock footer data
export const mockFooterData = {
  companyInfo: 'Harakati za Enzi Roastery - Premium Tanzanian Coffee since 2020',
  socialLinks: mockSocialLinks,
  partnerLogos: [
    '/images/organic-cert.png',
    '/images/fairtrade-cert.png',
    '/images/tanzania-coffee.png'
  ]
};