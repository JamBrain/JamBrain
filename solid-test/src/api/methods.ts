export async function GET(url: string) {
  const response = await fetch(`${API_ENDPOINT}${url}`);
  if (!response.ok) {
    throw new Error("API Error");
  }
  return response.json();
}
