const container = document.querySelector(".container");
const lorem =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga vero harum magni quibusdam eligendi aspernatur qui ullam minus veritatis hic ratione, provident dolorem? Consequuntur atque dignissimos alias. Sequi, dicta repudiandae.";

function createQuestion(question, answer) {
  const questionEl = document.createElement("div");
  questionEl.classList.add("question");

  const qHeaderEl = document.createElement("div");
  qHeaderEl.classList.add("question-header");

  const qTitleEl = document.createElement("div");
  qTitleEl.classList.add("question-title");
  qTitleEl.textContent = question;
  qHeaderEl.appendChild(qTitleEl);

  const qBodyEl = document.createElement("div");
  qBodyEl.classList.add("question-body");
  qBodyEl.textContent = answer;

  questionEl.appendChild(qHeaderEl);
  questionEl.appendChild(qBodyEl);

  return questionEl;
}

const QUESTIONS = [
  {
    question: "Where is the wedding?",
    answer:
      "Our wedding will take place at Villa Nemora in Montebenichi, Bucine, Tuscany, nestled in the rolling hills of the Tuscan countryside between Florence, Siena, and Arezzo.",
  },
  {
    question: "How do I get to Villa Nemora?",
    answer:
      "The closest major airport is Florence Airport (FLR), approximately a 1-1.5 hour drive from Villa Nemora. Pisa Airport (PSA) is approximately 2 hours away, while Rome (FCO) is about 2.5-3 hours away.",
  },
  {
    question: "Where should I stay?",
    answer:
      "We would love for you to stay with us at the venue! The property includes three villas all within an 8 minute walk.",
  },
  {
    question: "Are kids welcome?",
    answer:
      "While we love all your little ones, our wedding will be an adult-only event. We appreciate your understanding!",
  },
  {
    question: "What should I wear?",
    answer:
      "Cocktail (tuxes and gowns welcome, as well as suits and cocktail dresses). Please be mindful of the fact that the majority of the wedding will take place on grass/gravel when choosing your shoes!",
  },
  {
    question: "Will the wedding take place indoors or outdoors?",
    answer: "All events will take place outdoors, barring inclement weather!",
  },
  {
    question: "Do I need to rent a car?",
    answer:
      "We recommend renting a car if you plan to explore Tuscany before or after the wedding. Villa Nemora is located in the countryside, where public transportation and rideshare services are limited. If you don't plan to rent a car, we are happy to help coordinate a shared van from Florence to the venue!",
  },
  {
    question: "Can I bring a plus-one?",
    answer: "Please refer to your invitation for information about plus-ones. ",
  },
];

QUESTIONS.forEach((q) => {
  container.appendChild(createQuestion(q.question, q.answer));
});
