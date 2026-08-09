function checkPassword(event) {
  event.preventDefault();

  const passwordInput = document.getElementById("pwd");

  const rootUrl = window.location.href.slice(
    0,
    window.location.href.lastIndexOf("/"),
  );
  window.location.href = rootUrl + "/pages/splash/splash.html";
}
