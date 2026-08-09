const nav = document.querySelector(".nav");
let lastScrollY = window.scrollY;

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
