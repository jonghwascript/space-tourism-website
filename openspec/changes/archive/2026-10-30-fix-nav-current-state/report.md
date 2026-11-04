# Report: fix-nav-current-state

2026-10-30. Chromium(Playwright 1.63, headless)으로 검증했습니다. 스크래치 미리보기 빌드와 로컬 HTTP 서버를 썼고 `dist`는 사용하지 않았습니다. 캡처는 남기지 않고(AGENTS.md), DOM 속성·computed style·요소 상자를 측정했습니다.

## 준비 (1.1, 1.2)

- 사용자 미커밋 변경: `README.md`, `screenshot.jpg`. 이 change는 두 파일을 수정하지 않았습니다.
- 수정 대상(`header.html`, 대표 페이지 4개, `_site-header.scss`, `main.js`)에는 작업 전 사용자 변경이 없었습니다.
- 변경 전 기준값: 12개 페이지 × 375·768·1440px의 헤더 링크별 `aria-current`, 표시선 색(아래·오른쪽 테두리), 링크·헤더 상자를 JSON으로 저장했습니다. 375px은 메뉴를 연 상태입니다.
- 변경 전 확인: `destination-mars.html`에서 Destination 링크(`./destination-moon.html`)가 `aria-current="page"`였습니다.

## 구현 요약

| 파일 | 변경 |
| --- | --- |
| `src/pages/{index,destination-moon,crew-commander,technology-vehicle}.html` | header include context에 `"landing": true` 추가 |
| `src/partials/header.html` | 링크 4개의 조건을 `context.current === '<그룹>' && context.landing` → `page`, `&& !context.landing` → `true`로 나눔. `prettier-ignore` 주석 유지 |
| `src/scss/components/_site-header.scss` | 현재 표시선 선택자를 기본·강제 색상 두 곳 모두 `[aria-current='page'], [aria-current='true']`로 넓힘 |
| `src/js/main.js` | 탭 블록 `updateLocation()`에서 주소 교체 시도 뒤, 헤더의 현재 링크 목적지 경로가 실제 `location.pathname`과 같으면 `page`, 아니면 `true`로 설정(8줄) |

## 구현 중 바로잡은 점

- 계획 문서에 "대표 페이지가 아닌 7개 페이지"라고 적었지만, 실제로는 **8개**입니다(Destination 3, Crew 3, Technology 2). 측정에서 확인해 proposal·design·tasks의 숫자를 고쳤습니다.

## 검증 결과

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| `@@if` 식(`&&`, `!`) | 검증 완료 | 빌드 결과에 기대한 속성이 생기고 `@@`가 남지 않음 |
| 빌드된 `aria-current` | 검증 완료 | 12개 페이지: 대표 4개는 목적지가 그 페이지인 링크만 `page`, 나머지 8개는 그룹 링크만 `true`. 페이지마다 현재 링크가 정확히 하나(불일치 0) |
| Prettier 보호 | 검증 완료 | `npx prettier`를 표준 출력으로만 실행: `@@if` 8개 유지, 깨진 줄 0. `prettier-ignore` 4개 유지 |
| 표시선 유지 | 검증 완료 | 12개 페이지 × 375(메뉴 열림)·768·1440px: 아래·오른쪽 테두리 색이 기준값과 모두 같음. 바뀐 것은 `aria-current` 값뿐(8개 페이지 × 3폭) |
| 강제 색상 | 검증 완료(에뮬레이션) | `destination-mars` 1440, `crew-pilot` 1440·375(메뉴 열림): `true` 링크만 `rgb(0,0,0)`(CanvasText), 나머지는 배경과 같은 `rgb(255,255,255)` |
| 탭 전환 후 갱신 | 검증 완료 | Moon→Mars 클릭: Destination `true`. Mars→Moon: `page`. crew-pilot→첫 점(1440·375): Crew `page`. Technology ↓(vehicle→spaceport): `true`. ↑(spaceport→vehicle): `page`. 모두 표시선 white 유지 |
| 스크립트 없음 | 검증 완료 | JS 끈 `technology-spaceport.html`: Technology 링크 `true`(빌드 값) |
| SCSS·JS 문법 | 검증 완료 | `sass.compile` 통과, `node --check src/js/main.js` 통과 |
| 헤더 배치 회귀 | 검증 완료 | 12개 페이지 × 3폭 헤더·링크 상자 차이 0 |
| 탭 전환 기존 동작 | 검증 완료 | 11개 항목 주소·제목 일치, 페이드(60ms 0.35 → 1), 움직임 줄이기, 뒤로 가기(`/index.html`), 홈 메뉴 Escape 모두 이전과 같음 |
| 전체 콘솔·메뉴 | 검증 완료 | 12개 페이지 × 320·375·768·1024·1440px 콘솔 오류 없음, 375px 메뉴 열기·Escape 정상 |
| Firefox | 미검증 | 미설치 |
| 스크린 리더 낭독 | 미검증 | 속성 값만 확인. NVDA·VoiceOver에서 "current page"와 "current"로 읽히는지는 확인하지 않음 |

## 범위 (4.2)

- 변경: `src/partials/header.html`, `src/pages/` 대표 4개, `src/scss/components/_site-header.scss`, `src/js/main.js`, 이 change 폴더(합계 21줄 추가·10줄 삭제)
- `dist` 변경 없음. 사용자 미커밋 파일(`README.md`, `screenshot.jpg`)은 수정하지 않았습니다.
- `git diff --check -- src`를 통과했습니다.
