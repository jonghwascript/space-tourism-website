# 구현 보고: improve-header-accessibility

## 변경 파일

| 파일 | 내용 |
| --- | --- |
| `src/partials/head.html` | 스타일시트 앞 인라인 스크립트로 `<html>`에 `has-js` 추가, `main.js` `<script>`의 `onerror`로 `has-js` 제거 |
| `src/partials/header.html` | 토글 숨김 텍스트 "Open menu" → "Menu", 아이콘 `<img>` 2개 → 인라인 SVG(`fill="currentColor"`, `aria-hidden="true"`, `focusable="false"`) |
| `src/js/main.js` | `.is-enhanced` 제거(요소가 없으면 `has-js` 제거), 버튼 이름 변경 코드 제거, 헤더 `focusout`에서 헤더 밖으로 포커스가 나가면 닫기 |
| `src/scss/components/_site-header.scss` | 활성화 선택자 `.has-js .c-site-header`, 토글 `color: $blue-300`, 열린 패널 `overflow-y: auto`·`overscroll-behavior: contain`, 패널 링크 포커스 링(`::before`, 표시선 안쪽), 강제 색상 모드 규칙(패널 `Canvas`, 링크 표시선), 패널 배경 15% → 30% |

`src/images/shared/icon-hamburger.svg`, `icon-close.svg`는 참조가 끊겼지만 남겨 두었다(삭제는 범위 밖).

## 준비 확인 (1.1)

- 시작 시 `src/js`, `src/partials`에 사용자 변경이 없었다.
- `_site-header.scss`에 사용자 주석 변경 2줄(링크 `border-block-end-width` 주석, 태블릿 포커스 링 `inset` 주석)이 있었고 그대로 두었다.
- `AGENTS.md`(전·후 캡처 규칙 추가), `doc/figma-guide.md`(사용자)는 이 change와 무관하다.

## 계획 대비 변경 (구현 중 결정)

| 항목 | 내용 | 근거 |
| --- | --- | --- |
| 강제 색상 모드 현재 링크 표시 | 모든 화면 크기의 `.c-nav__link`에 `forced-colors` 규칙 추가: 비현재 `Canvas`, hover `LinkText`, 현재 `CanvasText`. spec에 "강제 색상 모드의 현재 링크" 시나리오 추가 | 투명 예약 테두리가 시스템 색으로 칠해져 4개 링크 모두 표시선이 생김(375 오른쪽, 1440 아래). 이 change 이전부터 있던 문제. 사용자 결정(선택 1) |
| 패널 배경 불투명도 | Figma 15% → 30% | 5.2 측정에서 Destination 4페이지 중 3페이지가 4.5:1 미달(Titan 3.43). 25%는 Titan 4.22로 미달, 30%는 최소 4.7. tasks 5.2의 사전 조건에 따른 보정 |
| 강제 색상 아이콘 보정 | `fill: ButtonText` 불필요 | `currentColor`가 강제 글자색을 그대로 따름(light·dark 모두) |

## 검증

