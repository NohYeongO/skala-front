// 성적 계산기
function calculateGrade() {
  const subjects = ["HTML", "CSS", "JavaScript"];
  let total = 0;

  for (let i = 0; i < subjects.length; i++) {
    let score;
    while (true) {
      const input = prompt(subjects[i] + " 점수를 입력하세요. (0~100)");
      if (input === null) {
        return; // 취소
      }
      score = Number(input);
      if (input.trim() === "" || Number.isNaN(score) || score < 0 || score > 100) {
        alert("0부터 100 사이의 숫자를 입력해 주세요.");
        continue;
      }
      break;
    }
    total += score;
  }

  const average = total / subjects.length;
  const passed = average >= 60;

  alert(
    "------ 📊 성적 평가표 ------\n" +
      "· 총점: " + total + "점\n" +
      "· 평균: " + average.toFixed(1) + "점\n" +
      "--------------------------\n" +
      "· 결과: " + (passed ? "🎉 합격" : "😢 불합격") + "입니다!"
  );
}

const gradeBtn = document.getElementById("gradeBtn");
if (gradeBtn) {
  gradeBtn.addEventListener("click", calculateGrade);
}
