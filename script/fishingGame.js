// script/fishingGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startFishingGame(onFinish) {
  hideRPG();

  const container = document.createElement("div");
  container.id = "fishingGame";
  container.style.width = "760px";
  container.style.margin = "30px auto";
  container.style.textAlign = "center";
  container.style.background = "#eef";
  container.style.padding = "20px";
  container.style.borderRadius = "12px";
  container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

  container.innerHTML = `
    <h1 style="font-size:2em; margin-bottom:10px; color:#004;">🎣 ブラックバス釣りゲーム</h1>
    <p style="margin:5px 0 15px; font-size:1.1em; color:#222;">
      敵に遭遇した！ブラックバスをできるだけ多く釣ろう！
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span class="pill">命中: <b id="fg-hit">0</b></span>
      <span class="pill">残り: <b id="fg-time">30</b>s</span>
      <button id="fg-start">スタート</button>
    </div>
    <div class="pond" id="fg-pond"
         style="width:100%;height:400px;background:#9cf;position:relative;overflow:hidden;border:2px solid #004;">
    </div>
  `;

  document.body.appendChild(container);

  let score = 0;
  let time = 30;
  let timer;

  function spawnFish() {
    const fish = document.createElement("div");
    fish.textContent = "🐟";
    fish.style.position = "absolute";
    fish.style.left = Math.random() * 700 + "px";
    fish.style.top = Math.random() * 360 + "px";
    fish.style.cursor = "pointer";
    fish.style.fontSize = "28px";
    fish.onclick = () => {
      score++;
      document.getElementById("fg-hit").textContent = score;
      fish.remove();
    };
    document.getElementById("fg-pond").appendChild(fish);
  }

  function tick() {
    time--;
    document.getElementById("fg-time").textContent = time;
    spawnFish();
    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }

  function endGame() {
    alert(`釣り終了！釣った数: ${score}`);
    document.body.removeChild(container);
    showRPG();
    if (onFinish) onFinish(score);
  }

  document.getElementById("fg-start").onclick = () => {
    timer = setInterval(tick, 1000);
  };
}
