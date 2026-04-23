"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getClientAuth } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/session-logout", { method: "POST" });
      await signOut(getClientAuth()).catch(() => undefined);
      startTransition(() => {
        router.replace("/");
        router.refresh();
      });
    } finally {
      setPending(false);
    }
  }

  const busy = pending || isPending;

  return (
    <Button
      onClick={handleLogout}
      disabled={busy}
      size="sm"
      variant="ghost"
      className="text-muted-foreground hover:text-foreground"
    >
      {busy ? "Signing out…" : "Sign out"}
    </Button>
  );
}
