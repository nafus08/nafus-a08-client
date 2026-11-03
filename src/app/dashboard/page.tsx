"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">YOUR CREATIVE HOME BASE</p><h1>Welcome, <em>{session?.user?.name?.split(" ")[0] ?? "creator"}.</em></h1><p>Your next idea is closer than you think. Pick up where you left off.</p></div></section><section className="section wrap"><div className="category-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}><Link className="category-card" href="/studios" style={{ backgroundImage: "linear-gradient(0deg,#17211ccc,transparent),url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80)" }}><strong>Find a studio</strong></Link><Link className="category-card" href="/my-bookings" style={{ backgroundImage: "linear-gradient(0deg,#17211ccc,transparent),url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80)" }}><strong>My bookings</strong></Link><Link className="category-card" href="/my-listings" style={{ backgroundImage: "linear-gradient(0deg,#17211ccc,transparent),url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80)" }}><strong>My studio listings</strong></Link></div></section></>;
}
