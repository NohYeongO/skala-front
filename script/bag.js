// 내 가방 — 소지품 객체(이름·수량)를 담고 빼며 꾸린다. 같은 물건을 다시 담으면
// 수량이 늘고, 목록은 localStorage에 저장된다. 사용자 입력은 escapeHTML로 감싼다.
import { openModal } from "./gameModal.js";
import { escapeHTML, readJSON, writeJSON } from "./util.js";

const BAG_KEY = "skala-bag";
const BAG_SAMPLES = [
  "여권",
  "노트북",
  "카메라",
  "여행용 어댑터",
  "이어폰",
  "텀블러",
  "보조배터리",
  "선글라스",
  "우산",
  "상비약",
];

function getBag() {
  // 예전 저장 형식(문자열 배열)도 소지품 객체 {name, count}로 맞춰 읽는다
  return readJSON(BAG_KEY, []).map((item) =>
    typeof item === "string" ? { name: item, count: 1 } : item
  );
}
function setBag(items) {
  writeJSON(BAG_KEY, items);
}

// 과제 스펙 함수명 보존 — showMyBag()으로도 호출할 수 있다.
export { startBag as showMyBag };

export function startBag(name) {
  openModal(
    "내 가방 🎒",
    `<p>${escapeHTML(name)}님의 여행 가방을 꾸려보세요. 담은 물건은 저장됩니다.</p>
     <p class="game-row bag-add">
       <input type="text" id="bag-input" placeholder="물건 이름" aria-label="담을 물건" maxlength="20" />
       <button type="button" id="bag-go" class="bag-btn">담기</button>
     </p>
     <p class="bag-samples-label">추천 품목</p>
     <ul class="bag-samples" id="bag-samples"></ul>
     <h4 class="bag-title">가방 속 <span id="bag-count">0</span>개</h4>
     <ul class="bag-list" id="bag-list"></ul>`
  );
  const input = document.getElementById("bag-input");
  const listEl = document.getElementById("bag-list");
  const samplesEl = document.getElementById("bag-samples");
  const countEl = document.getElementById("bag-count");

  function render() {
    const bag = getBag();
    countEl.textContent = bag.reduce((sum, item) => sum + item.count, 0);
    listEl.innerHTML = bag.length
      ? bag
          .map(
            (item, i) =>
              `<li class="bag-item"><span>${escapeHTML(item.name)} <b class="bag-count">×${escapeHTML(String(item.count))}</b></span>` +
              `<button type="button" class="bag-remove" data-i="${i}" aria-label="${escapeHTML(item.name)} 하나 빼기">✕ 빼기</button></li>`
          )
          .join("")
      : '<li class="bag-empty">아직 빈 가방이에요. 물건을 담아보세요!</li>';
    const remaining = BAG_SAMPLES.filter((s) => !bag.some((item) => item.name === s));
    samplesEl.innerHTML = remaining.length
      ? remaining
          .map((s) => `<li><button type="button" class="bag-sample" data-item="${escapeHTML(s)}">+ ${escapeHTML(s)}</button></li>`)
          .join("")
      : '<li class="bag-empty">추천 품목을 모두 담았어요!</li>';
  }
  function add(value) {
    const name = (value || input.value).trim();
    if (!name) return;
    const bag = getBag();
    const existing = bag.find((item) => item.name === name);
    if (existing) {
      existing.count += 1; // 같은 물건은 수량만 늘린다
    } else {
      bag.push({ name, count: 1 });
    }
    setBag(bag);
    input.value = "";
    render();
    input.focus();
  }

  document.getElementById("bag-go").addEventListener("click", () => add());
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") add();
  });
  listEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".bag-remove");
    if (!btn) return;
    const bag = getBag();
    const idx = Number(btn.dataset.i);
    if (bag[idx].count > 1) {
      bag[idx].count -= 1; // 수량을 하나씩 줄이고, 0이 되면 목록에서 뺀다
    } else {
      bag.splice(idx, 1);
    }
    setBag(bag);
    render();
    input.focus(); // 삭제로 버튼이 사라질 수 있으므로 입력창으로 포커스 복원
  });
  samplesEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".bag-sample");
    if (btn) add(btn.dataset.item);
  });
  render();
}
