import { z } from 'zod';

export const ContactSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type ContactType = z.infer<typeof ContactSchema>;

// Subscription types and schema
export type CupsRange = "1 cup a day" | "A cup every other day" | "Two or more cups a day" | "Others";
export type BrewMethod = "Espresso" | "Pour-Over" | "French Press" | "Cold Brew";
export type GrindPref = "Whole Bean" | "Ground";
export type Schedule = "Every 4 weeks";

export const SubscriptionSchema = z.object({
  cupsRange: z.enum(["1 cup a day", "A cup every other day", "Two or more cups a day", "Others"]),
  customCups: z.number().optional(),
  brewMethod: z.enum(["Espresso", "Pour-Over", "French Press", "Cold Brew"]),
  grindPref: z.enum(["Whole Bean", "Ground"]),
  coffeeProduct: z.enum(["Nguvu", "Tunu", "Amka"]),
  schedule: z.enum(["Every 4 weeks"]),
  recommendedSize: z.string().optional(),
  calculatedPrice: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
}).refine((data) => { 
  if (data.cupsRange === "Others") {
    return data.customCups !== undefined && data.customCups > 0;
  }
  return true;
}, {
  message: "Please specify the number of cups per day",
  path: ["customCups"],
});

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;

// Order types and schema
export const OrderSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal("")),
  phone: z.string().min(1, 'Phone number is required').regex(/^[+]?[\d ()-]{6,20}$/, 'Please enter a valid phone number'),
  note: z.string().optional(),
});

export type OrderType = z.infer<typeof OrderSchema>;
