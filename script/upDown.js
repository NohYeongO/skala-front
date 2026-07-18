// 업다운 게임 — 1~50 숫자 맞히기, 최소 시도 횟수를 localStorage 랭킹에 기록.
import { openModal } from "./gameModal.js";
import { escapeHTML, readJSON, writeJSON } from "./util.js";

const RANK_KEY = "skala-rank-updown";

function getRank() {
  return readJSON(RANK_KEY, []);
}
function saveRank(name, score) {
  const list = getRank();
  const existing = list.find((row) => row.name === name);
  if (existing) {
    if (score < existing.score) existing.score = score;
  } else {
    list.push({ name, score });
  }
  list.sort((a, b) => a.score - b.score);
  writeJSON(RANK_KEY, list.slice(0, 10));
}
function rankBlock() {
  const list = getRank().slice(0, 5);
  const rows = list.length
    ? `<ol class="rank-list">${list
        .map((row) => `<li><span>${escapeHTML(row.name)}</span><span>${row.score}회</span></li>`)
        .join("")}</ol>`
    : '<p class="game-msg">아직 기록이 없습니다.</p>';
  return `<h4 class="rank-title"><span aria-hidden="true">🏆</span> 랭킹</h4>${rows}`;
}

export function startUpDown(name) {
  const answer = 1 + Math.floor(Math.random() * 50);
  let tries = 0;
  openModal(
    "업다운 게임 🎮",
    `<p>${escapeHTML(name)}님, 1~50 사이 숫자를 맞혀보세요.</p>
     <p class="game-row">
       <input type="number" id="ud-input" min="1" max="50" inputmode="numeric" aria-label="추측 숫자" />
       <button type="button" id="ud-go">확인</button>
     </p>
     <p id="ud-msg" class="game-msg" aria-live="polite"></p>
     <div id="ud-rank">${rankBlock()}</div>`
  );
  const input = document.getElementById("ud-input");
  const msg = document.getElementById("ud-msg");
  input.focus();

  function guess() {
    const value = Number(input.value);
    if (!value || value < 1 || value > 50) {
      msg.textContent = "1~50 사이 숫자를 입력하세요.";
      return;
    }
    tries += 1;
    if (value === answer) {
      msg.textContent = `🎉 정답! ${tries}회 만에 맞혔습니다.`;
      input.disabled = true;
      saveRank(name, tries);
      document.getElementById("ud-rank").innerHTML = rankBlock();
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
