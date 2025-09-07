import { invasiveSpeciesQuiz } from "./quizdata.js";

function getRandomQuiz() {
  const randomIndex = Math.floor(Math.random() * invasiveSpeciesQuiz.length);
  return invasiveSpeciesQuiz[randomIndex];
}

export function startNiigataQuiz(onFinish) {
  const quiz = getRandomQuiz();
  console.log("✅ クイズ開始", quiz);

  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("messageBox").style.display = "none";
  const quizScreen = document.getElementById("quizScreen");
  quizScreen.style.display = "block";

  document.getElementById("quizQuestion").textContent = quiz.question;

  const choicesDiv = document.getElementById("quizChoices");
  choicesDiv.innerHTML = "";
  quiz.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      const answer = ["A","B","C"][idx];
      let correct = false;
      if (answer === quiz.correctAnswer) {
        alert("⭕ 正解！ HP回復！");
        correct = true;
      } else {
        alert(`❌ 不正解！ 正解は ${quiz.correctAnswer}\n${quiz.explanation}`);
      }
      quizScreen.style.display = "none";
      document.getElementById("gameCanvas").style.display = "block";
      document.getElementById("messageBox").style.display = "block";
      if (onFinish) onFinish(correct);
    };
    choicesDiv.appendChild(btn);
  });
}
