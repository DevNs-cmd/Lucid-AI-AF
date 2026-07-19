import { getStripe } from "./stripeClient";
import { PLANS, BillingInterval } from "./plans";
import { env } from "../config/env";

/** Creates a Stripe Checkout session to upgrade a user to Pro. */
export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  interval: BillingInterval;
}) {
  const stripe = getStripe();
  const priceId =
    params.interval === "yearly" ? PLANS.pro.priceIdYearly : PLANS.pro.priceIdMonthly;

  if (!priceId) {
    throw new Error(
      `[LUCID AI] Stripe price ID for Pro (${params.interval}) is not set yet. Add it once created in the Stripe dashboard.`
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.CLIENT_URL}/dashboard?upgrade=success`,
    cancel_url: `${env.CLIENT_URL}/pricing?upgrade=cancelled`,
    client_reference_id: params.userId,
    metadata: { userId: params.userId },
  });

  return { url: session.url };
}

/** Creates a Stripe billing portal session so a user can manage/cancel their subscription. */
export async function createBillingPortalSession(stripeCustomerId: string) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.CLIENT_URL}/dashboard`,
  });
  return { url: session.url };
}
