"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import { api } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const next = searchParams.get("next") || "/";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const result = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) });
      if (result.error) {
        toast.error(result.error.message ?? "Those sign-in details didn't work.");
        return;
      }
      await api("/api/security/cookie");
      toast.success("Welcome back. Let's make something.");
      router.push(next);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your sign-in could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  async function googleLogin() {
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: next });
      if (result.error) toast.error(result.error.message ?? "Google sign-in isn't available right now.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in isn't available right now.");
    }
  }

  return <section className="auth-wrap"><div className="auth-art"><p className="eyebrow light">YOUR NEXT GOOD IDEA STARTS HERE</p><h2>Find the space<br />where it all comes together.</h2><p>Good light. Great sound. Room for a little magic. It’s all out there.</p></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><p className="eyebrow">WELCOME BACK</p><h1>Good to see you.</h1><p>Sign in to find your space and pick up where you left off.</p><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div><button className="form-note" type="button" onClick={() => toast.info("Password reset is not enabled for this assignment.")}>Forgot password?</button><button className="button button-dark" disabled={busy}>{busy ? "Signing you in…" : "Log in"}</button><div className="auth-separator">or</div><button className="google-button" type="button" onClick={googleLogin}>Continue with Google</button><p className="auth-footer">New around here? <Link href="/register">Create an account</Link></p></form></div></section>;
}

export default function LoginPage() {
  return <Suspense fallback={<div className="skeleton" />}><LoginForm /></Suspense>;
}
