// script/ending.js
export function checkGoal(GRID, x, y) {
  return GRID[y][x] === 'G';
}

export function nextMap(state) {
  const { MAPS, currentMapIndexRef, setStatus, reloadMap } = state;
  if (currentMapIndexRef.value + 1 < MAPS.length) {
    currentMapIndexRef.value++;
    if (typeof reloadMap === 'function') reloadMap();
    if (typeof setStatus === 'function') {
      setStatus(`🌍 マップ ${currentMapIndexRef.value + 1} に移動！`);
    }
  } else {
    if (typeof setStatus === 'function') setStatus('🎉 全マップクリア！');
  }
}

export function checkGameOver(player, setStatus) {
  if (player.hearts <= 0) {
    if (typeof setStatus === 'function') setStatus('💀 ゲームオーバー');
    return true;
  }
  return false;
}
