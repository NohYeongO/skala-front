// 회원가입 폼 제출 시 계정을 localStorage에 저장하고 자동 로그인한다.
// 이미 있는 아이디면 막고 안내한다.
import { registerAccount, login } from "./auth.js";

const form = document.querySelector('form[action="signUpResult.html"]');
const msg = document.getElementById("signupMsg");

form?.addEventListener("submit", (event) => {
  const id = form.querySelector("#userId")?.value.trim();
  const password = form.querySelector("#password")?.value;
  const name = form.querySelector("#name")?.value.trim() || id;
  if (!id || !password) return; // 빈 값은 브라우저 required 검증에 맡긴다

  const result = registerAccount({ id, password, name });
  if (!result.ok) {
    event.preventDefault();
    if (msg) msg.textContent = result.reason;
    form.querySelector("#userId")?.focus();
    return;
  }
  // 계정 생성 성공 → 자동 로그인한 뒤 폼이 signUpResult.html로 이동한다.
  login(id, password);
});
