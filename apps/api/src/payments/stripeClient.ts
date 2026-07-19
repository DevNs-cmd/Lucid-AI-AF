import Stripe from "stripe";
import { env, requireKey } from "../config/env";

let _stripe: Stripe | null = null;

/** Lazily-created Stripe client — only errors when actually used, not at import time. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const apiKey = requireKey(env.STRIPE_SECRET_KEY, "STRIPE_SECRET_KEY");
    _stripe = new Stripe(apiKey, { apiVersion: "2024-04-10" });
  }
  return _stripe;
}
