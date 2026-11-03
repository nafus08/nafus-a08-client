"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, type Booking } from "@/lib/api";
import { authClient } from "@/lib/auth";

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login?next=%2Fmy-bookings");
      return;
    }
    api<Booking[]>("/api/bookings/mine")
      .then(setItems)
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [session, isPending, router]);

  async function cancel(booking: Booking) {
    try {
      await api(`/api/bookings/${booking.id}/cancel`, { method: "PATCH" });
      setItems((current) => current.map((item) => item.id === booking.id ? { ...item, status: "Cancelled" } : item));
      toast.success("Your booking request has been cancelled.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't cancel your booking.");
    }
  }

  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">YOUR CREATIVE CALENDAR</p><h1>My <em>bookings.</em></h1><p>All the spaces you’ve booked, and the creative plans that come with them.</p></div></section><section className="page-body wrap">{loading ? <div className="skeleton" /> : items.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Studio</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><Link href={`/studios/${item.studioId}`}>{item.studioTitle}</Link></td><td>{new Date(item.startAt).toLocaleString()}</td><td>{new Date(item.endAt).toLocaleString()}</td><td><span className={`status ${item.status}`}>{item.status}</span></td><td>{item.status === "Pending" ? <div className="table-actions"><button onClick={() => cancel(item)}>Cancel request</button></div> : "—"}</td></tr>)}</tbody></table></div> : <div className="empty-state"><h3>Your next creative session is waiting.</h3><p>You haven’t requested a booking yet. Find a space and make a plan.</p><Link className="button button-dark" href="/studios">Explore studios</Link></div>}</section></>;
}
