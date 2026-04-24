import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to this project so Next 16 doesn't walk
  // up to a stray lockfile in the home directory.
  turbopack: {
    root: path.resolve(),
  },

  // Self-host Firebase Auth's helper pages under our own domain so that
  // signInWithRedirect() works on iOS Safari and other browsers with strict
  // third-party storage policies. Required whenever the app's domain differs
  // from the Firebase `authDomain`.
  //
  // To enable this end-to-end, also set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN to
  // your app's custom domain (e.g. opensleeplab.com) in production.
  //
  // Ref: https://firebase.google.com/docs/auth/web/redirect-best-practices
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://opensleeplab.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/:path*",
        destination: "https://opensleeplab.firebaseapp.com/__/firebase/:path*",
      },
    ];
  },
};

export default nextConfig;
