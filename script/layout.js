// 공통 헤더/푸터를 페이지의 자리표시자에 주입한다.
//   <header data-site-header></header>  <footer data-site-foot></footer>
// 내용은 config.js에서만 관리하고, 현재 페이지 메뉴에 aria-current를 표시한다.
// 마크업은 모두 정적(신뢰) 데이터라 innerHTML을 쓰고, 사용자 값이 들어가는
// 인증 영역만 authUI가 textContent/DOM으로 안전하게 그린다.
import { BRAND, NAV_LINKS, SOCIAL_LINKS } from "./config.js";
import { renderAuth } from "./authUI.js";

const ICONS = {
  github:
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
  blog:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

// 현재 파일명 (예: myTrip.html). 루트면 index.html로 본다.
function currentPage() {
  return location.pathname.split("/").pop() || "index.html";
}

function headerHTML() {
  const here = currentPage();
  const items = NAV_LINKS.map((link) => {
    const active = link.href === here ? ' aria-current="page"' : "";
    return `<li><a href="${link.href}"${active}>${link.text}</a></li>`;
  }).join("");
  return `
    <a class="brand" href="${BRAND.href}"><b>${BRAND.name}</b><span class="brand__sub">${BRAND.sub}</span></a>
    <nav class="site-nav" aria-label="주요 메뉴"><ul>${items}</ul></nav>
    <div class="site-header__actions">
      <span class="auth" id="authArea"></span>
      <span data-theme-slot></span>
    </div>`;
}

function footerHTML() {
  const social = SOCIAL_LINKS.map((s) => {
    const external = s.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<li><a href="${s.href}"${external} aria-label="${s.label}">${ICONS[s.icon] || ""}</a></li>`;
  }).join("");
  return `
    <div class="foot">
      <p class="foot__brand"><b>${BRAND.name}</b> <span>${BRAND.sub}</span></p>
      <ul class="foot__social" aria-label="소셜 링크">${social}</ul>
      <p class="foot__copy"><small>&copy; 2026 SKALA-FRONT · ${BRAND.name}</small></p>
    </div>`;
}

function mount() {
  // 본문 바로가기 — 항상 첫 포커스 요소
  if (!document.querySelector(".skip-link")) {
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "본문 바로가기";
    document.body.prepend(skip);
  }

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.classList.add("site-header");
    header.innerHTML = headerHTML();
    renderAuth();
    // 헤더에 [data-theme-slot]이 생겼으니 테마 토글을 바로 마운트 (타이밍 의존 제거)
    if (window.mountThemeToggle) window.mountThemeToggle();
  }

  const footer = document.querySelector("[data-site-foot]");
  if (footer) {
    footer.classList.add("site-foot");
    footer.innerHTML = footerHTML();
  }
}

mount();
