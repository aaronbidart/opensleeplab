import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { getAuthenticatedUser } from "@/lib/auth/dal";

export const metadata = {
  title: "Create account · OpenSleepLab",
};

export default async function SignupPage() {
  const user = await getAuthenticatedUser();
  // Already signed in? `/app` figures out paid vs. unpaid routing.
  if (user) redirect("/app");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Order your sleep test
          </h1>
          <p className="text-sm text-muted-foreground">
            Create an account, then pay securely. Takes under a minute.
          </p>
        </div>

        <SignupForm />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Privacy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
