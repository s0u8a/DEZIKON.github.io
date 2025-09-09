export const player = {
  x: 1, y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0
};

// アニメーションフレーム用カウンタ
let lifeAnimFrame = 0;

// 🆕 return を追加 → game.js 側で player を受け取れるように
export function initPlayer(GRID) {
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[0].length; x++) {
      if (GRID[y][x] === 'S') {
        player.x = x; 
        player.y = y;
        GRID[y][x] = '0';
        // ✅ player を返すように変更
        return player;
      }
    }
  }
  return player; // 万が一スタート地点が見つからなかった時
}

export function takeDamage(amount = 1, setStatus) {
  if (player.invincibleTime > 0) return;
  player.hearts = Math.max(0, player.hearts - amount);
  player.invincibleTime = 10;
  if (setStatus) setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

export function heal(amount = 1, setStatus) {
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (setStatus) setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

export function updatePlayer() {
  if (player.invincibleTime > 0) player.invincibleTime--;
  lifeAnimFrame++; // フレーム進行
}

// 🆕 右上にハートを横並びで描画（鼓動付き）
export function drawLifeGauge(ctx, heartImg, tile, player) {
  const padding = 10;   // 右上からの余白
  const heartSize = 32; // ハートのサイズ
  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = ctx.canvas.width / dpr;

  for (let i = 0; i < player.maxHearts; i++) {
    // 右端から左へ横並び
    const dx = canvasWidth - padding - (player.maxHearts - i) * (heartSize + 5);
    const dy = padding;

    if (i < player.hearts) {
      if (player.hearts === 1 && i === 0) {
        // 残り1個のときだけ鼓動
        const pulse = 1 + 0.2 * Math.sin(lifeAnimFrame * 0.2);
        const size = heartSize * pulse;
        const offset = (heartSize - size) / 2;
        ctx.drawImage(heartImg, dx + offset, dy + offset, size, size);
      } else {
        ctx.drawImage(heartImg, dx, dy, heartSize, heartSize);
      }
    } else {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(heartImg, dx, dy, heartSize, heartSize);
      ctx.globalAlpha = 1.0;
    }
  }
}
