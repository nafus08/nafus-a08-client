"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { Aperture, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { authClient } from "@/lib/auth";
import { Toaster, toast } from "sonner";
import { api } from "@/lib/api";

const menuLinks = [
  ["/dashboard", "Dashboard"],
  ["/add-studio", "Add new studio"],
  ["/my-listings", "My studio listings"],
  ["/my-bookings", "My bookings"],
];

function NavigationLinks() {
  const pathname = usePathname();
  return <>
    <Link className={pathname === "/" ? "active" : ""} href="/">Home</Link>
    <Link className={pathname.startsWith("/studios") ? "active" : ""} href="/studios">Explore studios</Link>
    <Link className={pathname === "/how-it-works" ? "active" : ""} href="/how-it-works">How it works</Link>
    <Link className={pathname === "/about" ? "active" : ""} href="/about">About us</Link>
  </>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const user = session?.user;
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    api("/api/security/cookie").catch((error: Error) => toast.error(error.message));
  }, [userId]);

  function toggleTheme() {
    setDark((value) => {
      document.documentElement.dataset.theme = value ? "light" : "dark";
      return !value;
    });
  }

  async function logout() {
    try {
      await api("/api/security/clear", { method: "POST" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't clear the secure session cookie.");
    }
    await authClient.signOut();
    toast.success("You’re signed out. See you soon!");
    router.push("/");
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <header className="site-header">
        <div className="wrap nav-row">
          <Link href="/" className="brand"><span className="brand-icon"><Aperture size={22} /></span><span>studio<span className="brand-accent">space</span><small>ROOM TO MAKE</small></span></Link>
          <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          <nav className={`main-nav ${open ? "nav-open" : ""}`}><Suspense fallback={<span /> }><NavigationLinks /></Suspense></nav>
          <div className="nav-actions">
            <button className="theme-toggle" aria-label="Toggle color theme" onClick={toggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user ? <div className="profile-menu"><button className="profile-trigger" onClick={() => setOpen(!open)}>{user.image ? <img src={user.image} alt="" /> : <span className="avatar">{user.name?.[0]?.toUpperCase() ?? "U"}</span>}<span>{user.name?.split(" ")[0] ?? "Account"}</span><ChevronDown size={15} /></button><div className="profile-dropdown">{menuLinks.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}<button onClick={logout}>Log out</button></div></div> : <><Link className="login-link" href="/login">Log in</Link><Link className="button button-dark nav-register" href="/register">Join the space <span>↗</span></Link></>}
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-about"><Link href="/" className="brand footer-brand"><span className="brand-icon"><Aperture size={22} /></span><span>studio<span className="brand-accent">space</span><small>ROOM TO MAKE</small></span></Link><p>A little more room for the big things you want to make. Find your space, bring your people, and get to it.</p><div className="social-links"><a href="https://www.instagram.com/" aria-label="Instagram">ig</a><a href="https://www.linkedin.com/" aria-label="LinkedIn">in</a><a href="https://x.com/" aria-label="X">𝕏</a></div></div>
          <div><h3>Explore</h3><Link href="/studios">All studios</Link><Link href="/studios?category=Photo%20Studio">Photo studios</Link><Link href="/studios?category=Podcast%20Lounge">Podcast rooms</Link><Link href="/studios?category=Music%20Suite">Music suites</Link></div>
          <div><h3>StudioSpace</h3><Link href="/how-it-works">How it works</Link><Link href="/about">About us</Link><Link href="/add-studio">List your space</Link><Link href="/my-bookings">My bookings</Link></div>
          <div className="newsletter"><h3>A little inspiration?</h3><p>Good spaces, fresh ideas. Straight to your inbox.</p><form onSubmit={(event) => { event.preventDefault(); toast.info("Newsletter sign-up isn’t connected yet."); }}><input type="email" placeholder="Your email address" required aria-label="Your email address" /><button aria-label="Subscribe">↗</button></form></div>
        </div>
        <div className="wrap footer-bottom"><span>© 2026 StudioSpace. Made for making. Terms &amp; privacy apply.</span><span>Good ideas deserve good rooms. <span className="footer-heart">♥</span></span></div>
      </footer>
    </>
  );
}
