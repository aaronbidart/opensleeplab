import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaymentLinkUrl } from "@/lib/stripe/payment-link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <MarketingFooter />
    </div>
  );
}

function MarketingHeader() {
  const payUrl = getPaymentLinkUrl();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          OpenSleepLab
        </Link>
        {payUrl ? (
          <a href={payUrl} className={cn(buttonVariants({ size: "sm" }))}>
            Get your test
          </a>
        ) : null}
      </div>
    </header>
  );
}

function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} OpenSleepLab.</p>
        <nav className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
