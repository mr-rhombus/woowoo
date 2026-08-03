const viewportWidth = window.innerWidth;
const bgImage = document.querySelector(".scroll-background");

if (viewportWidth <= 768) {
  bgImage.src = "assets/img/bg1-color-tall-mobile.jpeg";
}
