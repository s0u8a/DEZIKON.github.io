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

  const VIEW_COLS = 10; // 横表示マス数
  const VIEW_ROWS = 8;  // 縦表示マス数

  const DPR = Math.max(1, window.devicePixelRatio || 1);

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
  function resizeCanvas() {
    const cssW = VIEW_COLS * TILE;
    const cssH = VIEW_ROWS * TILE;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width = Math.floor(cssW * DPR);
    canvas.height = Math.floor(cssH * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resizeCanvas();

  // -----------------------------
  // プレイヤー情報
  // -----------------------------
  const player = { x: 1, y: 1, hearts: 3, maxHearts: 3 };

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
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  const imagePaths = {
    floor: './assets/images/tanbo.png',
    wall: './assets/images/wall.png',
    enemy: './assets/images/enemy.png',
    item: './assets/images/item.png',
    ally: './assets/images/ally.png',
    goal: './assets/images/goal.png',
    pl: './assets/images/noumin.png'
  };
  const images = {};

  async function loadAllImages() {
    await Promise.all(Object.keys(imagePaths).map(async k => {
      images[k] = await loadImage(imagePaths[k]);
      setStatus(`${images[k] ? '✅' : '❌'} ${imagePaths[k]}`);
    }));
  }

  // -----------------------------
  // 描画ヘルパ
  // -----------------------------
  function drawSprite(img, dx, dy, size, fallback) {
    if (img && img.naturalWidth > 0) ctx.drawImage(img, dx, dy, size, size);
    else if (fallback) { ctx.fillStyle = fallback; ctx.fillRect(dx, dy, size, size); }
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
    if (t === 'E') { setStatus('👹 敵に遭遇！'); takeDamage(1); }
    else if (t === 'I') { setStatus('🎁 アイテム取得！'); heal(1); GRID[y][x]='0'; }
    else if (t === 'A') setStatus('🤝 味方に会った！');
    else if (t === 'G') setStatus('🏁 ゴール！');
  }

  // -----------------------------
  // キー入力（WASD対応） window に登録
  // -----------------------------
  window.addEventListener('keydown', e => {
    let nx = player.x, ny = player.y;
    const k = e.key.toLowerCase();
    let handled = true;

    if (k === 'arrowup' || k === 'w') ny--;
    else if (k === 'arrowdown' || k === 's') ny++;
    else if (k === 'arrowleft' || k === 'a') nx--;
    else if (k === 'arrowright' || k === 'd') nx++;
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
    const startX = 10, startY = 10, size = 16, gap = 4;
    for (let i=0;i<player.maxHearts;i++){
      ctx.fillStyle = (i<player.hearts) ? 'red':'gray';
      ctx.fillRect(startX + i*(size+gap), startY, size, size);
    }
  }

  // -----------------------------
  // 描画（スクロール対応）
  // -----------------------------
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let offsetX = player.x - Math.floor(VIEW_COLS/2);
    let offsetY = player.y - Math.floor(VIEW_ROWS/2);
    offsetX = Math.max(0, Math.min(offsetX, Math.max(0,COLS-VIEW_COLS)));
    offsetY = Math.max(0, Math.min(offsetY, Math.max(0,ROWS-VIEW_ROWS)));

    for(let y=0;y<VIEW_ROWS;y++){
      for(let x=0;x<VIEW_COLS;x++){
        const mapX=x+offsetX,mapY=y+offsetY;
        if(mapX>=COLS||mapY>=ROWS) continue;
        const t = GRID[mapY][mapX], dx=x*TILE, dy=y*TILE;

        drawSprite(images.floor, dx,dy,TILE,'#cfeec0');

        if(t==='E') drawSprite(images.enemy,dx,dy,TILE,'#8b0000');
        else if(t==='I') drawSprite(images.item,dx,dy,TILE,'#daa520');
        else if(t==='A') drawSprite(images.ally,dx,dy,TILE,'#1e90ff');
        else if(t==='G') drawSprite(images.goal,dx,dy,TILE,'#32cd32');
        else if(t==='#') drawSprite(images.wall,dx,dy,TILE,'#556b2f');
      }
    }

    // プレイヤー描画
    const px=(player.x-offsetX)*TILE, py=(player.y-offsetY)*TILE;
    drawSprite(images.pl, px,py,TILE,'#2b8a3e');

    drawLifeGauge();
  }

  // -----------------------------
  // 初期化
  // -----------------------------
  async function init(){
    setStatus('画像読み込み中…');
    await loadAllImages();
    setStatus('準備完了！矢印キー/WASDで移動');
    draw();
  }

  if(document.readyState==='complete'||document.readyState==='interactive') init();
  else window.addEventListener('DOMContentLoaded', init);

  window.addEventListener('resize', ()=>{
    resizeCanvas();
    draw();
  });
})();
