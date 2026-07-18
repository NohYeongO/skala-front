// 여정 로그 — 선택한 도시를 탑승권으로 표시 (분할플랩 도시 코드 + 실시간 날씨).
import { fetchWeather } from "./weatherAPI.js";

const log = document.getElementById("log");
const logStatus = document.getElementById("logStatus");
const modal = document.getElementById("photoModal");
const modalImg = document.getElementById("photo-modal-img");
const modalCap = document.getElementById("photo-modal-cap");
const modalStamp = document.getElementById("photo-modal-stamp");

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const prefersReduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

let flipTimers = [];
let weatherToken = 0;

// 스크린리더용 간결 안내 — 티켓 전체가 아니라 핵심(도시·날씨)만 낭독한다.
function announce(text) {
  if (logStatus) logStatus.textContent = text;
}

export function showHint() {
  log.innerHTML =
    '<div class="log-hint"><p class="log-hint__welcome">스칼라에 오신 것을 환영합니다.</p>' +
    '<p><span aria-hidden="true">📍</span> 지도의 도시를 클릭해<br />여정을 확인하세요</p></div>';
}

export async function showCity(city) {
  log.innerHTML = shellHTML(city);
  flipTo(document.getElementById("bp-dest"), city.iata);
  const viewBtn = log.querySelector(".bp__view");
  if (viewBtn) viewBtn.addEventListener("click", () => openPhoto(city, viewBtn));
  await mountWeather(city);
}

// 도시 코드(IATA 3글자)로 편명·게이트·좌석을 결정적으로 만든다(항상 같은 값).
function ticketMeta(iata) {
  const [first, second, third] = [0, 1, 2].map((i) => iata.charCodeAt(i));
  return {
    flight: `NA${(first % 9) + 1}${second % 10}${third % 10}`,
    gate: `${String.fromCharCode(65 + (first % 6))}${(third % 20) + 1}`,
    seat: `${(second % 30) + 1}${"ABCDF"[third % 5]}`,
  };
}

function shellHTML(city) {
  const { flight, gate, seat } = ticketMeta(city.iata);
  let tag;
  let date;
  if (city.type === "trip") {
    tag = `${city.name} 여행`;
    date = String(city.year);
  } else if (city.type === "home") {
    tag = "HOME BASE";
    date = "—";
  } else {
    tag = "실시간 날씨";
    date = "—";
  }
  // 사진이 있는 도시는 바코드 자리에 "여행 사진 보기" 버튼(클릭 시 모달)을 둔다.
  const bottom = city.media
    ? '<button type="button" class="bp__view">📸 여행 사진 보기</button>'
    : '<div class="bp__barcode" aria-hidden="true"></div>';

  return `
    <article class="bp">
      <div class="bp__stub"><span>NOH&nbsp;AIR</span><span class="bp__flight">${flight}</span></div>
      <div class="bp__body">
        <div class="bp__top">
          <p class="bp__label">BOARDING PASS</p>
          <p class="bp__tag">${tag}</p>
        </div>
        <p class="bp__route">
          <span class="bp__ep"><b class="bp__code">KWJ</b><small>광주</small></span>
          <span class="bp__plane" aria-hidden="true">✈</span>
          <span class="bp__ep"><b class="flip" id="bp-dest" aria-label="${city.name} (${city.iata})"></b><small>${city.name}</small></span>
        </p>
        <dl class="bp__grid">
          <div><dt>PASSENGER</dt><dd>NOH YEONG O</dd></div>
          <div><dt>DATE</dt><dd>${date}</dd></div>
          <div><dt>GATE</dt><dd>${gate}</dd></div>
          <div><dt>SEAT</dt><dd>${seat}</dd></div>
        </dl>
        <dl class="bp__weather" id="bp-weather"><div><dt>날씨</dt><dd>불러오는 중…</dd></div></dl>
        ${bottom}
      </div>
    </article>`;
}

function flipTo(el, target) {
  // 이전 애니메이션 타이머를 먼저 정리해 누수를 막는다.
  flipTimers.forEach(clearInterval);
  flipTimers = [];
  el.textContent = "";
  const tiles = [...target].map((ch) => {
    const tile = document.createElement("span");
    tile.className = "flip__tile";
    tile.textContent = ch;
    el.appendChild(tile);
    return { tile, ch };
  });
  if (prefersReduce()) return;
  for (let i = 0; i < tiles.length; i++) {
    const { tile, ch } = tiles[i];
    const steps = 6 + i * 3;
    let n = 0;
    const timer = setInterval(() => {
      n += 1;
      if (n >= steps) {
        tile.textContent = ch;
        clearInterval(timer);
      } else {
        tile.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }, 45);
    flipTimers.push(timer);
  }
}

async function mountWeather(city) {
  const box = document.getElementById("bp-weather");
  const cacheKey = `skala-weather-${city.key}`;
  const token = ++weatherToken;
  try {
    let weather = readWeatherCache(cacheKey);
    if (!weather) {
      announce(`${city.name} 날씨 불러오는 중`);
      weather = await fetchWeather(city.lat, city.lon);
      writeWeatherCache(cacheKey, weather);
    }
    if (token !== weatherToken) return; // 그 사이 다른 도시를 선택했으면 이 결과는 버린다.
    box.innerHTML = `
      <div><dt>기온</dt><dd>${weather.temperature}°C</dd></div>
      <div><dt>습도</dt><dd>${weather.humidity}%</dd></div>`;
    announce(`${city.name}, 기온 ${weather.temperature}도, 습도 ${weather.humidity}퍼센트`);
  } catch (error) {
    if (token !== weatherToken) return;
    console.error(error);
    box.innerHTML = "<div><dd>날씨 정보를 불러오지 못했습니다.</dd></div>";
    announce(`${city.name}, 날씨 정보를 불러오지 못했습니다`);
  }
}

// 세션 동안 도시별 날씨를 캐시해 재클릭 시 API를 다시 부르지 않는다.
function readWeatherCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function writeWeatherCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // 저장 실패(용량 초과 등)는 조용히 무시하고 계속 진행
  }
}

function openPhoto(city, trigger) {
  if (!modal || typeof modal.showModal !== "function") return;
  modalImg.src = `../media/${city.media}`;
  modalImg.alt = `${city.name} 여행 사진`;
  modalCap.textContent = `${city.name} · ${city.year}`;
  modalStamp.textContent = `ARRIVED · ${city.iata}`;
  modal.showModal();
  // 닫을 때 포커스를 열었던 버튼으로 되돌린다 (접근성)
  modal.addEventListener(
    "close",
    () => {
      if (trigger && typeof trigger.focus === "function") trigger.focus();
    },
    { once: true }
  );
}

// 백드롭(사진 바깥) 클릭 시 닫기
if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}
