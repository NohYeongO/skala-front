// 나의 여행지 — 갤러리 라이트박스
import "./layout.js"; // 공통 헤더/푸터
import "./reveal.js"; // 스크롤 등장

const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbCap = document.getElementById("lightbox-cap");
let trigger = null;

document.querySelectorAll(".gcard__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!lb || typeof lb.showModal !== "function") return;
    trigger = btn;
    const img = btn.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = btn.dataset.cap || "";
    lb.showModal();
  });
});

if (lb) {
  lb.addEventListener("click", (event) => {
    if (event.target === lb || event.target.hasAttribute("data-close")) lb.close();
  });
  lb.addEventListener("close", () => {
    lbImg.removeAttribute("src");
    if (trigger && typeof trigger.focus === "function") trigger.focus();
  });
}

// 브이로그 영상 모달 — 열면 재생, 닫으면 멈춤
const vm = document.getElementById("videoModal");
const vmPlayer = document.getElementById("videoModalPlayer");
let vmTrigger = null;

document.querySelectorAll("[data-video]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!vm || typeof vm.showModal !== "function") return;
    vmTrigger = btn;
    vm.showModal();
    // 사용자 클릭으로 열리므로 소리 포함 재생이 허용된다
    const p = vmPlayer.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  });
});

if (vm) {
  vm.addEventListener("click", (event) => {
    if (event.target === vm || event.target.hasAttribute("data-close")) vm.close();
  });
  vm.addEventListener("close", () => {
    vmPlayer.pause();
    vmPlayer.currentTime = 0;
    if (vmTrigger && typeof vmTrigger.focus === "function") vmTrigger.focus();
  });
}
