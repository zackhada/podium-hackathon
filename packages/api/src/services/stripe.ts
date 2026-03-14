// Stripe service — test mode only.
// Wraps Stripe SDK calls for charging tenants.
// TODO: Initialize Stripe with STRIPE_SECRET_KEY from env.

import Stripe from "stripe";

// TODO: const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

/**
 * Create a test payment intent for the given amount (in dollars).
 * Uses Stripe test card tok_visa by default.
 */
export async function chargeTestCard(
  _amountDollars: number,
  _tenantEmail: string
): Promise<{ success: boolean; chargeId?: string }> {
  // TODO:
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(amountDollars * 100),
  //   currency: "usd",
  //   payment_method: "pm_card_visa",
  //   confirm: true,
  //   receipt_email: tenantEmail,
  // });
  // return { success: true, chargeId: paymentIntent.id };
  return { success: false };
}
