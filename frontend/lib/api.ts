export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchJson<T>(route: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${route}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${route}: ${response.status}`);
  }

  return (await response.json()) as T;
}
