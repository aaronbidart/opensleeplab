import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export type Lead = {
  name: string;
  email: string;
  whatsappNumber: string;
  source?: string;
  userAgent?: string | null;
  referer?: string | null;
};

export type SavedLead = Lead & {
  id: string;
  createdAt: string;
};

/**
 * Persists an inbound lead from the marketing site. Server-only — relies on
 * the Firebase Admin SDK so writes bypass Firestore security rules. The
 * `leads` collection stays locked down for client reads/writes via the
 * catch-all rule in firestore.rules.
 */
export async function createLead(lead: Lead): Promise<SavedLead> {
  const ref = await getAdminDb()
    .collection("leads")
    .add({
      ...lead,
      createdAt: FieldValue.serverTimestamp(),
    });

  return {
    id: ref.id,
    createdAt: new Date().toISOString(),
    ...lead,
  };
}
