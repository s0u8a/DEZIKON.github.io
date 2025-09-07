import { invasiveSpeciesQuiz } from "./quizdata.js";

let currentQuiz = null;

export function startNiigataQuiz(onEnd) {
  const quizScreen = document.getElementById("quizScreen");
  const quizQ = document.getElementById("quizQuestion");
  const quizChoices = document.getElementById("quizChoices");

  quizScreen.style.display = "block";
  quizChoices.innerHTML = "";

  // ランダムで問題を選ぶ
  currentQuiz = invasiveSpeciesQuiz[Math.floor(Math.random() * invasiveSpeciesQuiz.length)];
  console.log("出題するクイズ:", currentQuiz);

  // ✅ 問題文を表示
  quizQ.textContent = currentQuiz.question;

  // 選択肢を生成
  currentQuiz.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      let explanationEl = document.getElementById("quizExplanation");
      if (!explanationEl) {
        explanationEl = document.createElement("p");
        explanationEl.id = "quizExplanation";
        explanationEl.style.marginTop = "15px";
        explanationEl.style.color = "red";
        quizScreen.appendChild(explanationEl);
      }

      if (choice.startsWith(currentQuiz.correctAnswer)) {
        explanationEl.innerHTML = `⭕ 正解！ ${currentQuiz.explanation}`;
        onEnd(true);
      } else {
        explanationEl.innerHTML = `❌ 不正解！ 正解は ${currentQuiz.correctAnswer}: ${currentQuiz.explanation}`;
        onEnd(false);
      }

      // ✅ 戻るボタン
      let backBtn = document.getElementById("backToGame");
      if (!backBtn) {
        backBtn = document.createElement("button");
        backBtn.id = "backToGame";
        backBtn.textContent = "⬅ ゲームに戻る";
        backBtn.style.display = "block";
        backBtn.style.marginTop = "15px";
        quizScreen.appendChild(backBtn);
      }

      backBtn.onclick = () => {
        quizScreen.style.display = "none";
        quizQ.textContent = "";      // ✅ 問題文をクリア
        quizChoices.innerHTML = "";  // ✅ 選択肢をクリア
        if (explanationEl) explanationEl.remove(); // ✅ 解説を削除
        backBtn.remove();            // ✅ 戻るボタンも削除
        currentQuiz = null;          // ✅ 状態リセット
      };
    };
    quizChoices.appendChild(btn);
  });
}
