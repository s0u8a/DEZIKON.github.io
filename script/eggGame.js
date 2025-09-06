// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG();

  const container = document.createElement("div");
  container.id = "eggGame";
  container.style.width = "760px";
  container.style.margin = "30px auto";
  container.style.textAlign = "center";
  container.style.background = "#fff5f5";
  container.style.padding = "20px";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  container.style.fontFamily = "sans-serif";

  container.innerHTML = `
    <h1 style="font-size:2em; margin-bottom:10px; color:#b22222;">
      🥚 タニシ卵つぶしゲーム
    </h1>
    <h2 style="font-size:1.2em; margin-bottom:15px; color:#333;">
      ジャンボタニシの卵をつぶして田んぼを守れ！
    </h2>
    <p style="margin:5px 0 15px; font-size:1em; color:#444;">
      制限時間内にできるだけ多く卵をクリックしてつぶそう。<br>
      つぶした数に応じて報酬がもらえるかも？
    </p>
    <div class="hud" style="margin-bottom:10px; font-size:1.1em;">
      <span>つぶした数: <b id="egg-hit">0</b></span>
      <span style="margin-left:20px;">残り: <b id="egg-time">20</b>s</span>
      <button id="egg-start" style="
        margin-left:20px;
        padding:5px 10px;
        background:#b22222;
        color:white;
        border:none;
        border-radius:5px;
        cursor:pointer;
      ">スタート</button>
    </div>
    <div id="egg-field"
         style="width:100%;height:400px;background:#fee;position:relative;overflow:hidden;border:2px solid #b22222;">
    </div>
  `;

  document.body.appendChild(container);

  let score = 0;
  let time = 20;
  let timer;
  const field = document.getElementById("egg-field");

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = "./assets/images/tamago.png"; // ← 卵画像
    egg.style.position = "absolute";
    egg.style.width = "32px";
    egg.style.height = "32px";

    // ランダム位置（卵が重なりにくいように調整）
    const maxX = field.clientWidth - 40;
    const maxY = field.clientHeight - 40;
    egg.style.left = Math.floor(Math.random() * maxX) + "px";
    egg.style.top = Math.floor(Math.random() * maxY) + "px";

    egg.style.cursor = "pointer";

    egg.onclick = () => {
      score++;
      document.getElementById("egg-hit").textContent = score;
      egg.remove();
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
    // 🎉 ゲーム終了時にメッセージ
    alert(`ゲーム終了！つぶした数: ${score}`);
    document.body.removeChild(container);
    showRPG();
    if (onFinish) onFinish(score);
  }

  document.getElementById("egg-start").onclick = () => {
    if (timer) clearInterval(timer); // 多重スタート防止
    score = 0;
    time = 20;
    document.getElementById("egg-hit").textContent = score;
    document.getElementById("egg-time").textContent = time;
    field.innerHTML = ""; // 卵をリセット
    timer = setInterval(tick, 1000);
  };
}
