// Coffee pricing — the single source of truth for the whole site.
//
// Every price shown anywhere (the rituals quiz, the pricing table, the
// subscription wizards, the product cards, Safari ya Ladha) is derived from
// PRICE_PER_BAG below. Change a number here and the site follows.
//
// Prices are TZS for one 250g bag. Larger bags are priced pro rata:
// bag size ÷ 250 × the bag price. Nothing else is added.

export const COFFEE_NAMES = ["Amka", "Mirumbani", "Nguvu", "Tunu"] as const;

export type CoffeeName = (typeof COFFEE_NAMES)[number];

/** The bag every coffee is quoted against. */
export const BASE_BAG_GRAMS = 250;

/** TZS for one 250g bag. */
export const PRICE_PER_BAG: Record<CoffeeName, number> = {
  Amka: 18000,
  Mirumbani: 22000,
  Nguvu: 23000,
  Tunu: 25000,
};

/** Used when a coffee has not been chosen yet. */
export const DEFAULT_COFFEE: CoffeeName = "Nguvu";

/** The lowest bag price in the catalogue — what "from TZS …" means. */
export const CHEAPEST_BAG = Math.min(...Object.values(PRICE_PER_BAG));

export const isCoffeeName = (name: string): name is CoffeeName =>
  Object.prototype.hasOwnProperty.call(PRICE_PER_BAG, name);

/** TZS for one 250g bag of `coffee`, falling back to the default coffee. */
export const priceForBag = (coffee: string): number =>
  isCoffeeName(coffee) ? PRICE_PER_BAG[coffee] : PRICE_PER_BAG[DEFAULT_COFFEE];

/** TZS for any weight of `coffee`, pro rata from the 250g bag. */
export const priceForGrams = (coffee: string, grams: number): number =>
  Math.round((priceForBag(coffee) / BASE_BAG_GRAMS) * grams);

/** "18,000" — digits only, for places that print their own currency word. */
export const amount = (value: number): string => value.toLocaleString("en-US");

/** "TZS 18,000". Pass "TSH" where the page uses that spelling. */
export const money = (value: number, currency = "TZS"): string =>
  `${currency} ${amount(value)}`;

/** "TZS 18,000" for one 250g bag. */
export const bagPrice = (coffee: string, currency = "TZS"): string =>
  money(priceForBag(coffee), currency);

/** "TZS 18,000" — the cheapest bag, for "from" copy. */
export const fromPrice = (currency = "TZS"): string =>
  money(CHEAPEST_BAG, currency);

/** The cheapest bag scaled to `grams` — "from" copy for a sized delivery. */
export const fromPriceForGrams = (grams: number, currency = "TZS"): string =>
  money(Math.round((CHEAPEST_BAG / BASE_BAG_GRAMS) * grams), currency);
