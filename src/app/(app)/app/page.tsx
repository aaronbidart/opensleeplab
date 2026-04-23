import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/dal";
import { ensureUserProfile, getUserProfile } from "@/lib/db/users";
import { WhatsappForm } from "@/components/app/whatsapp-form";

export const metadata = {
  title: "Dashboard · OpenSleepLab",
};

export default async function AppDashboard() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  await ensureUserProfile(user);
  const profile = await getUserProfile(user.uid);

  const firstName = profile?.displayName?.split(" ")[0];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hi{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="text-muted-foreground">
          Welcome to OpenSleepLab. If you haven&rsquo;t paid for your test
          yet, start{" "}
          <Link
            href="/checkout"
            className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
          >
            here
          </Link>
          . Otherwise, drop your WhatsApp number below so we can reach you
          during the test.
        </p>
      </section>

      <section className="rounded-xl border border-border/70 bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-base font-semibold tracking-tight">
            Contact number
          </h2>
          <p className="text-sm text-muted-foreground">
            Used for support during your test. You can update this any time.
          </p>
        </div>
        <WhatsappForm initialNumber={profile?.whatsappNumber ?? null} />
      </section>
    </div>
  );
}
