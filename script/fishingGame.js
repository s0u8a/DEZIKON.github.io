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
      アユ・サケ・ナマズを釣ると減点になるぞ！
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span class="pill">スコア: <b id="fg-hit">0</b></span>
      <span class="pill">残り: <b id="fg-time">30</b>s</span>
      <button id="fg-start">スタート</button>
    </div>
    <div id="fg-message" style="margin:10px; font-size:1.2em; color:#222;"></div>
    <div class="pond" id="fg-pond"
         style="width:100%;height:400px;background:#9cf;position:relative;overflow:hidden;border:2px solid #004;">
    </div>
  `;

  document.body.appendChild(container);

  let score = 0;
  let time = 30;
  let timer;

  // 魚リスト
  const fishes = [
    { src: "./assets/images/bas.png", good: true, name: "ブラックバス" },
    { src: "./assets/images/ayu.png", good: false, name: "アユ" },
    { src: "./assets/images/namazu.png", good: false, name: "ナマズ" },
    { src: "./assets/images/sake.png", good: false, name: "サケ" }
  ];

  function setMessage(msg) {
    document.getElementById("fg-message").textContent = msg;
  }

  function spawnFish() {
    const fishData = fishes[Math.floor(Math.random() * fishes.length)];
    const fish = document.createElement("img");
    fish.src = fishData.src;
    fish.style.position = "absolute";
    fish.style.left = Math.random() * 700 + "px";
    fish.style.top = Math.random() * 360 + "px";
    fish.style.width = "48px";
    fish.style.height = "48px";
    fish.style.cursor = "pointer";

    fish.onclick = () => {
      if (fishData.good) {
        score++;
        setMessage("🎣 ブラックバスを釣った！");
      } else {
        score = Math.max(0, score - 1);
        setMessage(`❌ ${fishData.name}を釣ってしまった…`);
      }
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
    alert(`釣り終了！最終スコア: ${score}`);

    // 解説文を追加
    const explanation = document.createElement("div");
    explanation.style.margin = "20px auto";
    explanation.style.padding = "15px";
    explanation.style.maxWidth = "720px";
    explanation.style.background = "#fff";
    explanation.style.border = "2px solid #444";
    explanation.style.borderRadius = "8px";
    explanation.style.fontSize = "1em";
    explanation.style.color = "#222";
    explanation.style.lineHeight = "1.6";
    explanation.innerHTML = `
      <h2 style="margin-top:0; color:#004;">📖 信濃川の魚について</h2>
      <p>
        信濃川では、ブラックバスだけでなくアユ・サケ・ナマズも本来の生息魚ではなく、外来種とされています。<br>
        外来種は在来の生態系に影響を与える可能性があり、環境保全の観点から注意が必要です。<br>
        ゲームでは「ブラックバス＝加点」「それ以外＝減点」としていますが、<br>
        実際の川ではどの魚が在来で、どの魚が外来なのかを正しく理解することがとても重要です。
      </p>
      <button id="fg-close" style="margin-top:10px; padding:6px 14px; font-size:1em;">閉じる</button>
    `;

    document.body.appendChild(explanation);

    document.getElementById("fg-close").onclick = () => {
      document.body.removeChild(explanation);
      document.body.removeChild(container);
      showRPG();
      if (onFinish) onFinish(score);
    };
  }

  document.getElementById("fg-start").onclick = () => {
    timer = setInterval(tick, 1000);
  };
}
