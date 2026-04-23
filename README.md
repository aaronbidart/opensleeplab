# OpenSleepLab

Landing + signup + paywall for a 3-night at-home sleep test. USD $490, one-time.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4 + shadcn (base-nova style)
- **Auth**: Firebase Authentication (email/password + Google) with server-side session cookies
- **Database**: Cloud Firestore (user-scoped rules)
- **Payments**: Stripe Payment Link (hosted, no webhooks in v1)
- **Hosting**: Vercel

## Flow

```
/                       landing with pricing CTA
  ↓ "Get your test" / "Sign up"
/signup                 email+password or Google (no email-verification wait)
  ↓ on success → establishSession()
/checkout               offering summary + "Pay $490 with Stripe" button
                        → hosted Stripe Payment Link (new tab or full redirect)
[Stripe]
  ↓ after payment, Stripe redirects back to NEXT_PUBLIC_APP_URL/app
/app                    auth-gated dashboard
                        - logout button in header
                        - WhatsApp contact field (saved to Firestore)
```

Both `/checkout` and `/app` are auth-gated only. There is no server-side paid
gate in v1 — if an authed user wants to see the dashboard before paying, they
can. The `client_reference_id=<firebaseUID>` query param is passed through to
Stripe so that when webhooks are added later, payments can be reconciled back
to the user.

## Project layout

```
opensleeplab/
├── docs/
│   └── SETUP.md                    # Firebase + Stripe + Vercel handoff
├── src/
│   ├── app/
│   │   ├── (marketing)/            # public pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # landing
│   │   │   ├── signup/ login/ reset-password/ privacy/ terms/
│   │   ├── (app)/                  # auth-gated
│   │   │   ├── layout.tsx          # header + logout
│   │   │   ├── app/page.tsx        # dashboard
│   │   │   ├── checkout/page.tsx   # Payment Link CTA
│   │   │   └── actions.ts          # saveWhatsappNumberAction
│   │   └── api/auth/               # session-login / session-logout
│   ├── components/
│   │   ├── ui/                     # shadcn primitives
│   │   ├── auth/                   # signup / login / reset / logout
│   │   └── app/                    # whatsapp form
│   └── lib/
│       ├── auth/{dal,session,client-helpers}.ts
│       ├── db/users.ts
│       ├── firebase/{client,admin}.ts
│       └── stripe/payment-link.ts
├── firestore.rules                 # user-scoped, deny-by-default
├── proxy.ts                        # security headers (Next 16 rename)
└── ...
```

## Local development

```bash
pnpm install
cp .env.local.example .env.local    # fill in values — see docs/SETUP.md
pnpm dev                             # http://localhost:3000
```

Full setup (Firebase project, Stripe product, Vercel deploy) lives in [docs/SETUP.md](./docs/SETUP.md).

## Scripts

| Command          | What it does                   |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Local dev server with Turbopack |
| `pnpm build`     | Production build               |
| `pnpm start`     | Serve the production build     |
| `pnpm lint`      | ESLint across `src/`           |
| `pnpm typecheck` | TypeScript, no emit            |

## Architecture notes

- **Auth DAL** (`src/lib/auth/dal.ts`) — `getAuthenticatedUser()` is wrapped in `React.cache` so Firebase session verification happens at most once per request.
- **No paid gate in v1** — `paidAt` is not tracked; the dashboard trusts the user. When Stripe webhooks are added, `client_reference_id` already carries the Firebase UID so reconciliation is a drop-in change.
- **Payment Link** — configured in the Stripe dashboard, URL stored in `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SLEEP_TEST`. The app appends `client_reference_id` and `prefilled_email` at request time.
- **Firestore rules** — users can read/write only their own doc, and only a narrow allowlist of fields on update (`whatsappNumber`, profile metadata).

## About the Next.js version

This repo runs on Next.js 16, which renamed several conventions that most tools (and agents) still expect from Next 14/15 — notably `middleware.ts` → `proxy.ts`, and `cookies()` / `headers()` / `params` / `searchParams` are all async now. If you're editing this repo (including via an AI agent), skim `node_modules/next/dist/docs/02-guides/upgrading/version-16.md` before writing anything non-trivial.
