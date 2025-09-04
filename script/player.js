// script/player.js
window.player = {
  x: 1, y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0
};

window.initPlayer = function initPlayer(GRID) {
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
};

window.takeDamage = function takeDamage(amount = 1) {
  if (player.invincibleTime > 0) return;
  player.hearts = Math.max(0, player.hearts - amount);
  player.invincibleTime = 10; // ターン無敵
  if (typeof window.setStatus === 'function') {
    setStatus(`💔 HP: ${player.hearts}/${player.maxHearts}`);
  }
};

window.heal = function heal(amount = 1) {
  player.hearts = Math.min(player.maxHearts, player.hearts + amount);
  if (typeof window.setStatus === 'function') {
    setStatus(`❤️ HP: ${player.hearts}/${player.maxHearts}`);
  }
};

