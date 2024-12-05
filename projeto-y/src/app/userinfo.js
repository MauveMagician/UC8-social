export async function fetchUserInfo() {
  const response = await fetch("/api/data/userinfo");
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
}
