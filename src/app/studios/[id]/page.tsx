"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { api, type Studio } from "@/lib/api";
import { authClient } from "@/lib/auth";

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    api<Studio>(`/api/studios/${id}`)
      .then(setStudio)
      .catch((error: Error) => { toast.error(error.message); setLoadError(true); });
  }, [id]);

  async function book() {
    if (!session?.user) {
      router.push(`/login?next=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    if (!startAt || !endAt) {
      toast.error("Choose a start and end time for your visit.");
      return;
    }
    setSaving(true);
    try {
      await api("/api/bookings", { method: "POST", body: JSON.stringify({ studioId: id, startAt, endAt }) });
      toast.success("Booking request sent. You can follow its status in My Bookings.");
      router.push("/my-bookings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't create your booking.");
    } finally {
      setSaving(false);
    }
  }

  if (!studio && !loadError) return <div className="page-body wrap"><div className="skeleton" /></div>;
  if (!studio) return <div className="page-body wrap"><div className="empty-state"><h2>We couldn’t find this studio.</h2><Link className="button button-dark" href="/studios">Back to explore</Link></div></div>;
  const gallery = [studio.imageUrl, ...(studio.galleryImages ?? [])];

  return (
    <section className="page-body wrap">
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-gallery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="detail-image" src={gallery[galleryIndex]} alt={`${studio.title} photo ${galleryIndex + 1}`} />
            {gallery.length > 1 && <><button className="gallery-arrow gallery-prev" aria-label="Previous photo" onClick={() => setGalleryIndex((index) => (index + gallery.length - 1) % gallery.length)}><ArrowLeft size={17} /></button><button className="gallery-arrow gallery-next" aria-label="Next photo" onClick={() => setGalleryIndex((index) => (index + 1) % gallery.length)}><ArrowRight size={17} /></button><span className="gallery-count">{galleryIndex + 1} / {gallery.length}</span></>}
          </div>
          <p className="eyebrow" style={{ marginTop: 24 }}>{studio.category}</p>
          <h1>{studio.title}</h1>
          <div className="detail-meta"><span><MapPin size={14} /> {studio.location}</span><span><Star size={14} fill="#d8a43b" color="#d8a43b" /> {studio.rating.toFixed(1)} rating</span><span><Users size={14} /> Up to {studio.maxCapacity} people</span></div>
          <p className="detail-copy">{studio.overview}</p>
          <h2>What this space offers</h2>
          <div className="amenity-list">{studio.amenities.map((amenity) => <span className="amenity-chip" key={amenity}>{amenity}</span>)}</div>
          <div className="host-info"><strong>Hosted by {studio.hostName}</strong><br />A local creative host, here to help you make the most of your time.</div>
          <h2 style={{ marginTop: 32 }}>Reviews</h2>
          <div className="empty-state" style={{ minHeight: 105 }}><p>Reviews haven’t opened for this space yet.</p></div>
        </div>
        <aside className="booking-card">
          <h2><strong>${studio.hourlyRate}</strong> <span>/ hour</span></h2>
          <div className="host-info"><ShieldCheck size={15} /> Transparent pricing · ${studio.securityDeposit} refundable security deposit</div>
          <button className="button button-dark" onClick={() => setBookingOpen(true)}>Book workspace now</button>
          <p className="form-note">Choose your time and send a request. The host can confirm availability.</p>
          <Link className="text-link" href="/studios">Back to explore</Link>
        </aside>
      </div>
      {bookingOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setBookingOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><h2 id="booking-title">Book {studio.title}</h2><p>Your request is pending until the host confirms your time.</p><div className="field"><label htmlFor="booking-start">Start date &amp; time</label><input id="booking-start" type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} /></div><div className="field" style={{ marginTop: 12 }}><label htmlFor="booking-end">End date &amp; time</label><input id="booking-end" type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} /></div><div className="modal-actions"><button onClick={() => setBookingOpen(false)} disabled={saving}>Not yet</button><button className="danger" onClick={book} disabled={saving}>{saving ? "Sending request…" : "Send booking request"}</button></div></section></div>}
    </section>
  );
}