환경: Chromium(Playwright 1.63, headless), 스크래치 미리보기 빌드(`dist` 미사용), 로컬 HTTP 서버. 강제 색상은 Playwright `forcedColors: 'active'` 에뮬레이션(light·dark).

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| SCSS 컴파일, `node --check src/js/main.js` | 검증 완료 | 명령 실행 |
| `grep -rn is-enhanced src` 비어 있음 | 검증 완료 | |
| 12개 HTML에 `has-js` 인라인·`onerror` | 검증 완료 | 미리보기 grep |
| 첫 그리기(main.js 1.5초 지연): 햄버거 배치 | 검증 완료 | 변경 전에는 링크 목록이 먼저 그려짐 |
| main.js 404 / JS 꺼짐 / 토글 요소 없음: 대체 배치 | 검증 완료 | 404 외 콘솔 오류 없음 |
| 버튼 이름 "Menu" 고정, `aria-expanded`만 변경 | 검증 완료 | `getByRole('button', { name: 'Menu', exact: true })` |
| 아이콘: 접근성 트리에 없음, `fill` = 버튼 `color` = `rgb(208, 214, 249)` | 검증 완료 | `ariaSnapshot`: `button "Menu" [expanded]` |
| 아이콘 모양 변경 전과 동일 | 검증 완료 | 375 닫힘·열림 토글 영역 픽셀 차이 0 |
| 마지막 링크 Tab → 닫힘, 포커스 요소가 패널에 가려지지 않음 | 검증 완료 | |
| 첫 링크 Shift+Tab → 토글·열림 유지, 패널 빈 곳 클릭 → 열림 유지 | 검증 완료 | |
| Escape, 바깥 클릭, 768↔767 분기점 초기화 | 검증 완료 | |
| 열린 패널 포커스 링(토글·링크 4개) 네 변이 화면·패널 안, 표시선과 안 겹침 | 검증 완료 | 계산 + 캡처 |
| 667×375, 375×667 글꼴 200%: 마지막 링크까지 Tab, 화면 안, 가로 넘침 없음 | 검증 완료 | 200%에서 패널 스크롤 발생 |
| 강제 색상: 아이콘 보임, 패널 불투명·블러 없음, 현재 링크만 표시선(375·1440) | 검증 완료(에뮬레이션) | light·dark |
| 대비: 패널 글자 ≥ 4.5, 아이콘 ≥ 3 (12페이지) | 검증 완료 | 아래 표 |
| 회귀: 12페이지 × 320·375·767·768·1023·1024·1440(84건) 콘솔 오류·가로 넘침 없음, 모바일 열기·닫기, 태블릿 이상 JS 유무 배치 동일 | 검증 완료 | 이전 change 검증 스크립트를 새 계약에 맞춰 재실행, 20/20 |
| Firefox | 미검증 | 설치되지 않음 |
| 실제 Windows 고대비 테마 | 미검증 | 에뮬레이션만 |
| 스크린 리더 실제 읽기 | 미검증 | 접근성 트리만 확인 |

### 대비 측정 (375px, 패널 30%)

측정 방식: 메뉴를 연 뒤 링크 글자·표시선(전환 효과 없이)·아이콘을 투명하게 한 캡처에서, 링크 상자 안 가장 밝은 픽셀과 white, 아이콘 주변 4px 안 가장 밝은 픽셀과 `#D0D6F9`의 대비를 계산했다. 최악값 기준이라 실제 평균 대비보다 낮다.

| 페이지 | 링크 글자 | 닫기 아이콘 | 햄버거 |
| --- | --- | --- | --- |
| crew-commander | 16.83 | 13.36 | 13.53 |
| crew-engineer | 15.46 | 13.36 | 13.53 |
| crew-pilot | 15.81 | 13.36 | 13.53 |
| crew-specialist | 16.46 | 13.36 | 13.53 |
| destination-europa | 6.63 | 13.16 | 13.53 |
| destination-mars | 5.67 | 13.16 | 13.53 |
| destination-moon | 5.29 | 13.16 | 13.53 |
| destination-titan | 4.70 | 13.16 | 13.53 |
| index | 16.74 | 13.34 | 13.53 |
| technology-capsule | 16.47 | 13.32 | 13.53 |
| technology-spaceport | 16.44 | 13.32 | 13.53 |
| technology-vehicle | 16.47 | 13.32 | 13.53 |

15%일 때 Destination: Europa 5.12, Mars 4.25, Moon 3.93, Titan 3.43.

**주의:** 본문(Destination 등) 스타일이 아직 없어 행성 이미지가 원본 크기로 패널 뒤에 놓인 상태에서 측정했다. 본문 배치가 완성되면 다시 측정해야 하며, 그때 15%로 되돌릴 수 있는지도 판단할 수 있다.

