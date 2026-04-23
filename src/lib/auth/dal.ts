import "server-only";
import { cache } from "react";
import { getAdminAuth } from "@/lib/firebase/admin";
import { readSessionCookie } from "@/lib/auth/session";

export type AuthenticatedUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
};

/**
 * Returns the authenticated user for the current request, or `null` if the
 * session cookie is missing or invalid. Cached per-request via React.cache,
 * so multiple calls within a single render share one Firebase verification.
 */
export const getAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    const sessionCookie = await readSessionCookie();
    if (!sessionCookie) return null;

    try {
      const decoded = await getAdminAuth().verifySessionCookie(
        sessionCookie,
        true,
      );

      return {
        uid: decoded.uid,
        email: decoded.email ?? null,
        emailVerified: decoded.email_verified === true,
        displayName: (decoded.name as string | undefined) ?? null,
        photoURL: (decoded.picture as string | undefined) ?? null,
      };
    } catch {
      return null;
    }
  },
);
