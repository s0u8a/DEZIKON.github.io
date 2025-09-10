// ゴール判定
export function checkGoal(GRID, x, y) {
  return GRID[y] && GRID[y][x] === "G";
}

// ノーマルエンディング
export function triggerNormalEnding(state) {
  const { setStatus, bgm, endingRef, setGameCleared } = state  {};
  if (bgm && typeof bgm.pause === "function") bgm.pause();
  if (typeof setStatus === "function") {
    setStatus("🎉 ノーマルエンディング！ゴールに到達しました！");
  }
  if (endingRef) endingRef.value = "normal";
  if (typeof setGameCleared === "function") setGameCleared(true);
}

// 特殊エンディング（敵を全滅させた場合）
export function triggerSpecialEnding(state) {
  const { setStatus, bgm, endingRef, setGameCleared } = state  {};
  if (bgm && typeof bgm.pause === "function") bgm.pause();
  if (typeof setStatus === "function") {
    setStatus("✨ 特殊エンディング！敵を全滅させ、佐渡を鎮めました！");
  }
  if (endingRef) endingRef.value = "special";
  if (typeof setGameCleared === "function") setGameCleared(true);
}

// 次のマップへ進む処理
export function nextMap(state) {
  const { MAPS, currentMapIndexRef, setStatus, reloadMap } = state;

  if (currentMapIndexRef.value + 1 < MAPS.length) {
    // 次マップへ
    currentMapIndexRef.value++;

    if (typeof reloadMap === "function") reloadMap();
    if (typeof setStatus === "function") {
      setStatus(🌍 マップ ${currentMapIndexRef.value + 1} に移動！);
    }
  } else {
    // 最終マップを超えた → ノーマルエンディングに移行
    triggerNormalEnding(state);
  }
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
