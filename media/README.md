# media

`html/myTrip.html`에서 사용하는 미디어 리소스 폴더입니다.

| 파일명 | 용도 | 형식 |
|--------|------|------|
| `concert-music.mp3` | 여행 앨범 배경 음악 (콘서트 녹음) | 오디오 (mp3) |
| `osaka-castle-2026.jpg` | 여행 사진 — 오사카성 (2026년) | 이미지 |
| `france-2020.jpg` | 여행 사진 — 프랑스 (2020년) | 이미지 |
| `santiago-2020.jpg` | 여행 사진 — 산티아고 순례길 (2020년) | 이미지 |
| `japan-baseball.mp4` | 여행 브이로그 — 일본 야구 홈런 (720p 변환) | 비디오 (mp4) |

원본은 `.m4a`(오디오)·`.mov`(비디오)였으나 브라우저 호환성·용량을 위해
`mp3`·`mp4`(H.264)로 변환했습니다. 파일명/캡션을 바꾸려면
`html/myTrip.html`의 `src`·`<figcaption>`·`alt`를 함께 수정하세요.

> 공개 저장소이므로, 사진을 추가할 때는 커밋 전에 반드시 EXIF 메타데이터
> (GPS 위치·기기정보 등)를 제거합니다. 예: `exiftool -all= -overwrite_original 사진.jpg`
