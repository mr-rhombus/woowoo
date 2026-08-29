const baseUrl = "http://localhost:8000";

export async function passwordIsValid(page, password) {
  const response = await fetch(`${baseUrl}/api/password/${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  });
  const result = await response.json();
  return result;
}
