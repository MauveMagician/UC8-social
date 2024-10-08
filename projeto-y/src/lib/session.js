export const fetchSession = async () => {
  try {
    const response = await fetch("/api/auth/session");
    const data = await response.json();
    if (response.ok) {
      return data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};
