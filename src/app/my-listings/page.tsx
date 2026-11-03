"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api, type Studio } from "@/lib/api";
import { authClient } from "@/lib/auth";

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [items, setItems] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Studio | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login?next=%2Fmy-listings");
      return;
    }
    api<Studio[]>("/api/studios/mine")
      .then(setItems)
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [session, isPending, router]);

  async function remove() {
    if (!deleting) return;
    try {
      await api(`/api/studios/${deleting.id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast.success("Studio listing deleted.");
      setDeleting(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn’t delete that listing.");
    }
  }

  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">YOUR SPACES, ALL IN ONE PLACE</p><h1>My <em>listings.</em></h1><p>Keep your creative spaces up to date and ready to welcome their next guests.</p></div></section><section className="page-body wrap"><div className="section-heading"><div><p className="results-line">{loading ? "Loading your listings…" : `${items.length} spaces listed`}</p></div><Link className="button button-dark" href="/add-studio"><Plus size={16} /> Add a space</Link></div>{!loading && (items.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Studio</th><th>Category</th><th>Location</th><th>Rate / hour</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.category}</td><td>{item.location}</td><td>${item.hourlyRate}</td><td><div className="table-actions"><Link href={`/studios/edit/${item.id}`}>Edit</Link><button onClick={() => setDeleting(item)}>Delete</button></div></td></tr>)}</tbody></table></div> : <div className="empty-state"><p>No studios listed yet. Have a creative space to share?</p><Link className="button button-dark" href="/add-studio">List your first space</Link></div>)}</section>{deleting && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">Take this listing down?</h2><p><strong>{deleting.title}</strong> will be removed from StudioSpace. This can’t be undone.</p><div className="modal-actions"><button onClick={() => setDeleting(null)}>Keep listing</button><button className="danger" onClick={remove}>Delete space</button></div></section></div>}</>;
}
