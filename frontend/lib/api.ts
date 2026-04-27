import { KitRequest } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function generateKit(req: KitRequest): Promise<Blob> {
  if (!BACKEND_URL) {
    throw new Error("Backend URL not configured. Set NEXT_PUBLIC_BACKEND_URL in Vercel environment variables.");
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/generate-kit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
  } catch {
    throw new Error(`Cannot reach backend at ${BACKEND_URL}. Check that the Railway service is running.`);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail || `Server error ${res.status}`;
    throw new Error(detail);
  }

  return res.blob();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
