
var start = false;
var floor = 0;
var h, w;
const span = document.getElementsByClassName("maze_storage");

const F1_maze = new Array(11); //1階
const F2_maze = new Array(11); //2階
const F3_maze = new Array(11); //3階
const F4_maze = new Array(11); //4階
const F5_maze = new Array(11); //5階

window.onload = function () {
  which_maze(); //　迷路のセッティング
}

// ｜ボタン操作ほか------------ ｜
// 「スタート」ボタン
function on_start() {
  start = true;
  delete_Byid("start"); // スタートボタンの除去

  span[0].style.display = "block"; // 迷路の画面表示
  GameStart();
  window.header_func.start_animation();
  window.header_func.countdown(90);
}
// ゲーム終了時
function GameEnd() {
  console.log("Finish");
  window.header_func.timeUp_animation();

  start = false;
  document.getElementById("jungle").className += " finish"; // ゲーム画面をモノクロに
  block_Byid("finish");// メニュー画面移行のボタン
}

// 「メニューに戻る」ボタン
function on_finish() {
  delete_Byid("finish"); // メニューボタンの除去
  block_Byid("start"); // スタートボタン
  span[0].style.display = "none"; //jungle の 非表示
  document.getElementById("jungle").className = "center"; //ゲーム画面のモノクロをカラーに
  window.right_func.reset();
  window.header_func.reset();
}

// ｜------------ ボタン操作ほか｜


function delete_Byid(id_name) {
  const none = document.getElementById(id_name);
  none.style.display = "none";
}
function block_Byid(id_name) {
  const block = document.getElementById(id_name);
  block.style.display = "block";
}
function delete_ByTag(Tag_name) {
  const none = document.getElementsByTagName(Tag_name);
  for (var i = 0; i < none.length; i++)  none[i].style.display = "none";
}
function block_ByTag(Tag_name) {
  const block = document.getElementsByTagName(Tag_name);
  for (var i = 0; i < block.length; i++) block[i].style.display = "block";
}


// ------------ 移動 ---------------

// [https://1-notes.com/javascript-addeventlistener-key-ivent/]
document.addEventListener("keydown", keydown_ivent);

function keydown_ivent(e) {
  if (start) {
    switch (e.key) {
      case 'ArrowUp':
        transmit(0);
        break;
      case 'ArrowDown':
        transmit(2);
        break;
      case 'ArrowLeft':
        transmit(1);
        break;
      case 'ArrowRight':
        transmit(3);
        break;
      case "Enter":
        next_floor();
        break;
      case " ":
        back_floor();
        break;
    }
  }
}

function transmit(dir) {
  if (dir % 2 == 0) {
    const confirm_w = document.getElementById("_" + String(h + (dir - 1)) + String(w)); // 移動先が壁に阻まれているか
    if (!~confirm_w.className.indexOf("wall")) {
      const was = document.getElementById("_" + String(h) + String(w));
      was.innerText = "";
      const is = document.getElementById("_" + String(h + (dir - 1) * 2) + String(w));
      is.innerText = "◉";
      h = h + (dir - 1) * 2;
    }
  } else {
    const confirm_w = document.getElementById("_" + String(h) + String(w + (dir - 2))); // 移動先が壁に阻まれているか
    if (!~confirm_w.className.indexOf("wall")) {
      const was = document.getElementById("_" + String(h) + String(w));
      was.innerText = "";
      const is = document.getElementById("_" + String(h) + String(w + (dir - 2) * 2));
      is.innerText = "◉";
      w = w + (dir - 2) * 2;
    }
  }
}

function next_floor() {
  var confirm = document.getElementById("_" + String(h) + String(w));
  if (floor == 5 && !~confirm.className.indexOf("jungle_open")) {
    confirm.className += " jungle_open";
    confirm.innerText = "";
    window.right_func.open(h, w);
    span[1].replaceChild(document.getElementsByClassName("jungle_floor")[0].cloneNode(true), span[1].lastChild);

    GameStart();
  }

  if (~confirm.className.indexOf("up")) { // [https://qiita.com/kazu56/items/557740f398e82fc881df]
    floor++;
    console.log("next", floor + "F");
    current_floor();
  }
}

function back_floor() {
  const confirm_w = document.getElementById("_" + String(h) + String(w));
  if (~confirm_w.className.indexOf("down")) {
    floor--;
    console.log("back", floor + "F");
    current_floor();
  }
}

// ------------------------------------

