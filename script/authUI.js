// 헤더 로그인 상태 표시. 주의: 사용자 이름은 textContent로만 넣는다(XSS 차단).
import { getSession, logout } from "./auth.js";

function link(className, href, text) {
  const anchor = document.createElement("a");
  anchor.className = className;
  anchor.href = href;
  anchor.textContent = text;
  return anchor;
}

export function renderAuth() {
  const area = document.getElementById("authArea");
  if (!area) return;
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
      renderAuth();
    });
    area.append(name, logoutBtn);
  } else {
    area.append(link("btn-login", "login.html", "로그인"), link("btn-signup", "signUp.html", "회원가입"));
  }
}
