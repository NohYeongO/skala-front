// 강의 일정 — 4반 주간 시간표 뷰어.
// 주 단위 이전/다음 이동 + 달력에서 날짜 선택 시 그 주를 표시한다.
import { SCHEDULE } from "./scheduleData.js";
import { escapeHTML } from "./util.js";
import "./layout.js"; // 공통 헤더/푸터

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

// 날짜 문자열("2026-07-20") → 주 인덱스
const dateToWeek = new Map();
SCHEDULE.forEach((w, i) => w.days.forEach((d) => dateToWeek.set(d.date, i)));

// 스케줄 범위(달 이동 제한용)
const firstDate = parseDate(SCHEDULE[0].days[0].date);
const lastWeekDays = SCHEDULE[SCHEDULE.length - 1].days;
const lastDate = parseDate(lastWeekDays[lastWeekDays.length - 1].date);

// 요소
const board = document.getElementById("board");
const weekTitle = document.getElementById("weekHeading");
const calGrid = document.getElementById("calGrid");
const calTitle = document.getElementById("calTitle");
const prevWeekBtn = document.querySelector("[data-week-prev]");
const nextWeekBtn = document.querySelector("[data-week-next]");
const prevMonBtn = document.querySelector("[data-cal-prev]");
const nextMonBtn = document.querySelector("[data-cal-next]");

