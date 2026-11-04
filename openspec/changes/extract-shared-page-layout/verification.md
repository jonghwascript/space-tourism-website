# 검증 기록

- 검증일: 2026-10-31 (Asia/Seoul)
- 변경: `extract-shared-page-layout`

## 변경 내용

- `src/scss/components/_page.scss`: 공통 `.c-page` Grid·최소 높이 선언 다섯 개와 주석 추가.
- `src/scss/style.scss`: components 구간에 page 모듈 로드 추가.
- `src/scss/pages/_home.scss`, `_destination.scss`, `_crew.scss`, `_technology.scss`: 동일 선언 제거 및 배경 책임에 맞게 주석 정리.
- 해당 OpenSpec 변경의 작업 목록과 검증 기록 갱신.

## 검증 방법

- `%TEMP%/space-layout-verify.cjs`의 before/after 모드로 기존 `gulp-file-include`와 Sass를 사용해 12개 HTML 및 CSS를 메모리에 생성하고 로컬 HTTP 서버로 제공했다. 기준 CSS는 소스 수정 전에 생성한 값을 보존해 재사용한다.
- 산출물은 `%TEMP%/space-layout-verification/`의 before/after CSS·HTML·JSON 및 PNG 파일이다. dist는 읽기·쓰기·삭제 대상으로 사용하지 않았다.
- `%TEMP%/space-layout-static.cjs`로 컴파일 CSS를 비교했다. 기존 네 modifier에서 다섯 선언을 제거한 CSS와 새 공통 블록을 제거한 CSS가 주석·공백을 제외하고 일치했다. 공통 블록은 정확히 하나이고 선언 값 및 100vh→100svh 순서가 일치한다. 12개 HTML의 body 클래스 연결도 확인했다.
- `node -e "require('sass').compile('src/scss/style.scss')"`: 출력 파일 없이 컴파일 통과.
- Chrome 156.0.8078.74, headless, reduced motion 설정에서 아래 상태를 변경 전후 비교했다. 외부 Google Fonts 요청은 두 결과 모두 차단해 같은 대체 글꼴 조건으로 측정했다. 로컬 이미지·스크립트·배경은 소스에서 제공했다.

| 범위 | 조건 |
| --- | --- |
| 12개 URL | 각 375×812, 768×1024, 1440×900 |
| 네 그룹 대표 URL | 767×812, 768×812, 1023×900, 1024×900, 320×568, 667×375 |
| 글꼴 확대 | 대표 URL 각 375×667, 루트 font-size 200% |
| 메뉴 열림 | 대표 URL 각 667×375 및 글꼴 200%의 375×667 |
| 메뉴 분기점 전환 | 대표 URL 각 767px에서 열기→768px→767px, 클릭으로 닫기 |
| JavaScript 비활성 | 대표 URL 각 375×812 |

대표 URL은 `index.html`, `destination-moon.html`, `crew-commander.html`, `technology-vehicle.html`이다. 총 92개 상태에서 body display·Grid 행/열·최소 높이·배경, body/header/main 크기와 위치, 문서 scroll 크기, 메뉴 ARIA·목록 가시성·스크롤 크기, 전체 화면 PNG를 비교했다.

## 검증 결과

- 검증 완료: 92/92개 상태의 모든 레이아웃·메뉴 측정값이 변경 전과 정확히 일치했다. 캡처 시점의 포인터 위치·이미지 디코딩을 통일하고, JS 활성 환경에서는 resize 후 두 프레임을 기다렸다.
- 검증 완료: 전체 재비교 PNG 91/92개가 정확히 일치했다. 나머지 `technology-vehicle.html`, 767×812는 로켓 이미지 영역(x=0~766, y=216~473)에만 채널 최대 4의 픽셀 차이가 있었고 레이아웃 값은 동일했다. `%TEMP%/space-layout-pixels.cjs`로 차이 범위를 확인한 후 `%TEMP%/space-layout-recheck.cjs`로 해당 상태만 재실행했으며 PNG까지 정확히 일치했다. 최종적으로 92개 상태 모두 일치하는 결과를 확인했다.
- 전체 재비교 결과는 `after-full.json`, 해당 한 상태의 재실행 결과는 `after.json`에 있다. 스크린샷은 동일 이름으로 최신 결과를 보관한다. 재실행은 소스 변경 없이 수행했다.
- 검증 완료: 비교한 상태에서 document scrollWidth가 clientWidth를 넘는 경우는 없었다. 320×568에서 네 대표 페이지의 body 높이는 약 698/950/891/930px로 콘텐츠에 따라 늘어났고 변경 전후 동일했다.
- 검증 완료: 메뉴 열기·닫기, 767→768→767px 전환에서 ARIA 및 목록 크기·가시성이 동일했다. 768px 진입 시 네 대표 페이지 모두 aria-expanded가 false로 초기화됐다. 메뉴의 overflow 및 scrollHeight/clientHeight도 기준과 같았다.
- 검증 완료: 생성된 12개 HTML 전체가 변경 전과 동일하다. 기존 배경 및 본문 CSS도 공통 선언 이동 외에는 동일하다.
- 검증 완료: `git diff --check`와 최종 diff 검토. 소스 변경은 계획한 SCSS 6개에 한정되며 HTML·JS·dist 및 다른 OpenSpec 변경은 수정하지 않았다. 기존 미추적 `.agents/`는 유지했다.

## 미검증과 한계

- Firefox: Playwright용 Firefox 실행 파일이 없다. 설치된 `C:/Program Files/Mozilla Firefox/firefox.exe` 경로로도 자동 실행을 시도했으나 tab subprocess 시작 실패로 종료됐다. Firefox 화면 비교는 미검증이다.
- 실제 Google Fonts 로드 상태의 화면 정확성은 미검증이다. 대체 글꼴에서 발생하는 기존 줄바꿈은 이번 리팩터링으로 수정하지 않는다.
- 실제 모바일 브라우저 주소창에 따른 svh/vh 동작, 스크린 리더, 고대비, 수동 키보드 전체 접근성 검사는 수행하지 않았다. Chrome 측정과 PNG 비교는 전체 접근성 준수를 의미하지 않는다.
- 첫 자동 비교는 일부 PNG와 resize 직후 메뉴 ARIA 측정 차이로 실패했다. 검증 절차의 이미지 decode·렌더링 대기·포인터 조건을 맞춰 재비교했고 위 결과로 확인했다. JS 비활성 상태에서는 requestAnimationFrame 콜백 대기가 끝나지 않아 해당 대기를 제외하고 재실행했다.
