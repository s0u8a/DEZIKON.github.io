import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy, enemies } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { checkGoal, checkGameOver, nextMap, triggerSpecialEnding } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js";          // 🐸 カエル用
import { startNiigataHardQuiz } from "./startNiigataHardQuiz.js"; // 🦝 アライグマ用
import { startNiigataQuiz } from "./niigataquiz.js";
import { startNiigataHardQuiz } from "./startNiigataHardQuiz.js";

// 🎮 キャンバス設定
const canvas = document.getElementById("gameCanvas");
@@ -29,7 +29,7 @@ const images = {
  wallSpecial: new Image(),
  enemy: new Image(),
  enemy2: new Image(),
  enemy3: new Image(), // アライグマ
  enemy3: new Image(),
  item: new Image(),
  ally: new Image(),
  allyFishing: new Image(),
@@ -42,9 +42,9 @@ const images = {
  heart: new Image(),
  bridge: new Image(),
  tree: new Image(),
  clear: new Image(),     // ノーマルエンディング用
  clear: new Image(),
  over: new Image(),
  sadometu: new Image()   // 特殊エンディング用
  sadometu: new Image()
};

// 🖼 画像読み込み
@@ -53,7 +53,7 @@ images.wall.src = "./assets/images/mizu_big.png";
images.wallSpecial.src = "./assets/images/isikabe.png";
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png";
images.enemy3.src = "./assets/images/araiguma.png"; // 🦝 アライグマ
images.enemy3.src = "./assets/images/araiguma.png";
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.allyFishing.src = "./assets/images/turibito.png";
@@ -75,10 +75,8 @@ let currentMapIndex = 0;
let map = maps[currentMapIndex].map(row => [...row]);
let nearAlly = false;
let nearFishingAlly = false;
let gameCleared = false;
let gameOver = false;
// endingType: null | "normal" | "special"
let endingType = null;
let endingRef = { value: null }; // null / "normal" / "special"

// 🖼 キャンバスリサイズ
const dpr = window.devicePixelRatio || 1;
@@ -106,56 +104,6 @@ function resetPlayer() {
  player.invincibleTime = 0;
}

// ➡ 次マップへ
function nextMap() {
  // もし「現在」が最終マップ（最後のインデックス）なら、G 到達はノーマルエンディングとする
  if (currentMapIndex === maps.length - 1) {
    if (!gameCleared && !gameOver) {
      endingType = "normal";
      setStatus("🏁 ノーマルエンディング！新潟の旅は続く…");
      if (bgm) bgm.pause();
      gameCleared = true;
    }
    return;
  }

  // それ以外は次のマップへ進行
  currentMapIndex++;
  if (currentMapIndex >= maps.length) {
    // 念のための保険（通常ここには来ない）
    if (!gameCleared && !gameOver) {
      endingType = "normal";
      setStatus("🎉 全クリア！！");
      if (bgm) bgm.pause();
      gameCleared = true;
    }
    return;
  }

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
@@ -168,18 +116,14 @@ function onTile(x, y) {

// 🆕 敵全滅チェック（特殊エンディング）
function checkAllEnemiesCleared() {
  // 4マップ目（index 3）で敵がゼロになったら特殊エンディング
  if (currentMapIndex === 3 && enemies.length === 0 && !gameCleared && !gameOver) {
    endingType = "special";
    setStatus("✨ 特殊エンディング！敵を全滅させ、佐渡を鎮めました！");
    if (bgm) bgm.pause();
    gameCleared = true;
  if (currentMapIndex === 3 && enemies.length === 0 && !gameOver && !endingRef.value) {
    triggerSpecialEnding({ setStatus, bgm, endingRef });
  }
}

// ⌨️ キー操作
document.addEventListener("keydown", (e) => {
  if (gameCleared || gameOver) return;
  if (endingRef.value || gameOver) return;

  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
@@ -220,7 +164,7 @@ document.addEventListener("keydown", (e) => {

    if (checkGoal(map, player.x, player.y)) {
      setStatus("🏁 ゴール！");
      nextMap();
      nextMap({ MAPS: maps, currentMapIndexRef: { value: currentMapIndex }, setStatus, reloadMap, bgm, endingRef });
      return;
    }
    onTile(nx, ny);
@@ -256,7 +200,6 @@ document.addEventListener("keydown", (e) => {
        checkAllEnemiesCleared();
      });
    }
    // 通常エネミーを倒した後もチェック（念のため）
    checkAllEnemiesCleared();
  });

@@ -267,6 +210,14 @@ document.addEventListener("keydown", (e) => {
  }
});

// ▶ マップリロード
function reloadMap() {
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();
}

// ▶ リスタート処理
function restartGame() {
  currentMapIndex = 0;
@@ -275,9 +226,8 @@ function restartGame() {
  initEnemies(map);
  resizeCanvas();
  setStatus("🔄 ゲーム再スタート！");
  gameCleared = false;
  endingRef.value = null;
  gameOver = false;
  endingType = null;
  if (bgm) {
    bgm.currentTime = 0;
    bgm.play().catch(()=>{});
@@ -289,23 +239,21 @@ function restartGame() {
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ゲームクリア（エンディング）表示：endingType に応じて差し替え
  if (gameCleared) {
    if (endingType === "special") {
      // 特殊エンディング表示（敵全滅）
      ctx.drawImage(images.sadometu, 0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("✨ 特殊エンディング！佐渡を鎮めた！", canvas.width / dpr / 2, 50);
    } else {
      // ノーマルエンディング表示（G 到達）
      ctx.drawImage(images.clear, 0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("🎉 ノーマルエンディング！", canvas.width / dpr / 2, 50);
    }
  if (endingRef.value === "normal") {
    ctx.drawImage(images.clear, 0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("🎉 ノーマルエンディング", canvas.width / dpr / 2, 50);
    return;
  }

  if (endingRef.value === "special") {
    ctx.drawImage(images.sadometu, 0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("🎉 特殊エンディング", canvas.width / dpr / 2, 50);
    return;
  }

@@ -329,9 +277,7 @@ function draw() {
      const dy = y * tile;
      const cell = map[y][x];

      // 🆕 床の切り替え（K,X）
      if (cell === "K") ctx.drawImage(images.floorSpecial, dx, dy, tile, tile); // 地下通路床
      else if (cell === "X") ctx.drawImage(images.floorSpecial, dx, dy, tile, tile);
      if (cell === "K" || cell === "X") ctx.drawImage(images.floorSpecial, dx, dy, tile, tile);
      else ctx.drawImage(images.floor, dx, dy, tile, tile);

      if (cell === "#") ctx.drawImage(images.wall, dx, dy, tile, tile);
@@ -345,7 +291,7 @@ function draw() {
      }
      if (cell === "E") ctx.drawImage(images.enemy, dx, dy, tile, tile);
      if (cell === "F") ctx.drawImage(images.enemy2, dx, dy, tile, tile);
      if (cell === "H") ctx.drawImage(images.enemy3, dx, dy, tile, tile); // 🦝 アライグマ
      if (cell === "H") ctx.drawImage(images.enemy3, dx, dy, tile, tile);
      if (cell === "B") ctx.drawImage(images.bridge, dx, dy, tile, tile);
      if (cell === "T") ctx.drawImage(images.tree, dx, dy, tile, tile);
      if (cell === "M") ctx.drawImage(images.mahouzin, dx, dy, tile, tile);
@@ -384,7 +330,6 @@ window.startGame = function () {
  initEnemies(map);
  resizeCanvas();

  // ゲーム開始専用メッセージ
  setStatus("🌾 マップ1：田んぼエリアに到着！");

  if (bgm) {
