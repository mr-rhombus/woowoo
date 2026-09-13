const viewportWidth = window.innerWidth;
const bgImage = document.querySelector(".scroll-background");
const footerThinEl = document.querySelector(".footer-text > .thin");

if (viewportWidth <= 768) {
  bgImage.src = "/ui/assets/img/bg1-color-tall-mobile-less-sky.jpeg";
  footerThinEl.textContent = "";
}

const homePageRedirectEl = document.querySelector(".footer a");
if (!homePageRedirectEl.href.includes("127.0.0.1:5500")) {
  homePageRedirectEl.href = "/home";
}
