"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveWhatsappNumberAction,
  type SaveWhatsappResult,
} from "@/app/(app)/actions";

export function WhatsappForm({
  initialNumber,
}: {
  initialNumber: string | null;
}) {
  const [state, formAction, pending] = useActionState<
    SaveWhatsappResult | null,
    FormData
  >(saveWhatsappNumberAction, null);

  const [value, setValue] = useState(initialNumber ?? "");
  const showSaved = state?.ok === true;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-sm font-medium">
          WhatsApp number
        </label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+1 555 555 1234"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={pending}
          required
        />
        <p className="text-xs text-muted-foreground">
          Include your country code. We use this only for support messages
          during your test.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {showSaved ? (
          <span className="text-sm text-muted-foreground">Saved.</span>
        ) : null}
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}
