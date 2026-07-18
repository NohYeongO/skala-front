// 공용 유틸 — 사용자 입력을 innerHTML에 넣기 전 HTML 이스케이프
export function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}

// localStorage 읽기/쓰기 (실패는 조용히 무시) — 게임 저장 로직 공용화
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // 저장소가 외부에서 조작돼도 배열 메서드가 깨지지 않게 형태를 확인한다
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (error) {
    return fallback;
  }
}
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
}
