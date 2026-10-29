# Design

## Context

- 동기와 범위는 [proposal.md](proposal.md), 요구사항은 [specs/site-layout/spec.md](specs/site-layout/spec.md) 참고.
- 헤더 마크업: `.c-skip-link` → `header.c-site-header` > `a.c-site-header__logo`(img 48×48), `button.c-nav-toggle`(햄버거·닫기 img + `u-sr-only` 텍스트), `nav.c-nav` > `ul.c-nav__list#primary-navigation` > `li.c-nav__item` > `a.c-nav__link`(`span.c-nav__number[aria-hidden]` + 이름). 현재 링크는 `aria-current="page"`.
- Figma 값은 이전 change의 인계표(`openspec/changes/archive/2026-10-28-implement-site-html-markup/handoff.md` §2·§6)와 프레임 9:2079(데스크톱), 49:793(태블릿), 120:2494(모바일 헤더), 120:2725(모바일 패널), 99:1496(hover)에 있다.
- 현재 SCSS: `$breakpoints`(tablet 768px, desktop 1024px)와 `mq()`는 바로 쓸 수 있다(`sass:math` 이미 사용). `font-style()`은 `$font-primary` 하나만 쓴다. `hit-area()` 믹스인이 있다. 이전 토큰(`$grey-*`, `$bg-*`, `$font-size-preset*`)은 `_variables.scss` 밖에서 쓰이지 않는다. 전역 `button:focus-visible`은 `outline: 3px solid blue`.
- 컴포넌트 파셜은 `style.scss`에서 layout 뒤, utilities 앞에 불러온다.

## Goals / Non-Goals

**Goals:**

- 기반 토큰을 Figma 값으로 바꾸고, 헤더 하나를 화면 크기별로 Figma와 일치시킨다.
- 이후 메뉴 스크립트가 클래스만 붙이면 동작하도록 열림 상태 스타일을 미리 정한다.

**Non-Goals:**

- 메뉴 토글 스크립트, 스크롤 잠금, 포커스 관리(JS 단계).
- 페이지별 배경 이미지, `c-page-title`, 본문 섹션 스타일.
- 전체 텍스트 프리셋 토큰 정의. 이번에는 헤더와 `body`가 쓰는 값만 추가하고, 나머지는 각 페이지 change에서 추가한다.

## Decisions

### 1. 토큰 이름과 `font-style()` 확장

- 색: `$blue-900: #0b0d17`, `$blue-300: #d0d6f9`, `$white: #fff`(Figma `color/*` 이름).
- 서체: `$font-display: 'Bellefair', serif`, `$font-body: 'Barlow', sans-serif`, `$font-condensed: 'Barlow Condensed', sans-serif`.
- 크기: 헤더용 `$font-size-nav: 1rem`(text-preset-8, 16px). 자간 `$letter-spacing-nav: 0.125rem`(2px), `$letter-spacing-nav-number: 0.16875rem`(2.7px).
- `font-style($size, $weight, $line-height, $family: $font-body)`로 서체 인자를 뒤에 기본값과 함께 추가한다. 기존 호출 형식은 그대로 동작한다(현재 호출처는 없다).
- 대안: 서체마다 믹스인을 따로 만들기 → 같은 선언 묶음이 중복되어 제외.

### 2. 전역 기반 스타일

- `body`: `background-color: $blue-900`, `color: $white`, `font-family: $font-body`. `line-height`는 기존 `var(--ratio)`를 유지한다(본문 줄 간격은 페이지 change에서 정함).
- 포커스: 전역 `button:focus-visible`을 `:focus-visible { outline: 2px solid $white; outline-offset: 4px; }`로 바꾼다. white는 `#0B0D17` 배경에서 대비가 충분하고 링크까지 일관되게 적용된다. 대안(헤더에만 지정)은 이후 본문 버튼·링크에서 같은 문제가 반복되어 제외.
- `_fonts.scss`: Work Sans `@font-face` 두 블록을 지우고 Google Fonts `<link>`를 쓴다는 주석만 남긴다. `style.scss`의 `@use 'base/fonts'`는 유지해 이후 로컬 글꼴 전환 위치를 보존한다.

### 3. 헤더 배치 (모바일 우선)

