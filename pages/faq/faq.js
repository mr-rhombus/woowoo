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
  { question: "Can I pet dat dogue?", answer: lorem },
  { question: "Are children allowed?", answer: "hell no" },
  { question: "Anotha one", answer: lorem },
  { question: "r u getting sick of these yet?", answer: lorem },
  { question: "stahp scrolling", answer: lorem },
  { question: "boo", answer: "lol i got u" },
];

QUESTIONS.forEach((q) => {
  container.appendChild(createQuestion(q.question, q.answer));
});
