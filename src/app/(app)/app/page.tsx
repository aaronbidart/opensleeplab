import Link from "next/link";

export const metadata = {
  title: "Thanks · OpenSleepLab",
};

export default function AppThanksPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border border-border/70 bg-card p-10 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          You&rsquo;re all set.
        </h1>
        <p className="text-muted-foreground">
          Thanks for your order. We received your payment and will reach out
          by email with next steps — including what you want measured across
          your three nights — within one business day.
        </p>
        <p className="text-sm text-muted-foreground">
          Questions in the meantime:{" "}
          <a
            href="mailto:support@opensleeplab.com"
            className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            support@opensleeplab.com
          </a>
        </p>
        <Link
          href="/"
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
