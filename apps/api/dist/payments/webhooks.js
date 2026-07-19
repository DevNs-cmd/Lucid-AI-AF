"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = handleStripeWebhook;
const stripeClient_1 = require("./stripeClient");
const env_1 = require("../config/env");
/**
 * Verifies and handles incoming Stripe webhook events.
 * Wire this into a Next.js API route, e.g. /api/webhooks/stripe,
 * passing the raw request body (do NOT JSON.parse it before this).
 *
 * Hook up `onEvent` callbacks to your user/DB layer once the DB
 * schema (users, subscriptions tables) is ready.
 */
async function handleStripeWebhook(rawBody, signature, handlers) {
    const stripe = (0, stripeClient_1.getStripe)();
    const webhookSecret = (0, env_1.requireKey)(env_1.env.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET");
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.client_reference_id || session.metadata?.userId;
            if (userId && session.subscription) {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                await handlers.onSubscriptionActive?.(userId, subscription);
            }
            break;
        }
        case "customer.subscription.updated": {
            const subscription = event.data.object;
            const userId = subscription.metadata?.userId;
            if (userId && subscription.status === "active") {
                await handlers.onSubscriptionActive?.(userId, subscription);
            }
            break;
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const userId = subscription.metadata?.userId;
            if (userId) {
                await handlers.onSubscriptionCancelled?.(userId, subscription);
            }
            break;
        }
        case "invoice.payment_failed": {
            const invoice = event.data.object;
            const userId = invoice.metadata?.userId;
            if (userId) {
                await handlers.onPaymentFailed?.(userId, invoice);
            }
            break;
        }
        default:
            // Unhandled event types are fine to ignore.
            break;
    }
    return { received: true };
}
