"use server";

import { headers } from "next/headers";
import { createLead } from "@/lib/db/leads";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Loose E.164 check: + followed by 8-15 digits. Stripe / WhatsApp will do
// stricter validation downstream when we actually reach out.
const PHONE_RE = /^\+?[1-9]\d{7,14}$/;

function normalizePhone(raw: string): string {
  const trimmed = raw.replace(/[\s\-().]/g, "");
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export async function submitLeadAction(
  _prev: SubmitLeadResult | null,
  formData: FormData,
): Promise<SubmitLeadResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsappRaw = String(formData.get("whatsapp") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim() || "marketing";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > 120)
    return { ok: false, error: "Please use a shorter name." };

  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." };

  if (!whatsappRaw)
    return { ok: false, error: "Please enter your WhatsApp number." };

  const whatsappNumber = normalizePhone(whatsappRaw);
  if (!PHONE_RE.test(whatsappNumber.replace(/^\+/, ""))) {
    return {
      ok: false,
      error:
        "That doesn't look like a valid phone number. Include your country code.",
    };
  }

  const h = await headers();
  const userAgent = h.get("user-agent");
  const referer = h.get("referer");

  try {
    await createLead({
      name,
      email,
      whatsappNumber,
      source,
      userAgent,
      referer,
    });
  } catch (err) {
    console.error("[submitLead] Failed to save lead:", err);
    return {
      ok: false,
      error:
        "Something went wrong saving your details. Please WhatsApp us directly at +1 902 567 5505.",
    };
  }

  return { ok: true };
}
