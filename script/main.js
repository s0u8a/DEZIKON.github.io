// === main.js ===
// ゲーム全体管理

import { drawMap } from "./map.js";
import { player } from "./map.js";

// ループ処理
function gameLoop() {
  drawMap();
  requestAnimationFrame(gameLoop);
}

// ゲーム開始
window.onload = () => {
  gameLoop();
};
