// 스크롤 시 섹션이 슬며시 나타나게 한다. (JS가 있을 때만 숨겼다 보여줌 — no-JS 안전)
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = document.querySelectorAll(".deck, .games");

if (!reduce && "IntersectionObserver" in window) {
  targets.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => observer.observe(el));
}