// 상태
let weekIndex = defaultWeek();
let calYear;
let calMonth;

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function iso(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function fmtMD(s) {
  const [, m, d] = s.split("-");
  return `${m}.${d}`;
}
function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

// 해당 날짜가 속한 그 주의 월요일
function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=일 … 6=토
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

// 기준 월요일: 평일이면 이번 주, 주말(토·일)이면 다음 주 월요일
function targetMonday() {
  const today = startOfToday();
  const mon = mondayOf(today);
  const day = today.getDay(); // 0=일 … 6=토
  if (day === 0 || day === 6) mon.setDate(mon.getDate() + 7);
  return mon.getTime();
}

// 기준 주(없으면 다가오는 주, 그마저 없으면 마지막 주)
function defaultWeek() {
  const target = targetMonday();
  for (let i = 0; i < SCHEDULE.length; i++) {
    const wm = mondayOf(parseDate(SCHEDULE[i].days[0].date)).getTime();
    if (wm >= target) return i;
  }
  return SCHEDULE.length - 1;
}

// ── 주간 보드 ──
function dayRow(d) {
  const type = d.type || "class";
  const tag =
    type === "special"
      ? '<span class="board__tag board__tag--special">특강</span>'
      : type === "holiday"
        ? '<span class="board__tag board__tag--off">휴무</span>'
        : "";
  const prof = d.prof
    ? `<span class="board__prof">${escapeHTML(d.prof)}</span>`
    : '<span class="board__prof board__prof--none" aria-hidden="true">—</span>';
  return `<li class="board__row board__row--${type}">
      <span class="board__date"><b>${fmtMD(d.date)}</b><span>${d.dow}</span></span>
      <span class="board__course">${escapeHTML(d.course)}${tag}</span>
      ${prof}
    </li>`;
}

function renderWeek() {
  const w = SCHEDULE[weekIndex];
  const first = w.days[0].date;
  const last = w.days[w.days.length - 1].date;
  weekTitle.textContent = `${w.week}주차 · ${fmtMD(first)} ~ ${fmtMD(last)}`;
  board.innerHTML = w.days.map(dayRow).join("");
  prevWeekBtn.disabled = weekIndex === 0;
  nextWeekBtn.disabled = weekIndex === SCHEDULE.length - 1;
  renderDaily(w);
  // 달력을 이 주가 속한 달로 맞춘다
  const fd = parseDate(first);
  calYear = fd.getFullYear();
  calMonth = fd.getMonth();
  renderCalendar();
}

// ── 주간 시간표 — 선택한 주차의 수업을 요일별 열로 그린다 (점심만 병합) ──
function renderDaily(w) {
  const head = document.getElementById("dailyHead");
  const body = document.getElementById("dailyBody");
  if (!head || !body) return;
  const cols = w.days
    .map((d) => `<th scope="col">${d.dow} <span class="daily__date">${fmtMD(d.date)}</span></th>`)
    .join("");
  head.innerHTML = `<tr><th scope="col">시간</th>${cols}</tr>`;

  const cell = (d, suffix) =>
    d.type === "holiday"
      ? '<td class="daily__off">휴무</td>'
      : `<td>${escapeHTML(d.course)}${suffix}` +
        (d.prof ? `<span class="daily__prof">${escapeHTML(d.prof)}</span>` : "") +
        "</td>";

  body.innerHTML = `
    <tr>
      <th scope="row">09:00 ~ 12:00<span class="daily__slot">오전 강의</span></th>
      ${w.days.map((d) => cell(d, "")).join("")}
    </tr>
    <tr>
      <th scope="row">12:00 ~ 13:00<span class="daily__slot">점심</span></th>
      <td colspan="${w.days.length}" class="daily__lunch">점심시간</td>
    </tr>
    <tr>
      <th scope="row">13:00 ~ 18:00<span class="daily__slot">오후 강의 및 실습</span></th>
      ${w.days.map((d) => cell(d, "")).join("")}
    </tr>`;
}

// ── 달력 ──
function renderCalendar() {
  calTitle.textContent = `${calYear}년 ${calMonth + 1}월`;
  const startDow = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = startOfToday();
  const todayIso = iso(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const selected = new Set(SCHEDULE[weekIndex].days.map((d) => d.date));

  let cells = DOW.map(
    (d, i) => `<span class="cal__dow${i === 0 ? " cal__dow--sun" : ""}" aria-hidden="true">${d}</span>`
  ).join("");
  for (let i = 0; i < startDow; i++) {
    cells += '<span class="cal__cell cal__cell--empty" aria-hidden="true"></span>';
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const ds = iso(calYear, calMonth + 1, day);
    const isToday = ds === todayIso;
    const cur = isToday ? ' aria-current="date"' : "";
    if (dateToWeek.has(ds)) {
      const cls =
        "cal__cell cal__cell--day" +
        (selected.has(ds) ? " is-selected" : "") +
        (isToday ? " is-today" : "");
      cells += `<button type="button" class="${cls}" data-date="${ds}" aria-label="${calMonth + 1}월 ${day}일 강의 보기"${cur}>${day}</button>`;
    } else {
      cells += `<span class="cal__cell cal__cell--off"${cur}>${day}</span>`;
    }
  }
  calGrid.innerHTML = cells;

  // 달 이동 제한 (스케줄 범위 밖으로는 못 감)
  prevMonBtn.disabled = calYear < firstDate.getFullYear() ||
    (calYear === firstDate.getFullYear() && calMonth <= firstDate.getMonth());
  nextMonBtn.disabled = calYear > lastDate.getFullYear() ||
    (calYear === lastDate.getFullYear() && calMonth >= lastDate.getMonth());
}

function shiftMonth(delta) {
  const d = new Date(calYear, calMonth + delta, 1);
  calYear = d.getFullYear();
  calMonth = d.getMonth();
  renderCalendar();
}

// ── 이벤트 ──
prevWeekBtn.addEventListener("click", () => {
  if (weekIndex > 0) {
    weekIndex -= 1;
    renderWeek();
  }
});
nextWeekBtn.addEventListener("click", () => {
  if (weekIndex < SCHEDULE.length - 1) {
    weekIndex += 1;
    renderWeek();
  }
});
prevMonBtn.addEventListener("click", () => shiftMonth(-1));
nextMonBtn.addEventListener("click", () => shiftMonth(1));
calGrid.addEventListener("click", (e) => {
  const cell = e.target.closest("[data-date]");
  if (!cell) return;
  weekIndex = dateToWeek.get(cell.getAttribute("data-date"));
  renderWeek();
});

renderWeek();
