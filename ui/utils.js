const baseUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://woowoo-production.up.railway.app";

export async function passwordIsValid(page, password) {
  const response = await fetch(`${baseUrl}/api/password/${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  });
  const result = await response.json();
  return result;
}
