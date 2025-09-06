// script/eggGame.js
import { showRPG, hideRPG } from "./screen.js";

export function startEggGame(onFinish) {
  hideRPG();

  // 既に古い eggGame があったら消す
  const old = document.getElementById("eggGame");
  if (old) old.remove();

  // GitHub Pages対応の画像パス
  const basePath = window.location.pathname.includes('/DEZIKON.github.io') 
    ? '/DEZIKON.github.io' 
    : '';
  
  const imagePaths = {
    background: `${basePath}/assets/images/tanshi5.png`,
    egg: `${basePath}/assets/images/tamago.png`,
    crushed: `${basePath}/assets/images/gucha.png`
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
      <span style="margin-left:20px;">残り: <b id="egg-time">15</b>s</span>
      <button id="egg-start" style="margin-left:20px;">スタート</button>
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

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = imagePaths.egg;
    egg.dataset.egg = "true";
    egg.style.position = "absolute";
    egg.style.left = Math.random() * (field.clientWidth - 32) + "px";
    egg.style.top = Math.random() * (field.clientHeight - 32) + "px";
    egg.style.width = "32px";
    egg.style.height = "32px";
    egg.style.cursor = "pointer";
    
    // 画像読み込みエラー時の処理 - 絵文字で代替
    egg.onerror = () => {
      // imgタグをdivに置き換えて絵文字表示
      const eggDiv = document.createElement("div");
      eggDiv.innerHTML = "🔴"; // 赤い丸でタニシの卵を表現
      eggDiv.dataset.egg = "true";
      eggDiv.style.position = "absolute";
      eggDiv.style.left = egg.style.left;
      eggDiv.style.top = egg.style.top;
      eggDiv.style.width = "32px";
      eggDiv.style.height = "32px";
      eggDiv.style.fontSize = "24px";
      eggDiv.style.cursor = "pointer";
      eggDiv.style.textAlign = "center";
      eggDiv.style.lineHeight = "32px";
      eggDiv.style.userSelect = "none";
      
      eggDiv.onclick = () => {
        score++;
        document.getElementById("egg-score").textContent = score;
        eggDiv.innerHTML = "💥";
        setTimeout(() => eggDiv.remove(), 300);
      };
      
      // 元のimgを削除して新しいdivを追加
      egg.remove();
      field.appendChild(eggDiv);
    };

    egg.onclick = () => {
      score++;
      document.getElementById("egg-score").textContent = score;
      egg.src = imagePaths.crushed;
      
      // つぶれた画像の読み込みエラー時の処理
      egg.onerror = () => {
        egg.style.display = "none";
        const crushed = document.createElement("div");
        crushed.innerHTML = "💥";
        crushed.style.position = "absolute";
        crushed.style.left = egg.style.left;
        crushed.style.top = egg.style.top;
        crushed.style.fontSize = "32px";
        crushed.style.textAlign = "center";
        crushed.style.userSelect = "none";
        field.appendChild(crushed);
        setTimeout(() => crushed.remove(), 300);
      };
      
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

  document.getElementById("egg-start").onclick = () => {
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
