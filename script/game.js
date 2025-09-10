import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy, enemies } from "./enemy.js";
import { checkGoal, checkGameOver, triggerNormalEnding, triggerSpecialEnding } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js";          // 🐸 カエル用
import { startNiigataHardQuiz } from "./startNiigataHardQuiz.js"; // 🦝 アライグマ用

// 🎮 キャンバス設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// 📢 メッセージ表示
const statusEl = document.getElementById("messageBox");
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 🎵 BGM
const bgm = document.getElementById("bgm");

// 🎨 画像管理
const images = {
  floor: new Image(),
  wall: new Image(),
  wallSpecial: new Image(),
  enemy: new Image(),
  enemy2: new Image(),
  enemy3: new Image(), // アライグマ
  item: new Image(),
  ally: new Image(),
  allyFishing: new Image(),
  goal: new Image(),
  goalEntrance: new Image(),
  entrance: new Image(),
  mahouzin: new Image(),
  floorSpecial: new Image(),
  pl: new Image(),
  heart: new Image(),
  bridge: new Image(),
  tree: new Image(),
  clear: new Image(),
  over: new Image(),
  sadometu: new Image()
};

// 🖼 画像読み込み
images.floor.src = "./assets/images/tanbo3.png";
images.wall.src = "./assets/images/mizu_big.png";
images.wallSpecial.src = "./assets/images/isikabe.png";
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png";
images.enemy3.src = "./assets/images/araiguma.png"; // 🦝 アライグマ
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.allyFishing.src = "./assets/images/turibito.png";
images.goal.src = "./assets/images/kakasi2.png";
images.goalEntrance.src = "./assets/images/koudouiriguti.png";
images.entrance.src = "./assets/images/kintin.png";
images.mahouzin.src = "./assets/images/mahouzin.png";
images.floorSpecial.src = "./assets/images/tikakoudouyuka.png";
images.pl.src = "./assets/images/noumin.png";
images.heart.src = "./assets/images/ha-to.png";
images.bridge.src = "./assets/images/hasihasii.png";
images.tree.src = "./assets/images/kinokabe.png";
images.clear.src = "./assets/images/clear.png";
images.over.src = "./assets/images/over.png";
images.sadometu.src = "./assets/images/sadometu.png";

// 🌍 ゲーム状態
let currentMapIndex = 0;
let map = maps[currentMapIndex].map(row => [...row]);
let nearAlly = false;
let nearFishingAlly = false;
let gameCleared = false;
let gameOver = false;
let endingType = null; // "normal" or "special"

// 🖼 キャンバスリサイズ
const dpr = window.devicePixelRatio || 1;
function resizeCanvas() {
  canvas.width = map[0].length * tile * dpr;
  canvas.height = map.length * tile * dpr;
  canvas.style.width = map[0].length * tile + "px";
  canvas.style.height = map.length * tile + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();

// 🚶 移動可能判定
function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  const cell = map[y][x];
  return cell !== "#" && cell !== "T" && cell !== "W" && cell !== "N";
}

// ▶ プレイヤー初期化
function resetPlayer() {
  initPlayer(map);
  player.hearts = player.maxHearts;
  player.invincibleTime = 0;
}

// ➡ 次マップへ
function nextMap() {
  // 最終マップ到達していたらエンディングへ
  if (currentMapIndex >= maps.length - 1) {
    if (enemies.length === 0) {
      triggerSpecialEnding({ setStatus, bgm, endingRef: { value: endingType }, setGameCleared: (f) => gameCleared = f });
      endingType = "special";
    } else {
      triggerNormalEnding({ setStatus, bgm, endingRef: { value: endingType }, setGameCleared: (f) => gameCleared = f });
      endingType = "normal";
    }
    return;
  }

  // 次マップへ進む
  currentMapIndex++;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();

  // マップごとの専用メッセージ
  switch (currentMapIndex) {
    case 0:
      setStatus("🌾 マップ1：田んぼエリアに到着！");
      break;
    case 1:
      setStatus("🌊 マップ2：信濃川の流域に突入！");
      break;
    case 2:
      setStatus("🏔 マップ3：山間部の里に入った！");
      break;
    case 3:
      setStatus("⛏ マップ4：佐渡金山の地下坑道に潜入！");
      break;
    default:
      setStatus(`➡ マップ${currentMapIndex + 1} へ進んだ！`);
  }
}

// 👤 プレイヤーが立っているタイル判定
function onTile(x, y) {
  const cell = map[y][x];
  nearAlly = cell === "A";
  nearFishingAlly = cell === "S";

  if (nearAlly) setStatus("🤝 村人がいる！Enterで話しかけてください");
  if (nearFishingAlly) setStatus("🎣 釣り好きの村人がいる！Enterで話しかけてください");
}

