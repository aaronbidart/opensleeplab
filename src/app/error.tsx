"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        We hit an unexpected error.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Try again in a moment. If it keeps happening, refreshing usually helps.
      </p>
      <Button onClick={reset} size="lg" className="mt-8">
        Try again
      </Button>
    </main>
  );
}
