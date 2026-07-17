// 헤더의 로그인 상태 표시 — 로그인 시 이름+로그아웃, 아니면 로그인+회원가입
// 사용자 이름은 textContent로만 넣어 XSS를 원천 차단한다.
import { getSession, logout } from "./auth.js";

const area = document.getElementById("authArea");

function link(className, href, text) {
  const anchor = document.createElement("a");
  anchor.className = className;
  anchor.href = href;
  anchor.textContent = text;
  return anchor;
}

function render() {
  const session = getSession();
  area.replaceChildren();
  if (session) {
    const name = document.createElement("span");
    name.className = "auth__name";
    name.textContent = `${session.name}님`;
    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "btn-logout";
    logoutBtn.textContent = "로그아웃";
    logoutBtn.addEventListener("click", () => {
      logout();
      render();
    });
    area.append(name, logoutBtn);
  } else {
    area.append(link("btn-login", "login.html", "로그인"), link("btn-signup", "signUp.html", "회원가입"));
  }
}

if (area) render();
