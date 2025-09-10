うさぎ
bright_kitten_72388
オンライン状態を隠す

うさぎ — 2025/05/16 22:32
コア機能・詳細
音ゲーシステム

直感的なタップ操作（2レーン〜4レーン切替可）

難易度選択／オート演奏あり

オリジナル楽曲＋美少女たちのボーカル曲多数収録

キャラクター育成・交流要素

絆ポイントで解放されるボイス・イラスト・エピソード

お気に入りキャラにアイテムをプレゼントして好感度UP

フルボイスストーリーモード

豪華声優陣による演技

演奏スコアでルート分岐、マルチエンディング対応

イベント／ガチャ機能

毎月キャラ別楽曲イベントを開催

新キャラはガチャで入手、衣装や演出も変化

ターゲットユーザー
音ゲー初心者～中級者

美少女ゲーム、キャラクター育成が好きなユーザー

音楽×ストーリーで没入したい層

「推し」との没入感を求める10〜30代

解決する課題
単なる音ゲーに飽きたユーザーに「物語性」を加えてリテンションを高める

推しキャラと深く交流できる体験で、課金率・継続率を向上

音ゲー未経験層でも入りやすい難易度設計で裾野を広げる

開発ツール・技術
使用言語：Unity (C#), Firebase, TypeScript（Web管理画面）

リズム解析：自動ノーツ生成アルゴリズム

バックエンド：Google Cloud Functions / Firestore

開発環境：Unity Hub, GitHub, Trello, Figma（UI設計）
うさぎ — 2025/06/19 15:30
画像
画像
画像
画像
うさぎ — 2025/06/24 14:07
https://chatgpt.com/share/685a328b-d050-8006-8f87-526ee2864b34
ChatGPT
ChatGPT - WEBサーバ構築手順
Shared via ChatGPT
画像
うさぎ — 2025/08/26 23:38
アニメスタイルの少年キャラクター。白くてくしゃくしゃの髪、鋭く冷たい青い目を持つ。服装は黒のパーカーに変更されており、その下にはベストシャツを着ている。スタイリッシュで少し反抗的な印象を与える。マントは無し。片手に銀色の剣を構え、自信に満ちたポーズを取っている。背景はひび割れた荒れ地と瓦礫が広がり、風が吹き荒れるダークファンタジー風の世界。全体はフルカラーで、高コントラスト、スタイリッシュかつ迫力のあるアニメアート。文豪ストレイドッグスやダークファンタジー作品にインスパイアされたビジュアル。
20代前半の白髪で紫の目の青年で、冷静沈着かつ感情をあまり表に出さない性格を持つ。常に状況を俯瞰して判断する思慮深い人物であり、都会の喧騒の中でも静かに存在感を放つミステリアスな雰囲気を纏っている。服装は落ち着いた色合いで統一されており、白と黒の格子柄の大きなマフラーを首に巻き、緑と白のダイヤ柄が入ったセーターの上に黒いベストを羽織っている。細身の黒いズボンと黒いブーツを身に着け、右手首には銀色のブレスレットが輝く。全体的にモノトーンと深緑を基調とした配色で、控えめながらも印象的なスタイルをしている。
うさぎ — 2025/08/27 18:39
4146931505096951
うさぎ — 2025/08/29 17:53
// index.js
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
展開
message.txt
15 KB
うさぎ — 2025/09/03 15:20
// -----------------------------
// 定数・初期設定
// -----------------------------
let TILE = window.GMAP?.tile ?? 64;
let GRID = window.GMAP?.grid ?? [];
let ROWS = GRID.length;
展開
message.txt
7 KB
うさぎ — 2025/09/04 10:48
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<link rel="stylesheet" href="./css/style.css" />
<title>🌾 新潟RPG デモ版</title>
</head>
<body>
<h1>🌸 新潟RPG デモ版</h1>
<p>矢印キーで移動できます。敵にぶつかるとクイズが出ます。</p>
 
  <canvas id="gameCanvas"></canvas>
<div id="status" aria-live="polite"></div>
 
  <!-- 非モジュール。必ず map.js → main.js の順で、両方とも defer -->
<script src="script/map.js" defer></script>
<script src="script/main.js" defer></script>
 
</body>
</html>
// script/map.js
// 20列 × 15行 マップ
window.GMAP = {
  tile: 64,
  grid: [
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
    ['#','S','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','E','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','#','#','#','#','#','0','#','#','#','#','#','#','#','0','#','#','#','#'],
    ['#','0','#','0','0','0','#','0','#','0','0','0','#','0','#','0','0','0','#','#'],
    ['#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','0','0','0','0','0','0','0','0','I','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','0','#','#'],
    ['#','0','0','0','0','0','0','0','A','0','0','0','0','0','0','0','0','0','G','#'],
    ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
  ]
};
// -----------------------------
// 定数・初期設定
// -----------------------------
let TILE = window.GMAP?.tile ?? 64;
let GRID = window.GMAP?.grid ?? [];
let ROWS = GRID.length;
展開
message.txt
8 KB
body {
  font-family: sans-serif;
  background: #222;
  color: #fff;
  text-align: center;
}

#game {
  display: inline-block;
  margin-top: 20px;
}

