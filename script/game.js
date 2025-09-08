import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js"; // 🆕 新潟クイズ

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

// 🎵 BGM要素取得
const bgm = document.getElementById("bgm");

// 🎨 画像管理
const images = {
  floor: new Image(),
  wall: new Image(),
  wallSpecial: new Image(),
  enemy: new Image(),
  enemy2: new Image(),
  item: new Image(),
  ally: new Image(),
  goal: new Image(),
  goalEntrance: new Image(),
  entrance: new Image(),
  mahouzin: new Image(),
  floorSpecial: new Image(),
  pl: new Image(),
  heart: new Image(),
  bridge: new Image(),
  tree: new Image(),
  clear: new Image(),   // クリア画面
  over: new Image()     // ゲームオーバー画面
};

// 🖼 画像の読み込み
images.floor.src = "./assets/images/tanbo3.png";//床
images.wall.src = "./assets/images/mizu_big.png";//水
images.wallSpecial.src = "./assets/images/isikabe.png";//石壁
images.enemy.src = "./assets/images/enemy.png";//エネミー
images.enemy2.src = "./assets/images/kaeru.png";//問題
images.item.src = "./assets/images/komebukuro.png";//アイテム
images.ally.src = "./assets/images/murabitopng.png";//村人
images.goal.src = "./assets/images/kakasi2.png";//ゴール
images.goalEntrance.src = "./assets/images/koudouiriguti.png";//入口
images.entrance.src = "./assets/images/kintin.png";//壁
images.mahouzin.src = "./assets/images/mahouzin.png";//第四マップゴール用
images.floorSpecial.src = "./assets/images/tikakoudouyuka.png"; // 地下
images.pl.src = "./assets/images/noumin.png";//主人公
images.heart.src = "./assets/images/ha-to.png";//ハート
images.bridge.src = "./assets/images/hasihasii.png";//橋
images.tree.src = "./assets/images/kinokabe.png";//木
images.clear.src = "./assets/images/clear.png";//クリア画面
images.over.src = "./assets/images/over.png";//ゲームオーバー画面

// 🌍 マップ状態
let currentMapIndex = 0;
let map = maps[currentMapIndex].map(row => [...row]); // コピー保持
let nearAlly = false;
let gameCleared = false;
let gameOver = false;

// 🖼 キャンバスのリサイズ
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
  return cell !== "#" && cell !== "T" && cell !== "W";
}

// ➡ 次マップへ
function nextMap() {
  currentMapIndex++;
  if (currentMapIndex >= maps.length) {
    setStatus("🎉 全クリア！！");
    if (bgm) bgm.pause();
    gameCleared = true;
    return;
  }
  map = maps[currentMapIndex].map(row => [...row]); // コピーで初期化
  initPlayer(map);
  if (player.maxHp) player.hp = player.maxHp;
  initEnemies(map);
  resizeCanvas();
  setStatus(`➡ マップ${currentMapIndex + 1} へ進んだ！`);
}

// 👤 プレイヤーが立っているタイル処理
function onTile(x, y) {
  const cell = map[y][x];
  nearAlly = cell === "A";
  if (nearAlly) setStatus("🤝 村人がいる！Enterで話しかけてください");
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

  updateEnemies(walkable, player, (amt, enemyIndex, type) => {
    if (type === "normal") {
      if (currentMapIndex === 1) {
        takeDamage(amt, setStatus);
        startFishingGame((score) => {
          if (score >= 10) heal(1, setStatus);
          else if (score <= 0) takeDamage(1, setStatus);
          setStatus(score >= 10 ? `🐟 ブラックバスを ${score} 匹釣った！HP回復！`
                    : score <= 0 ? `❌ ブラックバスが少なすぎる…外道ばかり！HP減少`
                    : `🎣 釣果: ブラックバス ${score}匹`);
          removeEnemy(enemyIndex);
        });
      } else {
        takeDamage(amt, setStatus);
        removeEnemy(enemyIndex);
      }
    } else if (type === "frog") {
      setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");
      startNiigataQuiz((correct) => {
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

// ▶ Restart関数
function restartGame() {
  // マップ初期化
  map = maps[0].map(row => [...row]);
  currentMapIndex = 0;

  // プレイヤー初期化
  initPlayer(map);
  if (player.maxHp) player.hp = player.maxHp;
  player.x = player.startX || 0;
  player.y = player.startY || 0;

  // 敵初期化
  initEnemies(map);

  // フラグリセット
  gameOver = false;
  gameCleared = false;

  resizeCanvas();
  setStatus("🔄 ゲーム再スタート！");
  if (bgm) { bgm.currentTime = 0; bgm.play().catch(()=>{}); }

  draw();
}

// 🎨 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameCleared) {
    ctx.drawImage(images.clear, 0, 0, canvas.width / dpr, canvas.height / dpr);
    return;
  }

  if (gameOver) {
    ctx.drawImage(images.over, 0, 0, canvas.width / dpr, canvas.height / dpr);

    const btnW = 200, btnH = 50;
    const btnX = (canvas.width / dpr -
