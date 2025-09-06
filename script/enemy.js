// 敵データを保持
export let enemies = [];

/**
 * 敵を初期化
 * @param {Array} map - 現在のマップ
 */
export function initEnemies(map) {
  enemies = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      if (cell === "E" || cell === "F") {
        enemies.push({ x, y, type: cell }); // 🆕 type で敵の種類を保持
      }
    }
  }
}

/**
 * 敵の更新（プレイヤー接触判定）
 * @param {Function} walkable - 移動可能判定
 * @param {Object} player - プレイヤーデータ
 * @param {Function} onHit - 接触時のコールバック
 */
export function updateEnemies(walkable, player, onHit) {
  enemies.forEach((enemy, index) => {
    if (enemy.x === player.x && enemy.y === player.y) {
      // 🆕 敵の種類も渡す
      onHit(1, index, enemy.type);
    }
  });
}

/**
 * 敵の描画
 * @param {CanvasRenderingContext2D} ctx - Canvas描画コンテキスト
 * @param {HTMLImageElement} img - 通常敵の画像
 * @param {number} tile - タイルサイズ
 * @param {number} offsetX - 描画オフセットX
 * @param {number} offsetY - 描画オフセットY
 * @param {number} width - 描画範囲の幅
 * @param {number} height - 描画範囲の高さ
 */
export function drawEnemies(ctx, img, tile, offsetX, offsetY, width, height) {
  enemies.forEach((enemy) => {
    const dx = enemy.x * tile + offsetX;
    const dy = enemy.y * tile + offsetY;

    // 🆕 敵の種類ごとに描画
    if (enemy.type === "E") {
      ctx.drawImage(img, dx, dy, tile, tile);
    }
    // F の場合は draw() 側で別の画像（enemy2）を描いているからここは触らなくてもOK
  });
}

/**
 * 敵を削除
 * @param {number} index - 削除対象のインデックス
 */
export function removeEnemy(index) {
  enemies.splice(index, 1);
}
