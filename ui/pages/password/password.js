const passwordInput = document.getElementById("pwd");
const submitBtn = document.getElementById("pwdSubmitBtn");

function checkPassword(event) {
  event.preventDefault();

  const rootUrl = window.location.href.slice(
    0,
    window.location.href.lastIndexOf("/"),
  );

  if (passwordInput.value == "dinosaur") {
    window.location.href = rootUrl + "/pages/splash/splash.html";
  } else {
    pwdSubmitBtn.blur();

    passwordInput.classList.add("shake");
    passwordInput.addEventListener(
      "animationend",
      () => {
        passwordInput.classList.remove("shake");
      },
      { once: true },
    );
  }
  passwordInput.value = "";
}