// 最初の１回だけ
function which_maze() {
  const mazes = [F1_maze, F2_maze, F3_maze, F4_maze, F5_maze];

  for (var i = 0; i < mazes.length; i++) {
    var p = get_Random(2); // 0 = make_Maze1, 1 = make_Maze2
    p += 1;

    if (i == 3) p = 4;
    else if (i == 4) p = 5;

    get_Mazes(mazes[i], p);
    if (p == 1) make_Maze1(mazes[i]);
    else if (p == 2) make_Maze2(mazes[i]);
    // else if (p == 3) make_Maze3(mazes[i]);
    else if (p == 4) make_Maze4(mazes[i]);
    else if (p == 5) make_Maze5(mazes[i]);
    floor_connection(mazes[i], i + 1);
    deliver_Maze(mazes[i], i + 1);
  }

  span[0].appendChild(document.getElementsByClassName("jungle_floor")[0].cloneNode(true));
}

// GameStart
function GameStart() {
  [h, w] = [get_Random(5) * 2 + 1, get_Random(5) * 2 + 1];
  floor = 1;
  current_floor();
  document.getElementById("_" + h + w).innerText = "◉";
}

//mazeの初期設定
function get_Mazes(maze, p) {

  for (let i = 0; i < 11; i++) {

    if (p == 1 || p == 4 || p == 5) {
      maze[i] = Array(11).fill("wall");
    }
    else if (i == 0 || i == 10) {
      maze[i] = Array(11).fill("wall");
    } else {
      maze[i] = [].concat(["wall"], Array(9).fill("road"), ["wall"]);
    }
    // else if (4 <= i && i <= 6) P1_maze[i] = [].concat(["wall"], Array(3).fill("road"), Array(3).fill("wall"), Array(3).fill("road"), ["wall"]);
  }
}

function get_Random(max) {
  return parseInt(Math.floor(Math.random() * max));
}

//ランダム棒倒し法_0
function make_Maze0(maze) {
  console.log(0);
  for (let h = 2; h <= 8; h += 2) {
    for (let w = 2; w <= 8; w += 2) {
      maze[h][w] = "wall";
      let r = get_Random(4);
      if (r % 2 == 0) {
        if (maze[h + r - 1][w] == "wall") r += 2;
        maze[h + r - 1][w] = "wall";
      } else {
        if (maze[h][w + r - 2] == "wall") r += 2;
        maze[h][w + r - 2] = "wall";
      }
    }
  }
  //floor_connection(maze);
}

//道伸ばし法_1
function make_Maze1(maze) {
  console.log(1);
  var y = get_Random(5) * 2 + 1;
  var x = get_Random(5) * 2 + 1;
  maze[y][x] = "road";
  let mas = 1;
  let roads = [[y, x]];

  //---------------------

  while (mas < 25) {
    let d = get_Random(4);
    if (d % 2 == 0) {
      y = y + (d - 1) * 2;
      if (y > 10 || y < 0) {
        const r = get_Random(mas);
        [x, y] = [roads[r][1], roads[r][0]];
      } else if (maze[y][x] == "wall") {
        maze[y - (d - 1)][x] = "road";
        maze[y][x] = "road";
        roads.push([y, x]);
        mas++;
      } else {
        const r = get_Random(mas);
        [x, y] = [roads[r][1], roads[r][0]];
      }
    } else {
      x = x + (d - 2) * 2;
      if (x > 10 || x < 0) {
        const r = get_Random(mas);
        [x, y] = [roads[r][1], roads[r][0]];
      } else if (maze[y][x] == "wall") {
        maze[y][x - (d - 2)] = "road";
        maze[y][x] = "road";
        roads.push([y, x]);
        mas++;
      } else {
        const r = get_Random(mas);
        [x, y] = [roads[r][1], roads[r][0]];
      }
    }
  }
  //floor_connection(maze);
}

//壁伸ばし法_2
function make_Maze2(maze) {
  console.log(2);

  let walls_yx = [];
  let walls_mas = 0;

  for (let y = 0; y <= 10; y += 2) {
    for (let x = 0; x <= 10; x += 2) {
      if (maze[y][x] == "wall") {
        walls_yx.push([y, x]);
      }
    }
  }

  walls_mas = walls_yx.length;

  //---------------
  var y, x;
  var r;

  [y, x] = walls_yx[get_Random(walls_mas)];

  while (walls_mas < 36) {
    let d = get_Random(4);
    if (d % 2 == 0) {
      y = y + (d - 1) * 2;
      if (y > 10 || y < 0) {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      } else if (maze[y][x] == "road") {
        maze[y - (d - 1)][x] = "wall";
        maze[y][x] = "wall";
        walls_yx.push([y, x]);
        walls_mas++;
      } else {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      }
    } else {
      x = x + (d - 2) * 2;
      if (x > 10 || x < 0) {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      } else if (maze[y][x] == "road") {
        maze[y][x - (d - 2)] = "wall";
        maze[y][x] = "wall";
        walls_yx.push([y, x]);
        walls_mas++;
      } else {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      }
    }
  }
  //floor_connection(maze);
}



