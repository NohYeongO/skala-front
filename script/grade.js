// 성적 계산기 — 과목·점수를 넣으면 등급이 매겨지고 평점·최종 등급을 계산한다.
// 성적 기록은 날짜와 함께 localStorage에 저장해 과거 기록을 볼 수 있다.
import { openModal } from "./gameModal.js";
import { escapeHTML, readJSON, writeJSON } from "./util.js";

const GRADES_KEY = "skala-grades";
const GRADE_POINT = { A: 4.5, B: 3.5, C: 2.5, D: 1.5, F: 0 };

function letterOf(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
function getGrades() {
  return readJSON(GRADES_KEY, []);
}
function setGrades(list) {
  writeJSON(GRADES_KEY, list);
}
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function startGrade() {
  openModal(
    "성적 계산기 📊",
    `<p>과목과 점수를 넣으면 등급이 매겨지고, 평점과 최종 등급이 계산됩니다.</p>
     <p class="game-row">
       <input type="text" id="gr-subject" placeholder="과목명" aria-label="과목명" maxlength="20" />
       <input type="number" id="gr-score" min="0" max="100" placeholder="점수" aria-label="점수" inputmode="numeric" />
       <button type="button" id="gr-add" class="bag-btn">추가</button>
     </p>
     <p id="gr-msg" class="game-msg" aria-live="polite"></p>
     <ul class="grade__list" id="gr-list"></ul>
     <div class="grade__result" id="gr-result" hidden>
       <p class="grade__gpa">평점 <b id="gr-gpa">0.00</b> / 4.5 · 최종 등급 <b class="grade__final" id="gr-final">–</b> · <b id="gr-pass"></b></p>
       <button type="button" id="gr-save" class="grade__save">이 성적 기록 저장</button>
     </div>
     <h4 class="grade__past-title"><span aria-hidden="true">🗂️</span> 과거 기록</h4>
     <ul class="grade__past" id="gr-past"></ul>`
  );

  const subjectEl = document.getElementById("gr-subject");
  const scoreEl = document.getElementById("gr-score");
  const msg = document.getElementById("gr-msg");
  const listEl = document.getElementById("gr-list");
  const resultEl = document.getElementById("gr-result");
  const gpaEl = document.getElementById("gr-gpa");
  const finalEl = document.getElementById("gr-final");
  const passEl = document.getElementById("gr-pass");
  const pastEl = document.getElementById("gr-past");
  const subjects = [];

  function renderList() {
    listEl.innerHTML = subjects
      .map(
        (s, i) =>
          `<li class="grade__item"><span class="grade__subject">${escapeHTML(s.name)}</span>` +
          `<span class="grade__score">${s.score}점</span>` +
          `<span class="grade__badge grade__badge--${s.grade}">${s.grade}</span>` +
          `<button type="button" class="grade__remove" data-i="${i}" aria-label="${escapeHTML(s.name)} 빼기">✕</button></li>`
      )
      .join("");
    if (subjects.length) {
      const avgScore = subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length;
      const gpa = subjects.reduce((sum, s) => sum + GRADE_POINT[s.grade], 0) / subjects.length;
      gpaEl.textContent = gpa.toFixed(2);
      finalEl.textContent = letterOf(avgScore);
      finalEl.className = `grade__final grade__badge--${letterOf(avgScore)}`;
      // 평균 60점(D) 이상이면 합격
      const passed = avgScore >= 60;
      passEl.textContent = passed ? "합격" : "불합격";
      passEl.className = passed ? "grade__pass" : "grade__pass grade__pass--fail";
      resultEl.hidden = false;
    } else {
      resultEl.hidden = true;
    }
  }

  function add() {
    const name = subjectEl.value.trim();
    const score = Number(scoreEl.value);
    if (!name) {
      msg.textContent = "과목명을 입력하세요.";
      subjectEl.focus();
      return;
    }
    if (scoreEl.value === "" || Number.isNaN(score) || score < 0 || score > 100) {
      msg.textContent = "점수는 0~100 사이로 입력하세요.";
      scoreEl.focus();
      return;
    }
    msg.textContent = "";
    subjects.push({ name, score, grade: letterOf(score) });
    subjectEl.value = "";
    scoreEl.value = "";
    renderList();
    subjectEl.focus();
  }

  function renderPast() {
    const records = getGrades();
    pastEl.innerHTML = records.length
      ? records
          .map(
            (r, i) =>
              `<li class="grade__past-item"><span class="grade__past-date">${escapeHTML(r.date)}</span>` +
              `<span>평점 ${escapeHTML(String(r.gpa))} · <b class="grade__badge--${escapeHTML(r.final)}">${escapeHTML(r.final)}</b> · ${escapeHTML(String(r.count))}과목</span>` +
              `<button type="button" class="grade__remove" data-past="${i}" aria-label="기록 삭제">✕</button></li>`
          )
          .join("")
      : '<li class="bag-empty">저장된 기록이 없습니다.</li>';
  }

  function save() {
    if (!subjects.length) return;
    const records = getGrades();
    records.unshift({
      date: todayStr(),
      count: subjects.length,
      gpa: gpaEl.textContent,
      final: finalEl.textContent,
    });
    setGrades(records.slice(0, 20));
    renderPast();
    msg.textContent = "기록을 저장했어요! ✅";
  }

  document.getElementById("gr-add").addEventListener("click", add);
  subjectEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") scoreEl.focus();
  });
  scoreEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") add();
  });
  document.getElementById("gr-save").addEventListener("click", save);
  listEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".grade__remove");
    if (!btn) return;
    subjects.splice(Number(btn.dataset.i), 1);
    renderList();
    subjectEl.focus(); // 삭제로 버튼이 사라지므로 입력창으로 포커스 복원
  });
  pastEl.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-past]");
    if (!btn) return;
    const records = getGrades();
    records.splice(Number(btn.dataset.past), 1);
    setGrades(records);
    renderPast();
    subjectEl.focus();
  });

  renderList();
  renderPast();
  subjectEl.focus();
}
