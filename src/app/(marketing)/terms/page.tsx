export const metadata = {
  title: "Terms · OpenSleepLab",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 text-[15px] leading-relaxed text-muted-foreground">
      <p className="text-sm font-medium text-muted-foreground">OpenSleepLab</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        Terms of Use
      </h1>
      <p className="mt-3 text-sm">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="mt-6 text-lg font-semibold text-foreground">
          1. What OpenSleepLab is
        </h2>
        <p>
          OpenSleepLab offers an at-home sleep test. The service is
          informational and is not a replacement for evaluation or treatment
          by a licensed clinician. If you have symptoms of a serious sleep
          disorder, see a physician.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-foreground">
          2. Purchase and refunds
        </h2>
        <p>
          Pricing is quoted on a per-customer basis and depends on what you
          want to measure. Each plan covers the device, shipping, data
          analysis, a written report, and a consult call. Refund policy
          details are confirmed before payment and by emailing{" "}
          <a
            href="mailto:aaron@opensleeplab.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            aaron@opensleeplab.com
          </a>
          .
        </p>

        <h2 className="mt-6 text-lg font-semibold text-foreground">
          3. Your account
        </h2>
        <p>
          You sign up with email or Google. You are responsible for keeping
          your credentials secure. We may suspend accounts that abuse the
          service or attempt to access data that isn&rsquo;t theirs.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-foreground">
          4. No medical advice
        </h2>
        <p>
          The report and consult are informational. They do not constitute a
          diagnosis or prescription. Do not delay seeking professional care
          because of anything we provide.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-foreground">
          5. Limitation of liability
        </h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any
          indirect, incidental, or consequential damages arising from your use
          of the service.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-foreground">
          6. Contact
        </h2>
        <p>
          Questions about these terms:{" "}
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
