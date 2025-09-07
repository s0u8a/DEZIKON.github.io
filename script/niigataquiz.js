import { invasiveSpeciesQuiz } from "./quizdata.js";

// ランダムで1問取得
function getRandomQuiz() {
  const randomIndex = Math.floor(Math.random() * invasiveSpeciesQuiz.length);
  return invasiveSpeciesQuiz[randomIndex];
}

// クイズ画面を表示
export function startNiigataQuiz(onFinish) {
  const quiz = getRandomQuiz();

  // ゲーム画面を隠してクイズ画面を表示
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("messageBox").style.display = "none";
  const quizScreen = document.getElementById("quizScreen");
  quizScreen.style.display = "block";

  // 問題文を表示
  document.getElementById("quizQuestion").textContent = quiz.question;

  // 選択肢をボタンとして表示
  const choicesDiv = document.getElementById("quizChoices");
  choicesDiv.innerHTML = "";

  // 解説エリアを追加（毎回リセット）
  let explanationDiv = document.getElementById("quizExplanation");
  if (!explanationDiv) {
    explanationDiv = document.createElement("div");
    explanationDiv.id = "quizExplanation";
    explanationDiv.style.marginTop = "20px";
    explanationDiv.style.fontWeight = "bold";
    quizScreen.appendChild(explanationDiv);
  }
  explanationDiv.textContent = "";

  // 戻るボタンを準備（最初は非表示）
  let backBtn = document.getElementById("quizBackBtn");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.id = "quizBackBtn";
    backBtn.textContent = "⬅ ゲームに戻る";
    backBtn.style.display = "none";
    backBtn.style.marginTop = "20px";
    quizScreen.appendChild(backBtn);
  }

  quiz.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      const answer = ["A","B","C"][idx];
      let correct = false;

      if (answer === quiz.correctAnswer) {
        explanationDiv.textContent = `⭕ 正解！ ${quiz.explanation}`;
        explanationDiv.style.color = "green";
        correct = true;
      } else {
        explanationDiv.textContent = `❌ 不正解！ 正解は ${quiz.correctAnswer} : ${quiz.explanation}`;
        explanationDiv.style.color = "red";
      }

      // 戻るボタンを表示
      backBtn.style.display = "block";

      backBtn.onclick = () => {
        quizScreen.style.display = "none";
        document.getElementById("gameCanvas").style.display = "block";
        document.getElementById("messageBox").style.display = "block";
        if (onFinish) onFinish(correct);
      };
    };
    choicesDiv.appendChild(btn);
  });
}
