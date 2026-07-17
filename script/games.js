// 미니 게임 3종 — 로그인/비회원 이름으로 시작하고, 결과·랭킹을 localStorage에 저장한다.
// 사용자 이름/닉네임은 escapeHTML로 감싸 innerHTML XSS를 막는다.
import { getSession } from "./auth.js";
import { escapeHTML } from "./util.js";

const modal = document.getElementById("gameModal");
const titleEl = document.getElementById("game-modal-title");
const bodyEl = document.getElementById("game-modal-body");

// 비회원 닉네임은 메모리에만 둔다 — 새로고침하면 사라지고, 로그인 상태로 오해되지 않는다.
let guestName = null;

function openModal(title, html) {
  const trigger = document.activeElement;
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  if (typeof modal.showModal === "function") {
    modal.showModal();
    // 닫을 때 포커스를 열었던 요소로 되돌린다 (접근성)
    modal.addEventListener(
      "close",
      () => {
        if (trigger && typeof trigger.focus === "function") trigger.focus();
      },
      { once: true }
    );
  }
}

// 로그인 상태면 그 이름으로, 아니면 회원(로그인) / 비회원(닉네임) 선택
function requirePlayer(start) {
  const session = getSession();
  const name = session ? session.name : guestName;
  if (name) {
    start(name);
    return;
  }
  openModal(
    "게임 시작 🎮",
    `<p>게임을 시작하려면 이름이 필요해요.</p>
     <div class="game-choice">
       <a class="game-choice__btn" href="login.html">회원으로 시작 (로그인)</a>
       <button type="button" class="game-choice__btn" id="guestStart">비회원으로 시작</button>
     </div>
     <p class="game-row" id="guestRow" hidden>
       <input type="text" id="guestNick" placeholder="닉네임" aria-label="닉네임" maxlength="20" />
       <button type="button" id="guestGo">시작</button>
     </p>`
  );
  document.getElementById("guestStart").addEventListener("click", () => {
    document.getElementById("guestRow").hidden = false;
    document.getElementById("guestNick").focus();
  });
  function go() {
    guestName = document.getElementById("guestNick").value.trim() || "게스트";
    start(guestName);
  }
  document.getElementById("guestGo").addEventListener("click", go);
  document.getElementById("guestNick").addEventListener("keydown", (event) => {
    if (event.key === "Enter") go();
  });
}

// 랭킹 (localStorage) — 값이 작을수록 좋은 게임(업다운)
function getRank(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

function saveRank(key, name, score) {
  const list = getRank(key);
  const existing = list.find((row) => row.name === name);
  if (existing) {
    if (score < existing.score) existing.score = score;
  } else {
    list.push({ name, score });
  }
  list.sort((a, b) => a.score - b.score);
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
  } catch (error) {
    // 무시
  }
}

function rankBlock(key, unit) {
  const list = getRank(key).slice(0, 5);
  const rows = list.length
    ? `<ol class="rank-list">${list
        .map((row) => `<li><span>${escapeHTML(row.name)}</span><span>${row.score}${unit}</span></li>`)
        .join("")}</ol>`
    : '<p class="game-msg">아직 기록이 없습니다.</p>';
  return `<h4 class="rank-title"><span aria-hidden="true">🏆</span> 랭킹</h4>${rows}`;
}

// 업다운 게임 — 1~100 숫자 맞히기, 최소 시도 횟수를 랭킹에 기록
function startUpDown(name) {
  const answer = 1 + Math.floor(Math.random() * 100);
  let tries = 0;
  openModal(
    "업다운 게임 🎮",
    `<p>${escapeHTML(name)}님, 1~100 사이 숫자를 맞혀보세요.</p>
     <p class="game-row">
       <input type="number" id="ud-input" min="1" max="100" inputmode="numeric" aria-label="추측 숫자" />
       <button type="button" id="ud-go">확인</button>
     </p>
     <p id="ud-msg" class="game-msg" aria-live="polite"></p>
     <div id="ud-rank">${rankBlock("skala-rank-updown", "회")}</div>`
  );
  const input = document.getElementById("ud-input");
  const msg = document.getElementById("ud-msg");
  input.focus();

  function guess() {
    const value = Number(input.value);
    if (!value || value < 1 || value > 100) {
      msg.textContent = "1~100 사이 숫자를 입력하세요.";
      return;
    }
    tries += 1;
    if (value === answer) {
      msg.textContent = `🎉 정답! ${tries}회 만에 맞혔습니다.`;
      input.disabled = true;
      saveRank("skala-rank-updown", name, tries);
      document.getElementById("ud-rank").innerHTML = rankBlock("skala-rank-updown", "회");
    } else {
      msg.textContent = value < answer ? `⬆️ 더 큰 숫자 (${tries}회)` : `⬇️ 더 작은 숫자 (${tries}회)`;
      input.value = "";
      input.focus();
    }
  }

  document.getElementById("ud-go").addEventListener("click", guess);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") guess();
  });
}

// 성적 계산기 — 쉼표로 구분한 점수의 평균과 학점
function startGrade(name) {
  openModal(
    "성적 계산기 📊",
    `<p>${escapeHTML(name)}님, 점수를 쉼표로 구분해 입력하세요. (예: 90, 85, 100)</p>
     <p class="game-row">
       <input type="text" id="gr-input" aria-label="점수 목록" />
       <button type="button" id="gr-go">계산</button>
     </p>
     <p id="gr-msg" class="game-msg" aria-live="polite"></p>`
  );
  const input = document.getElementById("gr-input");
  const msg = document.getElementById("gr-msg");
  input.focus();

  function calculate() {
    const scores = input.value
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((score) => !Number.isNaN(score));
    if (!scores.length) {
      msg.textContent = "숫자를 입력하세요.";
      return;
    }
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const grade =
      average >= 90 ? "A" : average >= 80 ? "B" : average >= 70 ? "C" : average >= 60 ? "D" : "F";
    msg.textContent = `평균 ${average.toFixed(1)}점 · 학점 ${grade}`;
  }

  document.getElementById("gr-go").addEventListener("click", calculate);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") calculate();
  });
}

// 내 가방 보기 — 여행 가방 속 물건 목록
function startBag(name) {
  const items = ["여권", "노트북", "카메라", "여행용 어댑터", "이어폰", "텀블러"];
  openModal(
    "내 가방 보기 🎒",
    `<p>${escapeHTML(name)}님의 여행 가방 속 물건들:</p>
     <ul class="game-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
  );
}

document.getElementById("upDownBtn")?.addEventListener("click", () => requirePlayer(startUpDown));
document.getElementById("gradeBtn")?.addEventListener("click", () => requirePlayer(startGrade));
document.getElementById("bagBtn")?.addEventListener("click", () => requirePlayer(startBag));

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}
