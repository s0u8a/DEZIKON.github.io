// -----------------------------
// 定数・初期設定
// -----------------------------
let TILE = window.GMAP?.tile ?? 64;
let GRID = window.GMAP?.grid ?? [];
let ROWS = GRID.length;
let COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
canvas.setAttribute('tabindex', '0'); 
canvas.focus();
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
  maxHearts: 3
};

// スタート位置(S)があれば設定
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'S') {
      player.x = x;
      player.y = y;
    }
  }
}

// -----------------------------
// 敵の管理
// -----------------------------
const enemies = [];
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'E') {
      enemies.push({ x: x, y: y, dir: 1 });
      GRID[y][x] = '0'; // マップからは消す
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
  item:  loadImage('./assets/images/ha-to.png'),
  ally:  loadImage('./assets/images/ally.png'),
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
  player.hearts -= amount;
  if (player.hearts < 0) player.hearts = 0;
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
    setStatus('🤝 味方に会った！');
  } else if (t === 'G') {
    setStatus('🏁 ゴール！');
  }
}

// -----------------------------
// キー入力
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
  }
});

// -----------------------------
// 敵の更新＆描画
// -----------------------------
function updateEnemies() {
  for (let e of enemies) {
    let nx = e.x + e.dir;

    // 壁に当たったら反転
    if (!walkable(nx, e.y)) {
      e.dir *= -1;
    } else {
      e.x = nx;
    }

    // プレイヤーと同じマスならダメージ
    if (e.x === player.x && e.y === player.y) {
      setStatus("👹 敵にぶつかった！");
      takeDamage(1);
    }
  }
}

function drawEnemies(offsetX, offsetY) {
  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;

    // 画面内にいる敵だけ描画
    if (dx >= 0 && dx < canvas.width && dy >= 0 && dy < canvas.height) {
      ctx.drawImage(images.enemy, dx, dy, TILE, TILE);
    }
  }
}

// -----------------------------
// ライフゲージ描画（鼓動アニメーション）
// -----------------------------
let animationFrame = 0;

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

      ctx.drawImage(images.