.row {
  display: flex;
}

.tile {
  width: 64px;   /* TILE に合わせる /
  height: 64px;
  border: 1px solid #333;
  background-size: cover;  / 画像を枠いっぱいに敷き詰める /
}

/ タイルごとに画像を割り当て */
.tile.floor  { background-image: url("./assets/images/tanbo.png"); }
.tile.wall   { background-image: url("./assets/images/wall.png"); }
.tile.player { background-image: url("./assets/images/noumin.png"); }
.tile.enemy  { background-image: url("./assets/images/enemy.png"); }
.tile.item   { background-image: url("./assets/images/item.png"); }
.tile.ally   { background-image: url("./assets/images/ally.png"); }
.tile.goal   { background-image: url("./assets/images/goal.png"); }
うさぎ — 2025/09/04 12:29
画像
うさぎ — 11:34
import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy, enemies } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js";          // 🐸 カエル用
import { startNiigataHardQuiz } from "./startNiigataHardQuiz.js"; // 🦝 アライグマ用

// 🎮 キャンバス設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// 📢 メッセージ表示
const statusEl = document.getElementById("messageBox");
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 🎵 BGM
const bgm = document.getElementById("bgm");

// 🎨 画像管理
const images = {
  floor: new Image(),
  wall: new Image(),
  wallSpecial: new Image(),
  enemy: new Image(),
  enemy2: new Image(),
  enemy3: new Image(), // アライグマ
  item: new Image(),
  ally: new Image(),
  allyFishing: new Image(),
  goal: new Image(),
  goalEntrance: new Image(),
  entrance: new Image(),
  mahouzin: new Image(),
  floorSpecial: new Image(),
  pl: new Image(),
  heart: new Image(),
  bridge: new Image(),
  tree: new Image(),
  clear: new Image(),
  over: new Image(),
  sadometu: new Image()
};

// 🖼 画像読み込み
images.floor.src = "./assets/images/tanbo3.png";
images.wall.src = "./assets/images/mizu_big.png";
images.wallSpecial.src = "./assets/images/isikabe.png";
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png";
images.enemy3.src = "./assets/images/araiguma.png"; // 🦝 アライグマ
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.allyFishing.src = "./assets/images/turibito.png";
images.goal.src = "./assets/images/kakasi2.png";
images.goalEntrance.src = "./assets/images/koudouiriguti.png";
images.entrance.src = "./assets/images/kintin.png";
images.mahouzin.src = "./assets/images/mahouzin.png";
images.floorSpecial.src = "./assets/images/tikakoudouyuka.png";
images.pl.src = "./assets/images/noumin.png";
images.heart.src = "./assets/images/ha-to.png";
images.bridge.src = "./assets/images/hasihasii.png";
images.tree.src = "./assets/images/kinokabe.png";
images.clear.src = "./assets/images/clear.png";
images.over.src = "./assets/images/over.png";
images.sadometu.src = "./assets/images/sadometu.png";

// 🌍 ゲーム状態
let currentMapIndex = 0;
let map = maps[currentMapIndex].map(row => [...row]);
let nearAlly = false;
let nearFishingAlly = false;
let gameCleared = false;
let gameOver = false;

// 🖼 キャンバスリサイズ
const dpr = window.devicePixelRatio || 1;
function resizeCanvas() {
  canvas.width = map[0].length * tile * dpr;
  canvas.height = map.length * tile * dpr;
  canvas.style.width = map[0].length * tile + "px";
  canvas.style.height = map.length * tile + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();

// 🚶 移動可能判定
function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  const cell = map[y][x];
  return cell !== "#" && cell !== "T" && cell !== "W" && cell !== "N";
}

