export type Studio = {
  id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  galleryImages?: string[];
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
  rating: number;
};

export type Booking = {
  id: string;
  studioId: string;
  studioTitle: string;
  startAt: string;
  endAt: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? `Request failed (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function studioPayload(form: FormData) {
  return {
    title: String(form.get("title") ?? ""),
    category: String(form.get("category") ?? ""),
    hourlyRate: Number(form.get("hourlyRate")),
    securityDeposit: Number(form.get("securityDeposit")),
    maxCapacity: Number(form.get("maxCapacity")),
    location: String(form.get("location") ?? ""),
    imageUrl: String(form.get("imageUrl") ?? ""),
    galleryImages: String(form.get("galleryImages") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    amenities: String(form.get("amenities") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    overview: String(form.get("overview") ?? ""),
  };
}
