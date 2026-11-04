# Tasks

## 1. 준비와 변경 전 캡처

- [x] 1.1 `git status`로 사용자 미커밋 변경(`AGENTS.md`, `doc/figma-guide.md`, `_site-header.scss` 주석, `docs/`)을 확인하고, 이 change가 수정할 `src/scss/pages/_home.scss`·`src/pages/index.html`에 사용자 변경이 없는지 확인한다 (결과를 보고서에 기록)
- [x] 1.2 코드 수정 전에 현재 소스로 스크래치 미리보기를 빌드하고(HTML include, SCSS 컴파일, `images`·`js` 복사, `dist` 미사용) Playwright Chromium 캡처 스크립트로 아래 파일을 `openspec/changes/style-home-page/screenshots/before/`에 저장한다. 스크립트는 파일 이름·viewport·상태·`document.fonts.ready` 대기를 고정해 5.2에서 그대로 다시 쓴다 (목록의 파일이 모두 생성됨, `dist` 변경 없음)
  - 홈 전체 페이지: `home-320.png`(320×568), `home-375.png`(375×812), `home-767.png`(767×1024), `home-768.png`(768×1024), `home-1023.png`(1023×768), `home-1024.png`(1024×768), `home-1440.png`(1440×900), `home-1920.png`(1920×1080), `home-667x375.png`
  - 홈 상태: `home-375-explore-hover.png`, `home-1440-explore-hover.png`, `home-375-explore-focus.png`, `home-1440-explore-focus.png`, `home-375-text200.png`, `home-1440-text200.png`, `home-375-forced.png`, `home-1440-forced.png`, `home-375-menu-open.png`
  - 회귀 비교용: `crew-pilot-375.png`, `crew-pilot-375-menu-open.png`, `crew-pilot-768.png`, `crew-pilot-1440.png`

## 2. 배경과 본문 배치

- [x] 2.1 Figma 노드 49:792(태블릿)·91:1207(모바일)에서 텍스트 묶음–Explore 세로 간격과 본문 세로 정렬 값을 조회해 design 결정 4의 기본값(48px, 가운데)을 확정한다 (조회한 값과 출처 노드를 보고서에 기록. 조회할 수 없으면 기본값을 쓰고 미확인으로 기록)
- [x] 2.2 `_home.scss`에 `.c-page--home`의 배경색·분기점별 배경 이미지(`../images/home/background-home-*.jpg`, `center / cover no-repeat`)와 `100vh`→`100svh` 최소 높이, `auto 1fr` 2행 그리드를 추가한다 (SCSS 검사 `node -e "require('sass').compile('src/scss/style.scss')"` 통과, 미리보기에서 375·767·768·1023·1024·1440px 배경 URL이 spec 표대로이고 요청 성공, 이미지 차단 시 배경 `rgb(11, 13, 23)`, 1440×900에서 헤더+main 높이 ≥ 900·세로 스크롤 없음)
- [x] 2.3 `.c-hero`·`.c-hero__content`에 모바일 세로·가운데 배치(패딩 24, 텍스트 최대 540), 태블릿(패딩 128/40, 텍스트 512), 데스크톱(최대 폭 1110·좌우 최소 여백 40 가운데, 가로, 아래 정렬, 간격 ≥ 48, 패딩 128) 규칙을 추가한다 (375·767·768·1023·1024·1440·1920px 측정: spec의 "모바일/태블릿/데스크톱 홈 배치" 시나리오 값 일치, 1440×900에서 Explore 아래 끝–viewport 아래 끝 128px, 1024px에서 좌우 여백 40px·텍스트와 Explore 겹침 없음, 1920px에서 영역 1110px·좌우 405px, 다른 11개 페이지 `body`의 computed `display`·`background-image` 변화 없음)

## 3. 타이포그래피

- [x] 3.1 eyebrow·headline·소개문에 서체·크기·자간·줄 간격·색·대문자 규칙(모바일 16/80/15, 태블릿 28/144/16, 데스크톱 28/144/18)과 eyebrow–headline 간격 24px을 추가한다 (`document.fonts.ready` 후 375·768·1440px에서 computed `font-size`·`font-family`·`letter-spacing`·`color`가 spec "홈 타이포그래피"와 일치, 접근성 트리의 `<h1>` 이름이 "So, you want to travel to Space")
- [x] 3.2 "Space"와 텍스트 묶음에 viewport 상한을 적용해 넘침을 막는다(design 결정 5) (320px, 375×812·1440×900 루트 글꼴 200%에서 `scrollWidth ≤ viewport`, 텍스트·Explore 겹침 없음, 기본 루트 글꼴의 375·768·1440px 글자 크기는 3.1 값 그대로)
- [x] 3.3 소개문 blue-300 글자 뒤 배경 이미지의 가장 밝은 색과 대비를 375·768·1440px에서 측정한다 (측정표를 보고서에 기록. 4.5:1 미만이면 수정하지 않고 사용자에게 보정 방법을 묻는다)
- [x] 3.4 (사용자 결정으로 추가) 별 점 대비 미달은 예외로 기록하고, 텍스트 200%에서 소개문이 밝은 배경과 겹치는 부분은 blue-900 em 단위 `text-shadow`로 보정한다 (글자 주변 2px 영역 측정: 375·768·1440px 4.5:1 미만 0px, 200% 375·1440px 결과를 보고서에 기록, 768px 캡처에서 그림자가 거의 보이지 않음)

