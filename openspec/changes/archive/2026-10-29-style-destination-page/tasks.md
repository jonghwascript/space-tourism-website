# Tasks

## 1. 준비와 변경 전 캡처

- [x] 1.1 `git status`로 사용자 미커밋 변경(`AGENTS.md`, `doc/figma-guide.md`, `_site-header.scss`, `docs/`)을 확인하고, 이 change가 수정할 `src/scss/base/_reset.scss`·`src/scss/style.scss`·`src/partials/destination-tabs.html`에 사용자 변경이 없는지 확인한다. `hidden` 속성 사용처가 탭 패널뿐인지 `grep`으로 재확인한다 (결과를 `report.md`에 기록)
- [x] 1.2 코드 수정 전에 스크래치 미리보기를 빌드하고(HTML include, SCSS 컴파일, `images`·`js` 복사, `dist` 미사용) Playwright Chromium 캡처 스크립트로 아래 파일을 `openspec/changes/style-destination-page/screenshots/before/`에 저장한다. 스크립트는 파일 이름·viewport·상태·`document.fonts.ready` 대기를 고정해 5.2에서 그대로 다시 쓴다. Firefox 실행 가능 여부도 확인해 기록한다 (목록의 파일이 모두 생성됨, `dist` 변경 없음)
  - Destination 전체 페이지(`destination-moon.html`): `dest-320.png`(320×568), `dest-375.png`(375×812), `dest-767.png`(767×1024), `dest-768.png`(768×1024), `dest-1023.png`(1023×768), `dest-1024.png`(1024×768), `dest-1440.png`(1440×1024), `dest-1440x900.png`, `dest-1920.png`(1920×1080), `dest-667x375.png`
  - 다른 목적지: `dest-mars-1440.png`, `dest-europa-1440.png`, `dest-titan-1440.png`, `dest-europa-320.png`
  - 상태: `dest-1440-tab-hover.png`(Titan hover), `dest-375-tab-hover.png`, `dest-375-tab-focus.png`, `dest-1440-tab-focus.png`, `dest-1440-panel-focus.png`, `dest-375-text200.png`, `dest-1440-text200.png`, `dest-375-forced.png`, `dest-1440-forced.png`, `dest-375-menu-open.png`
  - 회귀 비교용: `home-375.png`, `home-1440.png`, `crew-pilot-375.png`, `crew-pilot-1440.png`, `technology-vehicle-375.png`, `technology-vehicle-1440.png`

## 2. 공통 바탕과 페이지 골격

- [x] 2.1 `figma-design-to-code` 스킬을 불러온 뒤 `get_design_context`로 91:1358(모바일)·49:1019(태블릿)·9:2089(데스크톱)·99:1739(hover)를 조회해 design 결정 4의 간격(이미지–탭, 탭–이름, 구분선 앞뒤, 제목 번호–텍스트, 태블릿 세로 분배)을 확정한다 (조회 값과 노드를 `report.md`에 기록. 조회 실패 시 design의 기본값을 쓰고 미확인으로 기록)
- [x] 2.2 `_reset.scss`에 `[hidden] { display: none !important; }`를 추가한다 (SCSS 검사 `node -e "require('sass').compile('src/scss/style.scss')"` 통과, 미리보기에서 `destination-europa.html`의 숨긴 패널 3개 computed `display`가 `none`, 홈·헤더 computed style 변화 없음)
- [x] 2.3 `pages/_destination.scss`를 만들고 `style.scss`에 `@use`한 뒤 `.c-page--destination`에 배경색·분기점별 `background-destination-*.jpg`(`center / cover no-repeat`)·`100vh`→`100svh` 최소 높이·`auto 1fr` 2행 그리드·`minmax(0, 1fr)` 열을 추가한다 (375·767·768·1023·1024·1440px 배경 URL이 spec 표대로이고 요청 성공, 이미지 차단 시 `rgb(11, 13, 23)`, 1440×1024에서 헤더+main ≥ 1024·세로 스크롤 없음, 홈·Crew·Technology `body` 배경 변화 없음)
- [x] 2.4 `components/_page-title.scss`를 만들고 `@use`한 뒤 제목 서체·크기·자간·대문자·번호(700, white 25%)와 모바일 가운데·태블릿 이상 왼쪽 정렬을 추가한다 (375·768·1440px에서 spec "페이지 제목 표시" 값과 위치 일치, `<h1>` 접근 가능한 이름 "Pick your destination", Crew·Technology 제목도 같은 스타일로 바뀐 것을 캡처로 확인)

## 3. 본문 배치와 패널

