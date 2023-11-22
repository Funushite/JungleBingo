let nums = new Array(5);
const bingo = ["B", "I", "N", "G", "O"];
const bingo_sheet = document.getElementById("bingo_sheet");

// BINGO_checker用
var opened_nums = [];
for (var i = 0; i < 5; i++) opened_nums[i] = Array(5).fill(false);

// --------

for (let i = 0; i < 5; i++) {
  nums[i] = [1 + 5 * i, 2 + 5 * i, 3 + 5 * i, 4 + 5 * i, 5 + 5 * i];
}

// setting
for (let y = 0; y < 5; y++) {
  const tr = document.createElement("tr");
  for (let x = 0; x < 5; x++) {
    const td = document.createElement("td");
    td.id = "_" + y + x + "_";
    (y == 2 && x == 2) ? td.className = "sheet_squares _FREE_ open" : td.className = "sheet_squares";
    (y == 2 && x == 2) ? td.innerHTML = "FREE" : td.innerHTML = String(nums[y][x]);
    tr.appendChild(td);
  }
  bingo_sheet.appendChild(tr);
}

// globalFunction
function open(y, x) {
  y = parseInt((y - 1) / 2);
  x = parseInt((x - 1) / 2);
  
  const td = document.getElementById("_" + y + x + "_");
  td.className += " open";
  console.log(y, x);

  pts_caluculate(10);
  opened(y, x);
  bingo_checker(y, x);
}

// 得点表示
const display_pts = document.getElementById("pts");
var total_pts = 0;
function pts_caluculate(add) {
  total_pts += add;
  display_pts.innerText = total_pts;
}

const opened = (y, x) => opened_nums[y][x] = true; // globalFunction

function bingo_checker(y, x) {
  var display = "open";
  const number = y*5 + x+1;
  console.log("open! " + number);

  // [https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every]
  // 横ビンゴ
  if (opened_nums[y].every((n) => n)) {
    console.log("BINGO");
    display += "BINGO";
    pts_caluculate(50);
  } else if (opened_nums[y].findIndex((b) => !b) == opened_nums[y].findLastIndex((b) => !b)) {
    console.log("リーチ");
    display += "リーチ";
  }

  // [https://teratail.com/questions/303032]
  // 縦ビンゴ
  const vertical = opened_nums.map(arr => arr[x]);
  if (vertical.every(n => n)) {
    console.log("BINGO");
    display += "BINGO";
    pts_caluculate(50);
  } else if (vertical.findIndex((b) => !b) == vertical.findLastIndex((b) => !b)) {
    console.log("リーチ");
    display += "リーチ";
  }

  if (y == x) display += bingo_d(0);
  if (y + x == 4) display += bingo_d(1);

  if (~display.indexOf("BINGO")) window.header_func.bingo_animation();
  else if (~display.indexOf("リーチ")) window.header_func.reach_animation();
  else if (~display.indexOf("open")) window.header_func.open_animation(number);
}

// 斜めビンゴ
function bingo_d(a) {
  var diagonal = [];
  if (a == 0) for (var i = 0; i < 5; i++) diagonal[i] = (opened_nums[i][i]);
  else if (a == 1) for (var i = 0; i < 5; i++) diagonal[i] = (opened_nums[i][4 - i]);

  console.log(diagonal);

  if (diagonal.every((n) => n)) {
    pts_caluculate(50);
    console.log("BINGO");
    return "BINGO";
  } else if (diagonal.findIndex((b) => !b) == diagonal.findLastIndex((b) => !b)) {
    console.log("リーチ");
    return "リーチ";
  }
}

function sheet_reset() {
  span[0].replaceChild(document.getElementsByClassName("jungle_floor")[5].cloneNode(true), span[0].firstChild);
  for (var i = 0; i < 25; i++) {
    const y = parseInt(i / 5);
    const x = i % 5;
    if (opened_nums[y][x]) {
      const square = document.getElementById("_" + y + x + "_");
      if (!~square.className.indexOf("_FREE_")) {
        square.className = "sheet_squares";
        opened_nums[y][x] = false;
        window.jungle_func.reset(y,x);
      }
    }
  }
  span[1].replaceChild(document.getElementsByClassName("jungle_floor")[0].cloneNode(true), span[1].lastChild);
  span[0].replaceChild(document.getElementsByClassName("jungle_floor")[1].cloneNode(true), span[0].firstChild);

  total_pts = 0;
  pts_caluculate(0);
}

window.sheet_func = {};
window.sheet_func.open = open;
window.sheet_func.opened = opened;
window.sheet_func.reset = sheet_reset;