## 4. Explore 원과 상태

- [x] 4.1 `.c-explore`를 흰 원(모바일 9rem, 태블릿 이상 17rem), Bellefair 대문자 blue-900 글자(18/32px), `flex-shrink: 0`, 모바일 `max-inline-size: 100%`로 스타일한다 (375·768·1440px 링크 상자 144×144·272×272·272×272, `border-radius` 50%, 글자 중심이 원 중심과 1px 이내, 1440px에서 중심 120px 지점 클릭 시 `destination-moon.html` 이동)
- [x] 4.2 `@media (hover: hover)`의 `:hover`와 `:focus-visible`에 halo(태블릿 이상 88px, 모바일 약 47px, white 10% `box-shadow`)를, 태블릿 이상 hover에 글자 opacity 50%를 추가한다 (1440·375px hover 캡처에서 halo 보임, 링크 상자 크기·다른 요소 위치 불변, `scrollWidth` 변화 없음, 글자–원 대비 측정: 모바일 ≥ 4.5:1, 태블릿 이상 ≥ 3:1. Tab 포커스 시 375·768·1440px에서 outline 네 방향이 보이고 Enter로 이동)
- [x] 4.3 `transition`과 `prefers-reduced-motion: reduce`의 `transition: none`을 추가한다 (reduced motion 에뮬레이션에서 Explore `transition-duration`이 `0s`, 기본에서는 0보다 큼)
- [x] 4.4 `@media (forced-colors: active)`에서 Explore 원 경계선(시스템 색)과 hover 대체 표시를 추가한다 (Playwright `forcedColors: 'active'` 375·1440px 캡처에서 원 경계가 배경과 다른 색으로 보이고 "Explore"가 원 안에서 읽힘, 강제 색상이 아닐 때 computed style 변화 없음)

## 5. 통합 검증과 보고

- [x] 5.1 홈 전체 회귀: 320·375·767·768·1023·1024·1440·1920px과 667×375에서 콘솔 오류·가로 넘침·요소 겹침 없음, 375px에서 모바일 메뉴 열기·닫기와 열린 패널이 본문 위에 그려짐, `node --check src/js/main.js` 통과 (Chromium. Firefox·실제 OS 고대비·스크린 리더는 미검증으로 기록)
- [x] 5.2 1.2의 캡처 스크립트를 수정 후 소스로 다시 실행해 같은 파일 이름으로 `screenshots/after/`에 저장하고, 보고서에 항목별 전·후 비교(달라진 점, 의도 여부)를 표로 적는다. `crew-pilot-*.png`와 홈 헤더 영역은 달라지지 않아야 하며, 다르면 원인을 기록한다 (before·after 파일 쌍이 모두 존재)
- [x] 5.3 범위 확인: 변경 파일이 `src/scss/pages/_home.scss`(필요 시 `src/pages/index.html` 클래스 추가)와 이 change 폴더뿐이고 `dist`·사용자 미커밋 파일에 변경 없음, `git diff --check` 통과. 결과를 change 폴더의 `report.md`에 검증 표(검증 완료·미검증·해당 없음)와 측정값으로 정리한다

## 6. Figma 세로 배치 보정 (파일 키 변경 후 재조회)

- [x] 6.1 `doc/figma-guide.md`·`doc/figma-values.md`의 Figma 파일 키를 `N4sbXDrXrbiUYYF6ZUUZZh`로 바꾼다 (옛 키 `yxbe3VJDYJjy4OzccnLVYJ`가 `doc/`에서 0건, 다른 내용 변경 없음. 보관된 change 문서는 당시 기록이라 유지)
- [x] 6.2 코드 수정 전에 현재 상태를 같은 캡처 스크립트로 `screenshots/layout-fix/before/`에 저장한다 (23장, Figma 데스크톱 프레임 크기 1440×1024 추가)
- [x] 6.3 `_home.scss`에서 모바일(텍스트 위·Explore 남은 공간 가운데), 태블릿(텍스트 위·Explore 아래), 데스크톱(줄은 아래, 줄 안 세로 가운데) 배치로 바꾼다 (측정: spec "모바일/태블릿/데스크톱 홈 배치" 수정 시나리오 통과, 1440×1024 포함. 기존 넘침·겹침·텍스트 200%·hover·포커스 측정 회귀 없음)
- [x] 6.4 `screenshots/layout-fix/after/`와 `screenshots/after/`를 다시 캡처하고, Figma 스크린샷(9:2078·49:792·91:1207)과 같은 크기 캡처를 육안 대조해 보고서를 갱신한다 (전·후 비교표, `git diff --check`, `dist` 변경 없음)

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 `_home.scss`와 change 폴더만 명시적으로 스테이징).
- 검토가 끝나면 `/opsx:archive`로 change를 보관하고 `home-page` 주 spec에 반영되었는지 확인한다.
