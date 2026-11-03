"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const passwordValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && password.length >= 6;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordValid) {
      toast.error("Use at least 6 characters, including an uppercase and a lowercase letter.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const image = String(form.get("image") || "");
      const result = await authClient.signUp.email({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password,
        ...(image ? { image } : {}),
      });
      if (result.error) {
        toast.error(result.error.message ?? "We couldn’t create your account.");
        return;
      }
      await authClient.signOut();
      toast.success("Your account is ready. Sign in to get started.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn’t create your account.");
    } finally {
      setBusy(false);
    }
  }

  async function googleRegister() {
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (result.error) toast.error(result.error.message ?? "Google sign-in isn't available right now.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in isn't available right now.");
    }
  }

  return <section className="auth-wrap"><div className="auth-art"><p className="eyebrow light">YOUR SPACE, YOUR PEOPLE, YOUR NEXT BIG THING</p><h2>Make something<br />you can’t stop thinking about.</h2><p>Come find a space that’s ready when your idea is.</p></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><p className="eyebrow">MAKE ROOM FOR MORE</p><h1>Join the space.</h1><p>Create an account and find your place to make.</p><div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required /></div><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="image">Profile photo URL <span className="form-note">(optional)</span></label><input id="image" name="image" type="url" /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><p className={`password-hint ${password && !passwordValid ? "error-text" : ""}`}>At least 6 characters, one uppercase and one lowercase letter.</p></div><button className="button button-dark" disabled={busy}>{busy ? "Creating your account…" : "Create account"}</button><div className="auth-separator">or</div><button className="google-button" type="button" onClick={googleRegister}>Continue with Google</button><p className="auth-footer">Already have an account? <Link href="/login">Log in</Link></p></form></div></section>;
}
