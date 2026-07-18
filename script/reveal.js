// 접혀 있던 섹션만 스크롤 시 등장시킨다.
// 주의: 처음부터 보이는 섹션은 숨기지 않는다(전환 깜빡임 방지). no-JS는 그대로 노출.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const targets = document.querySelectorAll("[data-reveal]");

if (!reduce && "IntersectionObserver" in window) {
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
  const fold = window.innerHeight * 0.9;
  targets.forEach((el) => {
    // 이미 화면에 걸쳐 보이는 섹션은 숨기지 않는다(로드 직후 깜빡임 방지).
    if (el.getBoundingClientRect().top < fold) return;
    el.classList.add("reveal");
    observer.observe(el);
  });
}
