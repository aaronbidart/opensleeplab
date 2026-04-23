# OpenSleepLab · Setup

Operator handoff for getting OpenSleepLab running locally, wiring up the Stripe Payment Link, deploying Firestore rules, and shipping to Vercel at `opensleeplab.com`.

Assumes you have the repo cloned and `pnpm` installed.

---

## 0. Prerequisites

- Node.js 20.9+ (`node -v`)
- pnpm 9+ (`pnpm -v`)
- A Google account that will own the Firebase project
- A Stripe account
- `firebase-tools` CLI (`pnpm add -g firebase-tools`, then `firebase login`)

---

## 1. Firebase project

### 1a. Create the project

1. Go to <https://console.firebase.google.com> → **Add project**.
2. Display name: **OpenSleepLab**. Uncheck Google Analytics.

### 1b. Enable authentication

1. Build → Authentication → Get started.
2. Sign-in method → **Email/Password** → Enable. Leave "Email link (passwordless)" **off**.
3. Sign-in method → **Google** → Enable.
   - Public-facing name: `OpenSleepLab` (details below in §1f)
   - Support email: your support email

### 1c. Create Firestore

1. Build → Firestore Database → Create database.
2. **Production mode** (rules deny by default).
3. Location: `nam5` (US multi-region).
4. After creation: Firestore → **⋯ Settings → Point-in-time recovery → Enable**.

### 1d. Register the web app

1. Project settings (gear icon) → **Your apps** → Add app → Web.
2. Nickname: `OpenSleepLab`. Skip Firebase Hosting.
3. Copy the `firebaseConfig` values into `.env.local`.

### 1e. Generate a service-account key

1. Project settings → **Service accounts** → Generate new private key.
2. A JSON downloads. Copy `project_id`, `client_email`, and `private_key` into `.env.local`, then delete the JSON.

### 1f. Change the public-facing project name (fixes "%APP_NAME%" in emails)

By default Firebase sets the public name to something like `project-886533588927`, which shows up in the subject line of verification / password-reset emails and on the Google OAuth consent screen. Fix it once:

1. Project settings → **General** tab → **Public-facing name** → change to **OpenSleepLab** → Save.
2. (Or from Authentication → Sign-in method → Google → the "project-level setting" link — same field.)

### 1g. Authorized domains

Authentication → Settings → **Authorized domains**. The initial list has `localhost` and `<project-id>.firebaseapp.com`; add:

