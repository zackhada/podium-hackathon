import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2023-10-16" }) : null;

export async function chargeTestCard(
  amountDollars: number,
  tenantEmail: string
): Promise<{ success: boolean; chargeId?: string }> {
  if (!stripe) {
    console.log(`[Stripe] Simulated charge: $${amountDollars} for ${tenantEmail}`);
    return { success: true, chargeId: `sim_${Date.now()}` };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountDollars * 100),
    currency: "usd",
    payment_method: "pm_card_visa",
    confirm: true,
    receipt_email: tenantEmail,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  return { success: true, chargeId: paymentIntent.id };
}
