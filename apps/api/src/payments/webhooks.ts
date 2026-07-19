import type Stripe from "stripe";
import { getStripe } from "./stripeClient";
import { env, requireKey } from "../config/env";

/**
 * Verifies and handles incoming Stripe webhook events.
 * Wire this into a Next.js API route, e.g. /api/webhooks/stripe,
 * passing the raw request body (do NOT JSON.parse it before this).
 *
 * Hook up `onEvent` callbacks to your user/DB layer once the DB
 * schema (users, subscriptions tables) is ready.
 */
export async function handleStripeWebhook(
  rawBody: string | Buffer,
  signature: string,
  handlers: {
    onSubscriptionActive?: (userId: string, subscription: Stripe.Subscription) => Promise<void>;
    onSubscriptionCancelled?: (userId: string, subscription: Stripe.Subscription) => Promise<void>;
    onPaymentFailed?: (userId: string, invoice: Stripe.Invoice) => Promise<void>;
  }
) {
  const stripe = getStripe();
  const webhookSecret = requireKey(env.STRIPE_WEBHOOK_SECRET, "STRIPE_WEBHOOK_SECRET");

  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await handlers.onSubscriptionActive?.(userId, subscription);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId && subscription.status === "active") {
        await handlers.onSubscriptionActive?.(userId, subscription);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await handlers.onSubscriptionCancelled?.(userId, subscription);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
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
