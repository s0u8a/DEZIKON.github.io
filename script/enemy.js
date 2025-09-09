export let enemies = [];
let enemyAnim = 0;

export function initEnemies(GRID) {
  enemies.length = 0;
  for (let y = 0; y < GRID.length; y++) {
    for (let x = 0; x < GRID[0].length; x++) {
      if (GRID[y][x] === "E") {
        enemies.push({ x, y, dx: 1, dy: 0, type: "normal" });
        GRID[y][x] = "E";
      } else if (GRID[y][x] === "F") {
        enemies.push({ x, y, dx: 1, dy: 0, type: "frog" });
        GRID[y][x] = "0";
      } else if (GRID[y][x] === "H") {
        // 🆕 H -> araiteki 敵
        enemies.push({ x, y, dx: 1, dy: 0, type: "araiteki" });
        GRID[y][x] = "K"; // 床は専用タイルに置き換え
      }
    }
  }
  // 👇 わかりやすいログ
  console.log(
    "敵生成:",
    enemies.map(e => ({ x: e.x, y: e.y, type: e.type }))
  );
}

export function updateEnemies(walkable, player, onHit) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const nx = e.x + e.dx;
    const ny = e.y + e.dy;
    if (walkable(nx, ny)) {
      e.x = nx; e.y = ny;
    } else {
      const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
      ];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      e.dx = dir.dx; e.dy = dir.dy;
    }
    if (e.x === player.x && e.y === player.y) {
      if (onHit) onHit(1, i, e.type);
    }
  }
  if (player.invincibleTime > 0) player.invincibleTime--;
}

export function drawEnemies(ctx, imgEnemy, imgFrog, imgAraiteki, TILE, offsetX, offsetY, canvasW, canvasH) {
  enemyAnim++;
  for (let e of enemies) {
    const dx = (e.x - offsetX) * TILE;
    const dy = (e.y - offsetY) * TILE;
    if (dx + TILE < 0 || dy + TILE < 0 || dx > canvasW || dy > canvasH) continue;
    const pulse = 1 + 0.1 * Math.sin(enemyAnim * 0.1);
    const size = TILE * pulse;
    const off = (TILE - size) / 2;
    if (e.type === "normal") ctx.drawImage(imgEnemy, dx + off, dy + off, size, size);
    else if (e.type === "frog") ctx.drawImage(imgFrog, dx + off, dy + off, size, size);
    else if (e.type === "araiteki") ctx.drawImage(imgAraiteki, dx + off, dy + off, size, size);
  }
}

export function removeEnemy(index) {
  if (index >= 0 && index < enemies.length) enemies.splice(index, 1);
}
