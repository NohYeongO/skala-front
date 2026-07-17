// 다크/라이트 모드 수동 토글
(function () {
  const root = document.documentElement;
  const KEY = "skala-theme";

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function systemDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effective() {
    return root.getAttribute("data-theme") || (systemDark() ? "dark" : "light");
  }

  // 저장된 설정 복원 (첫 페인트 전에 적용해 깜빡임 방지)
  const saved = stored();
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";

  function render() {
    const dark = effective() === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
    btn.setAttribute("aria-pressed", String(dark));
  }

  btn.addEventListener("click", function () {
    const next = effective() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    render();
  });

  render();

  function mount() {
    const slot = document.querySelector("[data-theme-slot]");
    (slot || document.body).appendChild(btn);
  }
  // layout.js가 헤더를 주입한 직후 명시적으로 호출한다(마운트 순서 명확화).
  // appendChild는 같은 노드를 재배치하므로 여러 번 불려도 버튼은 하나다.
  window.mountThemeToggle = mount;
  // layout이 없는 정적 슬롯 페이지(로그인/회원가입)를 위한 폴백
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
