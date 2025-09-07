import { invasiveSpeciesQuiz } from "./quizdata.js"; // ←拡張子必須

// ランダムに1問取得
function getRandomQuiz() {
  const randomIndex = Math.floor(Math.random() * invasiveSpeciesQuiz.length);
  return invasiveSpeciesQuiz[randomIndex];
}

// クイズ開始処理
export function startNiigataQuiz(onFinish) {
  const quiz = getRandomQuiz();

  // デバッグログ
  console.log("出題するクイズ:", quiz);
  console.log("問題文:", quiz?.question);
  console.log("選択肢:", quiz?.choices);

  // ゲーム画面を非表示にしてクイズ画面を表示
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("messageBox").style.display = "none";

  const quizScreen = document.getElementById("quizScreen");
  quizScreen.style.display = "block";

  // 問題文を表示
  const qEl = document.getElementById("quizQuestion");
  if (quiz?.question) {
    qEl.textContent = quiz.question;
  } else {
    qEl.textContent = "⚠ 問題文が取得できませんでした";
    console.error("quiz.question が空です:", quiz);
  }

  // 選択肢をボタンで表示
  const choicesDiv = document.getElementById("quizChoices");
  choicesDiv.innerHTML = "";
  quiz.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      const answer = ["A", "B", "C"][idx];
      let correct = false;

      if (answer === quiz.correctAnswer) {
        alert("⭕ 正解！ HP回復！");
        correct = true;
      } else {
        alert(`❌ 不正解！ 正解は ${quiz.correctAnswer}\n${quiz.explanation}`);
      }

      // クイズ終了 → ゲーム画面へ戻す
      quizScreen.style.display = "none";
      document.getElementById("gameCanvas").style.display = "block";
      document.getElementById("messageBox").style.display = "block";

      if (onFinish) onFinish(correct);
    };
    choicesDiv.appendChild(btn);
  });
}
