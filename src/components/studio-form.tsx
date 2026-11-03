"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, studioPayload, type Studio } from "@/lib/api";
import { authClient } from "@/lib/auth";

const categories = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop", "Other"];

export function StudioForm({ studio }: { studio?: Studio }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/login?next=${encodeURIComponent(studio ? `/studios/edit/${studio.id}` : "/add-studio")}`);
    }
  }, [isPending, session, router, studio]);

  if (isPending) return <div className="form-layout"><div className="skeleton" /></div>;
  if (!session?.user) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = studioPayload(new FormData(event.currentTarget));
      await api(studio ? `/api/studios/${studio.id}` : "/api/studios", {
        method: studio ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(studio ? "Your studio listing has been updated." : "Your space is listed. Let the making begin!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We couldn't save your studio.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) {
      toast.error("Add NEXT_PUBLIC_IMGBB_API_KEY to client/.env.local to enable image uploads.");
      if (imageInput.current) imageInput.current.value = "";
      return;
    }
    if (!file.type.startsWith("image/") || file.size > 32 * 1024 * 1024) {
      toast.error("Choose an image smaller than 32 MB.");
      if (imageInput.current) imageInput.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.set("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.success || typeof result.data?.url !== "string") {
        throw new Error(result.error?.message ?? "The image host could not upload this file.");
      }
      const imageUrl = document.querySelector<HTMLInputElement>("#imageUrl");
      if (imageUrl) {
        imageUrl.value = result.data.url;
        imageUrl.dispatchEvent(new Event("input", { bubbles: true }));
      }
      toast.success("Image uploaded. It's ready to use.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
      if (imageInput.current) imageInput.current.value = "";
    }
  }

  return (
    <div className="form-layout">
      <p className="eyebrow">{studio ? "MAKE IT JUST RIGHT" : "OPEN YOUR DOORS"}</p>
      <h1>{studio ? "Update your space." : "List your studio."}</h1>
      <p className="form-intro">The details creators need to picture their next great project here.</p>
      <form className="studio-form" onSubmit={submit}>
        <div className="field full"><label htmlFor="title">Studio title</label><input id="title" name="title" defaultValue={studio?.title} placeholder="e.g. Sunlit cyclorama in the Arts District" minLength={3} maxLength={100} required /></div>
        <div className="field"><label htmlFor="category">Category</label><select id="category" name="category" defaultValue={studio?.category ?? categories[0]}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
        <div className="field"><label htmlFor="location">Location / address</label><input id="location" name="location" defaultValue={studio?.location} placeholder="City, neighborhood" required minLength={3} /></div>
        <div className="field"><label htmlFor="hourlyRate">Hourly rate (USD)</label><input id="hourlyRate" name="hourlyRate" type="number" min="1" step="1" defaultValue={studio?.hourlyRate} required /></div>
        <div className="field"><label htmlFor="securityDeposit">Security deposit (USD)</label><input id="securityDeposit" name="securityDeposit" type="number" min="0" step="1" defaultValue={studio?.securityDeposit ?? 0} required /></div>
        <div className="field"><label htmlFor="maxCapacity">Maximum capacity</label><input id="maxCapacity" name="maxCapacity" type="number" min="1" defaultValue={studio?.maxCapacity ?? 4} required /></div>
        <div className="field"><label htmlFor="imageUrl">Cover image URL</label><input id="imageUrl" name="imageUrl" type="url" defaultValue={studio?.imageUrl} placeholder="https://…" required /></div>
        <div className="field"><label htmlFor="imageUpload">Upload a cover image</label><input ref={imageInput} id="imageUpload" type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} disabled={uploading} /><span className="form-note">{uploading ? "Uploading image…" : "Upload via ImgBB, or paste a public image URL above."}</span></div>
        <div className="field full"><label htmlFor="galleryImages">Additional gallery image URLs</label><input id="galleryImages" name="galleryImages" defaultValue={studio?.galleryImages?.join(", ")} placeholder="https://… , https://…" /><span className="form-note">Optional. Add public image URLs separated by commas.</span></div>
        <div className="field full"><label htmlFor="amenities">Amenities</label><input id="amenities" name="amenities" defaultValue={studio?.amenities.join(", ")} placeholder="Natural light, Backdrops, Wi-Fi (separate with commas)" /><span className="form-note">Separate amenities with commas. For image hosting, use a public image URL such as an ImgBB or Postimages link.</span></div>
        <div className="field full"><label htmlFor="overview">Tell us about your space</label><textarea id="overview" name="overview" defaultValue={studio?.overview} placeholder="What makes this space special? Share what guests can expect." minLength={20} maxLength={5000} required /></div>
        <div className="field"><label htmlFor="hostName">Host name</label><input id="hostName" className="readonly" value={session.user.name} readOnly /></div>
        <div className="field"><label htmlFor="hostEmail">Host email</label><input id="hostEmail" className="readonly" value={session.user.email} readOnly /></div>
        <button className="button button-dark" disabled={busy || uploading}>{busy ? "Saving your space…" : uploading ? "Uploading image…" : studio ? "Save changes" : "List my space"}</button>
      </form>
    </div>
  );
}
