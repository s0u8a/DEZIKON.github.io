// -----------------------------
// スクロール対応版（要素を一部変更）
// - 高DPI対応
// - 画像ロード待ち
// - フォールバック描画
// - WASD対応 & フォーカス安定
// -----------------------------
(() => {
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

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
    console.log(msg);
  }

  if (!COLS || !ROWS) {
    setStatus('GMAP.grid が未設定です');
    return;
  }

  // -----------------------------
  // 高DPI対応
  // -----------------------------
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  function resizeCanvas() {
    const cssW = VIEW_COLS * TILE;
    const cssH = VIEW_ROWS * TILE;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width = Math.floor(cssW * DPR);
    canvas.height = Math.floor(cssH * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // 以後の描画はCSS座標でOK
  }
  resizeCanvas();

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
  // 画像読み込み（Promise化 & フォールバック）
  // -----------------------------
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      // 別ドメインなら CORS: img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // 失敗でもnullを返す
      img.src = src;
    });
  }

  const imagePaths = {
    floor: './assets/images/tanbo.png',  // 床
    wall: './assets/images/wall.png',    // 壁
    enemy: './assets/images/enemy.png',  // 敵
    item: './assets/images/item.png',    // アイテム
    ally: './assets/images/ally.png',    // 味方
    goal: './assets/images/goal.png',    // ゴール
    pl: './assets/images/noumin.png'     // プレイヤー
  };
  const images = {};

  async function loadAllImages() {
    const keys = Object.keys(imagePaths);
    await Promise.all(keys.map(async k => {
      images[k] = await loadImage(imagePaths[k]);
      setStatus(`${images[k] ? '✅' : '❌'} ${imagePaths[k]}`);
    }));
  }

  // -----------------------------
  // 描画ヘルパ
  // -----------------------------
  function drawSprite(img, dx, dy, size, fallback) {
    if (img && img.naturalWidth > 0) {
      ctx.drawImage(img, dx, dy, size, size);
    } else if (fallback) {
      ctx.fillStyle = fallback;
      ctx.fillRect(dx, dy, size, size);
    }
  }

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
  // キー入力（WASD対応 & フォーカス）
  // -----------------------------
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0');
  canvas.addEventListener('click', () => canvas.focus());
  canvas.focus();

  window.addEventListener('keydown', e => {
    let nx = player.x, ny = player.y;
    let handled = true;

    const k = e.key;
    if (k === 'ArrowUp' || k === 'w' || k === 'W') ny--;
    else if (k === 'ArrowDown' || k === 's' || k === 'S') ny++;
    else if (k === 'ArrowLeft' || k === 'a' || k === 'A') nx--;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') nx++;
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

        // 床（フォールバック色：#cfeec0）
        drawSprite(images.floor, dx, dy, TILE, '#cfeec0');

        // 上書きタイル
        if (t === '#')      drawSprite(images.wall,  dx, dy, TILE, '#556b2f');
        else if (t === 'E') drawSprite(images.enemy, dx, dy, TILE, '#8b0000');
        else if (t === 'I') drawSprite(images.item,  dx, dy, TILE, '#daa520');
        else if (t === 'A') drawSprite(images.ally,  dx, dy, TILE, '#1e90ff');
        else if (t === 'G') drawSprite(images.goal,  dx, dy, TILE, '#32cd32');
      }
    }

    // プレイヤー描画（フォールバック：濃い緑）
    const px = (player.x - offsetX) * TILE;
    const py = (player.y - offsetY) * TILE;
    drawSprite(images.pl, px, py, TILE, '#2b8a3e');

    // HPライフゲージ
    drawLifeGauge();
  }

  // -----------------------------
  // 初期化：画像ロード後に初回描画
  // -----------------------------
  async function init() {
    setStatus('画像読み込み中…');
    await loadAllImages();
    setStatus('準備完了！矢印キー/WASDで移動');
    draw();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

  // リサイズ時もにじみを防ぐ
  window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
  });
})();
