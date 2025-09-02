// script/main.js
const TILE = window.GMAP?.tile ?? 64;
const GRID = window.GMAP?.grid ?? [];
const ROWS = GRID.length;
const COLS = GRID[0]?.length ?? 0;

const canvas = document.getElementById('gameCanvas'); // ← index.html と一致
const ctx     = canvas.getContext('2d');
const statusEl = document.getElementById('status');

function setStatus(msg){ if(statusEl) statusEl.textContent = msg; console.log(msg); }

// 画像（GitHub Pages のパスに合わせる）
const images = {
  bg:  load('./assets/images/tanbo.png',  'background'),
  pl:  load('./assets/images/noumin.png', 'player'),
};
function load(src,label){
  const img=new Image();
  img.onload =()=>setStatus(`✅ loaded: ${label} → ${src}`);
  img.onerror=()=>setStatus(`❌ error: ${label} → ${src}`);
  img.src=src; return img;
}

// スタート位置を探す
const player = { x:1, y:1 };
for (let y=0;y<ROWS;y++){
  for (let x=0;x<COLS;x++){
    if (GRID[y][x]==='S'){ player.x=x; player.y=y; }
  }
}

// 入力
window.addEventListener('keydown', e=>{
  let nx=player.x, ny=player.y, handled=true;
  if (e.key==='ArrowUp') ny--;
  else if (e.key==='ArrowDown') ny++;
  else if (e.key==='ArrowLeft') nx--;
  else if (e.key==='ArrowRight') nx++;
  else handled=false;
  if (handled) e.preventDefault();

  if (handled && walkable(nx,ny)) {
    player.x=nx; player.y=ny;
    draw();
    onTile(nx,ny);
  }
});

function walkable(x,y){
  return !(x<0||x>=COLS||y<0||y>=ROWS) && GRID[y][x] !== '#';
}
function onTile(x,y){
  const t=GRID[y][x];
  if (t==='E') setStatus('👹 敵に遭遇！クイズへ…（仮）');
  else if (t==='I') setStatus('🎁 アイテムを見つけた！');
  else if (t==='A') setStatus('🤝 味方に会った！');
  else if (t==='G') setStatus('🏁 ゴール！');
  else setStatus('');
}

function draw(){
  // 背景
  if (images.bg.complete && images.bg.naturalWidth) {
    ctx.drawImage(images.bg,0,0,canvas.width,canvas.height);
  } else {
    ctx.fillStyle='#cfeec0'; ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  // 壁＆グリッド
  for (let y=0;y<ROWS;y++){
    for (let x=0;x<COLS;x++){
      if (GRID[y][x]==='#'){
        ctx.fillStyle='#556b2f';
        ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
      }
      ctx.strokeStyle='rgba(0,0,0,.08)';
      ctx.strokeRect(x*TILE+.5,y*TILE+.5,TILE-1,TILE-1);
      const t=GRID[y][x];
      if (t!=='0'&&t!=='#'){ // デバッグの印字
        ctx.fillStyle='rgba(0,0,0,.28)';
        ctx.font='12px sans-serif';
        ctx.fillText(t, x*TILE+6, y*TILE+18);
      }
    }
  }
  // プレイヤー
  const dx=player.x*TILE, dy=player.y*TILE;
  if (images.pl.complete && images.pl.naturalWidth) {
    ctx.drawImage(images.pl, dx, dy, TILE, TILE);
  } else {
    ctx.fillStyle='#2b8a3e';
    ctx.fillRect(dx+8,dy+8,TILE-16,TILE-16);
  }
}

draw();
setStatus('画像を読み込み中… ./assets/images/tanbo.png, ./assets/images/noumin.png');
