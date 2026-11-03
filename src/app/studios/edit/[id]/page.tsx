"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { StudioForm } from "@/components/studio-form";
import { api, type Studio } from "@/lib/api";

export default function EditStudioPage() {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api<Studio>(`/api/studios/${id}`)
      .then(setStudio)
      .catch((error: Error) => { toast.error(error.message); setLoadError(true); });
  }, [id]);

  if (studio) return <StudioForm studio={studio} />;
  if (loadError) return <div className="form-layout"><div className="empty-state"><p>We couldn’t load this listing.</p></div></div>;
  return <div className="form-layout"><div className="skeleton" /></div>;
}
