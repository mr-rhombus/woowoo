const baseUrl = "http://localhost:8000";

const nav = document.querySelector(".nav");
let lastScrollY = window.scrollY;

export async function passwordIsValid(page, password) {
  const response = await fetch(`${baseUrl}/api/password/${page}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  });
  const result = await response.json();
  return result;
}

if (nav) {
  window.addEventListener("scroll", () => {
    currentScrollY = window.scrollY;

    // Ignore small scrolls
    if (Math.abs(currentScrollY - lastScrollY) < 8) return;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      nav.classList.add("nav-hidden");
    } else {
      nav.classList.remove("nav-hidden");
    }
    lastScrollY = currentScrollY;
  });
}
