// script/map.js
(function(){
  const TILE = 64;

  // ステージ定義（grid: 文字タイル）
  const STAGES = {
    tanbo: {
      name: "田んぼ",
      bg: "./assets/images/tanbo.png",
      grid: [
        "############",
        "#S0000000E0#",
        "#0##0000000#",
        "#0000##0000#",
        "#0000000000#",
        "#00I0000000#",
        "#000000E000#",
        "#000000000G#",
        "############",
        "############",
        "############",
        "############",
      ]
    },
    shinano: {
      name: "信濃川",
      bg: "./assets/images/tanbo2.png",
      grid: [
        "############",
        "#S000000000#",
        "#000##00000#",
        "#0000#00000#",
        "#0000#000E0#",
        "#0000#00000#",
        "#00I0#00000#",
        "#0000#0000G#",
        "############",
        "############",
        "############",
        "############",
      ]
    },
    sado: {
      name: "佐渡島",
      bg: "./assets/images/tanbo.png",
      grid: [
        "############",
        "#S000000000#",
        "#0E0#000000#",
        "#000#00I000#",
        "#000#000000#",
        "#000#000000#",
        "#000#000000#",
        "#000#0000G0#",
        "############",
        "############",
        "############",
        "############",
      ]
    },
    hanabi: {
      name: "花火会場（ラス）",
      bg: "./assets/images/tanbo2.png",
      grid: [
        "############",
        "#S000000000#",
        "#0000000000#",
        "#00000E0000#",
        "#0000000000#",
        "#0000000000#",
        "#0000I00000#",
        "#000000000G#",
        "############",
        "############",
        "############",
        "############",
      ]
    }
  };

  function toMatrix(arr){ return arr.map(r => r.split("")); }

  const state = {
    tile: TILE,
    stageId: "tanbo",
    stage: null,
    grid: null,
    bgImg: null,
    bgOK: false,
    cols: 0, rows: 0,
  };

  function loadStage(id){
    state.stageId = id;
    state.stage   = STAGES[id];
    state.grid    = toMatrix(state.stage.grid);
    state.rows    = state.grid.length;
    state.cols    = state.grid[0].length;

    state.bgImg = new Image();
    state.bgOK = false;
    state.bgImg.onload  = ()=> state.bgOK = true;
    state.bgImg.onerror = ()=> state.bgOK = false;
    state.bgImg.src = state.stage.bg;
  }

  function draw(ctx, canvas){
    // 背景
    if (state.bgOK) {
      ctx.drawImage(state.bgImg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#cfeec0";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    // 壁＆グリッド
    for (let y=0; y<state.rows; y++){
      for (let x=0; x<state.cols; x++){
        if (state.grid[y][x] === "#"){
          ctx.fillStyle="#556b2f";
          ctx.fillRect(x*TILE, y*TILE, TILE, TILE);
        }
        ctx.strokeStyle="rgba(0,0,0,.06)";
        ctx.strokeRect(x*TILE+.5, y*TILE+.5, TILE-1, TILE-1);
      }
    }
  }

  function getStart(){
    for (let y=0;y<state.rows;y++){
      for (let x=0;x<state.cols;x++){
        if (state.grid[y][x] === "S") return {x,y};
      }
    }
    return {x:1,y:1};
  }

  function isWalkable(x,y){
    return !(x<0||x>=state.cols||y<0||y>=state.rows) && state.grid[y][x] !== "#";
  }
  function getTile(x,y){
    if (x<0||x>=state.cols||y<0||y>=state.rows) return null;
    return state.grid[y][x];
  }
  function clearTile(x,y){ if(getTile(x,y)!==null){ state.grid[y][x]="0"; } }

  // 公開
  window.MapManager = {
    loadStage, draw, getStart, isWalkable, getTile, clearTile,
    TILE, STAGES, state
  };

  // 初期ステージ
  loadStage("tanbo");
})();


