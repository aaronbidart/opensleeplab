"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export function LoginForm() {
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

  async function handleEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailPending(true);
    try {
      const auth = getClientAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      await establishSession(idToken);
      await goTo("/app");
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
    } finally {
      setEmailPending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGooglePending(true);
    try {
      const result = await startGoogleSignIn("/app");
      if (result === "redirecting") return; // page is navigating away
      await establishSession(result.idToken);
      await goTo("/app");
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
    } finally {
      setGooglePending(false);
    }
  }

  const anyPending = emailPending || googlePending;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleEmail} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={anyPending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
              tabIndex={anyPending ? -1 : 0}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={anyPending}
          />
        </div>

        <Button type="submit" size="lg" disabled={anyPending} className="mt-1">
          {emailPending ? "Signing in…" : "Sign in"}
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
