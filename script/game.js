import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js"; // 🆕 新潟クイズ

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const statusEl = document.getElementById("messageBox");
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 🎵 BGM要素取得
const bgm = document.getElementById("bgm");

const images = {
  floor: new Image(),
  wall: new Image(),
  wallSpecial: new Image(), // 🆕 壁判定
  enemy: new Image(),
  enemy2: new Image(), // 🐸 カエル用
  item: new Image(),
  ally: new Image(),
  goal: new Image(),
  goalEntrance: new Image(), // 🆕 ゴール地点判定
  entrance: new Image(),     // 🆕 入口判定
  mahouzin: new Image(),     // 🆕 魔法陣
  floorSpecial: new Image(), // 🆕 地面判定
  pl: new Image(),
  heart: new Image(),
  bridge: new Image(), // 🆕 橋
  tree: new Image()    // 🆕 木
};
images.floor.src = "./assets/images/tanbo3.png";
images.wall.src = "./assets/images/mizu_big.png";
images.wallSpecial.src = "./assets/images/isikabe.png";      // 壁判定
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png"; // 🐸 カエル
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.goal.src = "./assets/images/goal.png";
images.goalEntrance.src = "./assets/images/koudouiriguti.png"; // ゴール
images.entrance.src = "./assets/images/kintin.png";             // 入口
images.mahouzin.src = "./assets/images/mahouzin.png";           // 魔法陣
images.floorSpecial.src = "./assets/images/tikadoukuyuka.png"; // 地面
images.pl.src = "./assets/images/noumin.png";
images.heart.src = "./assets/images/ha-to.png";
images.bridge.src = "./assets/images/hasihasii.png"; // 橋
images.tree.src = "./assets/images/kinokabe.png";   // 木

let currentMapIndex = 0;
let map = maps[currentMapIndex];
let nearAlly = false;

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

// 🔹 移動できる判定
function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  const cell = map[y][x];
  // "#" → 壁（水）NG
  // "T" → 木 NG
  // "W" → 壁判定 NG
  return cell !== "#" && cell !== "T" && cell !== "W";
}

function nextMap() {
  currentMapIndex++;
  if (currentMapIndex >= maps.length) {
    setStatus("🎉 全クリア！！");
    if (bgm) bgm.pause();
    return;
  }
  map = maps[currentMapIndex];
  console.log("次マップ読み込み:", currentMapIndex, map.map(row => row.join("")));
  initPlayer(map);
  initEnemies(map);
  resizeCanvas();
  setStatus(`➡ マップ${currentMapIndex + 1} へ進んだ！`);
}

function onTile(x, y) {
  const cell = map[y][x];
  if (cell === "A") {
    setStatus("🤝 村人がいる！Enterで話しかけてください");
    nearAlly = true;
  } else {
    nearAlly = false;
  }
}

document.addEventListener("keydown", (e) => {
  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;
  else if (e.key === "Enter" && nearAlly) {
    setStatus("💬 村人『田んぼを荒らすジャンボタニシの卵をつぶしてくれ！』");
    setTimeout(() => {
      startEggGame((score) => {
        if (score >= 10) {
          heal(1, setStatus);
          setStatus(`🥚 卵を大量につぶした！HP回復！`);
        } else {
          setStatus(`🥚 卵つぶしスコア: ${score}`);
        }
      });
      map[player.y][player.x] = "0"; // 村人を消す
      nearAlly = false;
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

    // アイテム取得処理
    if (map[player.y][player.x] === "I") {
      heal(1, setStatus);
      setStatus("🍙 アイテムを取った！HP回復！");
      map[player.y][player.x] = "0";
    }
  }

  // 敵処理
  updateEnemies(walkable, player, (amt, enemyIndex, type) => {
    if (type === "normal") {
      if (currentMapIndex === 1) {
        takeDamage(amt, setStatus);
        startFishingGame((score) => {
          if (score >= 10) {
            heal(1, setStatus);
            setStatus(`🐟 ブラックバスを ${score} 匹釣った！HP回復！`);
          } else if (score <= 0) {
            takeDamage(1, setStatus);
            setStatus(`❌ ブラックバスが少なすぎる…外道ばかり！HP減少`);
          } else {
            setStatus(`🎣 釣果: ブラックバス ${score}匹`);
          }
          removeEnemy(enemyIndex);
        });
      } else {
        takeDamage(amt, setStatus);
        removeEnemy(enemyIndex);
      }
    } else if (type === "frog") {
      setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");
      startNiigataQuiz((correct) => {
        if (correct) {
          heal(1, setStatus);
          setStatus("⭕ 正解！HP回復！");
        } else {
          takeDamage(1, setStatus);
          setStatus("❌ 不正解！HP減少");
        }
        removeEnemy(enemyIndex);
      });
    }
  });

  if (checkGameOver(player, setStatus)) {
    if (bgm) bgm.pause();
    return;
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;
      const cell = map[y][x];

      // 基本地面
      ctx.drawImage(images.floor, dx, dy, tile, tile);

      // 新タイル描画
      if (cell === "#") ctx.drawImage(images.wall, dx, dy, tile, tile);
      if (cell === "W") ctx.drawImage(images.wallSpecial, dx, dy, tile, tile); // 壁判定
      if (cell === "I") ctx.drawImage(images.item, dx, dy, tile, tile);
      if (cell === "A") ctx.drawImage(images.ally, dx, dy, tile, tile);
      if (cell === "G") ctx.drawImage(images.goal, dx, dy, tile, tile);
      if (cell === "E") ctx.drawImage(images.enemy, dx, dy, tile, tile);
      if (cell === "F") ctx.drawImage(images.enemy2, dx, dy, tile, tile);
      if (cell === "B") ctx.drawImage(images.bridge, dx, dy, tile, tile);
      if (cell === "T") ctx.drawImage(images.tree, dx, dy, tile, tile);
      if (cell === "S") ctx.drawImage(images.floorSpecial, dx, dy, tile, tile); // 地面判定
      if (cell === "M") ctx.drawImage(images.mahouzin, dx, dy, tile, tile);     // 魔法陣
      if (cell === "N") ctx.drawImage(images.entrance, dx, dy, tile, tile);     // 入口判定
      if (cell === "O") ctx.drawImage(images.goalEntrance, dx, dy, tile, tile);// ゴール判定
    }
  }

  drawEnemies(ctx, images.enemy, images.enemy2, tile, 0, 0, map[0].length * tile, map.length * tile);
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);
  drawLifeGauge(ctx, images.heart, tile, player);

  updatePlayer();
  requestAnimationFrame(draw);
}

window.startGame = function () {
  currentMapIndex = 0;
  map = maps[currentMapIndex];
  console.log("startGame後のマップ:", map.map(row => row.join("")));
  initPlayer(map);
  initEnemies(map); 
  resizeCanvas();
  setStatus("✅ ゲーム開始");

  if (bgm) {
    bgm.volume = 0.5;
    bgm.play().catch(err => console.log("BGM再生エラー:", err));
  }

  draw();
};
