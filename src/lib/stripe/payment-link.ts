/**
 * Builds the Stripe Payment Link URL with the user's email prefilled and
 * their Firebase UID stamped as `client_reference_id`. When Stripe webhooks
 * are wired up later, `client_reference_id` is how we'll map a payment back
 * to a Firebase user.
 *
 * Callable from both server and client code — reads the base link from a
 * `NEXT_PUBLIC_…` env var so it's available in the browser.
 */
export function buildPaymentLinkUrl({
  uid,
  email,
}: {
  uid: string;
  email: string | null;
}): string | null {
  const base = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST;
  if (!base) return null;

  const url = new URL(base);
  url.searchParams.set("client_reference_id", uid);
  if (email) url.searchParams.set("prefilled_email", email);
  return url.toString();
}
