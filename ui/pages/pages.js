const nav = document.querySelector(".nav");
const homeBanner = document.querySelector(".banner");
let lastScrollY = window.scrollY;

if (nav) {
  window.addEventListener("scroll", () => {
    currentScrollY = window.scrollY;
    if (homeBanner?.classList.contains("is-active")) {
      nav.classList.add("banner-active");
    } else {
      nav.classList.remove("banner-active");
    }

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

// Permit slug-based nav when hosting app with FastAPI
const navElements = document.querySelectorAll(".nav a");
if (!navElements[0].href.includes("127.0.0.1:5500")) {
  navElements.forEach((anchorEl) => {
    anchorEl.href = anchorEl.textContent;
  });
}
