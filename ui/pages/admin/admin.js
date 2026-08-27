import { passwordIsValid } from "/ui/pages/pages.js";

const baseUrl = "http://localhost:8000";

const containerEl = document.querySelector(".container");

const tbodyEl = document.querySelector("tbody");

function renderPage() {
  renderPwdModal();
}

function renderPwdModal() {
  const pwdDiv = document.createElement("div");
  pwdDiv.classList.add("pwd-div");

  const pwdForm = document.createElement("form");
  pwdForm.method = "post";

  const pwdInputEl = document.createElement("input");
  pwdInputEl.type = "password";
  pwdInputEl.name = "adminPwd";
  pwdInputEl.id = "adminPwd";
  pwdInputEl.placeholder = "Enter Password";
  pwdInputEl.autofocus = true;

  pwdForm.appendChild(pwdInputEl);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.id = "pwdSubmitBtn";
  submitBtn.textContent = "LOGIN";

  pwdForm.appendChild(submitBtn);

  pwdForm.addEventListener("submit", checkPassword);

  pwdDiv.appendChild(pwdForm);

  containerEl.appendChild(pwdDiv);
}

async function checkPassword(event) {
  event.preventDefault();

  const passwordInput = document.getElementById("adminPwd");
  const submitBtn = document.getElementById("pwdSubmitBtn");
  const isValid = await passwordIsValid("admin", passwordInput.value);

  if (isValid) {
    renderTable();
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

async function renderTable() {
  const response = await fetch(`${baseUrl}/api/get_all_guests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  result.guests.forEach((guest) => {
    tbodyEl.appendChild(createRow(guest.full_name, guest.rsvp));
  });
}

function createRow(name, rsvp) {
  const rowEl = document.createElement("tr");

  const nameEl = document.createElement("td");
  nameEl.textContent = name;

  const rsvpEl = document.createElement("td");
  switch ((rsvp ?? "").toLowerCase()) {
    case "y":
      rsvpEl.textContent = "✅";
      break;
    case "n":
      rsvpEl.textContent = "❌";
      break;
    default:
      rsvpEl.textContent = "N/A";
  }

  rowEl.appendChild(nameEl);
  rowEl.appendChild(rsvpEl);

  return rowEl;
}

renderPage();
