import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy, enemies } from "./enemy.js";
import { checkGoal, checkGameOver, triggerNormalEnding, triggerSpecialEnding } from "./ending.js"; // ← エンディング処理を利用
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
  clear: new Image(),     // ノーマルエンディング用
  over: new Image(),
  sadometu: new Image()   // 特殊エンディング用
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
let allEnemiesCleared = false; // 敵全滅フラグ

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

// ▶ プレイヤー初期化
function resetPlayer() {
  initPlayer(map);
  player.hearts = player.maxHearts;
  player.invincibleTime = 0;
}

// 敵全滅チェック
function checkAllEnemiesCleared() {
  if (currentMapIndex === 3 && enemies.length === 0) {
    allEnemiesCleared = true;
    setStatus("💥 敵を全滅させた！ゴールへ向かおう！");
  }
}

// ⌨️ キー操作
document.addEventListener("keydown", (e) => {
  if (gameCleared || gameOver) return;

  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;

  if (walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;

    if (checkGoal(map, player.x, player.y)) {
      if (currentMapIndex === 3) {
        // 佐渡マップのゴール
        if (allEnemiesCleared) {
          triggerSpecialEnding({ setStatus, bgm, endingRef: { value: endingType = "special" } });
        } else {
          triggerNormalEnding({ setStatus, bgm, endingRef: { value: endingType = "normal" } });
        }
        gameCleared = true;
      } else {
        nextMap();
      }
      return;
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
        if (correct) heal(1, setStatus); else takeDamage(1, setStatus);
        removeEnemy(enemyIndex);
        checkAllEnemiesCleared();
      });
    } else if (type === "araiteki") {
      setStatus("🦝 アライグマに遭遇！高難易度クイズに挑戦！");
      startNiigataHardQuiz((correct) => {
        if (correct) heal(1, setStatus); else takeDamage(1, setStatus);
        removeEnemy(enemyIndex);
        checkAllEnemiesCleared();
      });
    }
    checkAllEnemiesCleared();
  });

  if (checkGameOver(player, setStatus)) {
    if (bgm) bgm.pause();
    gameOver = true;
    return;
  }
});

// 🎨 花火演出用
let fireworks = [];
function spawnFirework() {
  fireworks.push({
    x: Math.random() * canvas.width / dpr,
    y: canvas.height / dpr,
    targetY: 100 + Math.random() * 200,
    color: `hsl(${Math.random() * 360},100%,50%)`,
    exploded: false,
    particles: []
  });
}
function updateFireworks() {
  fireworks.forEach(fw => {
    if (!fw.exploded) {
      fw.y -= 4;
      if (fw.y <= fw.targetY) {
        fw.exploded = true;
        for (let i = 0; i < 50; i++) {
          fw.particles.push({
            x: fw.x, y: fw.y,
            vx: Math.cos(i * (Math.PI * 2 / 50)) * (2 + Math.random() * 2),
            vy: Math.sin(i * (Math.PI * 2 / 50)) * (2 + Math.random() * 2),
            life: 60
          });
        }
      }
    } else {
      fw.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
      });
    }
  });
  fireworks = fireworks.filter(fw => fw.exploded ? fw.particles.some(p => p.life > 0) : true);
}
function drawFireworks(ctx) {
  fireworks.forEach(fw => {
    ctx.fillStyle = fw.color;
    if (!fw.exploded) {
      ctx.fillRect(fw.x, fw.y, 2, 6);
    } else {
      fw.particles.forEach(p => {
        if (p.life > 0) {
          ctx.globalAlpha = p.life / 60;
          ctx.fillRect(p.x, p.y, 2, 2);
        }
      });
      ctx.globalAlpha = 1;
    }
  });
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
      if (Math.random() < 0.05) spawnFirework();
      updateFireworks();
      drawFireworks(ctx);
      requestAnimationFrame(draw);
      return;
    } else {
      ctx.drawImage(images.clear, 0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("🎉 ノーマルエンディング！", canvas.width / dpr / 2, 50);
      return;
    }
  }

  if (gameOver) {
    ctx.drawImage(images.over, 0, 0, canvas.width / dpr, canvas.height / dpr);
    return;
  }

  // 通常マップ描画処理 …（省略）
  drawEnemies(ctx, images.enemy, images.enemy2, images.enemy3, tile, 0, 0, map[0].length * tile, map.length * tile);
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);
  drawLifeGauge(ctx, images.heart, tile, player);

  updatePlayer();
  requestAnimationFrame(draw);
}

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