//壁伸ばし法_3F
function make_Maze3(maze) {
  console.log(3);

  let walls_yx = [];
  let walls_mas = 0;

  for (let y = 0; y <= 10; y += 2) {
    for (let x = 0; x <= 10; x += 2) {
      if (maze[y][x] == "wall") {
        walls_yx.push([y, x]);
      }
    }
  }

  walls_mas = walls_yx.length;

  //---------------
  var y, x;
  var r;

  [y, x] = walls_yx[get_Random(walls_mas)];

  while (walls_mas < 36) {
    let d = get_Random(4);
    if (d % 2 == 0) {
      y = y + (d - 1) * 2;
      if (y > 10 || y < 0) {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      } else if (maze[y][x] == "road") {
        maze[y - (d - 1)][x] = "wall";
        maze[y][x] = "wall";
        walls_yx.push([y, x]);
        walls_mas++;
      } else {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      }
    } else {
      x = x + (d - 2) * 2;
      if (x > 10 || x < 0) {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      } else if (maze[y][x] == "road") {
        maze[y][x - (d - 2)] = "wall";
        maze[y][x] = "wall";
        walls_yx.push([y, x]);
        walls_mas++;
      } else {
        r = get_Random(walls_mas);
        [x, y] = [walls_yx[r][1], walls_yx[r][0]];
      }
    }
  }
}

//道伸ばし法_4F
function make_Maze4(maze) {
  console.log(4);

  const pass = 2;
  let roads_N = [glo_up[0]]; maze[glo_up[0][0]][glo_up[0][1]] = "road";
  let roads_S = [glo_up[1]]; maze[glo_up[1][0]][glo_up[1][1]] = "road";
  const roadss = [roads_N, roads_S];

  maze4_5F(maze, pass, roadss);
}

//道伸ばし法_5F
function make_Maze5(maze) {
  console.log(5);

  const pass = 4;
  let roads_n = [[1, 1]]; maze[1][1] = "road";
  let roads_e = [[1, 9]]; maze[1][9] = "road";
  let roads_w = [[9, 1]]; maze[9][1] = "road";
  let roads_s = [[9, 9]]; maze[9][9] = "road";
  const roadss = [roads_n, roads_e, roads_w, roads_s];

  maze4_5F(maze, pass, roadss);
}

// 4F 5F
function maze4_5F(maze, pass, roadss){
  var mas = pass; //道の数
  var news = get_Random(pass);
  var y = roadss[news][0][0];
  var x = roadss[news][0][1];

  // -----------
  var deadline = 0;
  while (mas < 25) {
    let d = get_Random(4); //0上, 2下, 1左, 3右

    if (d % 2 == 0) {
      if (y == 9) d = 0;
      if (y == 1) d = 2;
      y = y + (d - 1) * 2;

      if (maze[y][x] == "wall") {
        maze[y - (d - 1)][x] = "road";
        maze[y][x] = "road";
        roadss[news].push([y, x]);
        mas++;
      } else {
        news = (news + 1) % pass;
        const r = get_Random(roadss[news].length);
        [x, y] = [roadss[news][r][1], roadss[news][r][0]];
      }
    } else {
      if (x == 9) d = 1;
      if (x == 1) d = 3;
      x = x + (d - 2) * 2;

      if (maze[y][x] == "wall") {
        maze[y][x - (d - 2)] = "road";
        maze[y][x] = "road";
        roadss[news].push([y, x]);
        mas++;
      } else {
        news = (news + 1) % pass;
        const r = get_Random(roadss[news].length);
        [x, y] = [roadss[news][r][1], roadss[news][r][0]];
      }
    }
  }
}

// ------- floor connection --------
var A_1, A_2, B_1, B_2, AB_r;
var glo_up;

