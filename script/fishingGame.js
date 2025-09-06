// script/fishingGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startFishingGame(onFinish) {
  hideRPG();

  const old = document.getElementById("fishingGame");
  if (old) old.remove();

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
    <h1 style="font-size:2em; margin-bottom:10px; color:#028;">🎣 ブラックバス釣りゲーム</h1>
    <p style="margin:5px 0 15px; font-size:1.1em; color:#111;">
      敵に遭遇した！ブラックバスをできるだけ多く釣ろう！<br>
      ブラックバス＝加点、それ以外＝減点
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span class="pill" style="color:#06c;">スコア: <b id="fg-hit">0</b></span>
      <span class="pill" style="color:#06c;">残り: <b id="fg-time">30</b>s</span>
      <button id="fg-start">スタート</button>
    </div>
    <div class="pond" id="fg-pond"
         style="width:100%;height:400px;
                background:url('./assets/images/kawa.png') center/cover no-repeat;
                position:relative;overflow:hidden;border:2px solid #004;">
    </div>
  `;

  document.body.appendChild(container);

  let score = 0;
  let time = 30;
  let timer;

  const pond = document.getElementById("fg-pond");

  const fishImages = [
    { src: "./assets/images/bas.png", type: "bass" },
    { src: "./assets/images/ayu.png", type: "other" },
    { src: "./assets/images/namazu.png", type: "other" },
    { src: "./assets/images/sake.png", type: "other" }
  ];

  function spawnFish() {
    const fish = document.createElement("img");
    const fishData = fishImages[Math.floor(Math.random() * fishImages.length)];
    fish.src = fishData.src;
    fish.dataset.type = fishData.type;

    fish.style.position = "absolute";
    fish.style.left = pond.clientWidth + "px";
    fish.style.top = Math.random() * (pond.clientHeight - 48) + "px";
    fish.style.width = "48px";
    fish.style.height = "auto";
    fish.style.cursor = "pointer";
    fish.style.transition = "transform 0.2s";

    fish.onclick = () => {
      if (fish.dataset.type === "bass") {
        score++;
      } else {
        score--;
      }
      document.getElementById("fg-hit").textContent = score;
      fish.remove();
    };

    pond.appendChild(fish);

    // 🔥 ここを修正（速さアップ）
    const speed = 3 + Math.random() * 3; // 3〜6 px/フレーム
    const moveInterval = setInterval(() => {
      const currentX = parseFloat(fish.style.left);
      if (currentX < -50) {
        fish.remove();
        clearInterval(moveInterval);
      } else {
        fish.style.left = currentX - speed + "px";
      }
    }, 30);
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
    const oldModal = document.getElementById("fg-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "fg-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.width = "600px";
    modal.style.color = "#111";
    modal.style.fontSize = "1.1em";
    modal.style.lineHeight = "1.8";
    modal.style.textAlign = "center";
    modal.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
    modal.style.zIndex = "1000";

    modal.innerHTML = `
      <h2 style="color:#002; margin-bottom:10px;">📖 信濃川の魚について</h2>
      <p style="margin-bottom:12px;">
        信濃川では、ブラックバスだけでなくアユ・サケ・ナマズも本来の生息魚<br>ではなく、外来種とされています。
        外来種は在来の生態系に影響を与える可能性があり、環境保全の観点から注意が必要です。ゲームでは「ブラックバス＝加点」「それ以外＝減点」としていますが、実際の川ではどの魚が在来で、どの魚が外来なのかを正しく理解することがとても重要です。
        </p>
      <p style="margin-top:10px; font-weight:bold; font-size:1.2em; color:#333;">
        🎮 あなたのスコア: ${score}
      </p>
      <button id="fg-close" style="margin-top:15px; padding:8px 20px; font-size:1em;">閉じる</button>
    `;

    document.body.appendChild(modal);

    document.getElementById("fg-close").onclick = () => {
      modal.remove();
      document.body.removeChild(container);
      showRPG();
      if (onFinish) onFinish(score);
    };
  }

  document.getElementById("fg-start").onclick = () => {
    timer = setInterval(tick, 1000);
  };
}
