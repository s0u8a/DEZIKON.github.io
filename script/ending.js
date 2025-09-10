// ゴール判定
export function checkGoal(GRID, x, y) {
  return GRID[y] && GRID[y][x] === "G";
}

// ノーマルエンディング
export function triggerNormalEnding(state) {
  const { setStatus, bgm, setGameCleared } = state || {};
  if (bgm && typeof bgm.pause === "function") bgm.pause();
  if (typeof setStatus === "function") {
    setStatus("🎉 ノーマルエンディング！ゴールに到達しました！");
  }
  if (typeof setGameCleared === "function") setGameCleared(true);
}

// 特殊エンディング（敵を全滅させた場合）
export function triggerSpecialEnding(state) {
  const { setStatus, bgm, setGameCleared } = state || {};
  if (bgm && typeof bgm.pause === "function") bgm.pause();
  if (typeof setStatus === "function") {
    setStatus("✨ 特殊エンディング！敵を全滅させ、佐渡を鎮めました！");
  }
  if (typeof setGameCleared === "function") setGameCleared(true);
}

// ゲームオーバー判定
export function checkGameOver(player, setStatus) {
  if (player.hearts <= 0) {
    if (typeof setStatus === "function") {
      setStatus("💀 ゲームオーバー");
    }
    return true;
  }
  return false;
}