- [x] 3.1 `.c-destination`에 모바일·태블릿 1열 영역(`title / image / tabs / text / stats`)과 데스크톱 2열 영역 그리드, 본문 패딩(24 / 40 / 위아래 48 + 폭 1110·좌우 최소 40)을 추가하고, 보이는 패널을 subgrid로 만들어 이미지·텍스트·통계를 각 영역에 놓는다 (375·767·768·1023·1024·1440·1920px 측정: spec "모바일/태블릿/데스크톱 Destination 배치" 시나리오 값 일치 — 375px 위 끝 순서, 768px 텍스트 묶음 ≤ 514 가운데, 1440px 이미지 왼쪽 195±2·텍스트 783±2·세로 중심 차 ≤ 2, 1024px 좌우 40, 1920px 좌우 여백 같음. 접근성 트리의 포커스 순서가 탭 → 패널 그대로)
- [x] 3.2 이미지 크기(150 / 300 / 480, 정사각형, 좁으면 축소)와 텍스트 묶음 폭(514 / 445)을 적용한다 (4개 페이지 1440px 이미지 480×480·`naturalWidth` > 0, 375px 150×150, 768px 300×300, 콘솔 404 없음)
- [x] 3.3 이름·설명·통계 라벨·값 타이포그래피, 이름–설명 16px, 구분선(1px white 25%)과 앞뒤 간격, 통계 배치(모바일 세로 간격 24, 태블릿 이상 같은 폭 2열 간격 24, 라벨–값 12, 모바일·태블릿 가운데·데스크톱 왼쪽)를 추가한다 (`document.fonts.ready` 후 375·768·1440px computed 값이 spec "목적지 패널 타이포그래피"와 일치, 구분선 높이 1px·색 `rgba(255, 255, 255, 0.25)`, 768px 두 통계 위 끝 같음)
- [x] 3.4 이름에 viewport 상한(`min(rem, vw)`)과 그리드 `minmax(0, 1fr)` 열로 넘침을 막는다 (320px 4개 페이지와 375×812·1440×900 루트 글꼴 200%에서 `scrollWidth ≤ viewport`, 요소 겹침 없음, 기본 루트 글꼴 글자 크기는 3.3 값 그대로)
- [x] 3.5 설명 blue-300 글자 뒤 배경의 가장 밝은 색과 대비를 375·768·1440px에서 측정한다 (측정표를 `report.md`에 기록. 4.5:1 미만이면 수정하지 않고 사용자에게 보정 방법을 묻는다)

## 4. 탭 스타일과 상태

- [x] 4.1 `components/_tabs.scss`를 만들고 `@use`한 뒤 탭 공통 바탕과 `.c-tabs--underline`의 서체(모바일 14px·2.1px, 태블릿 이상 16px·2px), 간격 32px, 높이 32px·글자–표시선 8px, 투명 3px 표시선, `[aria-selected='true']` white 글자·표시선, 비선택 blue-300, 모바일·태블릿 가운데·데스크톱 왼쪽 정렬을 추가한다 (`destination-mars.html` 1440px에서 "Mars"만 white·3px 표시선, 375·768·1440px 탭 높이 같음·한 줄·간격 32)
- [x] 4.2 `@media (hover: hover)` 비선택 탭 hover에 white 50% 표시선, `transition`과 `prefers-reduced-motion: reduce`의 `transition: none`을 추가한다 (1440·375px "Titan" hover 캡처에서 `rgba(255, 255, 255, 0.5)` 표시선, 탭·패널 상자 위치 변화 없음, `hover: none` 에뮬레이션에서 표시선 없음, reduced motion에서 `transition-duration` 0s)
- [x] 4.3 키보드 포커스와 비선택 탭 실행을 확인한다 (375·768·1440px에서 Tab으로 선택 탭 → 패널 순으로 이동하고 outline 네 변이 보임, "Mars" 클릭 시 Moon 패널 유지·콘솔 오류 없음, `git diff --stat src/js` 변경 없음. 패널 outline 모양을 캡처로 기록)
- [x] 4.4 강제 색상 모드를 확인하고 필요하면 선택 탭 표시선 `Highlight` 규칙을 추가한다 (Playwright `forcedColors: 'active'` 375·1440px에서 "Moon" 표시선만 배경과 다른 색, 구분선 보임, 강제 색상이 아닐 때 computed style 변화 없음)

## 5. 통합 검증과 보고

- [x] 5.1 Destination 4개 페이지 전체 회귀: 320·375·767·768·1023·1024·1440·1920px과 667×375에서 콘솔 오류·가로 넘침·요소 겹침 없음, 375px에서 모바일 메뉴 열기·닫기와 열린 패널이 본문 위에 그려짐, `node --check src/js/main.js` 통과 (Chromium. Firefox는 1.2 확인 결과에 따라 실행 또는 미검증, 실제 OS 고대비·스크린 리더는 미검증으로 기록)
- [x] 5.2 1.2의 캡처 스크립트를 수정 후 소스로 다시 실행해 같은 파일 이름으로 `screenshots/after/`에 저장하고, Figma 스크린샷(91:1358·49:1019·9:2089)과 같은 크기 캡처를 육안 대조한다. 보고서에 항목별 전·후 비교(달라진 점, 의도 여부)를 표로 적는다. 홈 캡처는 같아야 하고, Crew·Technology는 제목만 달라야 하며, 다르면 원인을 기록한다 (before·after 파일 쌍이 모두 존재)
- [x] 5.3 범위 확인: 변경 파일이 `_reset.scss`·`style.scss`·`pages/_destination.scss`·`components/_page-title.scss`·`components/_tabs.scss`(필요 시 `destination-tabs.html` 클래스 추가)와 이 change 폴더뿐이고 `dist`·사용자 미커밋 파일에 변경 없음, `git diff --check` 통과. `report.md`에 검증 표(검증 완료·미검증·해당 없음), 측정값, 알려진 제한(탭 전환 미지원, subgrid 미지원 대체 배치, 데스크톱 이미지 확대)을 정리한다

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 위 파일과 change 폴더만 명시적으로 스테이징).
- 탭 전환 JavaScript는 별도 change로 진행한다(`content-tabs`의 "전환 동작 범위 제외" 요구사항 수정 포함).
- 검토가 끝나면 `/opsx:archive`로 change를 보관하고 `destination-page` 주 spec에 반영되었는지 확인한다.
