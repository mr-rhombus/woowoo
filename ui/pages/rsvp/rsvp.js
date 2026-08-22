const baseUrl = "http://localhost:8000";

const findPartyBtn = document.getElementById("findPartyBtn");
findPartyBtn.addEventListener("click", renderParties);

const guestsDiv = document.querySelector(".guests");

const rsvpBtn = document.getElementById("rsvp");

async function renderParties(event) {
  event.preventDefault();

  guestsDiv.replaceChildren();

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
      guestsDiv.appendChild(
        createParty(partyLastName, partyId, partyGuests, (simple = true)),
      );
    });

    if (result.guests.length == 0) {
      noGuestsFoundDiv = document.createElement("div");
      noGuestsFoundDiv.classList.add("text");
      noGuestsFoundDiv.textContent = `No guests found with the last name "${lastNameVal}"`;
      guestsDiv.appendChild(noGuestsFoundDiv);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function createParty(partyName, partyId, guestData, simple = false) {
  const fieldset = document.createElement("fieldset");

  const legend = document.createElement("legend");
  legend.textContent = partyName;

  const partyDiv = document.createElement("div");
  if (simple) {
    partyDiv.classList.add("party-simple");
  } else {
    partyDiv.classList.add("party");
  }

  fieldset.appendChild(legend);

  guestData.forEach((guest) => {
    partyDiv.appendChild(
      createGuest(guest.full_name, guest.rsvp, (simple = simple)),
    );
  });
  fieldset.appendChild(partyDiv);

  const selectPartyBtn = document.createElement("button");
  selectPartyBtn.classList.add("select-party-btn");
  selectPartyBtn.id = partyId;
  selectPartyBtn.textContent = "Select Party";
  selectPartyBtn.addEventListener("click", (e) =>
    renderPartyFull(e, partyName, partyId, guestData),
  );

  if (simple) {
    fieldset.appendChild(selectPartyBtn);
  }

  return fieldset;
}

function createGuest(name, response = null, simple = true) {
  const guestDiv = document.createElement("div");
  guestDiv.classList.add("guest");

  const nameDiv = document.createElement("div");
  nameDiv.textContent = name;

  guestDiv.appendChild(nameDiv);

  if (!simple) {
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("guestResponse");

    guestDiv.appendChild(responseDiv);
    responseDiv.appendChild(createResponseRadio(name, "y", response));
    responseDiv.appendChild(createResponseRadio(name, "n", response));
  }

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

function renderPartyFull(event, partyLastName, partyId, partyGuests) {
  guestsDiv.replaceChildren();

  guestsDiv.appendChild(createParty(partyLastName, partyId, partyGuests));

  rsvpBtn.style.display = "block";
}
