import { KitRequest } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function generateKit(req: KitRequest): Promise<Blob> {
  const res = await fetch(`${BACKEND_URL}/generate-kit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Kit generation failed");
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
