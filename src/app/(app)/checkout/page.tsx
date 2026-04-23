import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAuthenticatedUser } from "@/lib/auth/dal";
import { ensureUserProfile } from "@/lib/db/users";
import { buildPaymentLinkUrl } from "@/lib/stripe/payment-link";

export const metadata = {
  title: "Complete your order · OpenSleepLab",
};

const INCLUDED = [
  "3 nights of at-home monitoring",
  "Clinical-grade sensors, shipped to you",
  "Report + 20-minute consult",
  "Support by WhatsApp during your test",
];

export default async function CheckoutPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  await ensureUserProfile(user);

  const payUrl = buildPaymentLinkUrl({ uid: user.uid, email: user.email });

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            One step left
          </h1>
          <p className="text-sm text-muted-foreground">
            Pay for your test, then we&rsquo;ll take care of the rest.
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                3-Night At-Home Sleep Test
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                One-time · everything included
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight">
                $500
              </span>
              <span className="text-xs text-muted-foreground">USD</span>
            </div>
          </div>

          <ul className="flex flex-col gap-2 text-sm">
            {INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            Right after payment, you&rsquo;ll be able to choose which tests
            you want to run across your three nights.
          </div>

          {payUrl ? (
            <a
              href={payUrl}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Pay $500 with Stripe
            </a>
          ) : (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              Payment link is not configured yet. Set{" "}
              <code className="font-mono text-xs">
                NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST
              </code>{" "}
              in your environment.
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Secure payment powered by Stripe. Your card details never touch
            our servers.
          </p>
        </div>

        <div className="flex justify-center text-sm">
          <Link
            href="/app"
            className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Already paid? Continue to your dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
