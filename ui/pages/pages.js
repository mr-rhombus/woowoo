const nav = document.querySelector(".nav");
let lastScrollY = window.scrollY;

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

//
const navElements = document.querySelectorAll(".nav a");
if (!navElements[0].href.includes("127.0.0.1:5500")) {
  navElements.forEach((anchorEl) => {
    anchorEl.href = anchorEl.textContent;
  });
}