function floor_connection(maze, f) {

  if (2 <= f && f <= 4) {
    if (AB_r == 0) {
      maze[A_1][B_1] = "down";
      maze[A_2][B_2] = "down";
      // maze[A_1 + 1][B_1] = "road";
      // maze[A_2 - 1][B_2] = "road";
    } else {
      maze[A_1][B_2] = "down";
      maze[A_2][B_1] = "down";
      // maze[A_1 + 1][B_2] = "road";
      // maze[A_2 - 1][B_1] = "road";
    }
  } else if (f == 5) {
    maze[1][1] = "down";
    maze[1][9] = "down";
    maze[9][1] = "down";
    maze[9][9] = "down";
  }

  if (f == 4) {
    maze[1][1] = "up";
    maze[1][9] = "up";
    maze[9][1] = "up";
    maze[9][9] = "up";

  } else if (f == 5) {
    ;
  } else if (f == 3) {
    const a_1 = 3; (A_1 == a_1) ? A_1 += 2 : A_1 = a_1; // y:2-3
    const a_2 = 7; (A_2 == a_2) ? A_2 -= 2 : A_2 = a_2; // y:3-4

    const b_1 = 3; (B_1 == b_1) ? B_1 += 2 : B_1 = b_1; // x:2-3
    const b_2 = 7; (B_2 == b_2) ? B_2 -= 2 : B_2 = b_2; // x:3-4
    if ((A_1 == A_2) && (B_1 == B_2)) B_1 += 2;
    AB_r = get_Random(2);

    if (AB_r == 0) {
      maze[A_1][B_1] = "up";
      maze[A_2][B_2] = "up";

      glo_up = [[A_1, B_1], [A_2, B_2]];
      // maze[A_1 + 1][B_1] = "road";
      // maze[A_2 - 1][B_2] = "road";
    } else {
      maze[A_1][B_2] = "up";
      maze[A_2][B_1] = "up";

      glo_up = [[A_1, B_2], [A_2, B_1]];
      // maze[A_1 + 1][B_2] = "road";
      // maze[A_2 - 1][B_1] = "road";
    }
  } else {
    const a_1 = get_Random(2) * 2 + 1; (A_1 == a_1) ? A_1 += 2 : A_1 = a_1;
    const a_2 = (get_Random(2) + 3) * 2 + 1; (A_2 == a_2) ? A_2 -= 2 : A_2 = a_2;

    const b_1 = get_Random(2) * 2 + 1; (B_1 == b_1) ? B_1 += 2 : B_1 = b_1;
    const b_2 = (get_Random(2) + 3) * 2 + 1; (B_2 == b_2) ? B_2 -= 2 : B_2 = b_2;
    AB_r = get_Random(2);

    if (AB_r == 0) {
      maze[A_1][B_1] = "up";
      maze[A_2][B_2] = "up";
      // maze[A_1 + 1][B_1] = "road";
      // maze[A_2 - 1][B_2] = "road";
    } else {
      maze[A_1][B_2] = "up";
      maze[A_2][B_1] = "up";
      // maze[A_1 + 1][B_2] = "road";
      // maze[A_2 - 1][B_1] = "road";
    }
  }
}

// 納品
function deliver_Maze(maze, f) {
  const table = document.createElement("table");
  table.className = "jungle_floor center";
  table.setAttribute("id", "F" + String(f));

  for (let y = 0; y < 11; y++) {
    const tr = document.createElement("tr");
    for (let x = 0; x < 11; x++) {
      const td = document.createElement("td");
      td.setAttribute("id", "_" + String(y) + String(x));

      if (maze[y][x] == "road") td.className = "road";

      if (y % 2 == 0 || x % 2 == 0) {
        td.className = "flame";
      } else if (f == 5) {
        td.className += " jungle_squares";

        // FREEマス
        if (y == 5 && x == 5) create_FREE(y, x, td);
      }


      if (maze[y][x] == "wall") td.className += " wall";
      if (maze[y][x] == "up") td.className += " up";
      if (maze[y][x] == "down") td.className += " down";
      td.className += " jungle_td";

      tr.appendChild(td);
    }
    table.appendChild(tr);
    span[1].appendChild(table);
  }
}

// FREEマス
function create_FREE(y, x, td) {
  y = (y - 1) / 2;
  x = (x - 1) / 2;
  td.className += " FREE jungle_open";
  window.right_func.opened(y, x);
}

// reset
function jungle_reset(y, x) {
  y = y * 2 + 1;
  x = x * 2 + 1;

  const square = document.getElementById("_" + y + x);
  if (~square.className.indexOf("down")) square.className = "down jungle_squares jungle_td";
  else square.className = "road jungle_squares jungle_td";
}

function current_floor() {
  span[0].replaceChild(document.getElementsByClassName("jungle_floor")[floor].cloneNode(true), document.getElementsByClassName("jungle_floor")[0]);
  document.getElementById("_" + String(h) + String(w)).innerText = "◉";
  window.header_func.Re_floor(floor);
}

window.main_func = {};
window.main_func.GameEnd = GameEnd;
window.main_func.reset = jungle_reset;