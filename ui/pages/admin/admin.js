import { environment } from "/ui/environment.js";
import { passwordIsValid } from "/ui/pages/pages.js";

const TABLE_COLUMNS = ["Name", "RSVP"];

const containerEl = document.querySelector(".container");

// Force page reload when navigating using back/fwd arrows
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

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
    const pwdDivEl = document.querySelector(".pwd-div");
    pwdDivEl.replaceChildren();
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
  const response = await fetch(`${environment.baseUrl}/api/get_all_guests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();

  containerEl.appendChild(createTable(result.guests, TABLE_COLUMNS));
}

function createTable(guests, columns) {
  const tableEl = document.createElement("table");
  const theadEl = document.createElement("thead");

  const trEl = document.createElement("tr");
  columns.forEach((column) => trEl.appendChild(createColumn(column)));

  theadEl.appendChild(trEl);
  tableEl.appendChild(theadEl);

  const tbodyEl = document.createElement("tbody");
  guests.forEach((guest) =>
    tbodyEl.appendChild(createRow(guest.full_name, guest.rsvp)),
  );
  tableEl.appendChild(tbodyEl);

  return tableEl;
}

function createColumn(name) {
  const thEl = document.createElement("th");
  thEl.scope = "col";
  thEl.textContent = name;

  return thEl;
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
