"use client";

import { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientAuth } from "@/lib/firebase/client";
import { authErrorMessage } from "@/lib/auth/client-helpers";

type Mode = "idle" | "submitting" | "sent";

export function ResetPasswordForm() {
  const [mode, setMode] = useState<Mode>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMode("submitting");

    try {
      await sendPasswordResetEmail(getClientAuth(), email);
      setMode("sent");
    } catch (err) {
      const message = authErrorMessage(err);

      if (message.includes("invalid")) {
        setError(message);
        setMode("idle");
        return;
      }

      // Never confirm whether an email exists. Show the "sent" state anyway.
      console.error(err);
      setMode("sent");
    }
  }

  if (mode === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-5 text-sm">
        <h2 className="text-base font-semibold">Check your email</h2>
        <p className="text-muted-foreground">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          link to reset your password. Click the link and follow the
          instructions.
        </p>
        <p className="text-muted-foreground">
          Don&apos;t see it? Check your <strong>junk or spam folder</strong> —
          password reset emails sometimes end up there.
        </p>
      </div>
    );
  }

  const submitting = mode === "submitting";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reset-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="reset-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-1">
        {submitting ? "Sending…" : "Send reset link"}
      </Button>

      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}
    </form>
  );
}
