// script/ending.js

// ゴール判定
export function checkGoal(GRID, x, y) {
  return GRID[y][x] === "G";
}

// ノーマルエンディング
export function triggerNormalEnding(state) {
  const { setStatus, bgm, endingRef } = state;
  if (bgm) bgm.pause();
  if (typeof setStatus === "function") setStatus("🎉 ノーマルエンディング！");
  endingRef.value = "normal";
}

// 特殊エンディング
export function triggerSpecialEnding(state) {
  const { setStatus, bgm, endingRef } = state;
  if (bgm) bgm.pause();
  if (typeof setStatus === "function") {
    setStatus("✨ 特殊エンディング！敵を全滅させ、佐渡を鎮めました！");
  }
  endingRef.value = "special";
}

// マップ進行（最終マップではエンディング分岐）
export function nextMap(state) {
  const { MAPS, currentMapIndexRef, setStatus, reloadMap, allEnemiesClearedRef } = state;

  // まだ次のマップがある場合
  if (currentMapIndexRef.get() + 1 < MAPS.length) {
    currentMapIndexRef.set(currentMapIndexRef.get() + 1);
    if (typeof reloadMap === "function") reloadMap(currentMapIndexRef.get());
    if (typeof setStatus === "function") {
      setStatus(`🌍 マップ ${currentMapIndexRef.get() + 1} に移動！`);
    }
  } else {
    // 最終マップの場合 → 敵全滅フラグで分岐
    if (allEnemiesClearedRef && allEnemiesClearedRef.value) {
      triggerSpecialEnding(state);
    } else {
      triggerNormalEnding(state);
    }
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
