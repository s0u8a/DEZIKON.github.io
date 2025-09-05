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
      敵に遭遇した！ブラックバスをできるだけ多く釣ろう！<br>
      ブラックバス = 加点、それ以外 = 減点
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span class="pill">スコア: <b id="fg-hit">0</b></span>
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

  // 🎨 魚の画像
  const fishImages = {
    bas: "./assets/images/bas.png",     // ブラックバス（加点）
    ayu: "./assets/images/ayu.png",     // アユ（減点）
    namazu: "./assets/images/namazu.png", // ナマズ（減点）
    sake: "./assets/images/sake.png"    // サケ（減点）
  };
  const fishTypes = ["bas", "ayu", "namazu", "sake"];

  function spawnFish() {
    const type = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    const fish = document.createElement("img");
    fish.src = fishImages[type];
    fish.dataset.type = type;
    fish.style.position = "absolute";
    fish.style.left = Math.random() * 700 + "px";
    fish.style.top = Math.random() * 360 + "px";
    fish.style.cursor = "pointer";
    fish.style.width = "64px";
    fish.style.height = "64px";
    fish.onclick = () => {
      if (fish.dataset.type === "bas") {
        score++;
      } else {
        score--;
      }
      document.getElementById("fg-hit").textContent = score;
      fish.remove();
    };
    document.getElementById("fg-pond").appendChild(fish);

    // ⏱ 自然消滅（逃げる魚）
    setTimeout(() => {
      if (fish.parentNode) fish.remove();
    }, 3000);
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
    // 🔹 モーダル用オーバーレイ
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "2000";

    // 🔹 解説カード（中央）
    const explanation = document.createElement("div");
    explanation.style.padding = "20px";
    explanation.style.width = "600px";
    explanation.style.background = "#fff";
    explanation.style.border = "2px solid #444";
    explanation.style.borderRadius = "12px";
    explanation.style.fontSize = "1em";
    explanation.style.color = "#222";
    explanation.style.lineHeight = "1.6";
    explanation.style.textAlign = "center";
    explanation.innerHTML = `
      <h2 style="margin-top:0; color:#004;">📖 信濃川の魚について</h2>
      <p>
        信濃川では、ブラックバスだけでなくアユ・サケ・ナマズも本来の生息魚ではなく、外来種とされています。<br>
        外来種は在来の生態系に影響を与える可能性があり、環境保全の観点から注意が必要です。<br>
        ゲームでは「ブラックバス＝加点」「それ以外＝減点」としていますが、<br>
        実際の川ではどの魚が在来で、どの魚が外来なのかを正しく理解することがとても重要です。
      </p>
      <p style="font-weight:bold; margin-top:10px; color:#222;">
        🎮 あなたのスコア: ${score}
      </p>
      <button id="fg-close" style="margin-top:15px; padding:8px 20px; font-size:1em;">閉じる</button>
    `;

    overlay.appendChild(explanation);
    document.body.appendChild(overlay);

    document.getElementById("fg-close").onclick = () => {
      // 解説モーダルを消す
      document.body.removeChild(overlay);
      // ゲーム本体を消す
      document.body.removeChild(container);
      // RPGに戻る
      showRPG();
      // 結果を返す
      if (onFinish) onFinish(score);
    };
  }

  document.getElementById("fg-start").onclick = () => {
    timer = setInterval(tick, 1000);
  };
}
