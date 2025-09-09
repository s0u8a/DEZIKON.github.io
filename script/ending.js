// script/ending.js

// ゴールタイル判定
export function checkGoal(GRID, x, y) {
  return GRID[y][x] === "G";
}

// ノーマルエンディング発動
export function triggerNormalEnding(state) {
  const { setStatus, bgm, endingRef } = state;
  if (bgm) bgm.pause();
  if (typeof setStatus === "function") setStatus("🎉 全マップクリア！！");
  endingRef.value = "normal"; // ノーマルエンディング
}

// 特殊エンディング発動
export function triggerSpecialEnding(state) {
  const { setStatus, bgm, endingRef } = state;
  if (bgm) bgm.pause();
  if (typeof setStatus === "function") setStatus("🎉 敵を全滅させ、佐渡を鎮めました！");
  endingRef.value = "special"; // 特殊エンディング
}

// マップ移動処理
export function nextMap(state) {
  const { MAPS, currentMapIndexRef, setStatus, reloadMap } = state;

  if (currentMapIndexRef.value + 1 < MAPS.length) {
    currentMapIndexRef.value++;
    if (typeof reloadMap === "function") reloadMap();
    if (typeof setStatus === "function") {
      setStatus(`🌍 マップ ${currentMapIndexRef.value + 1} に移動！`);
    }
  } else {
    // 最終マップを超えた → ノーマルエンディング
    triggerNormalEnding(state);
  }
}

// ゲームオーバー判定
export function checkGameOver(player, setStatus) {
  if (player.hearts <= 0) {
    if (typeof setStatus === "function") setStatus("💀 ゲームオーバー");
    return true;
  }
  return false;
}
