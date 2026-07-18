// Up-Down 숫자 맞추기 게임
function startUpDownGame() {
  const computerNum = Math.floor(Math.random() * 50) + 1;
  let tries = 0;

  while (true) {
    const input = prompt("1부터 50 사이의 숫자 중 컴퓨터가 생각한 숫자는 무엇일까요?");
    if (input === null) {
      return; // 취소
    }

    const guess = Number(input);
    if (!Number.isInteger(guess) || guess < 1 || guess > 50) {
      alert("1부터 50 사이의 숫자를 입력해 주세요.");
      continue;
    }

    tries++;
    if (guess > computerNum) {
      alert("Down!");
    } else if (guess < computerNum) {
      alert("Up!");
    } else {
      alert("축하합니다! " + tries + "번 만에 맞추셨습니다.");
      return;
    }
  }
}

const upDownBtn = document.getElementById("upDownBtn");
if (upDownBtn) {
  upDownBtn.addEventListener("click", startUpDownGame);
}
