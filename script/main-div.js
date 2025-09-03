// -----------------------------
// マップデータ取得
// -----------------------------
const GRID = window.GMAP.grid;
const ROWS = GRID.length;
const COLS = GRID[0].length;

const gameContainer = document.getElementById('game');
const statusEl = document.getElementById('status');

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// -----------------------------
// プレイヤー情報
// -----------------------------
const player = { x: 1, y: 1 };

// スタート位置を探す
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    if (GRID[y][x] === 'S') {
      player.x = x;
      player.y = y;
    }
  }
}

// -----------------------------
// 描画
// -----------------------------
function draw() {
  gameContainer.innerHTML = ""; // リセット

  for (let y = 0; y < ROWS; y++) {
    const row = document.createElement("div");
    row.className = "row";

    for (let x = 0; x < COLS; x++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      if (player.x === x && player.y === y) {
        tile.classList.add("player");
      } else {
        const t = GRID[y][x];
        if (t === "0" || t === "S") tile.classList.add("floor");
        if (t === "#") tile.classList.add("wall");
        if (t === "E") tile.classList.add("enemy");
        if (t === "I") tile.classList.add("item");
        if (t === "A") tile.classList.add("ally");
        if (t === "G") tile.classList.add("goal");
      }

      row.appendChild(tile);
    }

    gameContainer.appendChild(row);
  }
}

// -----------------------------
// 移動可能判定
// -----------------------------
function walkable(x, y) {
  return !(x < 0 || x >= COLS || y < 0 || y >= ROWS) && GRID[y][x] !== "#";
}

// -----------------------------
// キー入力
// -----------------------------
window.addEventListener("keydown", e => {
  let nx = player.x, ny = player.y;

  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;

  if (walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;
    onTile(nx, ny);
    draw();
  }
});

// -----------------------------
// タイル接触処理
// -----------------------------
function onTile(x, y) {
  const t = GRID[y][x];
  if (t === 'E') {
    setStatus('👹 敵に遭遇！');
  } else if (t === 'I') {
    setStatus('🎁 アイテムを取得！');
    GRID[y][x] = '0'; // アイテム消滅
  } else if (t === 'A') {
    setStatus('🤝 味方に会った！');
  } else if (t === 'G') {
    setStatus('🏁 ゴール！');
  }
}

// -----------------------------
// 初回描画
// -----------------------------
setStatus("✅ ゲーム開始");
draw();
