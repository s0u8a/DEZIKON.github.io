// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG();

  // 既に古い eggGame があったら消す
  const old = document.getElementById("eggGame");
  if (old) old.remove();

  // 画像パスを絶対パスまたはルートパスに修正
  const imagePaths = {
    background: "assets/images/tanshigame.png",
    egg: "assets/images/tamago.png",
    crushed: "assets/images/gucha.png"
  };

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
  container.style.zIndex = "1000";

  container.innerHTML = `
    <h1 style="font-size:2em; margin-bottom:10px; color:#900;">🥚 タニシ卵つぶしゲーム</h1>
    <p style="margin:5px 0 15px; font-size:1.1em; color:#222;">
      ジャンボタニシの卵をつぶして田んぼを守れ！<br>
      制限時間内にできるだけ多くクリックしてつぶそう！
    </p>
    <div class="hud" style="margin-bottom:10px;">
      <span style="color:deeppink;">つぶした数: <b id="egg-score">0</b></span>
      <span>残り: <b id="egg-time">15</b>s</span>
      <button id="egg-start">スタート</button>
    </div>
    <div id="egg-field"
         style="width:760px;height:400px;
                background:url('${imagePaths.background}') center/cover no-repeat;
                position:relative;overflow:hidden;border:2px solid #900;">
    </div>
  `;

  document.body.appendChild(container);

  const field = document.getElementById("egg-field");
  let score = 0;
  let time = 15;
  let timer;

  // 画像の事前読み込み関数
  function preloadImages() {
    return Promise.all(
      Object.values(imagePaths).map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => {
            console.warn(`画像の読み込みに失敗: ${src}`);
            resolve(src); // エラーでも続行
          };
          img.src = src;
        });
      })
    );
  }

  function spawnEgg() {
    const egg = document.createElement("div");
    
    // まず絵文字版を作成（確実に動作する）
    egg.innerHTML = "🥚";
    egg.dataset.egg = "true";
    egg.style.position = "absolute";
    egg.style.left = Math.random() * (field.clientWidth - 32) + "px";
    egg.style.top = Math.random() * (field.clientHeight - 32) + "px";
    egg.style.width = "32px";
    egg.style.height = "32px";
    egg.style.fontSize = "32px";
    egg.style.cursor = "pointer";
    egg.style.userSelect = "none";
    egg.style.textAlign = "center";
    egg.style.lineHeight = "32px";
    
    // 画像版を試行
    const imgEgg = document.createElement("img");
    imgEgg.src = imagePaths.egg;
    imgEgg.style.width = "32px";
    imgEgg.style.height = "32px";
    
    imgEgg.onload = () => {
      // 画像読み込み成功時は画像に置き換え
      egg.innerHTML = "";
      egg.appendChild(imgEgg);
    };
    
    imgEgg.onerror = () => {
      // 画像読み込み失敗時はそのまま絵文字を使用
      console.warn("卵画像の読み込みに失敗:", imagePaths.egg);
    };

    egg.onclick = () => {
      score++;
      document.getElementById("egg-score").textContent = score;
      
      // つぶれた表示
      if (egg.querySelector('img')) {
        // 画像版の場合
        const crushedImg = document.createElement("img");
        crushedImg.src = imagePaths.crushed;
        crushedImg.style.width = "32px";
        crushedImg.style.height = "32px";
        
        crushedImg.onload = () => {
          egg.innerHTML = "";
          egg.appendChild(crushedImg);
        };
        
        crushedImg.onerror = () => {
          egg.innerHTML = "💥";
        };
      } else {
        // 絵文字版の場合
        egg.innerHTML = "💥";
      }
      
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

    const old = document.getElementById("eggGame");
    if (old) old.remove();

    showRPG();

    if (onFinish) onFinish(score);
  }

  // スタートボタンの処理
  document.getElementById("egg-start").onclick = async () => {
    // 画像の事前読み込み
    await preloadImages();
    
    score = 0;
    time = 15;
    document.getElementById("egg-score").textContent = score;
    document.getElementById("egg-time").textContent = time;

    // 卵だけ削除（背景はCSSで残る）
    const eggs = field.querySelectorAll("img[data-egg='true'], div[data-egg='true']");
    eggs.forEach(e => e.remove());

    clearInterval(timer);
    timer = setInterval(tick, 1000);
  };
}