- `.c-site-header`: flex, `align-items: center`, `justify-content: space-between`. 모바일 패딩 24px(`var(--s1)`).
- 태블릿(`mq('tablet')`): 패딩 0, 로고 영역 왼쪽 패딩 40px(2.5rem), 내비 바 `flex: 1`, `min-inline-size: 30.5rem`(488px), 좌우 패딩 40px, 항목 간격 48px(3rem), `justify-content: flex-end`.
- 데스크톱(`mq('desktop')`): 상단 패딩 40px, 로고 왼쪽 64px(4rem), 장식선, 내비 바 `flex: 1 1 0`, `min-inline-size: 41.5rem`(664px), 좌우 패딩 64px.
- 장식선: HTML을 추가하지 않고 `.c-site-header::after`로 그린다. `order`로 로고와 내비 사이에 두고 `flex: 1`, 높이 1px, white 25%, `margin-inline: 4rem -2rem`(로고와 64px, 내비 바 위로 32px 겹침), `z-index`로 내비 바 위에 둔다. 대안(빈 `div`)은 장식용 마크업이 늘어 제외.
- 내비 바 배경: `background: rgb(255 255 255 / 5%)` + `backdrop-filter: blur(40px)`(`-webkit-` 접두사 포함). `overflow: clip`을 쓰면 포커스 outline이 잘리므로 쓰지 않는다.
- 고정 너비 대신 `min-inline-size`와 `flex`로 크기를 정한다. Figma의 `min-w`는 넘침 방지가 목적이라 그대로 최소값으로 쓴다.

### 4. 링크 상태

- `.c-nav__link`: flex, 높이 96px(6rem), `border-block-end: 3px solid transparent`로 공간을 미리 잡아 표시선이 생겨도 크기가 바뀌지 않게 한다. 번호–이름 간격 12px(0.75rem). `text-transform: uppercase`.
- 현재: `&[aria-current='page']`로 선택한다. scss-guide §4는 ARIA 속성 선택자를 피하라고 하지만, 그 예시는 연결용 속성(`aria-labelledby`)이다. `aria-current`는 상태 자체이고 HTML이 빌드 시점에 이미 출력하므로, 가이드가 허용하는 상태 선택자(`:has()`)와 같은 범주로 판단했다. 같은 정보를 `is-current` 클래스로 중복 출력하는 대안은 partial 수정이 필요해 제외했다. 이 판단은 결과 보고에 적는다.
- hover: `border-block-end-color: rgb(255 255 255 / 50%)`. 현재 링크에는 적용하지 않는다(`&:not([aria-current='page']):hover`).
- focus-visible: 전역 outline 사용, outline-offset을 음수로 두어 내비 바 안쪽에 그린다.
- `transition: border-color 0.2s`; `@media (prefers-reduced-motion: reduce)`에서 `transition: none`.

### 5. 모바일: 기본(스크립트 없음)과 활성화 상태

- **기본**: `.c-nav-toggle { display: none; }`. 헤더를 `flex-wrap: wrap`으로 두고 `.c-nav`를 `flex-basis: 100%`로 다음 줄에 내려, 링크를 `l-cluster`처럼 줄바꿈되는 가로 목록(간격 16~24px, 높이는 글자 + 패딩)으로 보여 준다. 이 배치는 Figma에 없는 임시 대체이며 보고서에 적는다.
- **활성화**(`.c-site-header.is-enhanced`, 768px 미만에만 적용):
  - 토글 버튼 표시, 아이콘 24×21, `hit-area(24px, 21px, 44px)`로 누를 수 있는 영역 44×44 확보.
  - `.c-nav`는 `display: none`(닫힘). 화면에서만 옮기는 `transform`이 아니라 `display`로 숨겨 키보드·보조 기술에서도 제외한다.
- **열림**(`.c-site-header.is-enhanced.is-menu-open`):
  - `.c-nav`: `position: fixed; inset-block: 0; inset-inline-end: 0; inline-size: min(15.875rem, 100%)`(254px), 위 패딩 133px(8.3125rem, 닫기 영역 85px + 간격 48px), 왼쪽 패딩 32px, 배경 `rgb(11 13 23 / 15%)` + blur 40px, `z-index`.
  - 링크: 세로 목록 간격 32px, 높이 auto, 아래 테두리 대신 `border-inline-end` 3px(현재 white, hover 50%).
  - 토글: `position: relative; z-index`를 패널보다 높게 두고 햄버거 숨김·닫기 표시. 닫기 아이콘 위치(위 32px, 오른쪽 24px)는 헤더 패딩 24px에서 약 1.5px 차이로 수렴하므로 별도 위치 지정 없이 둔다.
