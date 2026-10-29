# Design

## Context

- 현재 구조(`add-mobile-menu-toggle` 이후):
  - `head.html`이 `./js/main.js`를 `defer`로 불러온다.
  - `main.js`가 실행되면 헤더에 `.is-enhanced`를 붙이고, `.is-menu-open`·`aria-expanded`·숨김 텍스트("Open menu"/"Close menu")를 함께 바꾼다. Escape, 헤더 바깥 클릭, 48em 분기점 전환에서 닫는다.
  - `_site-header.scss`의 `.c-site-header.is-enhanced`, `.c-site-header.is-menu-open` 규칙은 모두 `mq-below('tablet')` 안에 있다.
- 열린 패널: `position: fixed; inset: 0 0 0 auto`, 폭 `min(15.875rem, 100%)`, 위 패딩 133px, 오른쪽 패딩 0, `overflow` 지정 없음, 배경 `rgb(11 13 23 / 15%)` + `backdrop-filter: blur(40px)`.
- 포커스 표시: 전역 `:focus-visible { outline: 2px solid white; outline-offset: 4px }`. 태블릿 이상 링크만 `::before` 링으로 따로 그린다.
- 아이콘은 `<img src="icon-hamburger.svg | icon-close.svg">`이고 SVG 안의 fill이 `#D0D6F9`로 고정되어 있어 CSS로 색을 바꿀 수 없다. 강제 색상 모드에서도 `<img>`는 색이 조정되지 않는다. 같은 색이 SCSS에 `$blue-300`으로 있다.
- 아이콘 SVG 파일은 `src/partials/header.html` 외 다른 곳(HTML·SCSS·JS)에서 쓰지 않는다(`grep`으로 확인).
- 이전 검증 스크립트(Playwright, 스크래치 미리보기 빌드)를 재사용할 수 있다. Chromium만 설치되어 있다.

## Goals / Non-Goals

**Goals:**
- proposal의 다섯 항목을 spec 시나리오 단위로 측정 가능하게 구현
- 활성화 조건을 첫 그리기 전으로 옮기되, 스크립트 실패 시 대체 배치로 돌아가는 안전장치 유지

**Non-Goals:**
- 모달 방식(포커스 가두기, 본문 `inert`, 본문 스크롤 잠금)
- 스크린 리더 실제 읽기 검증(도구 없음, 미검증으로 기록)
- 헤더 외 본문 영역의 접근성

## Decisions

### 1. 활성화 신호를 `<html>`의 클래스로 옮긴다
`head.html`에서 스타일시트 링크보다 앞에 인라인 스크립트 한 줄로 `document.documentElement.classList.add('has-js')`를 실행한다. SCSS의 활성화 조건 `.c-site-header.is-enhanced`를 `.has-js .c-site-header`로 바꾼다. 인라인 스크립트는 파싱 중 즉시 실행되므로 첫 그리기부터 햄버거 배치가 적용된다.
- 실패 복귀:
  - `main.js`의 `<script>`에 `onerror`로 `has-js`를 지운다(파일 404·네트워크 실패).
  - `main.js`가 필요한 요소를 찾지 못하면 `has-js`를 지운다.
- `.is-enhanced` 클래스는 더 이상 쓰지 않으므로 JS와 SCSS에서 모두 지운다. 상태 클래스는 `.is-menu-open` 하나가 된다.
- 대안: `main.js`를 `defer` 없이 `<head>`에서 동기 실행 → 파싱을 막고 헤더 DOM이 아직 없어 별도 대기 코드가 필요해 제외.
- 대안: `<noscript>` 스타일 → 스크립트 로딩 실패를 다루지 못해 제외.
- 남는 위험: `main.js`가 느리게 오는 동안에는 햄버거가 보이지만 눌러도 반응하지 않는다(아래 위험).

### 2. 버튼 이름은 "Menu"로 고정한다
`header.html`의 숨김 텍스트를 "Menu"로 바꾸고, `setOpen()`에서 텍스트 변경을 지운다. 상태는 `aria-expanded`만 전달하므로 "Menu, expanded/collapsed"로 읽힌다.

