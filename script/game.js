import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const statusEl = document.getElementById("messageBox");
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

const images = {
  floor: new Image(),
  wall: new Image(),
  enemy: new Image(),
  enemy2: new Image(), // 🐸 カエル用
  item: new Image(),
  ally: new Image(),
  goal: new Image(),
  pl: new Image(),
  heart: new Image()
};
images.floor.src = "./assets/images/tanbo3.png";
images.wall.src = "./assets/images/mizu_big.png";
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png";
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.goal.src = "./assets/images/goal.png";
images.pl.src = "./assets/images/noumin.png";
images.heart.src = "./assets/images/ha-to.png";

let currentMapIndex = 0;
let map = maps[currentMapIndex];
let nearAlly = false;

// ✅ 一時停止用
let isPaused = false;
let gameLoopId = null;

initPlayer(map);
initEnemies(map);

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

document.addEventListener("keydown", (e) => {
  if (isPaused) return; // 一時停止中は操作不可
  ...
  // 敵の処理
  updateEnemies(walkable, player, (amt, enemyIndex, type) => {
    if (type === "frog") {
      setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");

      // 一時停止
      isPaused = true;
      cancelAnimationFrame(gameLoopId);

      startNiigataQuiz((correct) => {
        if (correct) {
          heal(1, setStatus);
          setStatus("⭕ 正解！HP回復！");
        } else {
          takeDamage(1, setStatus);
          setStatus("❌ 不正解！HP減少");
        }

        map[player.y][player.x] = "0";
        removeEnemy(enemyIndex);

        // 再開
        isPaused = false;
        draw();
      });
    }
  });
});

function draw() {
  if (isPaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameLoopId = requestAnimationFrame(draw);
}

window.startGame = function () {
  currentMapIndex = 0;
  map = maps[currentMapIndex];
  initPlayer(map);
  initEnemies(map);
  resizeCanvas();
  setStatus("✅ ゲーム開始");
  draw();
};
