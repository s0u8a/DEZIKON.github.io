import { map } from "./map.js";
import { player, movePlayer } from "./player.js";

const gameDiv = document.getElementById("game");

// --- 描画 ---
function render() {
  gameDiv.innerHTML = "";
  map.forEach((row, y) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    row.forEach((cell, x) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (cell === 0) tile.classList.add("floor");
      if (cell === 1) tile.classList.add("wall");
      if (player.x === x && player.y === y) tile.classList.add("player");
      rowDiv.appendChild(tile);
    });
    gameDiv.appendChild(rowDiv);
  });
}

// --- キー操作 ---
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer("up", map);
  if (e.key === "ArrowDown") movePlayer("down", map);
  if (e.key === "ArrowLeft") movePlayer("left", map);
  if (e.key === "ArrowRight") movePlayer("right", map);
  render();
});

// 初期表示
render();

