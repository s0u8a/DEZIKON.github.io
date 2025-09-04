// script/player.js
export let player = {
  x: 1, y: 1,
  hearts: 3,
  maxHearts: 3,
  invincibleTime: 0
};

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
