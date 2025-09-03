// -----------------------------
// 定数・初期設定
// -----------------------------
const TILE = window.GMAP?.tile ?? 64;
const GRID = window.GMAP?.grid ?? [];
const ROWS = GRID.length;
const COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas?.getContext?.('2d');
const statusEl = document.getElementById('status');

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}
if (!canvas || !ctx) {
  console.error('❌ canvas #gameCanvas が見つからない/2D取得失敗');
}

// 表示範囲（スクロール用）
const VIEW_COLS = 10;
const VIEW_ROWS = 8;

// マップが読めているか（自己診断用）
const HAS_MAP = ROWS > 0 && COLS > 0;
if (!HAS_MAP) {
  setStatus('⚠️ GMAP が未定義 or grid が空です（map.js の読み込み順/パスを確認）');
  // GitHub Pages のプロジェクトサイトでは絶対パス (/script/...) はNG。相対で:
  //   <script src="script/map.js" defer></script>
  //   <script src="script/main.js" defer></script>
}

// ==== 高DPI対応（にじみ防止）====
const DPR = Math.max(1, window.devicePixelRatio || 1);
function resizeCanvas() {
  if (!canvas) return;
  const cssW = VIEW_COLS * TILE;
  const cssH = VIEW_ROWS * TILE;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = Math.floor(cssW * DPR);
  canvas.height = Math.floor(cssH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (ctx) ctx.imageSmoothingEnabled = false;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); draw(); });

// -----------------------------
// プレイヤー情報
// -----------------------------
const player = {
  x: 1,
  y: 1,
  hearts: 3,
  maxHearts: 3
};

// スタート位置(S)があれば設定（マップがある場合）
if (HAS_MAP) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (GRID[y][x] === 'S') { player.x = x; player.y = y; }
    }
  }
}

// -----------------------------
// 画像読み込み（onload/onerrorで再描画）
// -----------------------------
function loadImage(src) {
  const img = new Image();
  img.onload = () => { setStatus(`✅ loaded: ${src}`); draw(); };
  img.onerror = () => { setStatus(`❌ error: ${src}`); draw(); };
  img.src = src;
  return img;
}
const images = {
  floor: loadImage('./assets/images/tanbo.png'),
  wall:  loadImage('./assets/images/wall.png'),
  enemy: loadImage('./assets/images/enemy.png'),
  item:  loadImage('./assets/images/item.png'),
  ally:  loadImage('./assets/images/ally.png'),
  goal:  loadImage('./assets/images/goal.png'),
  pl:    loadImage('./assets/images/noumin.png')
};
const ready = img => !!(img && img.complete && img.naturalWidth);

// -----------------------------
// 移動判定（マップが無いときは常にtrueで動けるように）
// -----------------------------
function walkable(x, y) {
  if (!HAS_MAP) return true;
  return !(x < 0 || x >= COLS || y < 0 || y >= ROWS) && GRID[y][x] !== '#';
}

// -----------------------------
// HP管理
// -----------------------------
function takeDamage(n = 1) {
  player.hearts = Math.max(0, player.hearts - n);
  draw();
  setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}
function heal(n = 1) {
  player.hearts = Math.min(player.maxHearts, player.hearts + n);
  draw();
  setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

// -----------------------------
// タイル接触処理（マップが無いときは何もしない）
// -----------------------------
function onTile(x, y) {
  if (!HAS_MAP) return;
  const t = GRID[y][x];
  if (t === 'E') { setStatus('👹 敵に遭遇！'); takeDamage(1); }
  else if (t === 'I') { setStatus('🎁 アイテム！'); heal(1); GRID[y][x] = '0'; }
  else if (t === 'A') { setStatus('🤝 味方に会った！'); }
  else if (t === 'G') { setStatus('🏁 ゴール！'); }
}

// -----------------------------
// 入力（capture先取り/フォーカス安定）
// -----------------------------
(function setupInput() {
  if (!canvas) return;
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0');
  setTimeout(() => canvas.focus(), 0);
  canvas.addEventListener('click', () => canvas.focus());

  const KEY = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D']);
  function onKey(e) {
    if (!KEY.has(e.key)) return;
    e.preventDefault(); e.stopPropagation();

    let nx = player.x, ny = player.y;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': ny--; break;
      case 'ArrowDown': case 's': case 'S': ny++; break;
      case 'ArrowLeft': case 'a': case 'A': nx--; break;
      case 'ArrowRight': case 'd': case 'D': nx++; break;
    }
    if (walkable(nx, ny)) {
      player.x = nx; player.y = ny; onTile(nx, ny); draw();
    }
  }
  document.addEventListener('keydown', onKey, { capture: true, passive: false });
  window.addEventListener('keydown',   onKey, { capture: true, passive: false });
})();

