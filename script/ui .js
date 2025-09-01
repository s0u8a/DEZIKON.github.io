const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

const questions = [
  {
    question: "日本の首都はどこ？",
    answers: [
      { text: "大阪", correct: false },
      { text: "東京", correct: true },
      { text: "京都", correct: false },
      { text: "名古屋", correct: false }
    ]
  },
  {
    question: "地球は何番目の惑星？",
    answers: [
      { text: "3番目", correct: true },
      { text: "2番目", correct: false },
      { text: "4番目", correct: false },
      { text: "5番目", correct: false }
    ]
  }
];

let currentQuestionIndex = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.classList.add("hidden");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  
  if (isCorrect) {
    selectedBtn.style.background = "#2ecc71";
  } else {
    selectedBtn.style.background = "#e74c3c";
  }
  
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
  });
  
  nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    questionElement.innerText = "バトル終了！お疲れさまでした次のステージへ🎉";
    answerButtons.innerHTML = "";
    nextButton.classList.add("hidden");
  }
});

startQuiz();
