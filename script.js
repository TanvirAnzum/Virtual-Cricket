const btn = document.querySelector(".spin-btn");
const wheel = document.querySelector("#box");
const spin = document.querySelector(".main__spinner");
const img = document.querySelector(".img");
const modal = document.querySelector(".modal");
const mtext = document.querySelector(".modal-text");
const mimg = document.querySelector(".modal-img");
let deg = 0;

///initially spin button should be disabled
btn.disabled = true;
btn.style.cursor = "no-drop";
btn.title = "Select Overs & Wickets Then Toss Please!";

///toss
const t_area = document.querySelector(".tossing-area");
const trText = document.querySelector(".tr-text");
const tr_btn = document.querySelector(".toss-btns");
const toss_btn = document.querySelector(".toss");

///initially toss button also be disabled

toss_btn.disabled = true;
toss_btn.title = "Please Select Overs and Wickets First!";
toss_btn.style.cursor = "no-drop";

let cb;
let toss_caller;
let toss_winner;

{
  ///this section for which player will be calling the toss
  let rand = Math.random();
  if (rand >= 0.5) {
    trText.innerText = "Head Or Tail!! (Selection for p1 only)";
    toss_caller = "p1";
  } else {
    trText.innerText = "Head Or Tail!! (Selection for p2 only)";
    toss_caller = "p2";
  }
}

function toss(elm) {
  let rand = Math.random();
  tr_btn.style.display = "none";
  if (rand >= 0.5) {
    trText.innerHTML = `${toss_caller} have won the toss!<br>Batting First`;
    toss_winner = toss_caller;
  } else {
    trText.innerHTML = `${toss_caller} have lost the toss!<br>Bowling First`;
    if (toss_caller == "p1") toss_winner = "p2";
    else toss_winner = "p1";
  }
  cb = document.querySelector(`.${toss_winner}`);
  cb.style.display = "flex";
  setTimeout(() => {
    t_area.style.display = "none";
    toss_btn.disabled = true;
    toss_btn.style.cursor = "no-drop";
    toss_btn.title =
      "Toss Completed! Now Play the game! Spin is ready for toss Winner!";
    console.log(toss_winner);
    btn.disabled = false;
    btn.style.cursor = "pointer";
    btn.title = "";
  }, 2000);
  // alert(elm.innerText);
}

function DisplayToss() {
  t_area.style.display = "flex";
}

///forms
let max_over;
let max_wicket;

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const overs = document.querySelector("#overs");
  const wickets = document.querySelector("#wickets");
  max_over = Number(overs.value);
  max_wicket = Number(wickets.value);
  document.querySelector(".total_over").innerText += " " + overs.value;
  document.querySelector(".total_wicket").innerText += " " + wickets.value;

  overs.disabled = true;
  wickets.disabled = true;
  document.querySelector("#submit").disabled = true;
  document.querySelector("#submit").style.cursor = "no-drop";
  document.querySelector("#submit").title =
    "This can be changed once for a Match!";
  toss_btn.disabled = false;
  toss_btn.style.cursor = "pointer";
  toss_btn.title = "";
});

///object for calculation

let current_wicket = 0;
let current_run = 0;
let current_ball = 0;
let current_over = 0;
let target = 0;
///object for mapping

let score = {
  p1: 0,
  p2: 1,
};

let obj = {
  0: -1,
  1: 4,
  2: 2,
  3: 0,
  4: 6,
  5: -1,
  6: 3,
  7: 1,
};

btn.addEventListener("click", () => {
  btn.style.pointerEvents = "none";
  btn.style.backgroundColor = "#3c6382";
  deg = Math.floor(3000 + Math.random() * 8000);
  wheel.style.transition = "transform ease 5s";
  wheel.style.transform = `rotate(${deg}deg)`;

  setTimeout(() => {
    btn.style.backgroundColor = "#0a3d62";
    btn.style.pointerEvents = "auto";
    let x = 360 - (deg % 360);
    wheel.style.transform = `rotate(${(deg % 360) + x}deg)`;
  }, 6000);
});

let isFinished = 0;

wheel.addEventListener("transitionend", () => {
  wheel.style.transition = "none";
  let val = verdict(get_arr(deg % 360));
  if (val != -1) {
    current_run += Number(val);
    mtext.innerText = `${val} Runs!`;
  } else {
    current_wicket++;
    mtext.innerText = `OUT!!`;
  }

  current_ball++;
  if (current_ball % 6 == 0) {
    current_over++;
  }

  update(current_wicket, current_ball, current_run, toss_winner);

  if (isFinished) {
    if (current_run > target) {
      Swal.fire({
        icon: "success",
        title: "Match Finished!",
        text: `${toss_winner} have won the match!`,
        showConfirmButton: false,
        footer: '<a href="./index.html">Play Again!!</a>',
      });
      return;
    }
  }

  if (val == 4) mimg.src = "./Four.png";
  else if (val == 6) mimg.src = "./Six.png";
  else if (val == -1) mimg.src = "./Out.png";
  else mimg.src = "./Runs.png";

  modal.style.display = "flex";

  setTimeout(() => {
    modal.style.display = "none";
  }, 1500);
  if (current_over == max_over || current_wicket == max_wicket) {
    if (isFinished) {
      setTimeout(() => {
        cb.style.display = "none";
        if (toss_winner == "p1") toss_winner = "p2";
        else toss_winner = "p1";

        Swal.fire({
          icon: "success",
          title: "Match Finished!",
          text: `${toss_winner} have won the match!`,
          showConfirmButton: false,
          footer: '<a href="./index.html">Play Again!!</a>',
        });
      }, 1500);
      return;
    }
    cb.style.display = "none";
    if (!isFinished) target = current_run;
    if (toss_winner == "p1") toss_winner = "p2";
    else toss_winner = "p1";
    cb = document.querySelector(`.${toss_winner}`);
    cb.style.display = "flex";
    current_ball = 0;
    current_wicket = 0;
    current_run = 0;
    current_over = 0;
    isFinished = 1;
  }
});

function get_arr(deg) {
  let arr = new Array(8);
  arr[0] = (337.5 + deg) % 360;
  for (let i = 0; i < 7; i++) {
    arr[i + 1] = (arr[i] + 45) % 360;
  }
  return arr;
}

function verdict(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= 180 && arr[i] + 45 > 180) return obj[i];
  }
  return;
}

///now scoreboard calculation

function update(wicket, ball, run, player) {
  const scores = document.querySelectorAll(".score");
  const overs = document.querySelectorAll(".overs");
  scores[score[player]].textContent = `${run} - ${wicket}`;
  overs[score[player]].textContent = parseInt(ball / 6) + (ball % 6) / 10;
}
