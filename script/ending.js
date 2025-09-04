// script/ending.js
window.checkGoal = function checkGoal(GRID, x, y) {
  return GRID[y][x] === 'G';
};

window.nextMap = function nextMap(state) {
  const { MAPS, currentMapIndexRef } = state;
  if (currentMapIndexRef.value + 1 < MAPS.length) {
    currentMapIndexRef.value++;
    if (typeof state.reloadMap === 'function') state.reloadMap();
    if (typeof window.setStatus === 'function') {
      setStatus(`🌍 マップ ${currentMapIndexRef.value + 1} に移動！`);
    }
  } else {
    if (typeof window.setStatus === 'function') setStatus('🎉 全マップクリア！');
    // ここでエンディング演出などを入れてもOK
  }
};

window.checkGameOver = function checkGameOver() {
  if (player.hearts <= 0) {
    if (typeof window.setStatus === 'function') setStatus('💀 ゲームオーバー');
    return true;
  }
  return false;
};

