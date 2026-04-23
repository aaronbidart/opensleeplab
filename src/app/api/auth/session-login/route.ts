import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { idToken } = (await request.json().catch(() => ({}))) as {
    idToken?: string;
  };

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    await createSessionCookie(idToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("session-login failed", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
