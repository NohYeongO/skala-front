// 로그인 페이지 — 아이디/비밀번호를 계정과 대조해 세션을 만든다.
import { login } from "./auth.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");
const idInput = document.getElementById("loginId");
const pwInput = document.getElementById("loginPw");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = idInput.value.trim();
  const password = pwInput.value;
  const result = login(id, password);
  if (result.ok) {
    location.href = "index.html";
  } else {
    msg.textContent = result.reason;
    idInput.setAttribute("aria-invalid", "true");
    pwInput.setAttribute("aria-invalid", "true");
    idInput.focus();
  }
});

// 다시 입력하면 오류 표시를 해제한다.
[idInput, pwInput].forEach((el) =>
  el?.addEventListener("input", () => el.removeAttribute("aria-invalid"))
);