// ▶ プレイヤー初期化
... （残り 270 行）
折りたたみ
message.txt
13 KB
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
﻿
import { maps, tile } from "./map.js";
import { player, initPlayer, takeDamage, updatePlayer, drawLifeGauge, heal } from "./player.js";
import { initEnemies, updateEnemies, drawEnemies, removeEnemy, enemies } from "./enemy.js";
import { checkGoal, checkGameOver } from "./ending.js";
import { startEggGame } from "./eggGame.js";
import { startFishingGame } from "./fishingGame.js";
import { startNiigataQuiz } from "./niigataquiz.js";          // 🐸 カエル用
import { startNiigataHardQuiz } from "./startNiigataHardQuiz.js"; // 🦝 アライグマ用

// 🎮 キャンバス設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// 📢 メッセージ表示
const statusEl = document.getElementById("messageBox");
function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
  console.log(msg);
}

// 🎵 BGM
const bgm = document.getElementById("bgm");

// 🎨 画像管理
const images = {
  floor: new Image(),
  wall: new Image(),
  wallSpecial: new Image(),
  enemy: new Image(),
  enemy2: new Image(),
  enemy3: new Image(), // アライグマ
  item: new Image(),
  ally: new Image(),
  allyFishing: new Image(),
  goal: new Image(),
  goalEntrance: new Image(),
  entrance: new Image(),
  mahouzin: new Image(),
  floorSpecial: new Image(),
  pl: new Image(),
  heart: new Image(),
  bridge: new Image(),
  tree: new Image(),
  clear: new Image(),
  over: new Image(),
  sadometu: new Image()
};

// 🖼 画像読み込み
images.floor.src = "./assets/images/tanbo3.png";
images.wall.src = "./assets/images/mizu_big.png";
images.wallSpecial.src = "./assets/images/isikabe.png";
images.enemy.src = "./assets/images/enemy.png";
images.enemy2.src = "./assets/images/kaeru.png";
images.enemy3.src = "./assets/images/araiguma.png"; // 🦝 アライグマ
images.item.src = "./assets/images/komebukuro.png";
images.ally.src = "./assets/images/murabitopng.png";
images.allyFishing.src = "./assets/images/turibito.png";
images.goal.src = "./assets/images/kakasi2.png";
images.goalEntrance.src = "./assets/images/koudouiriguti.png";
images.entrance.src = "./assets/images/kintin.png";
images.mahouzin.src = "./assets/images/mahouzin.png";
images.floorSpecial.src = "./assets/images/tikakoudouyuka.png";
images.pl.src = "./assets/images/noumin.png";
images.heart.src = "./assets/images/ha-to.png";
images.bridge.src = "./assets/images/hasihasii.png";
images.tree.src = "./assets/images/kinokabe.png";
images.clear.src = "./assets/images/clear.png";
images.over.src = "./assets/images/over.png";
images.sadometu.src = "./assets/images/sadometu.png";

// 🌍 ゲーム状態
let currentMapIndex = 0;
let map = maps[currentMapIndex].map(row => [...row]);
let nearAlly = false;
let nearFishingAlly = false;
let gameCleared = false;
let gameOver = false;