측정 중 첫 시도는 링크 표시선의 `transition`(0.2초)이 끝나기 전에 캡처해 회색 픽셀이 잡혔다. 숨김 스타일에 `transition: none`을 넣어 다시 측정했고, 위 값이 그 결과다.

## 전·후 캡처 (`screenshots/before`, `screenshots/after`)

같은 스크립트·이름·viewport·상태로 캡처했다. 픽셀 차이는 채널 차 8 초과 픽셀 수.

| 파일 | 차이 | 달라진 점 | 의도 |
| --- | --- | --- | --- |
| `768.png`, `1440.png` | 0 | 없음 | 예(회귀 없음) |
| `375-closed.png` | 0 | 없음(인라인 SVG 아이콘이 이전 `<img>`와 동일) | 예 |
| `667x375-open.png` | 최대 채널 차 3 | 거의 없음 | 예 |
| `375-open.png`, `375-open-focus-toggle.png` | 61,411 px, 최대 20 | 패널 배경이 약간 어두워짐(15% → 30%) | 예(5.2 보정) |
| `375-open-focus-link-1~4.png` | 63,345 px | 패널 배경 + 포커스 링 오른쪽 변이 화면 끝에서 잘리던 것이 표시선 안쪽에 온전히 그려짐 | 예 |
| `375-open-text200.png` | 7,776 px | 포커스 링이 표시선 안쪽에 그려짐, 배경 약간 어두워짐 | 예 |
| `375-open-tab-out.png` | 143,229 px | 변경 전: 메뉴가 열린 채 포커스가 패널 뒤에 가려짐 → 변경 후: 메뉴가 닫히고 본문 포커스 표시 | 예 |
| `375-forced-closed.png` | 216 px | 햄버거 아이콘이 연한 `#D0D6F9`에서 시스템 글자색(검정)으로 | 예 |
| `375-forced-open.png` | 143,748 px | 패널이 불투명 흰 배경, 본문이 비치지 않음, 닫기 아이콘이 검정, 현재 링크(Crew)만 표시선 | 예 |
| `375-first-paint.png` | 103,649 px | 변경 전: 스크립트 전 링크 목록 → 변경 후: 첫 화면부터 햄버거 | 예 |

## 범위 밖 발견

- **Crew 탭 버튼이 0×0 크기**: 메뉴를 닫고 본문으로 Tab하면 `crew-pilot`의 `.c-tabs__tab`(이름 "Victor Glover")이 포커스를 받지만 크기가 0×0이라 포커스 표시가 작은 점으로만 보인다(`after/375-open-tab-out.png`). 본문 탭 스타일이 아직 없는 상태로, 본문 작업에서 다뤄야 한다.
- **`dist` 재생성**: 작업 중 VS Code 터미널에서 실행 중인 사용자 `gulp` 프로세스 2개(어제 18:45, 오늘 10:46 시작)가 `dist`를 다시 만들고 `src` 변경을 감시해 갱신했다. 이 change는 `dist`를 직접 쓰거나 지우지 않았고, 미리보기는 스크래치 폴더만 사용했다. 한 프로세스는 메모리 약 5GB를 쓰고 HTML을 수 분 간격으로 쓰는 등 비정상적으로 느렸다.
- **`.no-scroll` 주석**: `src/scss/utilities/_utilities.scss`의 "main.js에서 body에 토글" 주석과 달리 이를 쓰는 코드가 없다.

## 범위 확인

- 변경 파일: `src/partials/head.html`, `src/partials/header.html`, `src/js/main.js`, `src/scss/components/_site-header.scss`.
- `git diff --check`: JS·HTML 3개 파일 통과. `_site-header.scss`는 사용자 기존 주석 줄(태블릿 포커스 링 `inset` 주석)의 줄 끝 공백 1건만 보고되며, 이 change가 추가한 줄에는 없다.
- `dist`는 이 change가 쓰거나 지우지 않았다(위 범위 밖 발견 참고).
