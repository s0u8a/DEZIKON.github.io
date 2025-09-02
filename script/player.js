// player.js
// 担当B：プレイヤー管理モジュール
// ES6モジュール形式

// -------------------------
// プレイヤー情報
// -------------------------
export const player = {
  x: 0,             // マップ上のX座標
  y: 0,             // マップ上のY座標
  hearts: 3,        // 現在のハート（HP）
  maxHearts: 3      // 最大ハート
};

// -------------------------
// プレイヤー初期化
// -------------------------
export function initPlayer(startX = 0, startY = 0) {
  player.x = startX;
  player.y = startY;
  player.hearts = player.maxHearts;
}

// -------------------------
// プレイヤー座標取得
// -------------------------
export function getPlayerPosition() {
  return { x: player.x, y: player.y };
}

// -------------------------
// プレイヤーハート取得
// -------------------------
export function getPlayerHearts() {
  return player.hearts;
}

// -------------------------
// プレイヤー移動
// direction: "up" | "down" | "left" | "right"
// map: 二次元配列（0=通路, 1=壁）
// -------------------------
export function movePlayer(direction, map) {
  let newX = player.x;
  let newY = player.y;

  switch(direction) {
    case "up":    newY--; break;
    case "down":  newY++; break;
    case "left":  newX--; break;
    case "right": newX++; break;
    default: return false;
  }

  if (isWalkable(newX, newY, map)) {
    player.x = newX;
    player.y = newY;
    return true;
  }
  return false;
}

// -------------------------
// 移動可能判定
// -------------------------
function isWalkable(x, y, map) {
  // マップ範囲外
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return false;
  const tile = map[y][x];
  // 0=通路 / 1=壁
  return tile === 0;
}

// -------------------------
// ダメージを受ける
// -------------------------
export function takeDamage(amount = 1) {
  player.hearts -= amount;
  if (player.hearts < 0) player.hearts = 0;
}

// -------------------------
// 回復する
// -------------------------
export function heal(amount = 1) {
  player.hearts += amount;
  if (player.hearts > player.maxHearts) player.hearts = player.maxHearts;
}

// -------------------------
// プレイヤー初期化＆描画用の補助関数例
// -------------------------
export function resetPlayer(startX = 0, startY = 0) {
  initPlayer(startX, startY);
}

// -------------------------
// デバッグ用
// -------------------------
export function logPlayerStatus() {
  console.log(`Player position: (${player.x}, ${player.y}) | Hearts: ${player.hearts}/${player.maxHearts}`);
}
