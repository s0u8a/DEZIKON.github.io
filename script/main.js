// -----------------------------
// 定数・初期設定
// -----------------------------
let TILE = window.GMAP?.tile ?? 64;
let GRID = window.GMAP?.grid ?? [];
let ROWS = GRID.length;
let COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
canvas.setAttribute('tabindex', '0'); 
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

canvas.addEventListener('click', () => {
  canvas.focus();
});

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 表示範囲
const VIEW_COLS = 10;
const VIEW_ROWS = 8;
canvas.width  = VIEW_COLS * TILE;
canvas.height = VIEW_ROWS * TILE;

// -----------------------------
// プレイヤー情報
// -----------------------------
const player = {
  x: 1,
  y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0 // 無敵時間カウンタ
};

// スタート位置(S)があれば設定
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'S') {
      player.x = x;
      player.y = y;
      GRID[y][x] = '0'; // ← プレイヤー位置は床に置き換え
    }
  }
}

// -----------------------------
// 敵の管理（上下左右ランダム移動）
// -----------------------------
const enemies = [];
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'E') {
      const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      enemies.push({ x: x, y: y, dx: dir.dx, dy: dir.dy });
      GRID[y][x] = '0'; // ← 敵位置も床に置き換え
    }
  }
}

// -----------------------------
// 画像読み込み
// -----------------------------
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const images = {
  floor: loadImage('./assets/images/tanbo.png'),
  wall:  loadImage('./assets/images/mizu.png'),
  enemy: loadImage('./assets/images/enemy.png'),
  item:  loadImage('./assets/images/komebukuro.png'), // ← 米袋
  ally:  loadImage('./assets/images/murabitopng.png'), // ← 村人
  goal:  loadImage('./assets/images/goal.png'),
  pl:    loadImage('./assets/images/noumin.png'),
  heart: loadImage('./assets/images/ha-to.png')
};

// -----------------------------
// 移動判定
// -----------------------------
function walkable(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  const t = GRID[y][x];
  return t !== '#';
}

// -----------------------------
// HP管理
// -----------------------------
function takeDamage(amount = 1) {
  if (player.invincibleTime > 0) return; // 無敵中は無効化

  player.hearts -= amount;
  if (player.hearts < 0) player.hearts = 0;
  player.invincibleTime = 10; // 10ターン無敵

  setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

function heal(amount = 1) {
  player.hearts += amount;
  if (player.hearts > player.maxHearts) player.hearts = player.maxHearts;
  setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

// -----------------------------
// タイル接触処理
// -----------------------------
function onTile(x, y) {
  const t = GRID[y][x];
  if (t === 'I') {
    setStatus('🎁 アイテムを取得！');
    heal(1);
    GRID[y][x] = '0';
  } else if (t === 'A') {
    setStatus('🤝 村人に会った！');
  } else if (t === 'G') {
    setStatus('🏁 ゴール！');
  }
}

// -----------------------------
// キー入力（プレイヤーが動いたら敵も動く）
// -----------------------------
document.addEventListener('keydown', e => {
  let nx = player.x, ny = player.y;
  let handled = true;

  if (e.key === 'ArrowUp') ny--;
  else if (e.key === 'ArrowDown') ny++;
  else if (e.key === 'ArrowLeft') nx--;
  else if (e.key === 'ArrowRight') nx++;
  else handled = false;

  if (handled) e.preventDefault();

  if (handled && walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;
    onTile(nx, ny);

    // プレイヤーが動いたターンで敵も移動
    updateEnemies();

    // 無敵時間カウント減少
    if (player.invincibleTime > 0) player.invincibleTime--;
  }
});

// -----------------------------
// 敵の更新（上下左右移動 + 当たり判定）
// -----------------------------
function updateEnemies() {
  for (let e of enemies) {
    let nx = e.x + e.dx;
    let ny = e.y + e.dy;

    // 壁ならランダム方向転換
    if (!walkable(nx, ny)) {
      const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      e.dx = dir.dx;
      e.dy = dir.dy;
    } else {
      e.x = nx;
      e.y = ny;
    }

    // プレイヤーに接触したらダメージ
    if (e.x === player.x && e.y === player.y) {
      takeDamage(1);
    }
  }
}

// -----------------------------
// 敵の描画（ドクドクアニメーション付き）
// -----------------------------
let animationFrame = 0;

function drawEnemies(offsetX, offsetY) {
  animationFrame++;

  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;

    // ドクドク鼓動
    let pulse = 1 + 0.1 * Math.sin(animationFrame * 0.1);
    let size = TILE * pulse;
    const offset = (TILE - size) / 2;

    if (dx >= 0 && dx < canvas.width && dy >= 0 && dy < canvas.height) {
      ctx.drawImage(images.enemy, dx + offset, dy + offset, size, size);
    }
  }
}

// -----------------------------
// ライフゲージ描画（鼓動付き）
// -----------------------------
function drawLifeGauge() {
  const startX = 10, startY = 10, baseSize = 32, gap = 4;
  animationFrame++;

  for (let i = 0; i < player.maxHearts; i++) {
    const dx = startX + i * (baseSize + gap);
    const dy = startY;

    if (i < player.hearts) {
      let pulse = (player.hearts <= 1)
        ? 1 + 0.2 * Math.sin(animationFrame * 0.1)
        : 1;
      let size = baseSize * pulse;

      ctx.drawImage(images.heart, dx, dy, size, size);
    } else {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(images.heart, dx, dy, baseSize, baseSize);
      ctx.globalAlpha = 1.0;
    }
  }
}

// -----------------------------
// 描画ループ
// -----------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let offsetX = player.x - Math.floor(VIEW_COLS / 2);
  let offsetY = player.y - Math.floor(VIEW_ROWS / 2);

  offsetX = Math.max(0, Math.min(offsetX, COLS - VIEW_COLS));
  offsetY = Math.max(0, Math.min(offsetY, ROWS - VIEW_ROWS));

  // マップ描画
  for (let y = 0; y < VIEW_ROWS; y++) {
    for (let x = 0; x < VIEW_COLS; x++) {
      const mapX = x + offsetX;
      const mapY = y + offsetY;
      if (mapX >= COLS || mapY >= ROWS) continue;

      const t = GRID[mapY][mapX];
      const dx = x * TILE, dy = y * TILE;

      ctx.drawImage(images.floor, dx, dy, TILE, TILE);

      if (t === '#') ctx.drawImage(images.wall, dx, dy, TILE, TILE);
      else if (t === 'I') ctx.drawImage(images.item, dx, dy, TILE, TILE);
      else if (t === 'A') ctx.drawImage(images.ally, dx, dy, TILE, TILE);
      else if (t === 'G') ctx.drawImage(images.goal, dx, dy, TILE, TILE);
    }
  }

  // 敵の描画
  drawEnemies(offsetX, offsetY);

  // プレイヤー描画
  const px = (player.x - offsetX) * TILE;
  const py = (player.y - offsetY) * TILE;
  ctx.drawImage(images.pl, px, py, TILE, TILE);

  // HPライフゲージ
  drawLifeGauge();

  requestAnimationFrame(draw);
}

// -----------------------------
// ゲーム開始関数（スタート画面から呼ぶ）
// -----------------------------
window.startGame = function() {
  canvas.focus();
  setStatus('✅ ゲーム開始');
  draw();
};
