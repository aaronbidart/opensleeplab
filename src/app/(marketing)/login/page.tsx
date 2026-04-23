import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getAuthenticatedUser } from "@/lib/auth/dal";

export const metadata = {
  title: "Sign in · OpenSleepLab",
};

export default async function LoginPage() {
  const user = await getAuthenticatedUser();
  if (user) redirect("/app");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your OpenSleepLab account.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            Order a test
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
