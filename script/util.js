// 공용 유틸 — 사용자 입력을 innerHTML에 넣기 전 HTML 이스케이프
export function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}