// 🖼 キャンバスリサイズ
const dpr = window.devicePixelRatio || 1;
function resizeCanvas() {
  canvas.width = map[0].length * tile * dpr;
  canvas.height = map.length * tile * dpr;
  canvas.style.width = map[0].length * tile + "px";
  canvas.style.height = map.length * tile + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();

// 🚶 移動可能判定
function walkable(x, y) {
  if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
  const cell = map[y][x];
  return cell !== "#" && cell !== "T" && cell !== "W" && cell !== "N";
}

// ▶ プレイヤー初期化
function resetPlayer() {
  initPlayer(map);
  player.hearts = player.maxHearts;
  player.invincibleTime = 0;
}

// ➡ 次マップへ
function nextMap() {
  if (currentMapIndex + 1 >= maps.length) {
    setStatus("🎉 全クリア！！");
    if (bgm) bgm.pause();
    gameCleared = true;
    return;
  }

  currentMapIndex++;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();

  // マップごとの専用メッセージ
  switch (currentMapIndex) {
    case 0:
      setStatus("🌾 マップ1：田んぼエリアに到着！");
      break;
    case 1:
      setStatus("🌊 マップ2：信濃川の流域に突入！");
      break;
    case 2:
      setStatus("🏔 マップ3：山間部の里に入った！");
      break;
    case 3:
      setStatus("⛏ マップ4：佐渡金山の地下坑道に潜入！");
      break;
    default:
      setStatus(`➡ マップ${currentMapIndex + 1} へ進んだ！`);
  }
}

// 👤 プレイヤーが立っているタイル判定
function onTile(x, y) {
  const cell = map[y][x];
  nearAlly = cell === "A";
  nearFishingAlly = cell === "S";

  if (nearAlly) setStatus("🤝 村人がいる！Enterで話しかけてください");
  if (nearFishingAlly) setStatus("🎣 釣り好きの村人がいる！Enterで話しかけてください");
}

// 🆕 敵全滅チェック
function checkAllEnemiesCleared() {
  if (currentMapIndex === 3 && enemies.length === 0 && !gameCleared && !gameOver) {
    setStatus("🎉 敵を全滅させ、佐渡を鎮めました！");
    if (bgm) bgm.pause();
    gameCleared = true;
  }
}

// ⌨️ キー操作
document.addEventListener("keydown", (e) => {
  if (gameCleared || gameOver) return;

  let nx = player.x, ny = player.y;
  if (e.key === "ArrowUp") ny--;
  else if (e.key === "ArrowDown") ny++;
  else if (e.key === "ArrowLeft") nx--;
  else if (e.key === "ArrowRight") nx++;
  else if (e.key === "Enter" && nearAlly) {
    setStatus("💬 村人『田んぼを荒らすジャンボタニシの卵をつぶしてくれ！』");
    setTimeout(() => {
      startEggGame((score) => {
        if (score >= 10) heal(1, setStatus);
        setStatus(score >= 10 ? `🥚 卵を大量につぶした！HP回復！` : `🥚 卵つぶしスコア: ${score}`);
      });
      map[player.y][player.x] = "0";
      nearAlly = false;
    }, 1500);
    return;
  }
  else if (e.key === "Enter" && nearFishingAlly) {
    setStatus("💬 村人『信濃川の外来魚を釣って退治してくれ！』");
    setTimeout(() => {
      startFishingGame((score) => {
        if (score >= 10) heal(1, setStatus);
        else if (score <= 0) takeDamage(1, setStatus);
        setStatus(score >= 10 ? `🐟 ブラックバスを ${score} 匹釣った！HP回復！`
                  : score <= 0 ? `❌ ブラックバスが少なすぎる…外道ばかり！HP減少`
                  : `🎣 釣果: ブラックバス ${score}匹`);
      });
      map[player.y][player.x] = "0";
      nearFishingAlly = false;
    }, 1500);
    return;
  } else return;

  if (walkable(nx, ny)) {
    player.x = nx;
    player.y = ny;

    if (checkGoal(map, player.x, player.y)) {
      setStatus("🏁 ゴール！");
      nextMap();
      return; // ✅ ここで終了しないと同じマップで再処理される
    }
    onTile(nx, ny);

    if (map[player.y][player.x] === "I") {
      heal(1, setStatus);
      setStatus("🍙 アイテムを取った！HP回復！");
      map[player.y][player.x] = "0";
    }
  }

  // 敵との接触処理
 updateEnemies(walkable, player, (amt, enemyIndex, type) => {
  if (type === "normal") {
    takeDamage(amt, setStatus);
    removeEnemy(enemyIndex);
  } else if (type === "frog") {
    setStatus("🐸 カエルに遭遇！新潟クイズに挑戦！");
    startNiigataQuiz((correct) => {
      if (correct) heal(1, setStatus);
      else takeDamage(1, setStatus);
      setStatus(correct ? "⭕ 正解！HP回復！" : "❌ 不正解！HP減少");
      removeEnemy(enemyIndex);
      checkAllEnemiesCleared();
    });
  } else if (type === "araiteki") {
    setStatus("🦝 アライグマに遭遇！高難易度クイズに挑戦！");
    startNiigataHardQuiz((correct) => {
      if (correct) heal(1, setStatus);
      else takeDamage(1, setStatus);
      setStatus(correct ? "⭕ 正解！HP回復！" : "❌ 不正解！HP減少");
      removeEnemy(enemyIndex);
      checkAllEnemiesCleared();
    });
  }
  checkAllEnemiesCleared();
});

  if (checkGameOver(player, setStatus)) {
    if (bgm) bgm.pause();
    gameOver = true;
    return;
  }
});

// ▶ リスタート処理
function restartGame() {
  currentMapIndex = 0;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();
  setStatus("🔄 ゲーム再スタート！");
  gameCleared = false;
  gameOver = false;
  if (bgm) {
    bgm.currentTime = 0;
    bgm.play().catch(()=>{});
  }
  draw();
}

// 🎨 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameCleared) {
    ctx.drawImage(images.sadometu, 0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("🎉 ゲームクリア！", canvas.width / dpr / 2, 50);
    return;
  }

  if (gameOver) {
    ctx.drawImage(images.over, 0, 0, canvas.width / dpr, canvas.height / dpr);
    const btnW = 200, btnH = 50;
    const btnX = (canvas.width / dpr - btnW) / 2;
    const btnY = canvas.height / dpr * 0.7;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.fillStyle = "#fff";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Restart", btnX + btnW/2, btnY + 32);
    return;
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const dx = x * tile;
      const dy = y * tile;
      const cell = map[y][x];

     // 🆕 床の切り替え（K,X,E）
      if (cell === "K") {
        ctx.drawImage(images.floorSpecial, dx, dy, tile, tile); // 地下通路床
      } else if (cell === "X") {
        ctx.drawImage(images.floorSpecial, dx, dy, tile, tile);
      } else if (cell === "W") {
        // 🐟 魚のいるマスの床は水面に変更
        ctx.drawImage(images.wall, dx, dy, tile, tile); 
      } else {
        ctx.drawImage(images.floor, dx, dy, tile, tile);
      }
      
      if (cell === "#") ctx.drawImage(images.wall, dx, dy, tile, tile);
      if (cell === "W") ctx.drawImage(images.wallSpecial, dx, dy, tile, tile);
      if (cell === "I") ctx.drawImage(images.item, dx, dy, tile, tile);
      if (cell === "A") ctx.drawImage(images.ally, dx, dy, tile, tile);
      if (cell === "S") ctx.drawImage(images.allyFishing, dx, dy, tile, tile);
      if (cell === "G") {
        if (currentMapIndex === 3) ctx.drawImage(images.mahouzin, dx, dy, tile, tile);
        else ctx.drawImage(images.goal, dx, dy, tile, tile);
      }
      if (cell === "E") ctx.drawImage(images.enemy, dx, dy, tile, tile);
      if (cell === "F") ctx.drawImage(images.enemy2, dx, dy, tile, tile);
      if (cell === "H") ctx.drawImage(images.enemy3, dx, dy, tile, tile); // 🦝 アライグマ
      if (cell === "B") ctx.drawImage(images.bridge, dx, dy, tile, tile);
      if (cell === "T") ctx.drawImage(images.tree, dx, dy, tile, tile);
      if (cell === "M") ctx.drawImage(images.mahouzin, dx, dy, tile, tile);
      if (cell === "N") ctx.drawImage(images.entrance, dx, dy, tile, tile);
      if (cell === "O") ctx.drawImage(images.goalEntrance, dx, dy, tile, tile);
    }
  }

  drawEnemies(ctx, images.enemy, images.enemy2, images.enemy3, tile, 0, 0, map[0].length * tile, map.length * tile);
  ctx.drawImage(images.pl, player.x * tile, player.y * tile, tile, tile);
  drawLifeGauge(ctx, images.heart, tile, player);

  updatePlayer();
  requestAnimationFrame(draw);
}

// 🖱 Restart ボタン処理
canvas.addEventListener("click", (e) => {
  if (!gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * dpr;
  const y = (e.clientY - rect.top) * dpr;
  const btnW = 200, btnH = 50;
  const btnX = (canvas.width / dpr - btnW) / 2 * dpr;
  const btnY = canvas.height * 0.7;
  if (x >= btnX && x <= btnX+btnW*dpr && y >= btnY && y <= btnY+btnH*dpr) {
    restartGame();
  }
});

// ▶ ゲーム開始
window.startGame = function () {
  currentMapIndex = 0;
  map = maps[currentMapIndex].map(row => [...row]);
  resetPlayer();
  initEnemies(map);
  resizeCanvas();

  // ゲーム開始専用メッセージ
  setStatus("🌾 マップ1：田んぼエリアに到着！");

  if (bgm) {
    bgm.volume = 0.5;
    bgm.play().catch(err => console.log("BGM再生エラー:", err));
  }
  draw();
};
