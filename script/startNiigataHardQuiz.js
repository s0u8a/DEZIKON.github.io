import { niigataHardQuiz } from "./niigataHardQuiz.js";

// ランダムで1問取得
function getRandomQuiz() {
  return niigataHardQuiz[Math.floor(Math.random() * niigataHardQuiz.length)];
}

// クイズ画面を表示
export function startNiigataHardQuiz(onFinish) {
  const quiz = getRandomQuiz();

  // 🎮 ゲーム画面を非表示
  const gameCanvas = document.getElementById("gameCanvas");
  const messageBox = document.getElementById("messageBox");
  gameCanvas.style.display = "none";
  messageBox.style.display = "none";

  // 📝 クイズ画面を表示
  const quizScreen = document.getElementById("quizScreen");
  quizScreen.style.display = "block";

  // 問題文を表示
  document.getElementById("quizQuestion").textContent = quiz.question;

  // 選択肢の描画領域をリセット
  const choicesDiv = document.getElementById("quizChoices");
  choicesDiv.innerHTML = "";

  // 解説と戻るボタンをリセット
  const explanationDiv = document.getElementById("quizExplanation");
  explanationDiv.innerHTML = "";
  const backBtn = document.getElementById("backToGame");
  backBtn.style.display = "none";

  // 選択肢ボタンを生成
  quiz.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.classList.add("quiz-button"); // スタイル用クラス（任意）

    btn.onclick = () => {
      const selected = ["A","B","C"][idx];
      const correct = (selected === quiz.correctAnswer);

      // 結果 + 解説表示
      explanationDiv.innerHTML = `
        <p>${correct ? "⭕ 正解！" : "❌ 不正解！"} 正解は ${quiz.correctAnswer} です。</p>
        <p>${quiz.explanation}</p>
        ${quiz.image ? `<img src="${quiz.image}" alt="解説画像" style="max-width:100%;margin-top:10px;">` : ""}
      `;

      // 戻るボタンを表示
      backBtn.style.display = "block";
      backBtn.onclick = () => {
        quizScreen.style.display = "none";
        gameCanvas.style.display = "block";
        messageBox.style.display = "block";
        if (onFinish) onFinish(correct);
      };
    };

    choicesDiv.appendChild(btn);
  });
}
