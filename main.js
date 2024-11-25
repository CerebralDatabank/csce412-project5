const PARTY_INTERVAL = 800;
const PARTY_ANIM_DUR = 600;
const PARTY_SWAP_DELAY = 750;
const SIMON_FLASH_DELAY = 800;

document.getElementById("menu").innerHTML = `<ul>
  <li id="nav_home"><a href="index.html">Home</a></li>
  <li id="nav_projects"><a href="projects.html">Projects</a></li>
  <li id="nav_qualifs"><a href="qualifs.html">Qualifications</a></li>
  <li id="nav_service"><a href="service.html">Community</a></li>
  <li id="nav_about"><a href="about.html">About</a></li>
  <li id="nav_chatgpt"><a href="chatgpt.html">ChatGPT</a></li>
</ul>`;
document.body.insertAdjacentHTML("afterend", `<button id="style_switch_btn" onclick="switchStyle();">Switch Style</button>`)

document.getElementById(`nav_${document.getElementById("menu").getAttribute("data-page")}`).classList.add("nav-selected");

if (location.search.includes("nostyle=1")) {
  document.querySelectorAll(`link[rel="stylesheet"], style`).forEach(elem => elem.remove());
  document.querySelectorAll(`li[id^="nav_"] a`).forEach(elem => elem.href += "?nostyle=1");
}

function switchStyle() {
  let styleElem = document.head.getElementsByTagName("link")[0];
  let newStr = styleElem.href.endsWith("style2.css") ? "style.css" : "style2.css";
  styleElem.href = newStr;
  localStorage.setItem("style", newStr);
  stopSimon();
  stopParty();
}

if (localStorage.getItem("style") === "style2.css") {
  switchStyle();
}

let logoSvg = document.getElementById("logo")?.getElementsByTagName("svg")[0];
if (location.search.includes("logodebug=1") && logoSvg) {
  logoSvg.insertAdjacentHTML("beforeend", `<line x1="160" x2="160" y1="0" y2="350" stroke="red" />
  <line x1="100" x2="100" y1="0" y2="250" stroke="red" />
  <line x1="40" x2="40" y1="0" y2="250" stroke="red" />
  <line x1="0" x2="500" y1="125" y2="125" stroke="red" />
  <line x1="0" x2="500" y1="185" y2="185" stroke="red" />
  <line x1="0" x2="500" y1="65" y2="65" stroke="red" />
  <circle cx="100" cy="65" r="2" fill="blue" />
  <circle cx="100" cy="125" r="2" fill="blue" />
  <circle cx="160" cy="125" r="2" fill="blue" />
  <circle cx="310" cy="155" r="2" fill="blue" />
  <circle cx="280" cy="155" r="2" fill="blue" />
  <circle cx="400" cy="155" r="2" fill="blue" />
  <circle cx="430" cy="155" r="2" fill="blue" />
  <circle cx="142.426407" cy="83.426407" r="2" fill="blue" />`);
  logoSvg.style.border = "2px solid red";
}

function changeLogoColor(color) {
  let stuff = document.getElementById("logo_0").outerHTML.replace(/logo_0/g, "logo_1").replace(/stroke=".+?"/g, `stroke="${color}"`).replace(/dur=".+?"/g, `dur="${PARTY_ANIM_DUR}ms"`);
  document.getElementById("logo").insertAdjacentHTML("beforeend", `<svg class="logo-svg" width="700" height="350" viewBox="0 0 500 250">${stuff}</svg>`);
  setTimeout(() => {
    document.getElementById("logo_0").parentElement.remove();
    document.getElementById("logo_1").id = "logo_0";
  }, PARTY_SWAP_DELAY);
}

function* rainbow() {
  while (true) {
    yield "#CC0000";
    yield "#CCAA00";
    yield "#00CC00";
    yield "#00AACC";
    yield "#0000CC";
    yield "#CC00AA";
  }
}

let gen = rainbow();

function randID() {
  return String(rand(0, 0xFFFFFF)).padStart(6, "0");
}

let konamiKeys = [];
if (location.href.includes("index.html") || !location.href.includes(".html")) {
  window.addEventListener("keydown", event => {
    if (konamiKeys.length >= 10) {
      konamiKeys.shift();
    }
    else {}
    konamiKeys.push(event.key);
    if (konamiKeys.toString().indexOf("ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a") > -1) {
      startParty();
    }
    else {}
  });
}

let partyInterval = null;

function startParty() {
  if (localStorage.getItem("style") === "style2.css") {
    return;
  }
  document.getElementById("logo_0").setAttribute("stroke", "green");
  document.getElementById("logo_0").classList.add("logo-g-party");
  document.getElementById("logo").classList.add("logo-party");
  document.getElementById("hello_msg_2").innerText = "and I like to party! :D";
  document.body.classList.add("thumping");
  document.getElementById("style_switch_btn").classList.add("thumping");
  partyInterval = setInterval(() => {
    let nextColor = gen.next().value;
    changeLogoColor(nextColor);
    let pfID = `partyframe-${randID()}`;
    document.body.insertAdjacentHTML("beforeend", `<div id="${pfID}" class="partyframe" style="border: 10px solid ${nextColor};"></div>`);
    document.body.style.background = `${nextColor}30`;
    document.getElementById("hello_msg_1").style.color = nextColor;
    document.getElementById("hello_msg_2").style.color = nextColor;
    setTimeout(() => {
      document.getElementById(pfID).remove();
    }, 600);
  }, PARTY_INTERVAL);
}

