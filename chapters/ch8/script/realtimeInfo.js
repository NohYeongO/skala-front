// 도시 선택 → 실시간 날씨 표시 (화면 책임)
import { fetchWeather } from "./weatherAPI.js";

const select = document.getElementById("city-select");
const box = document.getElementById("weather-box");

if (select && box) {
  select.addEventListener("change", handleCityChange);
}

async function handleCityChange() {
  if (!select.value) {
    box.innerHTML = "";
    return;
  }

  const option = select.selectedOptions[0];
  const name = option.textContent.trim();
  const lat = option.dataset.lat;
  const lon = option.dataset.lon;

  box.innerHTML = "<p>실시간 날씨 로딩 중… ⏳</p>";

  try {
    const weather = await fetchWeather(lat, lon);
    box.innerHTML =
      `<h3>🌍 ${name} 실시간 날씨</h3>` +
      `<p>🌡️ 현재 기온: <strong>${weather.temperature}°C</strong></p>` +
      `<p>💧 현재 습도: <strong>${weather.humidity}%</strong></p>` +
      `<p class="weather-coords">위도 ${lat} · 경도 ${lon}</p>`;
  } catch (error) {
    console.error(error);
    box.innerHTML =
      "<p>날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>";
  }
}
