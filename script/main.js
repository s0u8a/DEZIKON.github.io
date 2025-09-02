// -----------------------------
// 定数・初期設定
// -----------------------------
const TILE = window.GMAP?.tile ?? 64;
const GRID = window.GMAP?.grid ?? [];
const ROWS = GRID.length;
const COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

// 表示領域（見える範囲）
const VIEW_COLS = 10; // 横に何マス表示するか
const VIEW_ROWS = 8;  // 縦に何マス表示するか
canvas.width = VIEW_COLS * TILE;
canvas.height = VIEW_ROWS * TILE;

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

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
// 画像読み込み
// -----------------------------
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const images = {
  floor: loadImage('./assets/images/tanbo.png'), // 床
  wall: loadImage('./assets/images/wall.png'),   // 壁
  enemy: loadImage('./assets/images/enemy.png'), // 敵
  item: loadImage('./assets/images/item.png'),   // アイテム
  ally: loadImage('./assets/images/ally.png'),   // 味方
  goal: loadImage('./assets/images/goal.png'),   // ゴール
  pl: loadImage('./assets/images/noumin.png')    // プレイヤー
};

// -----------------------------
// 移動判定
// -----------------------------
function walkable(x, y) {
  return !(x < 0 || x >= COLS || y < 0 || y >= ROWS) && GRID[y][x] !== '#';
}

// -----------------------------
// HP管理
// -----------------------------
function takeDamage(amount = 1) {
  player.hearts -= amount;
  if (player.hearts < 0) player.hearts = 0;
  draw();
  setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

function heal(amount = 1) {
  player.hearts += amount;
  if (player.hearts > player.maxHearts) player.hearts = player.maxHearts;
  draw();
  setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

// -----------------------------
// タイル接触処理
// -----------------------------
function onTile(x, y) {
  const t = GRID[y][x];
  if (t === 'E') {
    setStatus('👹 敵に遭遇！クイズへ…（仮）');
    takeDamage(1);
  } else if (t === 'I') {
    setStatus('🎁 アイテムを取得！ハート+1');
    heal(1);
    GRID[y][x] = '0'; // アイテム消滅
  } else if (t === 'A') {
    setStatus('🤝 味方に会った！');
  } else if (t === 'G') {
    setStatus('🏁 ゴール！');
  }
}

// -----------------------------
// キー入力
// -----------------------------
window.addEventListener('keydown', e => {
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
    draw();
  }
});

// -----------------------------
// ライフゲージ描画
// -----------------------------
function drawLifeGauge() {
  const startX = 10;
  const startY = 10;
  const size = 16;
  const gap = 4;
  for (let i = 0; i < player.maxHearts; i++) {
    ctx.fillStyle = (i < player.hearts) ? 'red' : 'gray';
    ctx.fillRect(startX + i * (size + gap), startY, size, size);
  }
}

// -----------------------------
// 描画（スクロール対応）
// -----------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー中心に表示範囲を決定
  let offsetX = player.x - Math.floor(VIEW_COLS / 2);
  let offsetY = player.y - Math.floor(VIEW_ROWS / 2);

  // 範囲外に出ないように調整
  offsetX = Math.max(0, Math.min(offsetX, COLS - VIEW_COLS));
  offsetY = Math.max(0, Math.min(offsetY, ROWS - VIEW_ROWS));

  // マップ描画
  for (let y = 0; y < VIEW_ROWS; y++) {
    for (let x = 0; x < VIEW_COLS; x++) {
      const mapX = x + offsetX;
      const mapY = y + offsetY;
      if (mapX < 0 || mapX >= COLS || mapY < 0 || mapY >= ROWS) continue;

      const t = GRID[mapY][mapX];
      const dx = x * TILE, dy = y * TILE;

      // 床
      ctx.drawImage(images.floor, dx, dy, TILE, TILE);

      // タイルごとの上書き
      if (t === '#') ctx.drawImage(images.wall, dx, dy, TILE, TILE);
      else if (t === 'E') ctx.drawImage(images.enemy, dx, dy, TILE, TILE);
      else if (t === 'I') ctx.drawImage(images.item, dx, dy, TILE, TILE);
      else if (t === 'A') ctx.drawImage(images.ally, dx, dy, TILE, TILE);
      else if (t === 'G') ctx.drawImage(images.goal, dx, dy, TILE, TILE);
    }
  }

  // プレイヤー描画（画面上の位置）
  const px = (player.x - offsetX) * TILE;
  const py = (player.y - offsetY) * TILE;
  ctx.drawImage(images.pl, px, py, TILE, TILE);

  // HPライフゲージ
  drawLifeGauge();
}

setStatus('✅ ゲーム開始');
draw();
