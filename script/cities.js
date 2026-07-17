// 홈 지도의 단일 데이터 소스. 마커·항로·로그·날씨가 여기서 파생된다.
// x, y 는 지도 이미지 기준 퍼센트 좌표(격자 오버레이로 보정).
export const CITIES = [
  { key: "seoul",    name: "서울",     iata: "ICN", lat: 37.57,  lon: 126.98, type: "home",    year: null, media: null,                    x: 81,   y: 42 },
  { key: "paris",    name: "파리",     iata: "CDG", lat: 48.85,  lon: 2.35,   type: "trip",    year: 2020, media: "france-2020.jpg",       x: 48,   y: 36 },
  { key: "santiago", name: "산티아고", iata: "SCQ", lat: 42.88,  lon: -8.54,  type: "trip",    year: 2020, media: "santiago-2020.jpg",     x: 44.5, y: 39 },
  { key: "taipei",   name: "타이베이", iata: "TPE", lat: 25.03,  lon: 121.57, type: "trip",    year: 2025, media: "Taipei-2025.jpg",       x: 80.5, y: 49 },
  { key: "bali",     name: "발리",     iata: "DPS", lat: -8.65,  lon: 115.22, type: "trip",    year: 2025, media: "bali-2025.jpg",         x: 78.5, y: 63 },
  { key: "osaka",    name: "오사카",   iata: "KIX", lat: 34.69,  lon: 135.50, type: "trip",    year: 2026, media: "osaka-castle-2026.jpg", x: 85,   y: 42, video: "japan-baseball.mp4" },
  { key: "nhatrang", name: "나트랑",   iata: "CXR", lat: 12.24,  lon: 109.19, type: "trip",    year: 2026, media: "vietnam-2026.jpg",      x: 76.5, y: 54 },
  { key: "newyork",  name: "뉴욕",     iata: "JFK", lat: 40.71,  lon: -74.01, type: "weather", year: null, media: null,                    x: 26.5, y: 40 },
  { key: "london",   name: "런던",     iata: "LHR", lat: 51.51,  lon: -0.13,  type: "weather", year: null, media: null,                    x: 46.5, y: 32 },
  { key: "sydney",   name: "시드니",   iata: "SYD", lat: -33.87, lon: 151.21, type: "trip",    year: 2023, media: "sydney-2023.jpg",      x: 86.5, y: 75 },
];

// 항로는 방문 순서(시간순). home + trip 노드를 이 순서로 잇는다.
export const ROUTE = ["seoul", "paris", "santiago", "sydney", "taipei", "bali", "osaka", "nhatrang"];
