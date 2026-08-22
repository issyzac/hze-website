import type { 
  RoastedCoffeeBeanProduct, 
  CustomerReview, 
  Bundle, 
  SuperFeature,
  SocialLink
} from '../types';

// Mock coffee products data
export const mockProducts: RoastedCoffeeBeanProduct[] = [
  {
    id: '4',
    name: 'Mirumbani',
    description:
      'Seasonal Kigoma lot from the Josina and Alaa estates — red berry brightness, sweet orange, and a brown-sugar finish',
    image: '/assets/images/mirumbani/mrumba-tree.png',
    price: '22,000',
    category: 'Mirumbani',
    roastLevel: 'medium',
    origin: 'Kigoma, Tanzania',
    flavorNotes: ['red berry', 'sweet orange', 'brown sugar'],
    weight: '250g',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'washed',
    roastDate: '2026-06-01',
    certifications: ['organic'],
    backgroundColor: '#E3E3E3',
    seasonal: true
  },
  {
    id: '1',
    name: 'Nguvu',
    description: 'Classic Tanzanian washed roast — milk chocolate and caramel sweetness, smooth acidity, full body',
    image: '/assets/images/nguvu.PNG',
    price: '24,000',
    category: 'Nguvu',
    roastLevel: 'medium',
    origin: 'Kilimanjaro, Tanzania',
    flavorNotes: ['milk chocolate', 'caramel', 'smooth'],
    weight: '250g',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'washed',
    roastDate: '2026-08-01',
    certifications: ['organic'],
    backgroundColor: '#E3E3E3',
    seasonal: true
  },
  {
    id: '2',
    name: 'Tunu',
    description: 'Full-bodied medium roast with stone fruit sweetness and a rounded, chocolatey finish',
    image: '/assets/images/tunu.PNG',
    price: '25,000',
    category: 'Tunu',
    roastLevel: 'medium',
    origin: 'Tanzania',
    flavorNotes: ['stone fruit', 'chocolate', 'full-bodied'],
    weight: '250g',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'honey',
    roastDate: '2024-01-15',
    certifications: ['organic', 'fair-trade'],
    backgroundColor: '#E3E3E3'
  },
  {
    id: '3',
    name: 'Amka',
    description: 'Bright, clean, and delicate with apricot and citrus zest, rounded by caramel sweetness and a well-structured medium body',
    image: '/assets/images/amka.jpeg',
    price: '18,000',
    category: 'Amka',
    roastLevel: 'medium',
    origin: 'Tanzania',
    flavorNotes: ['apricot', 'citrus zest', 'caramel'],
    weight: '250g',
    grindType: 'whole-bean',
    caffeineContent: 'regular',
    processingMethod: 'washed',
    roastDate: '2024-01-15',
    certifications: ['organic'],
    backgroundColor: '#E3E3E3'
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
  title: 'Taste Tanzania. Join the movement.',
  subtitle: 'Specialty coffee roasted with precision, creating dignified work and places to belong.',
  ctaText: 'Find my coffee',
  productImages: [
    '/assets/images/community/community-is-our-favorite-blend.jpg',
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