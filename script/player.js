export const player = { x: 0, y: 0 };

export function movePlayer(dir, map) {
  let newX = player.x;
  let newY = player.y;

  if (dir === "up") newY--;
  if (dir === "down") newY++;
  if (dir === "left") newX--;
  if (dir === "right") newX++;

  if (map[newY] && map[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
  }
}
