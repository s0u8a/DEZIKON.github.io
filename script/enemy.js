// script/enemy.js
export let enemies = [];   // ← 外からもアクセスできるよう export
let enemyAnim = 0;

// 敵を初期化
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
        enemies.push({ x, y, dx: dir.dx, dy: dir.dy, type: "normal" });
        GRID[y][x] = '0'; // マップからは消す
      } else if (GRID[y][x] === 'F') {
        const dirs = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        enemies.push({ x, y, dx: dir.dx, dy: dir.dy, type: "frog" });
        GRID[y][x] = '0';
      }
    }
  }
}

// 敵の移動と接触判定
export function updateEnemies(walkable, player, onHit) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
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

    // 当たり判定 → type も渡す
    if (e.x === player.x && e.y === player.y) {
      if (onHit) onHit(1, i, e.type);
    }
  }

  if (player.invincibleTime > 0) player.invincibleTime--;
}

// 敵を描画
export function drawEnemies(ctx, imgEnemy, imgFrog, TILE, offsetX, offsetY, canvasW, canvasH) {
  enemyAnim++;
  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;
    if (dx + TILE < 0 || dy + TILE < 0 || dx > canvasW || dy > canvasH) continue;

    const pulse = 1 + 0.1 * Math.sin(enemyAnim * 0.1);
    const size = TILE * pulse;
    const off = (TILE - size) / 2;

    if (e.type === "normal") {
      ctx.drawImage(imgEnemy, dx + off, dy + off, size, size);
    } else if (e.type === "frog") {
      ctx.drawImage(imgFrog, dx + off, dy + off, size, size);
    }
  }
}

// 敵を削除
export function removeEnemy(index) {
  if (index >= 0 && index < enemies.length) {
    enemies.splice(index, 1);
  }
}
