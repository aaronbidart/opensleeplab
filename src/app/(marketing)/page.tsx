import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaymentLinkUrl } from "@/lib/stripe/payment-link";

export default function LandingPage() {
  const payUrl = getPaymentLinkUrl();

  return (
    <main className="flex flex-1 flex-col">
      <Hero payUrl={payUrl} />
      <WhatsIncluded />
      <HowItWorks />
      <PricingCTA payUrl={payUrl} />
    </main>
  );
}

function BuyButton({
  payUrl,
  className,
}: {
  payUrl: string | null;
  className?: string;
}) {
  if (!payUrl) {
    return (
      <span
        className={cn(
          buttonVariants({ size: "lg" }),
          "pointer-events-none opacity-50",
          className,
        )}
      >
        Payment link unavailable
      </span>
    );
  }
  return (
    <a
      href={payUrl}
      className={cn(buttonVariants({ size: "lg" }), className)}
    >
      Get your test — $500
    </a>
  );
}

function Hero({ payUrl }: { payUrl: string | null }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.muted)_0%,transparent_60%)]"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-20 pt-24 text-center sm:pt-28">
        <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          At-home · 3 nights · USD $500
        </span>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          A proper sleep test, at home.
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Three nights of clinical-grade monitoring, a clean report, and a real
          person to walk you through what it means.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <BuyButton payUrl={payUrl} />
          <Link
            href="#how-it-works"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}

const INCLUDED = [
  {
    title: "3 nights of monitoring",
    body: "One night is noise. Three nights gives us a signal you can act on.",
  },
  {
    title: "Clinical-grade sensors",
    body: "EEG, EOG, heart rate, breathing, airflow, SpO₂, movement, temperature, and sound — the same signals a lab captures.",
  },
  {
    title: "Report + consult",
    body: "A plain-language report and a call to walk through what it means for you.",
  },
  {
    title: "WhatsApp support",
    body: "A direct line to a real human while the device is at your door.",
  },
];

function WhatsIncluded() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What&rsquo;s included
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to understand your sleep — nothing you
            don&rsquo;t.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-border/70 bg-card p-6"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Order your test",
    body: "Sign up, pay, and choose what you want to measure across your three nights.",
  },
  {
    step: "02",
    title: "Wear it for 3 nights",
    body: "A few minutes to set up each night. No wires, no clinic.",
  },
  {
    step: "03",
    title: "Get your report",
    body: "We turn the data into a plain-language report and book a call to walk through it.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps. No clinic visit. Results you can actually read.
          </p>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-xl border border-border/70 bg-card p-6"
            >
              <div className="text-xs font-mono text-muted-foreground">
                {s.step}
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PricingCTA({ payUrl }: { payUrl: string | null }) {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-3xl px-6 py-20">
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-border/70 bg-card p-8 text-center sm:p-12">
          <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            One-time · Everything included
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight">$500</span>
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            3 nights. Shipping, report, and consult — included.
          </h2>
          <p className="max-w-lg text-muted-foreground">
            No subscription. No add-ons. Pay once, sleep, get answers.
          </p>
          <BuyButton payUrl={payUrl} className="mt-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            Secure payment powered by Stripe.
          </p>
        </div>
      </div>
    </section>
  );
}
