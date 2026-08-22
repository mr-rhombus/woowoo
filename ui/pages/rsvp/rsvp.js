const baseUrl = "http://localhost:8000";

const findPartyBtn = document.getElementById("findPartyBtn");
findPartyBtn.addEventListener("click", renderParties);

const guestsDiv = document.querySelector(".guests");

const rsvpBtn = document.getElementById("rsvp");
rsvpBtn.addEventListener("click", updateRsvp);

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

async function updateRsvp(event) {
  event.preventDefault();

  const partyForm = document.getElementById("single-party-form");
  const formData = new FormData(partyForm);

  try {
    const response = await fetch(`${baseUrl}/api/update_rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    guestsDiv.replaceChildren();
    rsvpBtn.style.display = "none";

    const successMsgDiv = document.createElement("div");
    successMsgDiv.textContent = "Successfully updated RSVP status!";
    guestsDiv.appendChild(successMsgDiv);
  } catch (error) {
    console.error("Error:", error);
  }
}

function createParty(partyName, partyId, guestData, simple = false) {
  const fieldset = document.createElement("fieldset");

  const legend = document.createElement("legend");
  legend.textContent = partyName;

  const partyForm = document.createElement("form");
  partyForm.id = "single-party-form";
  if (simple) {
    partyForm.classList.add("party-simple");
  } else {
    partyForm.classList.add("party");
  }

  fieldset.appendChild(legend);

  guestData.forEach((guest) => {
    partyForm.appendChild(
      createGuest(guest.full_name, guest.rsvp, (simple = simple)),
    );
  });
  fieldset.appendChild(partyForm);

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
  const guestFieldset = document.createElement("fieldset");
  guestFieldset.classList.add("guest-fieldset");

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

  guestFieldset.appendChild(guestDiv);

  return guestFieldset;
}

function createResponseRadio(guestName, responseOption, actualResponse) {
  const responseDiv = document.createElement("div");
  responseDiv.classList.add("radioResponse");

  const radioInput = document.createElement("input");
  radioInput.type = "radio";
  radioInput.name = guestName;

  const radioLabel = document.createElement("label");

  switch (responseOption.toLowerCase()) {
    case "y":
      radioInput.id = radioInput.name + "_y";
      radioInput.value = "y";
      radioLabel.htmlFor = radioInput.id;
      radioLabel.textContent = "Will Attend";
      if (actualResponse && actualResponse.toLowerCase() === "y") {
        radioInput.checked = true;
      }
      break;
    case "n":
      radioInput.id = radioInput.name + "_n";
      radioInput.value = "n";
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
