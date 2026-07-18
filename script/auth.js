// 로컬 스토리지 기반 간단 인증 (계정·세션).
// 강의 규칙상 서버·DB 없이 클라이언트에서만 처리한다. (실제 서비스용 보안은 아님)
import { readJSON, writeJSON } from "./util.js";

const ACCOUNTS_KEY = "skala-accounts";
const SESSION_KEY = "skala-session";

export function getAccounts() {
  return readJSON(ACCOUNTS_KEY, []);
}

export function registerAccount({ id, password, name }) {
  const accounts = getAccounts();
  if (accounts.some((account) => account.id === id)) {
    return { ok: false, reason: "이미 존재하는 아이디입니다." };
  }
  accounts.push({ id, password, name: name || id });
  writeJSON(ACCOUNTS_KEY, accounts);
  return { ok: true };
}

export function login(id, password) {
  const account = getAccounts().find((a) => a.id === id && a.password === password);
  if (!account) {
    return { ok: false, reason: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }
  writeJSON(SESSION_KEY, { id: account.id, name: account.name });
  return { ok: true, name: account.name };
}

export function getSession() {
  return readJSON(SESSION_KEY, null);
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    // 무시
  }
}
