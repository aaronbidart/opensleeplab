import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset password · OpenSleepLab",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the email for your account and we&apos;ll send you a link to
            choose a new password.
          </p>
        </div>

        <ResetPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
