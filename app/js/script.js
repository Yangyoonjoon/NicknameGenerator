const range = document.getElementById("letter-range"),
  letterCnt = document.querySelector(".letter-cnt"),
  oBtn = document.getElementById("meaning-btn"),
  xBtn = document.getElementById("nomeaning-btn"),
  type = document.querySelector(".type"),
  description = document.querySelector(".description"),
  adjective = document.querySelector(".adjective"),
  createBtn = document.getElementById("create-btn"),
  adjectiveAdd = document.getElementById("add"),
  resultArea = document.querySelector(".result"),
  licenseBtn = document.getElementById("license-btn"),
  copyright = document.querySelector(".copyright");

const files = {
  2: "data/2.txt",
  3: "data/3.txt",
  4: "data/4.txt",
  5: "data/5.txt",
  6: "data/6.txt",
  7: "data/7.txt",
  a: "data/a.txt",
  letter: "data/letter.txt",
};

const NONE_CN = "none";

let isOBtn = true;
let meaning = true,
  useAdj = false;

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleRangeInput() {
  letterCnt.innerText = range.value;
}

function handleOBtnClick() {
  type.innerText = "의미 O";
  description.innerText = "실제 존재하는 단어로 닉네임을 생성합니다";
  adjective.classList.remove(NONE_CN);
  isOBtn = true;
}

function handleXBtnClick() {
  type.innerText = "의미 X";
  description.innerText = "무작위의 글자를 조합하여 닉네임을 생성합니다";
  adjective.classList.add(NONE_CN);
  isOBtn = false;
}

async function loadFile(file) {
  let data;

  await fetch(file)
    .then((response) => response.text())
    .then((text) => {
      data = text;
    });

  return data;
}

async function handleCreate() {
  const letterLen = range.value;
  let file, data, words, adjs;

  if (isOBtn) {
    file = files[letterLen];
    data = await loadFile(file);
    data = data.split(" ");
    words = createWord(data);
    meaning = true;
    useAdj = false;

    const checked = adjectiveAdd.checked;
    if (checked) {
      file = files["a"];
      data = await loadFile(file);
      data = data.split(" ");
      adjs = createWord(data);
      useAdj = true;
    }
  } else {
    file = files["letter"];
    data = await loadFile(file);
    words = createWord(data, letterLen);
    meaning = false;
  }
  paintNicknames(words, adjs);
}

function paintNicknames(words, adjs) {
  const ul = document.createElement("ul");
  for (let i = 0; i < words.length; i++) {
    const li = document.createElement("li");
    if (meaning) {
      if (useAdj) {
        li.innerHTML = `${adjs[i]} <a href="https://opendict.korean.go.kr/search/searchResult?focus_name_top=query&query=${words[i]}" target="_blank">${words[i]}</a>`;
      } else {
        li.innerHTML = `<a href="https://opendict.korean.go.kr/search/searchResult?focus_name_top=query&query=${words[i]}" target="_blank">${words[i]}</a>`;
      }
    } else {
      li.innerText = words[i];
    }
    li.className = `nickname${i + 1}`;
    ul.appendChild(li);
  }
  if (resultArea.hasChildNodes()) {
    resultArea.removeChild(resultArea.firstChild);
  }
  resultArea.classList.remove(NONE_CN);
  resultArea.appendChild(ul);
}

function createWord(data, letterLen = 0) {
  words = [];
  for (let i = 0; i < 10; i++) {
    if (typeof data === "string") {
      word = "";
      for (let j = 0; j < letterLen; j++) {
        const num = getRandomNum(0, data.length - 1);
        word += data[num];
      }
      words.push(word);
    } else {
      const num = getRandomNum(0, data.length - 1);
      words.push(data[num].replace("-", ""));
    }
  }
  return words;
}

function handleLicense() {
  copyright.classList.toggle(NONE_CN);
}

function init() {
  handleOBtnClick();
  handleRangeInput();
  range.addEventListener("input", handleRangeInput);
  oBtn.addEventListener("click", handleOBtnClick);
  xBtn.addEventListener("click", handleXBtnClick);
  createBtn.addEventListener("click", handleCreate);
  licenseBtn.addEventListener("click", handleLicense);
}

init();
