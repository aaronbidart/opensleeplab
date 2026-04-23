import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  lastLoginAt?: string;

  // Post-payment app data
  whatsappNumber?: string | null;
  whatsappUpdatedAt?: string | null;
};

function userDocRef(uid: string) {
  return getAdminDb().collection("users").doc(uid);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await userDocRef(uid).get();
  if (!snap.exists) return null;
  return { uid, ...(snap.data() as Omit<UserProfile, "uid">) };
}

/**
 * Creates the user doc on first sight, refreshes profile metadata on
 * subsequent logins.
 */
export async function ensureUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<UserProfile> {
  const ref = userDocRef(user.uid);
  const snap = await ref.get();
  const now = new Date().toISOString();

  if (!snap.exists) {
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: now,
      lastLoginAt: now,
    };
    await ref.set(profile);
    return profile;
  }

  await ref.set(
    {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: now,
    },
    { merge: true },
  );

  return { uid: user.uid, ...(snap.data() as Omit<UserProfile, "uid">) };
}

export async function setWhatsappNumber(
  uid: string,
  whatsappNumber: string,
): Promise<void> {
  await userDocRef(uid).set(
    {
      whatsappNumber,
      whatsappUpdatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
