// 게임 공용 모달 — 모든 게임이 공유한다. 페이지에 없으면 주입한다.
let modal, titleEl, bodyEl;

export function ensureModal() {
  modal = document.getElementById("gameModal");
  if (!modal) {
    modal = document.createElement("dialog");
    modal.className = "game-modal";
    modal.id = "gameModal";
    modal.setAttribute("aria-labelledby", "game-modal-title");
    modal.innerHTML =
      '<form method="dialog"><button type="submit" class="game-modal__close" value="close" aria-label="닫기">✕</button></form>' +
      '<h3 id="game-modal-title"></h3><div id="game-modal-body"></div>';
    document.body.appendChild(modal);
  }
  titleEl = document.getElementById("game-modal-title");
  bodyEl = document.getElementById("game-modal-body");
  if (!modal.dataset.wired) {
    modal.dataset.wired = "1";
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  }
  return modal;
}

export function openModal(title, html) {
  if (!modal) ensureModal();
  const trigger = document.activeElement;
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  if (typeof modal.showModal === "function") {
    modal.showModal();
    // 닫을 때 포커스를 열었던 요소로 되돌린다 (접근성)
    modal.addEventListener(
      "close",
      () => {
        if (trigger && typeof trigger.focus === "function") trigger.focus();
      },
      { once: true }
    );
  }
}
