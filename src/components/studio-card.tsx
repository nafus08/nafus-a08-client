import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Studio } from "@/lib/api";

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="studio-card">
      <Link href={`/studios/${studio.id}`} className="studio-image-wrap">
        {/* Remote image URLs are user-provided; a regular img avoids requiring an unsafe host allowlist. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={studio.imageUrl} alt={studio.title} className="studio-image" />
        <span className="category-tag">{studio.category}</span>
        <span className="rating-tag"><Star size={13} fill="currentColor" /> {studio.rating.toFixed(1)}</span>
      </Link>
      <div className="studio-card-body">
        <div><h3>{studio.title}</h3><p className="studio-location"><MapPin size={14} />{studio.location}</p></div>
        <div className="studio-card-bottom"><p><strong>${studio.hourlyRate}</strong><span> / hour</span></p><Link href={`/studios/${studio.id}`} aria-label={`View ${studio.title}`} className="round-link"><ArrowUpRight size={18} /></Link></div>
      </div>
    </article>
  );
}
