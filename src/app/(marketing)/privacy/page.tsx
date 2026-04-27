export const metadata = {
  title: "Privacy · OpenSleepLab",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-[15px] leading-relaxed text-muted-foreground">
      <p className="text-sm font-medium text-muted-foreground">OpenSleepLab</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Privacy
      </h1>
      <p className="mt-3 text-sm">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </p>

      <section className="mt-8 space-y-4">
        <p>
          OpenSleepLab sells an at-home sleep test. This page explains what
          data we collect, why, and what we do with it.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-foreground">
          What we collect
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Account info
            </strong>{" "}
            — your email (and display name / photo if you sign in with
            Google), used for authentication via Firebase.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Payment details
            </strong>{" "}
            — handled by Stripe. We never see your full card number. We store
            the Stripe customer and payment IDs plus the amount paid.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Contact info
            </strong>{" "}
            — the WhatsApp number you provide after payment, used for support
            during the test.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-foreground">
          What we don&rsquo;t do
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Sell your data. Ever.</li>
          <li>Share your individual data with third parties for advertising.</li>
          <li>Use your audio, camera, microphone, or location from this website.</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-foreground">
          Processors we use
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-foreground">
              Google Firebase
            </strong>{" "}
            — authentication + Firestore database.
          </li>
          <li>
            <strong className="font-medium text-foreground">Stripe</strong> —
            payment processing.
          </li>
          <li>
            <strong className="font-medium text-foreground">Vercel</strong> —
            web hosting.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-foreground">
          Deleting your data
        </h2>
        <p>
          Email us from the address associated with your account and we will
          delete your account and all associated data within 7 days.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions or requests:{" "}
          <a
            href="mailto:aaron@opensleeplab.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            aaron@opensleeplab.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
