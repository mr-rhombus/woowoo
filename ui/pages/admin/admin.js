const baseUrl = "http://localhost:8000";

const tbodyEl = document.querySelector("tbody");

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

renderTable();
