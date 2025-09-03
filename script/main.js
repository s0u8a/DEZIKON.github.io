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

// 表示範囲（スクロール用）
const VIEW_COLS = 10; // 横に何マス表示するか
const VIEW_ROWS = 8;  // 縦に何マス表示するか

// ==== 高DPI対応（にじみ防止）====
const DPR = Math.max(1, window.devicePixelRatio || 1);
function resizeCanvas() {
  const cssW = VIEW_COLS * TILE;
  const cssH = VIEW_ROWS * TILE;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = Math.floor(cssW * DPR);
  canvas.height = Math.floor(cssH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  // ドット絵をにじませない
  ctx.imageSmoothingEnabled = false;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); draw(); });

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
// 画像読み込み（onloadで再描画 & 失敗時はログ）
// -----------------------------
function loadImage(src) {
  const img = new Image();
  // 別ドメインから配信時はCORSが必要: img.crossOrigin = 'anonymous';
  img.onload = () => { setStatus(`✅ loaded: ${src}`); draw(); };
  img.onerror = () => { setStatus(`❌ error: ${src}`); draw(); };
  img.src = src;
  return img;
}

const images = {
  floor: loadImage('./assets/images/tanbo.png'), // 床
  wall:  loadImage('./assets/images/wall.png'),  // 壁
  enemy: loadImage('./assets/images/enemy.png'), // 敵
  item:  loadImage('./assets/images/item.png'),  // アイテム
  ally:  loadImage('./assets/images/ally.png'),  // 味方
  goal:  loadImage('./assets/images/goal.png'),  // ゴール
  pl:    loadImage('./assets/images/noumin.png') // プレイヤー
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
  player.hearts = Math.max(0, player.hearts - amount);
  draw();
  setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

function heal(amount = 1) {
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
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
// キー入力（capture で先取り / フォーカス付与）
// -----------------------------
(function setupInput() {
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0');
  setTimeout(() => canvas.focus(), 0);
  canvas.addEventListener('click', () => canvas.focus());

  const KEY = new Set([
    'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
    'w','a','s','d','W','A','S','D'
  ]);

  function onKey(e) {
    if (!KEY.has(e.key)) return;
    e.preventDefault();
    e.stopPropagation();

    let nx = player.x, ny = player.y;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': ny--; break;
      case 'ArrowDown': case 's': case 'S': ny++; break;
      case 'ArrowLeft': case 'a': case 'A': nx--; break;
      case 'ArrowRight': case 'd': case 'D': nx++; break;
    }
    if (walkable(nx, ny)) {
      player.x = nx;
      player.y = ny;
      onTile(nx, ny);
      draw();
    }
  }
  document.addEventListener('keydown', onKey, { capture: true, passive: false });
  window.addEventListener('keydown',   onKey, { capture: true, passive: false });
})();

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
// 描画（スクロール対応、画像未読込のフォールバック付き）
// -----------------------------
function ready(img) { return !!(img && img.complete && img.naturalWidth); }

function draw() {
  // 背景クリア（透明→ページ背景色のままになる場合は色塗りしたいなら fillRect でもOK）
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー中心に表示範囲を決定
  let offsetX = player.x - Math.floor(VIEW_COLS / 2);
  let offsetY = player.y - Math.floor(VIEW_ROWS / 2);
  offsetX = Math.max(0, Math.min(offsetX, Math.max(0, COLS - VIEW_COLS)));
  offsetY = Math.max(0, Math.min(offsetY, Math.max(0, ROWS - VIEW_ROWS)));

  // マップ描画
  for (let y = 0; y < VIEW_ROWS; y++) {
    for (let x = 0; x < VIEW_COLS; x++) {
      const mapX = x + offsetX;
      const mapY = y + offsetY;
      if (mapX >= COLS || mapY >= ROWS) continue;

      const t = GRID[mapY][mapX];
      const dx = x * TILE, dy = y * TILE;

      // 床：画像がまだなら淡い緑で塗る
      if (ready(images.floor)) ctx.drawImage(images.floor, dx, dy, TILE, TILE);
      else { ctx.fillStyle = '#cfeec0'; ctx.fillRect(dx, dy, TILE, TILE); }

      // 上書きタイル：それぞれ画像が無ければ色で代替
      if (t === '#') {
        if (ready(images.wall)) ctx.drawImage(images.wall, dx, dy, TILE, TILE);
        else { ctx.fillStyle = '#556b2f'; ctx.fillRect(dx, dy, TILE, TILE); }
      } else if (t === 'E') {
        if (ready(images.enemy)) ctx.drawImage(images.enemy, dx, dy, TILE, TILE);
        else { ctx.fillStyle = '#8b0000'; ctx.fillRect(dx, dy, TILE, TILE); }
      } else if (t === 'I') {
        if (ready(images.item)) ctx.drawImage(images.item, dx, dy, TILE, TILE);
        else { ctx.fillStyle = '#daa520'; ctx.fillRect(dx, dy, TILE, TILE); }
      } else if (t === 'A') {
        if (ready(images.ally)) ctx.drawImage(images.ally, dx, dy, TILE, TILE);
        else { ctx.fillStyle = '#1e90ff'; ctx.fillRect(dx, dy, TILE, TILE); }
      } else if (t === 'G') {
        if (ready(images.goal)) ctx.drawImage(images.goal, dx, dy, TILE, TILE);
        else { ctx.fillStyle = '#32cd32'; ctx.fillRect(dx, dy, TILE, TILE); }
      }
    }
  }

  // プレイヤー：未読込なら濃い緑の四角
  const px = (player.x - offsetX) * TILE;
  const py = (player.y - offsetY) * TILE;
  if (ready(images.pl)) ctx.drawImage(images.pl, px, py, TILE, TILE);
  else { ctx.fillStyle = '#2b8a3e'; ctx.fillRect(px + 8, py + 8, TILE - 16, TILE - 16); }

  // HPライフゲージ
  drawLifeGauge();
}

// -----------------------------
// 初回描画（ロード前でもフォールバックで見える）
// -----------------------------
setStatus('✅ ゲーム開始');
draw();
