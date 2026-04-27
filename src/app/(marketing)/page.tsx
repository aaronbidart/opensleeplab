import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LeadInquiryButton } from "@/components/marketing/lead-form-dialog";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <WhatsIncluded />
      <HowItWorks />
      <PricingCTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,theme(colors.muted)_0%,transparent_60%)]"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-20 pt-24 text-center sm:pt-28">
        <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          At-home · multi-night · custom plan
        </span>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Measure your sleep. Then make it better.
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Multi-night clinical-grade monitoring, a clean report, and a
          personalized protocol. Built for deeper recovery, sharper days, or
          whatever you&rsquo;re trying to fix.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <LeadInquiryButton source="hero">Get in touch</LeadInquiryButton>
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
    title: "Multi-night monitoring",
    body: "One night is noise. A few nights gives us a signal you can act on.",
  },
  {
    title: "Lab-quality, at home",
    body: "The same signals a sleep lab captures — without the wires, the clinic, or the cost. We can also cross-check against your Apple Watch, Whoop, Oura, or Fitbit so you finally know what those numbers mean.",
  },
  {
    title: "Plain-language report",
    body: "What we found and what it means, written in language that doesn’t require a medical degree. Plus a call to walk through it together.",
  },
  {
    title: "Personalized protocol",
    body: "Concrete recommendations across exercise, supplements, and lifestyle — built around the data and what you’re trying to improve.",
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
            Everything you need to understand your sleep — and improve it.
            Whether you&rsquo;re an athlete chasing deeper sleep for recovery,
            an entrepreneur after sharper REM, or just tired of falling asleep
            at 2am.
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
    title: "Tell us about you",
    body: "Share your details and message us on WhatsApp. We'll figure out together what you want to measure and what you want to improve.",
  },
  {
    step: "02",
    title: "Wear it for a few nights",
    body: "A few minutes to set up each night. No wires, no clinic.",
  },
  {
    step: "03",
    title: "Get your report + protocol",
    body: "Plain-language results, a personalized protocol to act on, and a call to walk through it.",
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
            Three steps. No clinic visit. Results you can actually read and
            act on.
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

function PricingCTA() {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-3xl px-6 py-20">
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-border/70 bg-card p-8 text-center sm:p-12">
          <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Custom · Built around what you want to improve
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Every test is a little different.
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Tell us what you&rsquo;re trying to figure out, whether
            that&rsquo;s better recovery, faster sleep onset, or sharper days.
            We&rsquo;ll talk it through one-on-one and quote a plan that fits.
          </p>
          <LeadInquiryButton source="pricing-cta" className="mt-2">
            Get in touch
          </LeadInquiryButton>
        </div>
      </div>
    </section>
  );
}
