# Tasks

## 1. 준비

- [x] 1.1 `git status`로 `src/js`, `src/partials`, `src/scss/components/_site-header.scss`의 사용자 변경을 확인한다. `_site-header.scss`에 기존 사용자 주석 변경이 남아 있으면 덮어쓰지 않고 그 위에서 수정한다 (결과를 보고서에 기록)
- [x] 1.2 코드 수정 전에 현재 소스로 스크래치 미리보기를 빌드하고, 아래 캡처 목록을 `openspec/changes/improve-header-accessibility/screenshots/before/`에 저장한다. 캡처 스크립트는 파일 이름·viewport·상태를 고정해 6.2에서 그대로 다시 쓴다 (목록의 파일이 모두 생성됨, `dist` 미사용)
  - `375-closed.png`: 375×812 `crew-pilot.html` 닫힘
  - `375-open.png`: 같은 페이지 메뉴 열림
  - `375-open-focus-toggle.png`, `375-open-focus-link-1~4.png`: 열린 상태에서 키보드로 토글·링크 4개에 포커스
  - `375-open-tab-out.png`: 열린 상태에서 마지막 링크 다음으로 Tab
  - `667x375-open.png`: 가로 모드 열림
  - `375-open-text200.png`: 루트 글꼴 200%, 열림, 마지막 링크 포커스
  - `375-forced-closed.png`, `375-forced-open.png`: 강제 색상 에뮬레이션
  - `375-first-paint.png`: main.js 1.5초 지연 중 첫 화면
  - `768.png`, `1440.png`: 태블릿·데스크톱 헤더(회귀 비교용)

## 2. 활성화 신호와 첫 그리기

- [x] 2.1 `head.html`의 스타일시트 링크 앞에 `has-js` 인라인 스크립트를, `main.js` `<script>`에 `onerror`로 `has-js` 제거를 추가한다 (미리보기 12개 HTML에 둘 다 포함)
- [x] 2.2 `_site-header.scss`의 `.c-site-header.is-enhanced` 규칙을 `.has-js .c-site-header`로 바꾸고, `main.js`에서 `.is-enhanced` 추가를 지우고 요소가 없으면 `has-js`를 제거한다 (SCSS 컴파일 통과, `node --check` 통과, `grep -rn is-enhanced src`가 비어 있음, main.js 1.5초 지연에서 첫 캡처가 햄버거 배치, main.js 요청 차단 시와 JS 꺼짐 시 대체 배치, 콘솔 오류 없음)

## 3. 버튼 이름과 포커스 이탈

- [x] 3.1 `header.html` 숨김 텍스트를 "Menu"로 바꾸고 `main.js`의 이름 변경 코드를 지운다 (열림·닫힘 모두 `getByRole('button', { name: 'Menu' })`가 찾아지고 `aria-expanded`만 바뀜)
- [x] 3.2 `header.html` 아이콘 `<img>` 2개를 인라인 SVG(`fill="currentColor"`, `aria-hidden="true"`, `focusable="false"`, 기존 클래스·크기 유지)로 바꾸고 토글에 `color: $blue-300`을 지정한다 (`grep -rn icon-hamburger src`로 다른 사용처 확인, 375px 닫힘·열림 캡처가 변경 전과 같은 모양, 아이콘 `fill`과 버튼 `color`가 `rgb(208, 214, 249)`로 같음, 접근성 트리에서 버튼 자식에 아이콘이 없음)
- [x] 3.3 헤더 `focusout`에서 헤더 밖 `relatedTarget`이면 닫는다 (마지막 링크에서 Tab → 닫힘 + 다음 본문 요소 포커스·가려지지 않음, 첫 링크에서 Shift+Tab → 토글·열림 유지, 패널 빈 곳 클릭 → 열림 유지, 기존 Escape·바깥 클릭 시나리오 유지)

## 4. 패널 넘침과 포커스 표시

- [x] 4.1 열린 패널에 세로 스크롤을 추가하고, 패널 링크와 토글의 포커스 링이 잘리지 않게 보정한다 (667×375와 375×667 루트 글꼴 200%에서 마지막 링크까지 Tab으로 닿고 화면 안에 보임, 가로 넘침 없음, 375px 열린 상태에서 토글·링크 4개 포커스 캡처의 outline 네 변이 보임, 현재 링크 표시선과 겹치지 않음)

## 5. 고대비와 대비

- [x] 5.1 `forced-colors: active` 규칙(패널 `Canvas` 불투명 배경, 블러 해제)을 추가한다 (Playwright 강제 색상 에뮬레이션 375px 열림·닫힘 캡처에서 햄버거·닫기 아이콘 `fill`이 버튼의 강제 글자색과 같고 배경과 다름, 본문 글자가 패널 뒤로 비치지 않음, 강제 색상이 아닐 때 계산 스타일 변화 없음. 아이콘이 배경과 같아지면 `fill: ButtonText` 보정 추가)
- [x] 5.2 12개 페이지 375px에서 패널 링크 글자 대비(≥4.5:1)와 햄버거·닫기 아이콘 대비(≥3:1)를 design 결정 6 방식으로 측정한다 (측정값 표를 보고서에 기록, 미달이면 패널 배경 보정 후 재측정하고 Figma 값과의 차이를 기록)

## 6. 통합 검증과 보고

- [x] 6.1 이전 change의 회귀 확인: 12페이지 × 320·375·767·768·1023·1024·1440에서 콘솔 오류·가로 넘침 없음, 모바일 열기·닫기·Escape·바깥 클릭·분기점 초기화, 태블릿 이상에서 JS 유무에 따른 헤더 배치 차이 없음(글꼴 로딩 후 측정) (Chromium. Firefox·실제 OS 고대비·스크린 리더는 미검증으로 기록)
- [x] 6.2 1.2의 캡처 스크립트를 수정 후 소스로 다시 실행해 같은 파일 이름으로 `screenshots/after/`에 저장하고, 보고서에 항목별 전·후 비교(달라진 점, 의도한 변화인지)를 표로 적는다. `768.png`·`1440.png`는 달라지지 않아야 하며, 다르면 원인을 기록한다 (before·after 파일 쌍이 모두 존재)
- [x] 6.3 범위 확인: 변경 파일이 `head.html`, `header.html`, `main.js`, `_site-header.scss`뿐이고 `dist` 변경 없음, 이 change 파일의 `git diff --check` 통과. 결과를 변경 폴더의 `report.md`에 검증 표(검증 완료·미검증·해당 없음)로 정리한다
