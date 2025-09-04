
// enemy.js
window.enemies = [];

window.spawnEnemies = function(GRID) {
  enemies.length = 0;
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[y].length; x++) {
      if (GRID[y][x] === 'E') {
        enemies.push({ x, y, dx: 1, dy: 0 });
        GRID[y][x] = '0';
      }
    }
  }
};

window.updateEnemies = function(walkable) {
  for (let e of enemies) {
    let nx = e.x + e.dx;
    let ny = e.y + e.dy;
    if (!walkable(nx, ny)) {
      const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      Object.assign(e, dirs[Math.floor(Math.random() * dirs.length)]);
    } else {
      e.x = nx; e.y = ny;
    }
    if (e.x === player.x && e.y === player.y) takeDamage(1);
  }
};

let animationFrame = 0;
window.drawEnemies = function(ctx, images, TILE, offsetX, offsetY, canvas) {
  animationFrame++;
  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;
    let pulse = 1 + 0.1 * Math.sin(animationFrame * 0.1);
    let size = TILE * pulse;
    ctx.drawImage(images.enemy, dx + (TILE - size) / 2, dy + (TILE - size) / 2, size, size);
  }
};
