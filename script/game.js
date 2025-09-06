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
  enemy2: new Image(), // カエル用
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

function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  return map[y][x] !== "#";
}

function nextMap() {
  currentMapIndex++;
  if (currentMapIndex >= maps.length) {
    setStatus("🎉 全クリア！！");
    return;
  }
  map = maps[currentMapIndex];
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
  }

  if (currentMapIndex === 1) {
    updateEnemies(walkable, player, (amt, enemyIndex, type) => {
      if (type === "E") {
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
      } else if (type === "F") {
        setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");
        startNiigataQuiz((correct) => {
          if (correct) {
            heal(1, setStatus);
            setStatus(`📝 クイズ正解！HP回復！`);
          } else {
            takeDamage(1, setStatus);
            setStatus(`❌ クイズ不正解…HP減少`);
          }
          removeEnemy(enemyIndex);
        });
      }
    });
  } else {
    updateEnemies(walkable, player, (amt, enemyIndex) => {
      takeDamage(amt, setStatus);
      removeEnemy(enemyIndex);
    });
  }

  if (checkGameOver(player, setStatus)) return;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景とアイテム・壁・村人・ゴールだけを描画（敵はここで描かない）
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;
      ctx.drawImage(images.floor, dx, dy, tile, tile);
      const cell = map[y][x];
      if (cell === "#") ctx.drawImage(images.wall, dx, dy, tile, tile);
      if (cell === "I") ctx.drawImage(images.item, dx, dy, tile, tile);
      if (cell === "A") ctx.drawImage(images.ally, dx, dy, tile, tile);
      if (cell === "G") ctx.drawImage(images.goal, dx, dy, tile, tile);
    }
  }

  // 敵を描画
  drawEnemies(
    ctx,
    images.enemy,   // E
    images.enemy2,  // F
    tile,
    0, 0,
    map[0].length * tile,
    map.length * tile
  );

  // プレイヤー
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);

  // HPゲージ
  drawLifeGauge(ctx, images.heart, tile, player);

  updatePlayer();
  requestAnimationFrame(draw);
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