// -----------------------------
// ライフゲージ描画
// -----------------------------
function drawLifeGauge() {
  const startX = 10, startY = 10, size = 16, gap = 4;
  for (let i = 0; i < player.maxHearts; i++) {
    ctx.fillStyle = (i < player.hearts) ? 'red' : 'gray';
    ctx.fillRect(startX + i * (size + gap), startY, size, size);
  }
}

// -----------------------------
// 描画（GMAPが無い場合は「仮マップ」を描く）
// -----------------------------
function draw() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let offsetX = 0, offsetY = 0;
  if (HAS_MAP) {
    offsetX = player.x - Math.floor(VIEW_COLS / 2);
    offsetY = player.y - Math.floor(VIEW_ROWS / 2);
    offsetX = Math.max(0, Math.min(offsetX, Math.max(0, COLS - VIEW_COLS)));
    offsetY = Math.max(0, Math.min(offsetY, Math.max(0, ROWS - VIEW_ROWS)));
  }

  for (let y = 0; y < VIEW_ROWS; y++) {
    for (let x = 0; x < VIEW_COLS; x++) {
      const dx = x * TILE, dy = y * TILE;

      // 床（画像が無ければ色）
      if (ready(images.floor)) ctx.drawImage(images.floor, dx, dy, TILE, TILE);
      else { ctx.fillStyle = '#cfeec0'; ctx.fillRect(dx, dy, TILE, TILE); }

      if (HAS_MAP) {
        const mapX = x + offsetX;
        const mapY = y + offsetY;
        if (mapX < COLS && mapY < ROWS) {
          const t = GRID[mapY][mapX];
          if (t === '#')      (ready(images.wall)  ? ctx.drawImage(images.wall,  dx, dy, TILE, TILE) : (ctx.fillStyle='#556b2f', ctx.fillRect(dx,dy,TILE,TILE)));
          else if (t === 'E') (ready(images.enemy) ? ctx.drawImage(images.enemy, dx, dy, TILE, TILE) : (ctx.fillStyle='#8b0000', ctx.fillRect(dx,dy,TILE,TILE)));
          else if (t === 'I') (ready(images.item)  ? ctx.drawImage(images.item,  dx, dy, TILE, TILE) : (ctx.fillStyle='#daa520', ctx.fillRect(dx,dy,TILE,TILE)));
          else if (t === 'A') (ready(images.ally)  ? ctx.drawImage(images.ally,  dx, dy, TILE, TILE) : (ctx.fillStyle='#1e90ff', ctx.fillRect(dx,dy,TILE,TILE)));
          else if (t === 'G') (ready(images.goal)  ? ctx.drawImage(images.goal,  dx, dy, TILE, TILE) : (ctx.fillStyle='#32cd32', ctx.fillRect(dx,dy,TILE,TILE)));
        }
      }
    }
  }

  // プレイヤー
  const px = (player.x - offsetX) * TILE;
  const py = (player.y - offsetY) * TILE;
  if (ready(images.pl)) ctx.drawImage(images.pl, px, py, TILE, TILE);
  else { ctx.fillStyle = '#2b8a3e'; ctx.fillRect(px + 8, py + 8, TILE - 16, TILE - 16); }

  drawLifeGauge();
}

// -----------------------------
// 初回描画
// -----------------------------
setStatus('✅ ゲーム開始');
draw();
// -----------------------------
// GMAP_READY を受け取ってから描画（map.jsが確実に反映される）
// -----------------------------
window.addEventListener('GMAP_READY', () => {
  console.log('[main] GMAP ready', window.GMAP);

  // スタート位置を再設定
  for (let y = 0; y < window.GMAP.grid.length; y++) {
    for (let x = 0; x < window.GMAP.grid[0].length; x++) {
      if (window.GMAP.grid[y][x] === 'S') {
        player.x = x;
        player.y = y;
      }
    }
  }

  setStatus('🗺️ map.js が反映されました');
  draw();
}, { once: true });

