import { env } from "../config/env";

/** Mirrors the Free / Pro plans from the revenue model doc. */
export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    priceId: null,
    features: [
      "10 chapters/day",
      "3 worlds",
      "Limited artwork",
      "Standard AI",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceIdMonthly: env.STRIPE_PRICE_ID_PRO_MONTHLY,
    priceIdYearly: env.STRIPE_PRICE_ID_PRO_YEARLY,
    features: [
      "Unlimited stories",
      "Premium AI models",
      "Voice conversations",
      "Cinematic scenes",
      "Long-term memory",
      "Early access to new worlds",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type BillingInterval = "monthly" | "yearly";
