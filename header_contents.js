window.header_func = {};

// | 現在のフロア ------ |
const floor_display = document.getElementById("floor").firstElementChild;
  // globalFunction
function Re_floor(floor){
  floor_display.innerText = floor + "F";
}
window.header_func.Re_floor = Re_floor;


// |------------------ |
// | アニメーション ---- |
var transf;
var opa;
var ani_interval;
var square;

// ゲーム開始
const start_trf = document.getElementById("start_ani").style;

function start_animation(){
  transf = -1;
  opa = 2;
  start_trf.transform = "scale(" + transf + "," + (transf/2+0.5) + ")";
  start_trf.opacity = opa;
  start_trf.display = "block";

  ani_interval = setInterval(start_transformation, 10);
}
window.header_func.start_animation = start_animation;

function start_transformation(){
  if (transf < 1){
    transf += 0.03;
    start_trf.transform = "scale(" + transf + "," + (transf/2+0.5) + ")";
  } else if (opa > -1){
    opa -= 0.02;
    start_trf.opacity = opa;
  } else {
    clearInterval(ani_interval);
    start_trf.display = "none";
  }
}
// ゲーム終了時
const timeUp_trf = document.getElementById("time-up_ani").style;
var large_small;

function timeUp_animation(){
  transf = -150;
  timeUp_trf.top = transf + "%";
  timeUp_trf.display = "block";

  large_small = true;

  ani_interval = setInterval(timeUp_transformation, 10);
}
window.header_func.timeUp_animation = timeUp_animation;

function timeUp_transformation(){
  if (transf < 30 && large_small){
    transf += 5;
    timeUp_trf.top = transf + "%";
  } else if (transf > 0){
    large_small = false;
    transf -= 5;
    timeUp_trf.top = transf + "%";
  } else {
    clearInterval(ani_interval);
  }
}

// ゲーム中
// オープン！
function open_animation(number){
  transf = 0;
  opa = 3;

  square = document.getElementById("ani_open");
  square.children[1].innerText = number;
  
  square = square.style;
  large_small = true;

  square.transform = "scale(" + transf + "," + transf + ")";

  square.opacity = opa;
  square.display = "block"

  ani_interval = setInterval(open_transformation, 10);
}
function open_transformation(){
  if (transf < 1.2 && large_small){
    transf += 0.05;
    square.transform = "scale(" + transf + "," + transf + ")";
    } else if (transf > 1){
    large_small = false;
    transf -= 0.02;
    square.transform = "scale(" + transf + "," + transf + ")";
  } else if (opa > -1){
    opa -= 0.02;
    square.opacity = opa;
  } else {
    clearInterval(ani_interval);
    square.display = "none"
  }
}
window.header_func.open_animation = open_animation;

// --- リーチ！
var reach_div;
var location_;
function reach_animation(){
  location_ = 125;
  transf = 1;
  opa = 3;
  reach_div = document.getElementById("ani_reach");
  reach = reach_div.children[0].style;
  reach_div.style.transform = "scale(" + transf + ")";
  
  // large_small = true;
  reach.left = "" + location_ + "%";

  reach.opacity = opa;
  reach.display = "block";

  ani_interval = setInterval(reach_transformation, 10);
}
function reach_transformation(){
  if (location_ > 50){
    location_ -= 5;
    reach.left = "" + location_ + "%";
  } else if (transf < 1.2){
    transf += 0.1;
    reach_div.style.transform = "scale(" + transf + ")";
  } else if (opa > -1){
    opa -= 0.02;
    reach.opacity = opa;
  } else {
    clearInterval(ani_interval);
    reach.display = "none";
  }
}
window.header_func.reach_animation = reach_animation;

// --- BINGO ！
var location_;
var tex_bingo;
function bingo_animation(){
  transf = 0;
  opa = 3;
  par_bingo = document.getElementById("ani_BINGO").style;
  //tex_bingo = document.getElementById("ani_BINGO").children[0].style;
  par_bingo.transform = "scale(" + transf + ")";
  large_small = true;

  par_bingo.opacity = opa;
  par_bingo.display = "block";

  ani_interval = setInterval(bingo_transformation, 10);
}
function bingo_transformation(){
  if (transf < 1.3 && large_small){
    transf += 0.1;
    par_bingo.transform = "scale(" + transf + ")";
  } else if (transf > 1){
    large_small = false;
    transf -= 0.03;
    par_bingo.transform = "scale(" + transf + ")";
  } else if (opa > 0){
    opa -= 0.01;
    par_bingo.opacity = opa;
  } else {
    clearInterval(ani_interval);
    par_bingo.display = "none";
  }
}
window.header_func.bingo_animation = bingo_animation;


// |------------------ |
// | 残り時間 --------- |
var lest_time;
var mini;
var seco;
var interval;
var countdown_p = document.getElementById("countdown").firstElementChild;

function countdown_display(t){
  clearInterval(interval);
  
  lest_time = t;
  mini = parseInt(lest_time / 60);
  seco = lest_time % 60;
  countdown_p.innerText = "" + mini + " : " + seco;

  interval = setInterval(countdown_concreat, 1000);
}
function countdown_concreat(){
  lest_time--;
  mini = parseInt(lest_time / 60);
  seco = lest_time % 60;
  if (seco < 10) countdown_p.innerText = "" + mini + " : 0" + seco;
  else countdown_p.innerText = "" + mini + " : " + seco;

  if (lest_time === 0){
    clearInterval(interval);
    window.jungle_func.GameEnd();
  }
}
window.header_func.countdown = countdown_display;


// |------------------ |
// |リセット----------- |
function reset(){
  // タイマー
  countdown_p.innerText = "0 : 00";
  floor_display.innerText = "";

  // timeUp_animation
  timeUp_trf.display = "none";
}
window.header_func.reset = reset;


// |------------------ |