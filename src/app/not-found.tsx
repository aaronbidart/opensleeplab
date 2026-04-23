import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        It may have moved, or the link you followed might be wrong.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "mt-8")}
      >
        Back home
      </Link>
    </main>
  );
}
