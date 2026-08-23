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
  logHeadIconImg.src = "/static/assets/img/" + imgName;
  logHeadIconDiv.appendChild(logHeadIconImg);

  logHeadDiv.appendChild(logHeadTitle);
  logHeadDiv.appendChild(logHeadIconDiv);

  const logContentDiv = document.createElement("div");
  logContentDiv.classList.add("log-content");
  logContentDiv.textContent = lorem;

  logBlockDiv.appendChild(logHeadDiv);
  logBlockDiv.appendChild(logContentDiv);

  return logBlockDiv;
}

const LOGISTICS = [
  {
    title: "Flights",
    imgName: "plane-takeoff.svg",
    content: lorem,
  },
  {
    title: "Logistic 2",
    imgName: "front-facing-car.svg",
    content: lorem,
  },
];

LOGISTICS.forEach(({ title, imgName, content }) => {
  container.appendChild(createLogistic(title, imgName, content));
});
