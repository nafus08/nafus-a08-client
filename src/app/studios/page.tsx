"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api, type Studio } from "@/lib/api";
import { StudioCard } from "@/components/studio-card";
import { toast } from "sonner";

const categories = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function StudiosContent() {
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    api<Studio[]>("/api/studios")
      .then(setStudios)
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return studios
      .filter((studio) => category === "All" || studio.category === category)
      .filter((studio) => !needle || `${studio.title} ${studio.location} ${studio.category}`.toLowerCase().includes(needle))
      .sort((a, b) => sort === "price-low" ? a.hourlyRate - b.hourlyRate : sort === "price-high" ? b.hourlyRate - a.hourlyRate : sort === "rating" ? b.rating - a.rating : 0);
  }, [studios, query, category, sort]);

  return (
    <>
      <section className="page-hero"><div className="wrap"><p className="eyebrow">YOUR NEXT CREATIVE SPACE</p><h1>Find room to <em>make.</em></h1><p>Browse independent studios, production spaces, and creative rooms ready for what you have in mind.</p></div></section>
      <section className="page-body wrap">
        <div className="filter-bar">
          <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by space or location" /></label>
          <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Sort studios" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select>
          <SlidersHorizontal size={17} color="var(--muted)" />
        </div>
        <p className="results-line">{loading ? "Finding your next space…" : `${filtered.length} ${filtered.length === 1 ? "space" : "spaces"} to explore`}</p>
        {loading ? <div className="loading-grid">{[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}</div> : filtered.length ? <div className="studio-grid">{filtered.map((studio) => <StudioCard key={studio.id} studio={studio} />)}</div> : <div className="empty-state"><Search size={25} color="var(--muted)" /><h3>No spaces found</h3><p>Try a different search or category. Your next creative space is out there.</p><button className="button button-dark" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
      </section>
    </>
  );
}

export default function StudiosPage() {
  return <Suspense fallback={<div className="page-body wrap"><div className="skeleton" /></div>}><StudiosContent /></Suspense>;
}
