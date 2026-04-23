"use client";

import { FirebaseError } from "firebase/app";

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
