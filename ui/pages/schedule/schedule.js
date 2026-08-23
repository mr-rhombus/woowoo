const container = document.querySelector(".container");
const lorem =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga vero harum magni quibusdam eligendi aspernatur qui ullam minus veritatis hic ratione, provident dolorem? Consequuntur atque dignissimos alias. Sequi, dicta repudiandae.";

function createDay(dayTitle, dateDiv, events) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");
  dayDiv.id = dayTitle.replace(" ", "").replace(", 2027", "").toLowerCase();

  const dayTitleDiv = document.createElement("div");
  dayTitleDiv.classList.add("day-title");
  dayTitleDiv.textContent += dayTitle;
  dayDiv.appendChild(dayTitleDiv);

  return dayDiv;
}

function createTOD(tod) {
  const todDiv = document.createElement("div");
  todDiv.classList.add("tod-title");
  const todImg = document.createElement("img");

  const todTimeDiv = document.createElement("div");
  switch (tod.toLowerCase()) {
    case "morning":
      todTimeDiv.textContent = "Morning";
      todImg.src = "/ui/assets/img/sunrise.svg";
      todImg.alt = "Sunrise line drawing";
      break;
    case "afternoon":
      todTimeDiv.textContent = "Afternoon";
      todImg.src = "/ui/assets/img/sun.svg";
      todImg.alt = "Sun line drawing";
      break;
    case "evening":
      todTimeDiv.textContent = "Evening";
      todImg.src = "/ui/assets/img/moon-stars.svg";
      todImg.alt = "Moon and stars line drawing";
      break;
    default:
      console.log(`Unrecognized time of day: ${tod}`);
  }

  todDiv.appendChild(todTimeDiv);
  todDiv.appendChild(todImg);

  return todDiv;
}

function createEvent(name, start, end, details) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event");

  const eventTitleDiv = document.createElement("div");
  eventTitleDiv.classList.add("event-title");

  const eventNameDiv = document.createElement("div");
  eventNameDiv.classList.add("event-name");
  eventNameDiv.textContent = name;

  const eventTimeDiv = document.createElement("div");
  eventTimeDiv.classList.add("event-time");
  eventTimeDiv.textContent = `(${start})`;
  if (end !== "") {
    eventTimeDiv.textContent = eventTimeDiv.textContent.replace(
      ")",
      `- ${end})`,
    );
  }

  eventTitleDiv.appendChild(eventNameDiv);
  eventTitleDiv.appendChild(eventTimeDiv);

  const eventDetailsDiv = document.createElement("div");
  eventDetailsDiv.classList.add("event-details");
  eventDetailsDiv.textContent = details;

  eventDiv.appendChild(eventTitleDiv);
  eventDiv.appendChild(eventDetailsDiv);

  return eventDiv;
}

const SCHEDULE = {
  "SEPTEMBER 24, 2027": {
    afternoon: [createEvent("Guest Arrivals", "1pm", "", lorem)],
    evening: [createEvent("Welcome Dinner", "7pm", "9pm", lorem)],
  },
  "SEPTEMBER 25, 2027": {
    morning: [createEvent("Breakfast", "8am", "10am", lorem)],
    afternoon: [
      createEvent("Wedding Ceremony", "2pm", "3pm", lorem),
      createEvent("Aperitivo", "3:30pm", "5pm", lorem),
    ],
    evening: [
      createEvent("Dinner", "6pm", "8pm", lorem),
      createEvent("Celebration", "8pm", "12am", lorem),
    ],
  },
  "SEPTEMBER 26, 2027": {
    morning: [createEvent("Breakfast", "8am", "10am", lorem)],
    afternoon: [
      createEvent("Lunch", "12pm", "2pm", lorem),
      createEvent("Pool Party", "1pm", "3pm", lorem),
      createEvent("Guest Checkout", "4pm", "", lorem),
    ],
  },
};

// Add all events to schedule
for (const [day, eventsByTOD] of Object.entries(SCHEDULE)) {
  dayDiv = createDay(day);
  for (const [tod, events] of Object.entries(eventsByTOD)) {
    todDiv = createTOD(tod);
    dayDiv.append(todDiv);
    for (event of events) {
      dayDiv.appendChild(event);
    }
  }
  container.appendChild(dayDiv);

  const lastDay = Object.keys(SCHEDULE).at(-1);
  if (day !== lastDay) {
    const hrEl = document.createElement("hr");
    container.append(hrEl);
  }
}

// Show "to top" feature if scrolled down far enough
const toTopEl = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTopEl.style.visibility = "visible";
  } else {
    toTopEl.style.visibility = "hidden";
  }
});
