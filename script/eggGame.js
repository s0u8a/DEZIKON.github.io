// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG();

  const container = document.createElement("div");
  container.id = "eggGame";
  container.style.width = "760px";
  container.style.margin = "30px auto";
  container.style.textAlign = "center";
  container.style.background = "#fee";
  container.style.padding = "20px";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

  container.innerHTML = `
    <h1 style="font-size:2em; margin-bottom:10px; color:#800;">🥚 タニシ卵つぶしゲーム</h1>
    <h2 style="margin:5px 0 15px; color:#333;">ジャンボタニシの卵をつぶして田んぼを守れ！</h2>
    <p style="margin:5px 0 15px; font-size:1.1em; color:#444;">
      制限時間内にできるだけ多く卵をクリックしてつぶそう。<br>
      つぶした数に応じて報酬がもらえるかも？
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span class="pill">つぶした数: <b id="egg-hit">0</b></span>
      <span class="pill">残り: <b id="egg-time">15</b>s</span>
      <button id="egg-start">スタート</button>
    </div>
    <div class="field" id="egg-field"
         style="width:100%;height:400px;background:#fdd;position:relative;overflow:hidden;border:2px solid #800;">
    </div>
  `;

  document.body.appendChild(container);

  const field = document.getElementById("egg-field");
  let score = 0;
  let time = 15;
  let timer;

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = "./assets/images/tamago.png"; // 🥚生卵画像
    egg.style.position = "absolute";
    egg.style.width = "32px";
    egg.style.height = "32px";

    const maxX = field.clientWidth - 40;
    const maxY = field.clientHeight - 40;
    egg.style.left = Math.floor(Math.random() * maxX) + "px";
    egg.style.top = Math.floor(Math.random() * maxY) + "px";

    egg.style.cursor = "pointer";

    egg.onclick = () => {
      score++;
      document.getElementById("egg-hit").textContent = score;

      // 👣 gucha.png に変更（潰された卵）
      egg.src = "./assets/images/gucha.png";

      // 0.5秒後に消える
      setTimeout(() => {
        egg.remove();
      }, 500);
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
    alert(`ゲーム終了！つぶした数: ${score}`);
    document.body.removeChild(container);
    showRPG();
    if (onFinish) onFinish(score);
  }

  document.getElementById("egg-start").onclick = () => {
    timer = setInterval(tick, 1000);
  };
}
