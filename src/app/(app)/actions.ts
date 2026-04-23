"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/auth/dal";
import { setWhatsappNumber } from "@/lib/db/users";

export type SaveWhatsappResult =
  | { ok: true }
  | { ok: false; error: string };

// Loose E.164 check: + followed by 8-15 digits. Good enough for a contact
// field; Stripe / WhatsApp will do the heavy-duty validation downstream.
const E164 = /^\+?[1-9]\d{7,14}$/;

function normalize(raw: string): string {
  const trimmed = raw.replace(/[\s\-().]/g, "");
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export async function saveWhatsappNumberAction(
  _prev: SaveWhatsappResult | null,
  formData: FormData,
): Promise<SaveWhatsappResult> {
  const user = await getAuthenticatedUser();
  if (!user) return { ok: false, error: "You're not signed in." };

  const raw = String(formData.get("whatsapp") ?? "").trim();
  if (!raw) return { ok: false, error: "Enter your WhatsApp number." };

  const normalized = normalize(raw);
  if (!E164.test(normalized.replace(/^\+/, ""))) {
    return {
      ok: false,
      error: "That doesn't look like a valid phone number. Include country code.",
    };
  }

  await setWhatsappNumber(user.uid, normalized);
  revalidatePath("/app");
  return { ok: true };
}