### 2-1. 아이콘을 인라인 SVG + `currentColor`로 바꾼다
`header.html`의 아이콘 `<img>` 2개를 같은 경로의 인라인 `<svg>`로 바꾸고 `fill="currentColor"`, `aria-hidden="true"`, `focusable="false"`를 준다. 기존 클래스(`c-nav-toggle__icon`, `--open`, `--close`)와 `width`·`height`는 유지해 표시 전환 SCSS를 그대로 쓴다. 토글에 `color: $blue-300`을 지정한다.
- 강제 색상 모드에서는 버튼의 `color`가 시스템 색(`ButtonText`)으로 바뀌므로 아이콘도 따라간다. 별도 테두리 보정은 넣지 않는다(실제 동작은 5.1에서 확인).
- 헤더가 단일 원본이라 SVG 경로 복사는 한 곳뿐이다. 다른 곳에서 쓰지 않으면 `src/images/shared/icon-*.svg` 파일은 남겨 두되 참조만 끊는다(삭제는 별도 정리 작업).
- 대안: CSS `mask` + `background-color: currentColor` → 파일을 그대로 쓰지만 강제 색상 모드에서 `background-color`가 바뀌어 아이콘이 사라질 수 있어 `forced-color-adjust` 보정이 더 필요하므로 제외(사용자 결정).

### 3. 포커스가 헤더 밖으로 나가면 닫는다
헤더의 `focusout`에서 `event.relatedTarget`이 있고 헤더 밖 요소일 때만 `setOpen(false)`를 호출한다. 포커스는 옮기지 않는다(사용자가 이동한 곳에 그대로 둔다).
- `relatedTarget`이 `null`인 경우(패널 빈 곳 클릭, 창 전환)는 닫지 않는다. 패널 빈 곳 클릭 시 열림 유지 시나리오와 맞고, 바깥 클릭은 기존 `click` 처리기가 닫는다.
- Shift+Tab으로 링크 → 토글 이동은 헤더 안이라 열림을 유지한다.
- 대안: 포커스 가두기 → 사용자 결정으로 제외.

### 4. 패널 세로 스크롤과 포커스 링
열린 패널에 `overflow-y: auto`와 `overscroll-behavior: contain`을 준다. `overflow`를 주면 패널 밖으로 나가는 outline(offset 4px)이 잘리므로, 패널 링크의 포커스 표시는 패널 안쪽에 그린다(`outline-offset`을 음수로 하거나 오른쪽 패딩 확보). 어느 쪽을 쓸지는 측정으로 고르고, 현재 링크의 오른쪽 3px 표시선과 겹치지 않게 한다.
- 위 패딩 133px은 닫기 버튼 자리라 줄이지 않는다. 화면이 낮으면 스크롤이 생긴다.

### 5. 강제 색상 모드 보정
`@media (forced-colors: active)`에서:
- 열린 패널 `background-color: Canvas`(불투명)로 본문 글자가 비치지 않게 하고 `backdrop-filter`는 끈다.
- 토글 아이콘은 결정 2-1로 시스템 글자색을 따르므로 추가 규칙이 없다. 에뮬레이션에서 아이콘이 배경과 같은 색이 되면 `fill: ButtonText`를 명시하는 규칙을 추가한다.
- 현재 링크 표시선은 `border-color`라 시스템 색으로 바뀌어 유지되는지 확인한다.
- 검증은 Playwright `emulateMedia({ forcedColors: 'active' })`로 한다. 실제 Windows 고대비 테마는 미검증으로 남긴다.

### 6. 대비 측정 방식
패널을 연 상태에서 링크 글자를 투명하게 바꾼 캡처를 떠서, 링크 글자 영역의 가장 밝은 픽셀과 white의 대비를 계산한다. 아이콘은 아이콘을 숨긴 캡처에서 아이콘 영역의 가장 밝은 픽셀과 `#D0D6F9`의 대비를 계산한다. 아이콘 색은 이제 CSS로 정하므로 미달이면 아이콘 색 보정도 선택지가 된다. 12개 페이지(배경 이미지가 다름) 375px에서 측정한다. 기준 미달이면 패널 배경 불투명도를 올리는 SCSS 보정을 하되 Figma 값과의 차이를 보고서에 적는다.

## Risks / Trade-offs

- [`main.js` 로딩 중 햄버거가 반응하지 않음] → 같은 출처의 작은 파일이라 짧다. `onerror`로 실패는 복귀하지만 "느린 성공"은 막지 못한다. 수용하고 보고한다.
- [인라인 스크립트가 CSP를 쓰는 배포 환경에서 막힘] → 현재 CSP가 없다. 막히면 `has-js`가 없으므로 대체 배치로 남아 기능 손실만 있고 깨지지는 않는다.
- [`onerror` 인라인 속성] → 같은 CSP 조건. 동작은 위와 같다.
- [패널 `overflow`로 포커스 링이 잘림] → 결정 4에서 안쪽 링으로 해결하고 측정한다.
- [대비 기준 미달 시 Figma 패널 값(15%)과 달라짐] → 접근성을 우선하고 차이를 보고서에 남긴다.
- [`forced-colors` 에뮬레이션과 실제 OS 고대비 차이] → 미검증으로 명시한다.

## Migration Plan

배포 단계 없음. 되돌리려면 이 change의 커밋을 되돌리면 `add-mobile-menu-toggle` 상태로 돌아간다.
