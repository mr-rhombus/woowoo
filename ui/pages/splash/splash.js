const viewportWidth = window.innerWidth;
const bgImage = document.querySelector(".scroll-background");
const footerThinEl = document.querySelector(".footer-text > .thin");

if (viewportWidth <= 768) {
  bgImage.src = "/static/assets/img/bg1-color-tall-mobile-less-sky.jpeg";
  footerThinEl.textContent = "";
}
