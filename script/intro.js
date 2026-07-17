// 출국 수속 인트로 — 페이지 도착 시 잠깐 재생하는 장식 오버레이.
// 견고성: 오버레이를 JS로 직접 삽입한다. JS가 없거나 실패하면 오버레이 자체가
//   존재하지 않으므로 화면이 막히지 않는다(정적 HTML로 두면 잠길 위험이 있음).
// 접근성: prefers-reduced-motion이면 아예 재생하지 않고, 세션당 1회만,
//   아무 키·클릭으로 스킵 가능하며, 끝나면 포커스를 본문으로 옮긴다.
//   오버레이는 aria-hidden 장식이라 스크린리더는 항상 본문을 읽는다.
// 목적지 라벨은 <body data-intro="..."> 에서 읽어 페이지마다 다르게 표시한다.
const DEST = ((document.body && document.body.dataset.intro) || "TRAVEL").toUpperCase();
// 세션 키를 페이지별로 두어 각 페이지가 세션당 한 번씩 인트로를 재생한다.
const KEY = "skala-intro-" + (location.pathname.split("/").pop() || "index");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const OVERLAY_HTML = `
  <div class="intro__ticket">
    <p class="intro__eyebrow">BOARDING PASS</p>
    <p class="intro__title">출국 수속</p>
    <p class="intro__route"><b>KWJ</b><span class="intro__plane" aria-hidden="true">✈</span><b>${DEST}</b></p>
    <div class="intro__bar"><span class="intro__fill"></span></div>
    <p class="intro__status">탑승 수속 중…</p>
  </div>
  <span class="intro__stamp">APPROVED</span>`;

let overlay = null;

function alreadyShown() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch (e) {
    return false;
  }
}

function markShown() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch (e) {}
}

function focusMain() {
  const main = document.getElementById("main");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
  }
}

function dismiss() {
  if (!overlay) return;
  const el = overlay;
  overlay = null;
  el.classList.add("intro--out");
  focusMain();
  setTimeout(() => el.remove(), 450);
}

function play() {
  markShown();
  overlay = document.createElement("div");
  overlay.className = "intro";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = OVERLAY_HTML;
  document.body.prepend(overlay);

  const timer = setTimeout(dismiss, 1400);
  const skip = () => {
    clearTimeout(timer);
    dismiss();
  };
  overlay.addEventListener("click", skip, { once: true });
  window.addEventListener("keydown", skip, { once: true });
}

if (!reduceMotion && !alreadyShown()) {
  play();
}
