const baseUrl =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://williams-diamond.com";

const findPartyBtn = document.getElementById("findPartyBtn");
findPartyBtn.addEventListener("click", renderParties);

const rsvpBtn = document.getElementById("rsvp");
const submitBtn = document.getElementById("modalSubmitBtn");
const validFormDiv = document.querySelector(".validation-warning");

const guestsDiv = document.querySelector(".guests");

async function renderParties(event) {
  event.preventDefault();

  guestsDiv.replaceChildren();

  const fullNameElement = document.getElementById("fullName");
  const fullNameVal = fullNameElement.value.trim();
  const fullNameData = {
    full_name: fullNameVal,
  };

  try {
    const response = await fetch(`${baseUrl}/api/find_guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullNameData),
    });
    const result = await response.json();

    const partyIds = [...new Set(result.guests.map((guest) => guest.group_id))];

    partyIds.forEach((partyId) => {
      const partyGuests = result.guests.filter(
        (guest) => guest.group_id === partyId,
      );
      guestsDiv.appendChild(createParty(partyId, partyGuests, true));
    });

    if (result.guests.length == 0) {
      const noGuestsFoundDiv = document.createElement("div");
      noGuestsFoundDiv.classList.add("text");
      noGuestsFoundDiv.textContent = `No guests found with a name matching "${fullNameVal}"`;
      guestsDiv.appendChild(noGuestsFoundDiv);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function updateRsvp(event, partyId) {
  event.preventDefault();

  const partyForm = document.getElementById("single-party-form");
  const formData = new FormData(partyForm);
  const requestBody = {
    responses: Object.fromEntries(formData),
    party_id: partyId,
  };

  try {
    await fetch(`${baseUrl}/api/update_rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    guestsDiv.replaceChildren();
    rsvpBtn.style.display = "none";

    const successMsgDiv = document.createElement("div");
    successMsgDiv.classList.add("text-center");
    successMsgDiv.textContent = "Successfully updated RSVP status!";
    guestsDiv.appendChild(successMsgDiv);
  } catch (error) {
    console.error("Error:", error);
  }
}

function createParty(partyId, guestData, simple = false) {
  const fieldset = document.createElement("fieldset");

  const legend = document.createElement("legend");

  const partyForm = document.createElement("form");
  partyForm.id = "single-party-form";
  if (simple) {
    partyForm.classList.add("party-simple");
  } else {
    partyForm.classList.add("party");
  }

  fieldset.appendChild(legend);

  guestData.sort((a, b) => a.sort_order - b.sort_order);
  guestData.forEach((guest) => {
    partyForm.appendChild(
      createGuest(
        guest.full_name,
        guest.id,
        guest.is_plus_one,
        guest.rsvp,
        simple,
      ),
    );
  });
  fieldset.appendChild(partyForm);

  const selectPartyBtn = document.createElement("button");
  selectPartyBtn.classList.add("select-party-btn");
  selectPartyBtn.id = partyId;
  selectPartyBtn.textContent = "Select Party";
  selectPartyBtn.addEventListener("click", (e) =>
    renderPartyFull(e, partyId, guestData),
  );

  if (simple) {
    fieldset.appendChild(selectPartyBtn);
  }

  return fieldset;
}

function createGuest(
  name,
  guestId,
  is_plus_one,
  response = null,
  simple = true,
) {
  const guestFieldset = document.createElement("fieldset");
  guestFieldset.classList.add("guest-fieldset");

  const guestDiv = document.createElement("div");
  guestDiv.classList.add("guest");

  const nameDiv = document.createElement("div");
  nameDiv.classList.add("guestName");

  const nameContentDiv = document.createElement("div");
  nameContentDiv.textContent = name;
  nameDiv.appendChild(nameContentDiv);

  guestDiv.appendChild(nameDiv);

  // Force guests with unnamed plus-ones to name them
  if (!name.includes(" ") || name.toLowerCase().strip === "guest") {
    rsvpBtn.disabled = true;
    rsvpBtn.classList.add("disabled-btn");
    if (!simple) {
      validFormDiv.style.opacity = 1;
    }
  }

  if (!simple) {
    guestDiv.classList.add("guest-detailed");
    if (is_plus_one) {
      nameDiv.classList.add("edit-guest");

      const editGuestContainer = document.createElement("div");
      editGuestContainer.classList.add("edit-guest-container");
      editGuestContainer.id = "openModalBtn";

      const editGuestIcon = document.createElement("img");
      editGuestIcon.src = "/ui/assets/img/edit-outline.svg";
      editGuestContainer.appendChild(editGuestIcon);

      const editGuestText = document.createElement("div");
      editGuestText.classList.add("edit-text");
      editGuestText.textContent = "Edit";
      editGuestContainer.appendChild(editGuestText);

      nameDiv.appendChild(editGuestContainer);
      editGuestContainer.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openEditModal(nameContentDiv, guestId);
      });
    }
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("guestResponse");

    guestDiv.appendChild(responseDiv);
    responseDiv.appendChild(createResponseRadio(name, "y", response));
    responseDiv.appendChild(createResponseRadio(name, "n", response));
  }

  guestFieldset.appendChild(guestDiv);

  return guestFieldset;
}

function openEditModal(nameDiv, guestId) {
  const modal = document.getElementById("customModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const newGuestInput = document.getElementById("newGuestName");
  newGuestInput.value = nameDiv.textContent.trim();
  let newName = "";

  modal.showModal();

  // Enable submit btn if input has text
  newGuestInput.addEventListener("input", (event) => {
    if (event.target.value.trim().length > 0) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("disabled-btn");
      newName = event.target.value.trim();
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add("disabled-btn");
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.close();
  });

  submitBtn.addEventListener("click", (e) => {
    if (newName.length > 0) {
      // Update displayed name
      nameDiv.textContent = newName;

      // Update form
      const guestInputs = document.querySelectorAll(
        "div.edit-guest + div.guestResponse input",
      );
      guestInputs.forEach((input) => {
        input.name = newName;
      });

      // Update name in DB
      updateGuestName(newName, guestId);
      modal.close();
    }
  });

  modal.addEventListener("click", (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

function updateGuestName(newName, guestId) {
  requestBody = { guest_id: guestId, full_name: newName };
  try {
    fetch(`${baseUrl}/api/update_guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error("Error:", error);
  }

  if (newName.includes(" ") && newName.toLowerCase().trim() !== "guest") {
    rsvpBtn.disabled = false;
    rsvpBtn.classList.remove("disabled-btn");
    validFormDiv.style.opacity = 0;
  } else {
    rsvpBtn.disabled = true;
    rsvpBtn.classList.add("disabled-btn");
    validFormDiv.style.opacity = 1;
  }
}

function createResponseRadio(guestName, responseOption, actualResponse) {
  const responseDiv = document.createElement("div");
  responseDiv.classList.add("radioResponse");

  const radioInput = document.createElement("input");
  radioInput.type = "radio";
  radioInput.name = guestName.trim();

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

function renderPartyFull(event, partyId, partyGuests) {
  guestsDiv.replaceChildren();

  guestsDiv.appendChild(createParty(partyId, partyGuests));

  rsvpBtn.addEventListener("click", (e) => {
    updateRsvp(e, partyId);
  });

  rsvpBtn.style.display = "block";
}
