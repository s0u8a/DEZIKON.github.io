// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG();

  // 既に古い eggGame があったら消す
  const old = document.getElementById("eggGame");
  if (old) old.remove();

  // コンテナ作成
  const container = document.createElement("div");
  container.id = "eggGame";
  container.style.width = "760px";
  container.style.margin = "30px auto";
  container.style.textAlign = "center";
  container.style.background = "#fee";
  container.style.padding = "20px";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  container.style.position = "relative";
  container.style.zIndex = "1000"; // RPGより上に表示

  container.innerHTML = `
    <h1 style="font-size:2em; margin-bottom:10px; color:#900;">🥚 タニシ卵つぶしゲーム</h1>
    <p style="margin:5px 0 15px; font-size:1.1em; color:#222;">
      ジャンボタニシの卵をつぶして田んぼを守れ！<br>
      制限時間内にできるだけ多くクリックしてつぶそう！
    </p>
    <div class="hud" style="margin-bottom:10px; font-size:1.2em; color:deeppink;">
      <span>つぶした数: <b id="egg-score">0</b></span>
      <span>　残り: <b id="egg-time">15</b>s</span>
      <button id="egg-start">スタート</button>
    </div>
    <div id="egg-field"
         style="width:100%;height:400px;
                background:url('./assets/images/tanshigame.png') center center / contain no-repeat;
                position:relative;overflow:hidden;border:2px solid #900;">
    </div>
  `;

  document.body.appendChild(container);

  const field = document.getElementById("egg-field");
  let score = 0;
  let time = 15;
  let timer;

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = "./assets/images/tamago.png"; // 卵画像
    egg.style.position = "absolute";
    egg.style.left = Math.random() * (field.clientWidth - 32) + "px";
    egg.style.top = Math.random() * (field.clientHeight - 32) + "px";
    egg.style.width = "32px";
    egg.style.height = "32px";
    egg.style.cursor = "pointer";

    egg.onclick = () => {
      score++;
      document.getElementById("egg-score").textContent = score;
      egg.src = "./assets/images/gucha.png"; // つぶれた画像
      setTimeout(() => egg.remove(), 300);
    };

    field.appendChild(egg);
  }

  function tick() {
    time--;
    document.getElementById("egg-time").textContent = time;
    spawnEgg();
    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }

  function endGame() {
    clearInterval(timer);

    alert(`終了！つぶした数: ${score}`);

    // eggGame を必ず削除
    const old = document.getElementById("eggGame");
    if (old) old.remove();

    // RPG画面を復帰
    showRPG();

    if (onFinish) onFinish(score);
  }

  document.getElementById("egg-start").onclick = () => {
    score = 0;
    time = 15;
    document.getElementById("egg-score").textContent = score;
    document.getElementById("egg-time").textContent = time;

    // 卵だけ消す（背景は消さない）
    const eggs = field.querySelectorAll("img");
    eggs.forEach(e => e.remove());

    clearInterval(timer);
    timer = setInterval(tick, 1000);
  };
}
