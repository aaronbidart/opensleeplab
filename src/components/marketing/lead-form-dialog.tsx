"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  submitLeadAction,
  type SubmitLeadResult,
} from "@/app/(marketing)/actions";

const WHATSAPP_NUMBER = "+1 902 567 5505";
const WHATSAPP_LINK = "https://wa.me/19025675505";

type Props = {
  children: React.ReactNode;
  source?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

/**
 * Renders a trigger button that opens a dialog with a short lead-capture
 * form (name, email, WhatsApp). On submit we save the lead and surface
 * Aaron's WhatsApp number so the customer can reach out directly.
 */
export function LeadInquiryButton({
  children,
  source,
  className,
  variant = "default",
  size = "lg",
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<
    SubmitLeadResult | null,
    FormData
  >(submitLeadAction, null);

  // Reset the action state when the dialog reopens so a returning visitor
  // gets a fresh form rather than stale success/error UI.
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => setResetKey((k) => k + 1), 200);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const submitted = state?.ok === true;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-border/70 bg-card p-6 shadow-xl outline-none sm:p-7",
            "transition duration-200",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          )}
        >
          {submitted ? (
            <SuccessView onClose={() => setOpen(false)} />
          ) : (
            <FormView
              key={resetKey}
              formAction={formAction}
              pending={pending}
              error={state && !state.ok ? state.error : null}
              source={source}
              onCancel={() => setOpen(false)}
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FormView({
  formAction,
  pending,
  error,
  source,
  onCancel,
}: {
  formAction: (formData: FormData) => void;
  pending: boolean;
  error: string | null;
  source?: string;
  onCancel: () => void;
}) {
  return (
    <>
      <Dialog.Title className="text-lg font-semibold tracking-tight">
        Tell us a bit about you
      </Dialog.Title>
      <Dialog.Description className="mt-1.5 text-sm text-muted-foreground">
        Drop your details and we&rsquo;ll reach out on WhatsApp to scope a
        plan that fits — pricing depends on what you want to measure.
      </Dialog.Description>

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        <input type="hidden" name="source" value={source ?? "marketing"} />

        <Field id="lead-name" label="Name">
          <Input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            disabled={pending}
            required
            maxLength={120}
          />
        </Field>

        <Field id="lead-email" label="Email">
          <Input
            id="lead-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={pending}
            required
          />
        </Field>

        <Field
          id="lead-whatsapp"
          label="WhatsApp number"
          hint="Include your country code so we can reach you."
        >
          <Input
            id="lead-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 555 555 1234"
            disabled={pending}
            required
          />
        </Field>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Dialog.Close
            type="button"
            onClick={onCancel}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "sm:w-auto",
            )}
            disabled={pending}
          >
            Cancel
          </Dialog.Close>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Send"}
          </Button>
        </div>
      </form>
    </>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Dialog.Title className="text-lg font-semibold tracking-tight">
        Got it — talk soon.
      </Dialog.Title>
      <Dialog.Description className="text-sm leading-relaxed text-muted-foreground">
        Hi please contact aaron on whatsapp at{" "}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
        >
          {WHATSAPP_NUMBER}
        </a>
        .
      </Dialog.Description>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className={cn(buttonVariants({ size: "lg" }), "mt-1 w-full sm:w-auto")}
      >
        Open WhatsApp
      </a>

      <Dialog.Close
        type="button"
        onClick={onClose}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "self-end",
        )}
      >
        Close
      </Dialog.Close>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