function stopParty() {
  clearInterval(partyInterval);
  partyInterval = null;
  document.getElementById("logo_0")?.setAttribute("stroke", "green");
  document.getElementById("logo_1")?.classList.remove("logo-g-party");
  document.getElementById("logo_0")?.setAttribute("stroke", "green");
  document.getElementById("logo_1")?.classList.remove("logo-g-party");
  document.getElementById("logo").classList.remove("logo-party");
  document.body.style.removeProperty("background");
  document.getElementById("hello_msg_1").style.removeProperty("color");
  document.getElementById("hello_msg_2").style.removeProperty("color");
  document.getElementById("hello_msg_2").innerHTML = "Nice to meet you!";
  document.body.classList.remove("thumping");
  document.getElementById("style_switch_btn").classList.remove("thumping");
}

let simonGame = document.getElementById("simon_game");

let simonHovering = false;

if (simonGame) {
  simonGame.addEventListener("mouseenter", function() {
    simonHovering = true;
    setTimeout(() => {
      if (simonHovering) {
        this.classList.remove("hidden");
        setTimeout(() => {
          this.classList.remove("hover-hidden");
        }, 1000);
      }
    }, 3000);
  });
  simonGame.addEventListener("mouseleave", function() {
    simonHovering = false;
  })
}

let simon = {
  memory: [],
  current: 0,
  turn: false,
  inClick: false,
  level: 0,
  cards: null,
  statusElem: null,
  replayed: false
};

function simonReset(firstTime = false) {
  simon.memory = [];
  simon.current = 0;
  simon.level = 0;
  simon.replayed = !firstTime;
}

simonReset(true);

function rand(minNum, maxNum) {
  minNum = Math.ceil(minNum);
  maxNum = Math.floor(maxNum);
  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}

function simonStatusUpdate(state) {
  if (simon && simon.statusElem) {
    simon.statusElem.innerText = `Simon Says! | [${state}] Score: ${simon.level}`;
  }
}

function startSimon() {
  if (localStorage.getItem("style") === "style2.css") {
    return;
  }
  simon.cards = Array.from(document.getElementById("projects_cards").children);
  simon.statusElem = document.getElementById("projects_title");

  for (let i = 0; i < simon.cards.length; i++) {
    simon.cards[i].classList.add("simon");
    simon.cards[i].querySelector(simon.replayed ? "button" : "a").outerHTML = `<button class="btn" onclick="simonClick(${i}, this.parentElement.parentElement);">Click</button>`;
  }

  simonRound();
}

function simonRound() {
  simon.turn = false;
  simonStatusUpdate("WAIT");
  simon.memory.push(rand(0, simon.cards.length - 1));
  for (let i = 0; i < simon.memory.length; i++) {
    let index = simon.memory[i];
    setTimeout(() => {
      simon.cards[index].classList.add("simon-highlight");
      console.log(index);
      setTimeout(() => {
        simon.cards[index].classList.remove("simon-highlight");
      }, 600);
    }, SIMON_FLASH_DELAY * i);
  }
  setTimeout(() => {
    simon.turn = true;
    simonStatusUpdate("PLAY");
  }, SIMON_FLASH_DELAY * simon.memory.length);
}

function simonClick(cardId, cardElem) {
  if (!simon.turn || simon.inClick) {
    return;
  }
  simon.inClick = true;

  let correct = (cardId === simon.memory[simon.current]);

  if (correct) {
    cardElem.classList.add("simon-highlight");
    simon.current++;
  }
  else {
    simonFlashAll(true);
    stopSimon();
  }

  setTimeout(() => {
    cardElem.classList.remove("simon-highlight");
  }, 600);
  setTimeout(() => {
    simon.inClick = false;
    if (simon.current === simon.memory.length && correct) {
      simon.current = 0;
      simon.level++;
      simon.turn = false;
      simonFlashAll();
      setTimeout(simonRound, 900);
    }
  }, SIMON_FLASH_DELAY);
}

function simonFlashAll(gameOver = false) {
  let type = gameOver ? "gameover" : "correct";
  for (let i = 0; i < simon.cards.length; i++) {
    simon.cards[i].classList.add(`simon-highlight-${type}`);
  }
  setTimeout(() => {
    for (let i = 0; i < simon.cards.length; i++) {
      simon.cards[i].classList.remove(`simon-highlight-${type}`);
    }
  }, 800);
}

function stopSimon() {
  simonStatusUpdate("LOST");
  simon.turn = false;
  if (!simon.cards) {
    return;
  }
  for (let i = 0; i < simon.cards.length; i++) {
    simon.cards[i].querySelector("button").outerHTML = `<button class="btn" onclick="simonReset(); startSimon();">Try Again?</button>`;
  }
}

function easterMsg() {
  alert("EASTER EGG INSTRUCTIONS\n\n(1) There is an invisible sixth card in Projects. Hover over where a sixth card would be for 3 seconds and click the button.\n(2) Enter the Konami Code (Up, Up, Down, Down, Left, Right, Left, Right, B, A) on the home page with your keyboard.\n\nEnjoy! :)");
}