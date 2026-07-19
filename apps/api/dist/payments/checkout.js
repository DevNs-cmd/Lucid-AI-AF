"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = createCheckoutSession;
exports.createBillingPortalSession = createBillingPortalSession;
const stripeClient_1 = require("./stripeClient");
const plans_1 = require("./plans");
const env_1 = require("../config/env");
/** Creates a Stripe Checkout session to upgrade a user to Pro. */
async function createCheckoutSession(params) {
    const stripe = (0, stripeClient_1.getStripe)();
    const priceId = params.interval === "yearly" ? plans_1.PLANS.pro.priceIdYearly : plans_1.PLANS.pro.priceIdMonthly;
    if (!priceId) {
        throw new Error(`[LUCID AI] Stripe price ID for Pro (${params.interval}) is not set yet. Add it once created in the Stripe dashboard.`);
    }
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: params.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${env_1.env.CLIENT_URL}/dashboard?upgrade=success`,
        cancel_url: `${env_1.env.CLIENT_URL}/pricing?upgrade=cancelled`,
        client_reference_id: params.userId,
        metadata: { userId: params.userId },
    });
    return { url: session.url };
}
/** Creates a Stripe billing portal session so a user can manage/cancel their subscription. */
async function createBillingPortalSession(stripeCustomerId) {
    const stripe = (0, stripeClient_1.getStripe)();
    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${env_1.env.CLIENT_URL}/dashboard`,
    });
    return { url: session.url };
}
