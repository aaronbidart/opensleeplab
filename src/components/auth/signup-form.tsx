"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getClientAuth } from "@/lib/firebase/client";
import {
  authErrorMessage,
  consumeGoogleRedirectResult,
  establishSession,
  startGoogleSignIn,
} from "@/lib/auth/client-helpers";

export function SignupForm() {
  const router = useRouter();
  const [emailPending, setEmailPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function goTo(dest: "/app" | "/checkout") {
    router.push(dest);
    router.refresh();
  }

  // Catches the return leg of `signInWithRedirect` on mobile. On cold loads
  // this is a no-op (no pending result → returns null immediately).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dest = await consumeGoogleRedirectResult();
        if (cancelled || !dest) return;
        await goTo(dest);
      } catch (err) {
        if (cancelled) return;
        setError(authErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEmailSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setEmailPending(true);
    try {
      const auth = getClientAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      await establishSession(idToken);
      await goTo("/checkout");
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
      setEmailPending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGooglePending(true);
    try {
      const result = await startGoogleSignIn("/checkout");
      if (result === "redirecting") return; // page is navigating away
      await establishSession(result.idToken);
      await goTo("/checkout");
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
      setGooglePending(false);
    }
  }

  const anyPending = emailPending || googlePending;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={anyPending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={anyPending}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={anyPending}
          className="mt-1"
        >
          {emailPending ? "Creating account…" : "Continue to payment"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handleGoogle}
        disabled={anyPending}
      >
        {googlePending ? "Signing in…" : "Continue with Google"}
      </Button>

      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
