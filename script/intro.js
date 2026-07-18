// 출국 수속 인트로 오버레이 — head에서 즉시 실행해 첫 페인트 전에 페이지를 가린다
// (intro-pending). 목적지 페이지가 인트로보다 먼저 번쩍이는 것을 막기 위함.
// 주의: reduced-motion이면 재생 안 함, 세션당 1회, 클릭·Enter·Space·Esc로 스킵.
(function () {
  const root = document.documentElement;
  const KEY = "skala-intro-" + (location.pathname.split("/").pop() || "index");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // 재생하지 않을 상황이면 아무것도 가리지 않는다(페이지 그대로 노출).
  if (reduceMotion || alreadyShown()) return;

  // 첫 페인트 전에 페이지를 가린다(CSS가 인트로 배경만 보이게 함).
  root.classList.add("intro-pending");
  markShown();

  // 안전장치: 이후 단계가 실패해도 페이지가 잠기지 않도록 자동 해제한다.
  let failSafe = setTimeout(reveal, 2600);

  function reveal() {
    clearTimeout(failSafe);
    root.classList.remove("intro-pending");
  }

  function focusMain() {
    const main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  let overlay = null;

  function dismiss() {
    if (!overlay) return;
    const el = overlay;
    overlay = null;
    el.classList.add("intro--out");
    reveal(); // 오버레이가 페이드아웃하는 동안 아래 페이지를 드러낸다
    focusMain();
    setTimeout(() => el.remove(), 450);
  }

  function play() {
    const dest = ((document.body && document.body.dataset.intro) || "TRAVEL").toUpperCase();
    overlay = document.createElement("div");
    overlay.className = "intro";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="intro__ticket">
        <p class="intro__eyebrow">BOARDING PASS</p>
        <p class="intro__title">출국 수속</p>
        <p class="intro__route"><b>KWJ</b><span class="intro__plane" aria-hidden="true">✈</span><b>${dest}</b></p>
        <div class="intro__bar"><span class="intro__fill"></span></div>
        <p class="intro__status">탑승 수속 중…</p>
      </div>
      <span class="intro__stamp">APPROVED</span>`;
    document.body.prepend(overlay);

    const timer = setTimeout(finish, 1400);
    function finish() {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      dismiss();
    }
    // 명시적 '닫기 의도' 키만 스킵 — Tab·화살표로 탐색하는 중에 사라지지 않게
    function onKey(event) {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") finish();
    }
    overlay.addEventListener("click", finish, { once: true });
    window.addEventListener("keydown", onKey);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", play);
  } else {
    play();
  }
})();