- 상태 클래스는 헤더 루트 한 곳에 둔다. 자식 선택이 `.c-site-header.is-menu-open .c-nav`처럼 2단계로 끝나 중첩 3단계 규칙을 지킨다.
- 대안: Popover API(`popovertarget`)로 JS 없이 열기 → HTML과 기존 spec(`aria-expanded` 초기값)을 바꿔야 하고 데스크톱에서 항상 보이게 하는 덮어쓰기가 필요해 제외.

### 6. 검증 방법

- 컴파일: `node -e "require('sass').compile('src/scss/style.scss')"`.
- 미리보기: 이전 change와 같은 스크래치 미리보기 스크립트(`dist` 미사용).
- Chromium에서 320·375·767·768·1023·1024·1440px 캡처와 computed style 측정. Figma 헤더 영역(`get_screenshot` 9:2078, 49:792, 91:1207, 120:2725, 99:1496)과 나란히 비교.
- 활성화·열림 상태는 검증 스크립트에서만 클래스를 붙여 확인한다(소스에는 넣지 않음).
- hover·focus-visible 캡처, 탭 순서, `prefers-reduced-motion` 에뮬레이션, 텍스트 200% 확대(`html { font-size: 200% }` 주입과 브라우저 zoom 두 방식).

## Risks / Trade-offs

- [모바일 임시 배치가 Figma와 다름] → 사용자 결정. JS 단계에서 `is-enhanced`를 붙이면 Figma 모양으로 전환되도록 스타일을 미리 준비하고, 보고서에 차이를 적는다.
- [전역 `body`·포커스 변경이 본문에도 영향] → 의도된 기반 변경. 본문은 아직 스타일이 없으므로 깨질 기존 스타일이 없다. 미리보기에서 12개 페이지 가로 넘침만 확인한다.
- [`backdrop-filter` 미지원 브라우저] → 반투명 배경만 보이며 글자 대비는 유지된다(배경색 위 흰 글자).
- [`aria-current` 속성 선택자 사용이 scss-guide §4와 충돌로 읽힐 수 있음] → 결정 4의 근거를 보고서에 적는다. 사용자가 원하면 `is-current` 클래스를 partial에 추가하는 대안이 있다.
- [텍스트 200% 확대 시 태블릿·데스크톱 링크가 한 줄에 안 들어감] → 분기점이 `em`이라 확대하면 더 좁은 배치로 내려간다. 넘치면 `flex-wrap`과 높이 auto로 줄바꿈되게 하고 결과를 보고한다.
- [Firefox 미설치] → 미검증으로 기록.

## 구현 중 조정 (apply 단계)

| 항목 | 계획 | 구현 | 이유 |
| --- | --- | --- | --- |
| 모바일 전용 상태 범위 | `mq-below` 방식 미정 | `_mixins.scss`에 `mq-below($device)` 추가(`@media (width < 48em)`) | 기존 `mq()`는 `min-width`만 지원. 모바일 상태 스타일이 태블릿 이상으로 새지 않게 함 |
| 로고 왼쪽 여백 | `padding-inline-start` | `margin-inline-start`(태블릿 `flex-basis: 5.5rem` + 2.5rem = 128px) | padding이면 로고 포커스 링이 64px 여백까지 감쌈 |
| 태블릿 내비 최소 폭 | `min-inline-size: 30.5rem` | 지정하지 않음 | 768px에서 이미 640px이라 효과가 없고, 루트 글꼴 200%에서 256px 가로 넘침을 만듦 |
| 데스크톱 내비 폭 | `flex: 1 1 0` + 최소 664px | `flex: 0 1 max(50% + 1rem, 41.5rem)`, `min-inline-size: 0` | Figma 1440px 폭 736px·장식선 560px과 일치시키고, 확대 시 줄어들며 링크 줄바꿈 |
| 태블릿 이상 링크 포커스 | 음수 `outline-offset` | `outline: none` + `::before` 포커스 링(위아래 20px 안쪽, 좌우 12px 바깥, 2px white) | 음수 offset은 글자를 가리고, 양수 offset은 화면 위쪽에서 잘림 |
