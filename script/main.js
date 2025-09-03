// -----------------------------
// 定数・初期設定
// -----------------------------
let TILE = window.GMAP?.tile ?? 64;
let GRID = window.GMAP?.grid ?? [];
let ROWS = GRID.length;
let COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
canvas.setAttribute('tabindex', '0'); // ← キーボード操作可能にする
canvas.focus();                       // ← 起動時にフォーカスを当てる
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

canvas.addEventListener('click', () => {
  canvas.focus(); // ← クリックでフォーカス復帰
});

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 表示範囲（スクロール用）
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
// 画像読み込み
// -----------------------------
function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const images = {
  floor: loadImage('./assets/images/tanbo.png'),
  wall:  loadImage('./assets/images/mizu.png'),     // 壁を mizu.png に変更
  enemy: loadImage('./assets/images/enemy.png'),
  item:  loadImage('./assets/images/ha-to.png'),   // アイテムを ha-to.png に変更
  ally:  loadImage('./assets/images/ally.png'),
  goal:  loadImage('./assets/images/goal.png'),
  pl:    loadImage('./assets/images/noumin.png'),
  heart: loadImage('./assets/images/ha-to.png')    // ライフゲージも ha-to.png に変更
};

// -----------------------------
// 移動判定
// -----------------------------
function walkable(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  const t = GRID[y][x];
  return t !== '#'; // 壁以外は歩ける
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
    setStatus('👹 敵に遭遇！');
    takeDamage(1);
  } else if (t === 'I') {
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
    draw();
    setStatus(`移動: (${player.x}, ${player.y})`); // デバッグ表示
    console.log("Moved to:", nx, ny);
  }
});

// -----------------------------
// ライフゲージ描画（ハート画像）
// -----------------------------
function drawLifeGauge() {
  const startX = 10, startY = 10, size = 32, gap = 4;
  for (let i = 0; i < player.maxHearts; i++) {
    const dx = startX + i * (size + gap);
    const dy = startY;
    if (i < player.hearts) {
      // 残HP → 通常表示
      ctx.drawImage(images.heart, dx, dy, size, size);
    } else {
      // 減ったHP → 半透明で表示
      ctx.globalAlpha = 0.3;
      ctx.drawImage(images.heart, dx, dy, size, size);
      ctx.globalAlpha = 1.0;
    }
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

      // 床
      ctx.drawImage(images.floor, dx, dy, TILE, TILE);

      // 上書きタイル
      if (t === '#') ctx.drawImage(images.wall, dx, dy, TILE, TILE);
      else if (t === 'E') ctx.drawImage(images.enemy, dx, dy, TILE, TILE);
      else if (t === 'I') ctx.drawImage(images.item, dx, dy, TILE, TILE);
      else if (t === 'A') ctx.drawImage(images.ally, dx, dy, TILE, TILE);
      else if (t === 'G') ctx.drawImage(images.goal, dx, dy, TILE, TILE);
    }
  }

  // プレイヤー描画
  const px = (player.x - offsetX) * TILE;
  const py = (player.y - offsetY) * TILE;
  ctx.drawImage(images.pl, px, py, TILE, TILE);

  // HPライフゲージ
  drawLifeGauge();
}

// -----------------------------
// 初回描画
// -----------------------------
setStatus('✅ ゲーム開始');
draw();
