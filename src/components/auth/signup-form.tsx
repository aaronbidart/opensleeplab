"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getClientAuth, googleProvider } from "@/lib/firebase/client";
import { authErrorMessage, establishSession } from "@/lib/auth/client-helpers";

export function SignupForm() {
  const router = useRouter();
  const [emailPending, setEmailPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Unlike sleepmax, we do NOT wait for email verification — the user paid
  // intent is high and we want them at the Stripe page as fast as possible.
  async function goToCheckout() {
    router.push("/checkout");
    router.refresh();
  }

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
      await goToCheckout();
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
      const cred = await signInWithPopup(getClientAuth(), googleProvider);
      const idToken = await cred.user.getIdToken();
      await establishSession(idToken);
      await goToCheckout();
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
