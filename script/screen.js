// script/screen.js
export function hideRPG() {
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("messageBox").style.display = "none";
}

export function showRPG() {
  document.getElementById("gameCanvas").style.display = "block";
  document.getElementById("messageBox").style.display = "block";
}
