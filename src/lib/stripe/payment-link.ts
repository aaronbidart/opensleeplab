/**
 * Returns the Stripe Payment Link URL, or null if not configured.
 * Callable from server and client components — reads a `NEXT_PUBLIC_…`
 * env var so it's available in the browser bundle too.
 */
export function getPaymentLinkUrl(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST ?? null;
}
