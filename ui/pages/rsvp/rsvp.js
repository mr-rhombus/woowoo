const baseUrl = "http://localhost:8000";

const findPartyBtn = document.querySelector(".findPartyBtn");
findPartyBtn.addEventListener("click", renderParties);

const guestsDiv = document.querySelector(".guests");

async function renderParties(event) {
  event.preventDefault();

  const lastNameElement = document.getElementById("lastName");
  const lastNameVal = lastNameElement.value.trim();
  const lastNameData = {
    last_name: lastNameVal,
  };

  try {
    const response = await fetch(`${baseUrl}/api/lastName`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lastNameData),
    });
    const result = await response.json();

    const partyIds = [...new Set(result.guests.map((guest) => guest.group_id))];

    partyIds.forEach((partyId) => {
      const partyGuests = result.guests.filter(
        (guest) => guest.group_id === partyId,
      );
      const partyLastName = partyGuests.sort((a, b) =>
        b.last_name.localeCompare(a.lastName),
      )[0].last_name;
      guestsDiv.appendChild(createParty(partyLastName, partyGuests));
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function createParty(partyName, guestData) {
  const fieldset = document.createElement("fieldset");

  const legend = document.createElement("legend");
  legend.textContent = partyName;

  const partyDiv = document.createElement("div");
  partyDiv.classList.add("party");

  fieldset.appendChild(legend);

  guestData.forEach((guest) => {
    partyDiv.appendChild(createGuest(guest.full_name, guest.rsvp));
  });
  fieldset.appendChild(partyDiv);

  return fieldset;
}

function createGuest(name, response) {
  const guestDiv = document.createElement("div");
  guestDiv.classList.add("guest");

  const nameDiv = document.createElement("div");
  nameDiv.classList.add("guestName");
  nameDiv.textContent = name;

  const responseDiv = document.createElement("div");
  responseDiv.classList.add("guestResponse");

  responseDiv.appendChild(createResponseRadio(name, "y", response));
  responseDiv.appendChild(createResponseRadio(name, "n", response));

  guestDiv.appendChild(nameDiv);
  guestDiv.appendChild(responseDiv);

  return guestDiv;
}

function createResponseRadio(guestName, responseOption, actualResponse) {
  const responseDiv = document.createElement("div");
  responseDiv.classList.add("radioResponse");

  const radioInput = document.createElement("input");
  radioInput.type = "radio";
  radioInput.name = guestName.replace(" ", "_");

  const radioLabel = document.createElement("label");

  switch (responseOption.toLowerCase()) {
    case "y":
      radioInput.id = radioInput.name + "_y";
      radioLabel.htmlFor = radioInput.id;
      radioLabel.textContent = "Will Attend";
      if (actualResponse && actualResponse.toLowerCase() === "y") {
        radioInput.checked = true;
      }
      break;
    case "n":
      radioInput.id = radioInput.name + "_n";
      radioLabel.htmlFor = radioInput.id;
      radioLabel.textContent = "Will Not Attend";
      if (actualResponse && actualResponse.toLowerCase() === "n") {
        radioInput.checked = true;
      }
      break;
  }

  responseDiv.appendChild(radioInput);
  responseDiv.appendChild(radioLabel);

  return responseDiv;
}
