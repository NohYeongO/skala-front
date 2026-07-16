// Open-Meteo 날씨 API 호출 (데이터 책임)
export async function fetchWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("날씨 API 응답 오류: " + response.status);
  }

  const data = await response.json();
  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
  };
}
