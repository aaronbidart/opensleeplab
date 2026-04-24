import { redirect } from "next/navigation";
import { getPaymentLinkUrl } from "@/lib/stripe/payment-link";

export const metadata = {
  title: "Checkout · OpenSleepLab",
};

export default function CheckoutRedirectPage() {
  const payUrl = getPaymentLinkUrl();
  if (payUrl) redirect(payUrl);
  redirect("/");
}
