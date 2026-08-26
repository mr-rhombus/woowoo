import { passwordIsValid } from "/ui/pages/pages.js";

const passwordInput = document.getElementById("pwd");
const submitBtn = document.getElementById("pwdSubmitBtn");
const passwordForm = document.getElementById("passwordForm");

async function checkPassword(event) {
  event.preventDefault();

  const rootUrl = window.location.href.slice(
    0,
    window.location.href.lastIndexOf("/"),
  );

  const isValid = await passwordIsValid("index", passwordInput.value);

  if (isValid) {
    window.location.href = rootUrl + "/pages/splash/splash.html";
  } else {
    submitBtn.blur();

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

passwordForm.addEventListener("submit", checkPassword);
