// ゴール判定
export function checkGoal(GRID, x, y) {
  return GRID[y] && GRID[y][x] === "G";
}

// 次のマップへ進む処理
export function nextMap(state) {
  const { MAPS, currentMapIndexRef, setStatus, reloadMap } = state;

  // 次マップが存在する場合
  if (currentMapIndexRef.value + 1 < MAPS.length) {
    currentMapIndexRef.value++;

    if (typeof reloadMap === "function") {
      reloadMap();
    }

    if (typeof setStatus === "function") {
      setStatus(`🌍 マップ ${currentMapIndexRef.value + 1} に移動！`);
    }
  } else {
    // 最後のマップをクリアした場合
    if (typeof setStatus === "function") {
      setStatus("🎉 全マップクリア！");
    }
    // ここで currentMapIndexRef を進めない（ループ防止）
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
