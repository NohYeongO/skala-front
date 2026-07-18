// 미니게임 오케스트레이터 — 전 페이지 플로팅 런처(FAB)로 실행한다.
// 주의: 홈 아케이드가 화면에 보이면 FAB는 숨긴다(중복 방지).
import { getSession } from "./auth.js";
import { ensureModal, openModal } from "./gameModal.js";
import { startUpDown } from "./upDown.js";
import { startGrade } from "./grade.js";
import { startBag } from "./bag.js";

// 비회원 닉네임은 메모리에만 둔다(새로고침 시 사라지고 로그인으로 오해되지 않음).
let guestName = null;

// ── 플레이어 게이트 ──
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

const GAMES = { updown: startUpDown, calc: startGrade, bag: startBag };
function launch(key) {
  const start = GAMES[key];
  if (start) requirePlayer(start);
}

// ── 플로팅 런처(FAB) ──
function ensureLauncher() {
  const existing = document.querySelector(".game-fab");
  if (existing) return existing;
  const fab = document.createElement("div");
  fab.className = "game-fab";
  fab.innerHTML =
    '<div class="game-fab__menu" id="gameFabMenu" hidden>' +
    '<button type="button" class="game-fab__item" data-game="updown"><span aria-hidden="true">🎮</span> 업다운</button>' +
    '<button type="button" class="game-fab__item" data-game="calc"><span aria-hidden="true">📊</span> 성적 계산기</button>' +
    '<button type="button" class="game-fab__item" data-game="bag"><span aria-hidden="true">🎒</span> 내 가방</button>' +
    "</div>" +
    '<button type="button" class="game-fab__toggle" id="gameFabToggle" aria-expanded="false" aria-haspopup="true" aria-label="미니게임 열기"><span aria-hidden="true">🕹️</span></button>';
  document.body.appendChild(fab);

  const toggle = fab.querySelector("#gameFabToggle");
  const menu = fab.querySelector("#gameFabMenu");
  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-game]");
    if (!btn) return;
    setOpen(false);
    launch(btn.dataset.game);
  });
  document.addEventListener("click", (event) => {
    if (!fab.contains(event.target)) setOpen(false);
  });
  return fab;
}

// ── 초기화 ──
ensureModal();
const fab = ensureLauncher();

// 홈의 아케이드 캐비닛과 연동 + 아케이드가 보이면 FAB 숨김
document.getElementById("upDownBtn")?.addEventListener("click", () => requirePlayer(startUpDown));
document.getElementById("gradeBtn")?.addEventListener("click", () => requirePlayer(startGrade));
document.getElementById("bagBtn")?.addEventListener("click", () => requirePlayer(startBag));

const arcade = document.querySelector(".arcade");
if (arcade && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) fab.classList.toggle("game-fab--hidden", entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  observer.observe(arcade);
}
