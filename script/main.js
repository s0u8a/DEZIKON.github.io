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

// ==== 高DPI対応（にじみ防止）ここから ====
// const canvas.width/height 直指定をやめ、CSSサイズと内部ピクセルを分離
const DPR = Math.max(1, window.devicePixelRatio || 1);                   // [ADDED]
function resizeCanvas() {                                                // [ADDED]
  const cssW = VIEW_COLS * TILE;
  const cssH = VIEW_ROWS * TILE;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = Math.floor(cssW * DPR);
  canvas.height = Math.floor(cssH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // 以後はCSS座標系で描ける
}
resizeCanvas();                                                          // [ADDED]
window.addEventListener('resize', () => { resizeCanvas(); draw(); });    // [ADDED]
// ==== 高DPI対応ここまで ====

// （元の直指定は削除）
// canvas.width = VIEW_COLS * TILE;
// canvas.height = VIEW_ROWS * TILE;

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
// キー入力（ここを全面修正）
// -----------------------------
// 他スクリプトに先取りされても確実に拾えるよう capture:true / passive:false で登録
// またキャンバスにフォーカス可能化して初期フォーカスを当てる
(function setupInput() {                                                // [ADDED]
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0'); // [ADDED]
  setTimeout(() => canvas.focus(), 0);                                         // [ADDED]
  canvas.addEventListener('click', () => canvas.focus());                      // [ADDED]

  const KEY = new Set([                                                        // [ADDED]
    'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
    'w','a','s','d','W','A','S','D'
  ]);

  function onKey(e) {                                                          // [ADDED]
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

  document.addEventListener('keydown', onKey, { capture: true, passive: false }); // [ADDED]
  window.addEventListener('keydown', onKey,   { capture: true, passive: false }); // [ADDED]
})(); // [ADDED]

// （元のキー入力リスナーは削除）
// window.addEventListener('keydown', e => { ... });

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

  // （安全側に微修正：負値や過大を二重にケア）
  offsetX = Math.max(0, Math.min(offsetX, Math.max(0, COLS - VIEW_COLS))); // [CHANGED]
  offsetY = Math.max(0, Math.min(offsetY, Math.max(0, ROWS - VIEW_ROWS))); // [CHANGED]

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
