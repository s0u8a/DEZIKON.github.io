export const player = {
  x: 1, y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0
};

export function initPlayer(GRID) {
  // スタート位置 S を探して初期化
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[0].length; x++) {
      if (GRID[y][x] === 'S') {
        player.x = x; player.y = y;
        GRID[y][x] = '0';
        return;
      }
    }
  }
}

export function takeDamage(amount = 1, setStatus) {
  if (player.invincibleTime > 0) return;
  player.hearts = Math.max(0, player.hearts - amount);
  player.invincibleTime = 10; // ターン無敵
  if (setStatus) setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
}

export function heal(amount = 1, setStatus) {
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (setStatus) setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
}

// 無敵時間を減らす
export function updatePlayer() {
  if (player.invincibleTime > 0) player.invincibleTime--;
}

// プレイヤーの頭上にハートを描画
export function drawLifeGauge(ctx, heartImg, tile, player) {
  const baseX = player.x * tile;        // プレイヤーの位置
  const baseY = player.y * tile - 20;   // 頭の少し上に表示

  for (let i = 0; i < player.maxHearts; i++) {
    const dx = baseX + i * 20; // 横に並べる
    const dy = baseY;

    if (i < player.hearts) {
      ctx.globalAlpha = 1.0;
    } else {
      ctx.globalAlpha = 0.3; // 減ったハートは薄く表示
    }
    ctx.drawImage(heartImg, dx, dy, 16, 16);
  }

  ctx.globalAlpha = 1.0; // 戻す
}
