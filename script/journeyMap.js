// 세계지도 위 도시 마커와 여행 항로(곡선 + 비행기)를 그린다.
// 비행기는 활성 도시(클릭·재생·연도)로 항로를 따라 날아간다.
import { CITIES, ROUTE } from "./cities.js";
import { showCity, showHint } from "./journeyLog.js";

const map = document.getElementById("map");
const byKey = Object.fromEntries(CITIES.map((c) => [c.key, c]));
const prefersReduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// viewBox는 지도 이미지 비율(1672:941 ≈ 1.778)에 맞춰 왜곡을 막는다.
const SX = 17.78;
const SY = 10;

let planeEl = null;
const plane = { x: 0, y: 0, raf: 0 };
const tour = { playing: false, index: 0 };

function renderMarkers() {
  for (const city of CITIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `marker marker--${city.type}`;
    button.style.left = `${city.x}%`;
    button.style.top = `${city.y}%`;
    button.dataset.key = city.key;
    const action = city.type === "trip" ? "날씨·여행 사진" : "날씨";
    button.innerHTML = `<span class="sr-only">${city.name} ${action} 보기</span>`;
    map.appendChild(button);
  }
}

// ROUTE 순서대로 노드를 잇는 부드러운 곡선(위로 아치)을 만든다.
function buildRoutePath() {
  const pts = ROUTE.map((k) => ({ x: byKey[k].x * SX, y: byKey[k].y * SY }));
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    const cy = Math.min(prev.y, p.y) - 120;
    d += ` Q${cx.toFixed(1)},${cy.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }
  return d;
}

function renderRoute() {
  const d = buildRoutePath();
  const svg = `
    <svg class="hero__route" viewBox="0 0 1778 1000" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path class="route-faint" d="${d}" pathLength="1" />
      <path class="route-draw" d="${d}" pathLength="1" />
      <path id="routePath" d="${d}" fill="none" stroke="none" />
      <g class="plane" id="plane"><path d="M-28,-14 L34,0 L-28,14 L-8,0 Z" /></g>
    </svg>`;
  map.insertAdjacentHTML("beforeend", svg);
  planeEl = document.getElementById("plane");
  placePlaneAtNode(0);
}

function cityXY(key) {
  const c = byKey[key];
  return { x: c.x * SX, y: c.y * SY };
}

function setPlane(x, y, angle) {
  planeEl.setAttribute(
    "transform",
    `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`
  );
  plane.x = x;
  plane.y = y;
}

// 진행 방향(다음 노드, 마지막이면 이전 노드)을 향하도록 각도를 잡는다.
function headingAt(index) {
  const cur = cityXY(ROUTE[index]);
  const refKey = ROUTE[index + 1] || ROUTE[index - 1] || ROUTE[index];
  const ref = cityXY(refKey);
  return (Math.atan2(ref.y - cur.y, ref.x - cur.x) * 180) / Math.PI;
}

function placePlaneAtNode(index) {
  const p = cityXY(ROUTE[index]);
  setPlane(p.x, p.y, headingAt(index));
}

function flyPlaneToNode(index) {
  const target = cityXY(ROUTE[index]);
  cancelAnimationFrame(plane.raf);
  const sx = plane.x;
  const sy = plane.y;
  const angle = (Math.atan2(target.y - sy, target.x - sx) * 180) / Math.PI;
  if (prefersReduce()) {
    setPlane(target.x, target.y, angle);
    return;
  }
  const duration = 1100;
  const startTime = performance.now();
  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    setPlane(sx + (target.x - sx) * eased, sy + (target.y - sy) * eased, angle);
    if (t < 1) plane.raf = requestAnimationFrame(frame);
  }
  plane.raf = requestAnimationFrame(frame);
}

// 마커 클릭 → 활성화 + 로그 갱신 + (항로 도시면) 비행기 이동
function activate(key) {
  for (const marker of map.querySelectorAll(".marker")) {
    marker.classList.toggle("is-active", marker.dataset.key === key);
  }
  showCity(byKey[key]);
  const index = ROUTE.indexOf(key);
  if (index >= 0) {
    tour.index = index;
    flyPlaneToNode(index);
  }
}

// 여정 재생 — 현재 위치부터 항로를 순서대로 순회
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playBtn = document.getElementById("playJourney");

function setPlayLabel(playing) {
  if (!playBtn) return;
  playBtn.setAttribute("aria-pressed", String(playing));
  playBtn.querySelector(".btn-play__icon").textContent = playing ? "⏸" : "▶";
  playBtn.querySelector(".btn-play__label").textContent = playing ? "정지" : "여정 재생";
}

function stopTour() {
  if (!tour.playing) return;
  tour.playing = false;
  setPlayLabel(false);
}

async function playTour() {
  tour.playing = !tour.playing;
  setPlayLabel(tour.playing);
  if (!tour.playing) return;
  let start = tour.index;
  if (start >= ROUTE.length - 1) start = 0; // 끝이면 처음부터
  for (let i = start; i < ROUTE.length; i++) {
    if (!tour.playing) return;
    activate(ROUTE[i]);
    await wait(3200);
  }
  stopTour();
}

map.addEventListener("click", (event) => {
  const marker = event.target.closest(".marker");
  if (marker) {
    stopTour();
    activate(marker.dataset.key);
  }
});

if (playBtn) playBtn.addEventListener("click", playTour);

// 연도 타임라인 → 그 해 첫 도시로 이동
const firstCityOfYear = {};
for (const key of ROUTE) {
  const city = byKey[key];
  if (city.year && !(city.year in firstCityOfYear)) firstCityOfYear[city.year] = key;
}
for (const yearBtn of document.querySelectorAll(".timeline [data-year]")) {
  yearBtn.addEventListener("click", () => {
    stopTour();
    const key = firstCityOfYear[yearBtn.dataset.year];
    if (key) activate(key);
  });
}

renderMarkers();
renderRoute();
showHint();

export { renderMarkers, renderRoute, activate };