// ⌨️ キー操作
document.addEventListener("keydown", (e) => {
  if (gameCleared || gameOver) return;

  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;
  else if (e.key === "Enter" && nearAlly) {
    setStatus("💬 村人『田んぼを荒らすジャンボタニシの卵をつぶしてくれ！』");
    setTimeout(() => {
      startEggGame((score) => {
        if (score >= 10) heal(1, setStatus);
        setStatus(score >= 10 ? `🥚 卵を大量につぶした！HP回復！` : `🥚 卵つぶしスコア: ${score}`);
      });
      map[player.y][player.x] = "0";
      nearAlly = false;
    }, 1500);
    return;
  }
  else if (e.key === "Enter" && nearFishingAlly) {
    setStatus("💬 村人『信濃川の外来魚を釣って退治してくれ！』");
    setTimeout(() => {
      startFishingGame((score) => {
        if (score >= 10) heal(1, setStatus);
        else if (score <= 0) takeDamage(1, setStatus);
        setStatus(score >= 10 ? `🐟 ブラックバスを ${score} 匹釣った！HP回復！`
                  : score <= 0 ? `❌ ブラックバスが少なすぎる…外道ばかり！HP減少`
                  : `🎣 釣果: ブラックバス ${score}匹`);
      });
      map[player.y][player.x] = "0";
      nearFishingAlly = false;
    }, 1500);
    return;
  } else return;

  if (walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;

    if (checkGoal(map, player.x, player.y)) {
      setStatus("🏁 ゴール！");
      nextMap();
      return;
    }
    onTile(nx, ny);

    if (map[player.y][player.x] === "I") {
      heal(1, setStatus);
      setStatus("🍙 アイテムを取った！HP回復！");
      map[player.y][player.x] = "0";
    }
  }

  // 敵との接触処理
  updateEnemies(walkable, player, (amt, enemyIndex, type) => {
    if (type === "normal") {
      takeDamage(amt, setStatus);
      removeEnemy(enemyIndex);
    } else if (type === "frog") {
      setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");
      startNiigataQuiz((correct) => {
        if (correct) heal(1, setStatus);
        else takeDamage(1, setStatus);
        setStatus(correct ? "⭕ 正解！HP回復！" : "❌ 不正解！HP減少");
        removeEnemy(enemyIndex);
      });
    } else if (type === "araiteki") {
      setStatus("🦝 アライグマに遭遇！高難易度クイズに挑戦！");
      startNiigataHardQuiz((correct) => {
        if (correct) heal(1, setStatus);
        else takeDamage(1, setStatus);
        setStatus(correct ? "⭕ 正解！HP回復！" : "❌ 不正解！HP減少");
        removeEnemy(enemyIndex);
      });
    }
  });

  if (checkGameOver(player, setStatus)) {
    if (bgm) bgm.pause();
    gameOver = true;
    return;
  }
});

// ▶ リスタート処理
function restartGame() {
  currentMapIndex = 0;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();
  setStatus("🔄 ゲーム再スタート！");
  gameCleared = false;
  gameOver = false;
  endingType = null;
  if (bgm) {
    bgm.currentTime = 0;
    bgm.play().catch(()=>{});
  }
  draw();
}

// 🎨 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameCleared) {
    if (endingType === "special") {
      ctx.drawImage(images.sadometu, 0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("✨ 特殊エンディング！", canvas.width / dpr / 2, 50);
    } else {
      ctx.drawImage(images.clear, 0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("🎉 ノーマルエンディング！", canvas.width / dpr / 2, 50);
    }
    return;
  }

  if (gameOver) {
    ctx.drawImage(images.over, 0, 0, canvas.width / dpr, canvas.height / dpr);
    const btnW = 200, btnH = 50;
    const btnX = (canvas.width / dpr - btnW) / 2;
    const btnY = canvas.height / dpr * 0.7;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Restart", btnX + btnW/2, btnY + 32);
    return;
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;
      const cell = map[y][x];

      // 床
      if (cell === "K" || cell === "X") ctx.drawImage(images.floorSpecial, dx, dy, tile, tile);
      else ctx.drawImage(images.floor, dx, dy, tile, tile);

      if (cell === "#") ctx.drawImage(images.wall, dx, dy, tile, tile);
      if (cell === "W") ctx.drawImage(images.wallSpecial, dx, dy, tile, tile);
      if (cell === "I") ctx.drawImage(images.item, dx, dy, tile, tile);
      if (cell === "A") ctx.drawImage(images.ally, dx, dy, tile, tile);
      if (cell === "S") ctx.drawImage(images.allyFishing, dx, dy, tile, tile);
      if (cell === "G") {
        if (currentMapIndex === 3) ctx.drawImage(images.mahouzin, dx, dy, tile, tile);
        else ctx.drawImage(images.goal, dx, dy, tile, tile);
      }
      if (cell === "E") ctx.drawImage(images.enemy, dx, dy, tile, tile);
      if (cell === "F") ctx.drawImage(images.enemy2, dx, dy, tile, tile);
      if (cell === "H") ctx.drawImage(images.enemy3, dx, dy, tile, tile);
      if (cell === "B") ctx.drawImage(images.bridge, dx, dy, tile, tile);
      if (cell === "T") ctx.drawImage(images.tree, dx, dy, tile, tile);
      if (cell === "M") ctx.drawImage(images.mahouzin, dx, dy, tile, tile);
      if (cell === "N") ctx.drawImage(images.entrance, dx, dy, tile, tile);
      if (cell === "O") ctx.drawImage(images.goalEntrance, dx, dy, tile, tile);
    }
  }

  drawEnemies(ctx, images.enemy, images.enemy2, images.enemy3, tile, 0, 0, map[0].length * tile, map.length * tile);
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);
  drawLifeGauge(ctx, images.heart, tile, player);

  updatePlayer();
  requestAnimationFrame(draw);
}

// 🖱 Restart ボタン処理
canvas.addEventListener("click", (e) => {
  if (!gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * dpr;
  const y = (e.clientY - rect.top) * dpr;
  const btnW = 200, btnH = 50;
  const btnX = (canvas.width / dpr - btnW) / 2 * dpr;
  const btnY = canvas.height * 0.7;
  if (x >= btnX && x <= btnX+btnW*dpr && y >= btnY && y <= btnY+btnH*dpr) {
    restartGame();
  }
});

// ▶ ゲーム開始
window.startGame = function () {
  currentMapIndex = 0;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();

  setStatus("🌾 マップ1：田んぼエリアに到着！");

  if (bgm) {
    bgm.volume = 0.5;
    bgm.play().catch(err => console.log("BGM再生エラー:", err));
  }
  draw();
};
