const baseUrl = "http://localhost:8000";

const findPartyBtn = document.querySelector(".findPartyBtn");
findPartyBtn.addEventListener("click", findParty);

async function findParty(event) {
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
    const partyData = await response.json();
    console.log(partyData);
  } catch (error) {
    console.error("Error:", error);
  }
}
