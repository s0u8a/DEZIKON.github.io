// script/player.js
export let player = {
  x: 1, y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0
};

let animationFrame = 0; // ハートアニメ用カウンタ

export function initPlayer(GRID) {
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[0].length; x++) {
      if (GRID[y][x] === 'S') {
        player.x = x;
        player.y = y;
        GRID[y][x] = '0';
        return;
      }
    }
  }
}

export function takeDamage(amount = 1, setStatus) {
  if (player.invincibleTime > 0) return;
  player.hearts = Math.max(0, player.hearts - amount);
  player.invincibleTime = 10;
  if (typeof setStatus === 'function') {
    setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
  }
}

export function heal(amount = 1, setStatus) {
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (typeof setStatus === 'function') {
    setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
  }
}

// 無敵時間減少
export function updatePlayer() {
  if (player.invincibleTime > 0) player.invincibleTime--;
}

/**
 * ライフゲージ描画（鼓動アニメ付き）
 */
export function drawLifeGauge(ctx, heartImg) {
  const startX = 10, startY = 10, baseSize = 32, gap = 8;
  animationFrame++;

  for (let i = 0; i < player.maxHearts; i++) {
    const dx = startX + i * (baseSize + gap);
    const dy = startY;

    if (i < player.hearts) {
      let pulse = (player.hearts <= 1)
        ? 1 + 0.3 * Math.sin(animationFrame * 0.2) // 瀕死でドクドク強調
        : 1 + 0.1 * Math.sin(animationFrame * 0.1);

      let size = baseSize * pulse;
      const offset = (baseSize - size) / 2;

      ctx.drawImage(heartImg, dx + offset, dy + offset, size, size);
    } else {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(heartImg, dx, dy, baseSize, baseSize);
      ctx.globalAlpha = 1.0;
    }
  }
}
