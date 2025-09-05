// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG(); // RPGを隠す

  const field = document.createElement("div");
  field.id = "eggGame";
  field.style.position = "relative";
  field.style.width = "480px";
  field.style.height = "320px";
  field.style.margin = "20px auto";
  field.style.background = "#fdd"; // 卵フィールド背景色
  field.style.overflow = "hidden";
  document.body.appendChild(field);

  let score = 0;
  let time = 30;
  let timer;

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = "./assets/images/tamago.png";
    egg.style.position = "absolute";
    egg.style.left = Math.random() * (480 - 32) + "px";
    egg.style.top = Math.random() * (320 - 32) + "px";
    egg.style.width = "32px";
    egg.style.cursor = "pointer";

    egg.onclick = () => {
      egg.src = "./assets/images/gucha.png";
      score++;
    };

    field.appendChild(egg);
  }

  function updateTimer() {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }

  function endGame() {
    alert("卵つぶし終了！スコア: " + score);
    document.body.removeChild(field);
    showRPG(); // RPGを再表示
    if (onFinish) onFinish(score);
  }

  // ゲーム開始（1秒ごとに卵を出す）
  timer = setInterval(() => {
    spawnEgg();
    updateTimer();
  }, 1000);
}
