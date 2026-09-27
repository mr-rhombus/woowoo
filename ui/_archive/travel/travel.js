const container = document.querySelector(".container");
const lorem =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga vero harum magni quibusdam eligendi aspernatur qui ullam minus veritatis hic ratione, provident dolorem? Consequuntur atque dignissimos alias. Sequi, dicta repudiandae.";

function createLogistic(title, imgName, content) {
  const logBlockDiv = document.createElement("div");
  logBlockDiv.classList.add("log-block");

  const logHeadDiv = document.createElement("div");
  logHeadDiv.classList.add("log-block-head");

  const logHeadTitle = document.createElement("div");
  logHeadTitle.classList.add("log-head-title");
  logHeadTitle.id = title.replace(" ", "").toLowerCase();
  logHeadTitle.textContent = title;

  const logHeadIconDiv = document.createElement("div");
  logHeadIconDiv.classList.add("log-icon");

  const logHeadIconImg = document.createElement("img");
  logHeadIconImg.src = "/ui/assets/img/" + imgName;
  logHeadIconDiv.appendChild(logHeadIconImg);

  logHeadDiv.appendChild(logHeadTitle);
  logHeadDiv.appendChild(logHeadIconDiv);

  const logContentDiv = document.createElement("div");
  logContentDiv.classList.add("log-content");
  logContentDiv.textContent = content;

  logBlockDiv.appendChild(logHeadDiv);
  logBlockDiv.appendChild(logContentDiv);

  return logBlockDiv;
}

const LOGISTICS = [
  {
    title: "Venue",
    imgName: "villa-outline.svg",
    content:
      "Our wedding will be hosted in Tuscany, IT at Villa Nemora. The venue address is Via Montebenichi, 35, 52020 Montebenichi AR, Italy",
  },
  {
    title: "Flights",
    imgName: "plane-takeoff.svg",
    content:
      "We recommend flying into Amerigo Vespucci Airport in Florence. From there, Villa Nemora is about a 1h 30m drive. Flying into Leonardo da Vinci International Airport in Rome is also an option, however that will require a 3h drive to the venue.",
  },
  {
    title: "Transit",
    imgName: "front-facing-car.svg",
    content:
      "We plan to coordinate shuttles (8 guests) and  buses (20 guests) to help transport guests from Florence to Villa Nemora. We will send out more details as the wedding date approaches.",
  },
];

LOGISTICS.forEach(({ title, imgName, content }) => {
  container.appendChild(createLogistic(title, imgName, content));
});
