// script/enemy.js
let enemies = [];
let enemyAnim = 0;

export function initEnemies(GRID) {
  enemies.length = 0;
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[0].length; x++) {
      if (GRID[y][x] === 'E') {
        const dirs = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        enemies.push({ x, y, dx: dir.dx, dy: dir.dy });
        GRID[y][x] = '0';
      }
    }
  }
}

export function updateEnemies(walkable, player, takeDamage) {
  for (let e of enemies) {
    const nx = e.x + e.dx;
    const ny = e.y + e.dy;

    if (!walkable(nx, ny)) {
      const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      e.dx = dir.dx; e.dy = dir.dy;
    } else {
      e.x = nx; e.y = ny;
    }

    if (e.x === player.x && e.y === player.y) {
      takeDamage(1);
    }
  }

  if (player.invincibleTime > 0) player.invincibleTime--;
}

export function drawEnemies(ctx, imgEnemy, TILE, offsetX, offsetY, canvasW, canvasH) {
  enemyAnim++;
  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;
    if (dx + TILE < 0 || dy + TILE < 0 || dx > canvasW || dy > canvasH) continue;

    const pulse = 1 + 0.1 * Math.sin(enemyAnim * 0.1);
    const size = TILE * pulse;
    const off = (TILE - size) / 2;
    ctx.drawImage(imgEnemy, dx + off, dy + off, size, size);
  }
}