- `opensleeplab.com`
- `www.opensleeplab.com`
- your Vercel preview domain, e.g. `opensleeplab.vercel.app` (you'll get the exact one after deploying)

Google sign-in silently fails from any domain not on this list, so don't skip it.

---

## 2. Stripe (Payment Link flow, v1)

### 2a. Create the product + Payment Link

1. Stripe Dashboard → **Test mode** (toggle top-right).
2. Products → **Add product**.
   - Name: `OpenSleepLab 3-Night Sleep Test`
   - Pricing: **One-time**, **$490.00 USD**
3. On the product page → **Create payment link**.
   - Collect customer email: **on**
   - After payment → **Don't show confirmation page, redirect customers to your website** → URL: `https://opensleeplab.com/app` (use `http://localhost:3000/app` for testing)
4. Copy the Payment Link URL (looks like `https://buy.stripe.com/…`) → this goes into `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST`.

The app appends `?client_reference_id=<firebaseUID>&prefilled_email=<user email>` automatically at runtime so that:

- The customer lands on Stripe with their email prefilled.
- Every payment is stamped with the Firebase UID — which is how webhooks will reconcile back to users **later** (see §2c).

### 2b. Going live

Flip Stripe to **Live mode**, re-create the product and Payment Link there, and swap `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST` in Vercel to the live URL. Redeploy.

### 2c. (Later) Turning webhooks on

Not part of v1. When you're ready:

1. Re-introduce `/api/stripe/webhook`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
2. Subscribe to `checkout.session.completed`.
3. Inside the handler, read `session.client_reference_id` (the Firebase UID) and write `users/{uid}.paidAt`.
4. Reinstate the paid gate on `/app`.

The Payment Link already carries `client_reference_id`, so no migration work is needed on the payment side — just the receiver.

---

## 3. Environment variables

1. `cp .env.local.example .env.local`
2. Paste in the values collected above. The admin private key needs to stay wrapped in double quotes with literal `\n` escapes — the admin SDK decodes them at runtime:

   ```
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

3. `NEXT_PUBLIC_APP_URL=http://localhost:3000` for dev, `https://opensleeplab.com` for prod.

---

## 4. Firestore security rules

Paste this into the Rules tab in the Firebase console (Firestore Database → Rules) and publish. They're also tracked in `firestore.rules` for future CLI deploys.

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read their own profile. Writes are allow-listed:
    // the Admin SDK (from our server code) creates the doc and refreshes
    // profile metadata; the client is only allowed to set the WhatsApp
    // number fields + a handful of profile fields.
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;

      allow create: if false; // server-only via Admin SDK

      allow update: if request.auth != null
        && request.auth.uid == uid
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly([
               'whatsappNumber',
               'whatsappUpdatedAt',
               'displayName',
               'email',
               'photoURL',
               'lastLoginAt'
             ]);

      allow delete: if false;
    }

    // Reserved for future webhook idempotency. Server-only.
    match /processedStripeEvents/{eventId} {
      allow read, write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

To deploy via CLI instead:

```bash
firebase login
firebase use --add          # alias this project as "default"
firebase deploy --only firestore:rules
```

---

## 5. Local development

```bash
pnpm install
pnpm dev                    # http://localhost:3000
```

Expected flow:

- `/` renders the landing page with a **Get your test** header CTA + pricing card.
- `/signup` takes email+password or Google; on success you land on `/checkout`.
- `/checkout` shows the $490 summary and a **Pay $490 with Stripe** button that opens the Payment Link (with your email prefilled).
- Complete the payment with a Stripe test card (`4242 4242 4242 4242`, any future date, any CVC, any ZIP). Stripe redirects to `/app` (as configured in the Payment Link).
- On `/app`: logout in the header, WhatsApp form in the body. Entering `+15551234567` and saving should show "Saved.".

---

## 6. Deploy to Vercel

### 6a. Push to GitHub

Create a private repo (`opensleeplab`) and push. `.gitignore` already protects `.env.local` and any service-account JSON.

### 6b. Import to Vercel

1. <https://vercel.com/new> → import the repo.
2. Framework preset: **Next.js**.
3. Environment Variables → paste all values from `.env.local`, swapping `NEXT_PUBLIC_APP_URL` to `https://opensleeplab.com`. Apply to Production, Preview, and Development.
4. Deploy.

### 6c. Custom domain (Cloudflare-registered)

1. Vercel → Project → Settings → Domains → add `opensleeplab.com` and `www.opensleeplab.com`.
2. In Cloudflare DNS:
   - Recommended: let Vercel own DNS. Change nameservers at Cloudflare Registrar → Nameservers to the ones Vercel shows.
   - Or keep Cloudflare as the DNS provider and add the exact records Vercel prints (an `A` record on apex → Vercel's IP, and a `CNAME` on `www` → `cname.vercel-dns.com`). If you do this, set the records to **DNS only** (grey cloud), not proxied — Vercel manages TLS itself.

### 6d. Authorize the production domains in Firebase

After the domain resolves, return to Firebase → Authentication → Settings → Authorized domains and confirm `opensleeplab.com`, `www.opensleeplab.com`, and the Vercel preview subdomain are all listed.

### 6e. Update the Stripe Payment Link redirect

Back in the Stripe dashboard, edit the Payment Link's after-payment redirect URL from `http://localhost:3000/app` to `https://opensleeplab.com/app`.

---

## 7. Google OAuth consent screen (public launch)

You can ship in Testing mode for private beta and switch to Production before launching publicly.

1. <https://console.cloud.google.com> → pick the Firebase project.
2. APIs & Services → OAuth consent screen.
3. User type: **External**. Fill in:
   - App name: `OpenSleepLab`
   - User support email: your email
   - Authorized domains: `opensleeplab.com`
4. Scopes: defaults (`email`, `profile`, `openid`) only.
5. While in Testing mode: add beta testers' Google emails under **Test users**.
6. Ready to open up → **Publish app**.

---

## 8. Pre-launch checklist

- [ ] Firestore rules deployed.
- [ ] `pnpm build`, `pnpm typecheck`, `pnpm lint` all clean.
- [ ] Live-mode Stripe Payment Link created; URL is in Vercel env; Payment Link redirects to `https://opensleeplab.com/app`.
- [ ] End-to-end test on production: signup → pay with live card → redirected to `/app` → save WhatsApp number.
- [ ] Signing out from `/app` redirects to `/` and blocks access until re-signing-in.
- [ ] Privacy and Terms pages reachable with a real support email.
- [ ] Rotate the service-account key if it ever touched a shared doc or screen-share.

---

## 9. Common issues

**"Firebase Admin env vars missing" on page load**
Restart `pnpm dev` after editing `.env.local`. Next.js only reads env files at startup.

**"Payment link is not configured yet" on `/checkout`**
`NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST` isn't set (or didn't reach Vercel). Must start with `https://buy.stripe.com/…`.

**Google sign-in pops up then errors with "unauthorized domain"**
Add the domain you're signing in from to Firebase Authentication → Settings → Authorized domains (§1g).

**Email verification / password-reset emails still say "%APP_NAME%" or the numeric project ID**
You haven't set the public-facing project name — see §1f.

**Turbopack warning about workspace root**
Already handled in `next.config.ts` by pinning `turbopack.root` to the project directory.
