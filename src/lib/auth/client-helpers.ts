"use client";

import { FirebaseError } from "firebase/app";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { getClientAuth, googleProvider } from "@/lib/firebase/client";

const GOOGLE_REDIRECT_DEST_KEY = "openSleepLab.googleRedirectDest";

/**
 * Returns true for touch-first browsers (iOS Safari, Android Chrome, iPad)
 * where `signInWithPopup` is blocked or flaky. Desktop browsers — including
 * a narrow desktop window — return false.
 */
export function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPod|Opera Mini|IEMobile|Mobile/i.test(ua)) return true;
  // iPadOS 13+ reports as Mac; distinguish by touch.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
}

/**
 * Kicks off Google sign-in. Uses a popup on desktop and a full-page redirect
 * on mobile, where popups are blocked. The `dest` is where we'll send the
 * user after the redirect completes (handled by `consumeGoogleRedirectResult`
 * on page mount).
 *
 * On desktop: resolves with an idToken that the caller can pass to
 * `establishSession`.
 * On mobile: the page navigates away; the promise never resolves.
 */
export async function startGoogleSignIn(
  dest: "/app" | "/checkout",
): Promise<{ idToken: string } | "redirecting"> {
  const auth = getClientAuth();
  if (isMobileBrowser()) {
    try {
      sessionStorage.setItem(GOOGLE_REDIRECT_DEST_KEY, dest);
    } catch {
      // sessionStorage unavailable (private mode, etc.) — the redirect
      // handler will just fall back to the form's default destination.
    }
    await signInWithRedirect(auth, googleProvider);
    return "redirecting";
  }

  const { signInWithPopup } = await import("firebase/auth");
  const cred = await signInWithPopup(auth, googleProvider);
  const idToken = await cred.user.getIdToken();
  return { idToken };
}

/**
 * Call on mount of the signup/login pages. If the user is returning from a
 * Google redirect, this establishes the session cookie and returns the
 * destination path the caller should navigate to. Returns null on a cold
 * page load (no pending redirect).
 */
export async function consumeGoogleRedirectResult(): Promise<
  "/app" | "/checkout" | null
> {
  try {
    const auth = getClientAuth();
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const idToken = await result.user.getIdToken();
    await establishSession(idToken);

    let dest: string | null = null;
    try {
      dest = sessionStorage.getItem(GOOGLE_REDIRECT_DEST_KEY);
      sessionStorage.removeItem(GOOGLE_REDIRECT_DEST_KEY);
    } catch {
      dest = null;
    }
    return dest === "/checkout" ? "/checkout" : "/app";
  } catch (err) {
    console.error("Google redirect sign-in failed", err);
    throw err;
  }
}

/**
 * Posts an ID token to the session-login endpoint to mint a server-side
 * session cookie. Shared by every client-side sign-in/sign-up path.
 */
export async function establishSession(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session-login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    throw new Error("Session failed");
  }
}

/**
 * Maps Firebase auth error codes to user-facing copy. Anything we don't
 * recognize falls back to a generic message so we never leak internals.
 */
export function authErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email or password is incorrect.";
      case "auth/invalid-email":
        return "That email address looks invalid.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/email-already-in-use":
        return "An account with that email already exists. Try signing in instead.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled.";
      case "auth/popup-blocked":
        return "Your browser blocked the popup. Please allow popups and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  if (err instanceof Error && err.message === "Session failed") {
    return "We signed you in but couldn't create a session. Please try again.";
  }

  return "Something went wrong. Please try again.";
}
