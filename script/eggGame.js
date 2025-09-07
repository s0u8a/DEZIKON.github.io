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
    <div class="hud" style="margin-bottom:10px; font-size:1.2em; color:#c06;">
      <span>つぶした数: <b id="egg-score">0</b></span>
      <span style="margin-left:15px;">残り: <b id="egg-time">15</b>s</span>
      <button id="egg-start" style="margin-left:15px;">スタート</button>
    </div>
    <div id="egg-field"
         style="
           width:100%;
           height:400px;
           background:url('./assets/images/tanbo4.png') center/200% 200% no-repeat;
           position:relative;
           overflow:hidden;
           border:2px solid #900;">
    </div>
  `;

  document.body.appendChild(container);

  const field = document.getElementById("egg-field");
  let score = 0;
  let time = 15;
  let timer;

  function spawnEgg() {
    const egg = document.createElement("img");
    egg.src = "./assets/images/tamago.png"; // 通常の卵
    egg.style.position = "absolute";
    egg.style.left = Math.random() * (field.clientWidth - 32) + "px";
    egg.style.top = Math.random() * (field.clientHeight - 32) + "px";
    egg.style.width = "32px";
    egg.style.height = "32px";
    egg.style.cursor = "pointer";

    egg.onclick = () => {
      score++;
      document.getElementById("egg-score").textContent = score;
      egg.src = "./assets/images/gucha.png"; // つぶれた画像に変更
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

    // 既存のモーダルがあれば削除
    const oldModal = document.getElementById("egg-modal");
    if (oldModal) oldModal.remove();

    // モーダル生成
    const modal = document.createElement("div");
    modal.id = "egg-modal";
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
    modal.style.zIndex = "2000";

    modal.innerHTML = `
      <h2 style="color:#600; margin-bottom:10px;">🌾 ジャンボタニシと田んぼの環境</h2>
      <p style="margin-bottom:12px;">
        ジャンボタニシ（スクミリンゴガイ）はもともと<strong>食用として南米から持ち込まれた外来種</strong>ですが、養殖場からの脱走や、飼育放棄されたものが野生化して日本各地の田んぼに広がりました。
        稲を食べて成長し、田植え後の苗に大きな被害を与えるだけでなく、田んぼのあちこちに<strong>気色悪いピンク色の卵</strong>を植え付けて爆発的に繁殖します。<br>
        そのため、農業被害と生態系への影響が問題となっており、卵や個体を見つけたら駆除することが重要です。
      </p>
      <p style="margin-top:10px; font-weight:bold; font-size:1.2em; color:#333;">
        🎮 あなたのスコア: ${score}
      </p>
      <button id="egg-close" style="margin-top:15px; padding:8px 20px; font-size:1em;">閉じる</button>
    `;

    document.body.appendChild(modal);

    // 閉じるボタン処理
    document.getElementById("egg-close").onclick = () => {
      modal.remove();
      document.body.removeChild(container);
      showRPG();
      if (onFinish) onFinish(score);
    };
  }

  document.getElementById("egg-start").onclick = () => {
    score = 0;
    time = 15;
    document.getElementById("egg-score").textContent = score;
    document.getElementById("egg-time").textContent = time;
    field.innerHTML = "";
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  };
}
