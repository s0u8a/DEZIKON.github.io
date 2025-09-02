// script/main.js
(function(){
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // シーン（今は field だけ。将来 quiz/minigame 追加想定）
  let scene = "field";

  // ステージ順
  const ORDER = ["tanbo", "shinano", "sado", "hanabi"];
  let stageIndex = 0;

  function loadCurrentStage(){
    const id = ORDER[stageIndex];
    MapManager.loadStage(id);
    Player.initAtStart();
    UI.setStageName(MapManager.state.stage.name);
    UI.message("移動してみよう。G にたどり着けば次のエリアへ！");
    draw();
  }

  // 初期化
  Player.loadSprite();
  UI.setHP(Player.P.hp);
  loadCurrentStage();

  // 入力
  window.addEventListener("keydown", e=>{
    if (scene !== "field") return;

    let dx=0, dy=0, handled=true;
    if (e.key === "ArrowUp") dy=-1;
    else if (e.key === "ArrowDown") dy=1;
    else if (e.key === "ArrowLeft") dx=-1;
    else if (e.key === "ArrowRight") dx=1;
    else handled=false;

    if (!handled) return;

    e.preventDefault();
    if (Player.move(dx,dy)) {
      draw();

      // タイルイベント
      const ev = Enemy.onEnterTile(Player.P.x, Player.P.y);
      if (!ev) { UI.message(""); return; }

      if (ev.type === "enemy") {
        UI.message("👹 敵に遭遇！クイズ（or ミニゲーム）開始予定。HP -1");
        Player.P.hp = Math.max(0, Player.P.hp - 1);
        UI.setHP(Player.P.hp);
        MapManager.clearTile(Player.P.x, Player.P.y); // その場のEを消す（再遭遇防止）
        if (Player.P.hp === 0){
          UI.message("😵 倒れてしまった… 田んぼに戻る");
          setTimeout(()=> loadCurrentStage(), 600);
        }
      } else if (ev.type === "item") {
        UI.message("🎁 アイテムを見つけた！HP +1");
        Player.P.hp = Math.min(5, Player.P.hp + 1);
        UI.setHP(Player.P.hp);
        MapManager.clearTile(Player.P.x, Player.P.y);
      } else if (ev.type === "ally") {
        UI.message("🤝 味方に会った！次の戦いが少し楽に（演出予定）");
        MapManager.clearTile(Player.P.x, Player.P.y);
      } else if (ev.type === "goal") {
        UI.message("➡ 次のエリアへ移動中…");
        nextStage();
      }
    }
  });

  function nextStage(){
    stageIndex++;
    if (stageIndex >= ORDER.length){
      scene = "ending";
      Ending.onGameClear();
    } else {
      loadCurrentStage();
    }
  }

  // 描画
  function draw(){
    MapManager.draw(ctx, canvas);
    Player.draw(ctx);
  }
}();
