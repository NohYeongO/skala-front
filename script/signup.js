// 회원가입 검증 → localStorage 저장 → 자동 로그인.
// 주의: 성공 시 JS로 이동해 비밀번호가 URL(GET 쿼리)에 남지 않게 한다.
import { registerAccount, login } from "./auth.js";

const form = document.querySelector('form[action="signUpResult.html"]');
const msg = document.getElementById("signupMsg");
const idInput = form?.querySelector("#userId");
const pwInput = form?.querySelector("#password");

// 아이디: 영문·숫자 4~15자
const ID_RE = /^[A-Za-z0-9]{4,15}$/;
// 비밀번호: 영문과 숫자를 모두 포함해 8자 이상
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function fail(input, message) {
  if (msg) msg.textContent = message;
  input?.setAttribute("aria-invalid", "true");
  input?.focus();
}

// 입력을 고치면 오류 표시를 지운다
[idInput, pwInput].forEach((input) => {
  input?.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    if (msg) msg.textContent = "";
  });
});

form?.addEventListener("submit", (event) => {
  // 기본 전송(GET)을 막아 비밀번호가 URL·기록에 남지 않게 한다.
  event.preventDefault();
  if (msg) msg.textContent = "";

  const id = idInput?.value.trim() || "";
  const password = pwInput?.value || "";
  const name = form.querySelector("#name")?.value.trim() || id;

  if (!ID_RE.test(id)) {
    fail(idInput, "아이디는 영문·숫자 4~15자로 입력해 주세요.");
    return;
  }
  if (!PW_RE.test(password)) {
    fail(pwInput, "비밀번호는 영문과 숫자를 함께 포함해 8자 이상으로 입력해 주세요.");
    return;
  }

  const result = registerAccount({ id, password, name });
  if (!result.ok) {
    fail(idInput, result.reason); // 예: 이미 존재하는 아이디
    return;
  }

  login(id, password);
  window.location.href = "signUpResult.html";
});
