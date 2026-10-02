import { passwordIsValid } from "/ui/utils.js";

const baseUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://williams-diamond.com";
const TABLE_COLUMNS = ["Name", "RSVP", "Group"];

const containerEl = document.querySelector(".container");
const tableWrapper = document.querySelector(".table-wrapper");

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
    tableWrapper.style.display = "block";
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

  tableWrapper.appendChild(createTable(result.guests, TABLE_COLUMNS));
}

function createTable(guests, columns) {
  const tableEl = document.createElement("table");
  const theadEl = document.createElement("thead");

  const trEl = document.createElement("tr");
  columns.forEach((column) => trEl.appendChild(createColumn(column)));

  theadEl.appendChild(trEl);
  tableEl.appendChild(theadEl);

  const tbodyEl = document.createElement("tbody");
  guests.sort((a, b) => a.group_id - b.group_id || a.sort_order - b.sort_order);
  guests.forEach((guest) => tbodyEl.appendChild(createRow(guest)));
  tableEl.appendChild(tbodyEl);

  return tableEl;
}

function createColumn(name) {
  const thEl = document.createElement("th");
  thEl.scope = "col";
  thEl.textContent = name;

  return thEl;
}

function createRow(guest) {
  const rowEl = document.createElement("tr");

  const nameEl = document.createElement("td");
  nameEl.textContent = guest.full_name;

  const rsvpEl = document.createElement("td");
  switch ((guest.rsvp ?? "").toLowerCase()) {
    case "y":
      rsvpEl.textContent = "✅";
      break;
    case "n":
      rsvpEl.textContent = "❌";
      break;
    default:
      rsvpEl.textContent = "N/A";
  }

  const groupEl = document.createElement("td");
  groupEl.textContent = guest.group_id;

  rowEl.appendChild(nameEl);
  rowEl.appendChild(rsvpEl);
  rowEl.appendChild(groupEl);

  return rowEl;
}

renderPage();
