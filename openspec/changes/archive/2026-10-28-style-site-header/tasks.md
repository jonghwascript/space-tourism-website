# Tasks

## 1. 준비

- [x] 1.1 `git status`로 `src/scss`, `src/partials`에 사용자 변경이 없는지 확인하고, 있으면 덮어쓰기 전에 알린다 (결과를 보고서에 기록)
- [x] 1.2 figma-design-to-code 스킬을 불러온 뒤 헤더 노드(데스크톱 9:2079, 태블릿 49:793, 모바일 120:2494, 모바일 패널 120:2725, hover 99:1496)의 `get_design_context`·`get_screenshot`을 받아 design.md 값과 차이가 없는지 대조한다 (차이가 있으면 design.md를 고치고 보고)

## 2. 기반 값 교체

- [x] 2.1 `_variables.scss`에서 이전 토큰을 지우고 design 결정 1의 색·서체·헤더 글자 토큰을 추가한다 (`grep -rn '\$grey\|\$bg-\|\$font-size-preset\|\$font-primary' src/scss`가 정의 외 사용처 없이 끝나고 SCSS 컴파일 통과)
- [x] 2.2 `_mixins.scss`의 `font-style()`에 `$family` 인자(기본 `$font-body`)를 추가한다 (임시 호출 없이 컴파일 통과, 기존 3인자 호출 형식 유지)
- [x] 2.3 `_fonts.scss`의 Work Sans `@font-face`를 지우고 Google Fonts 사용 주석만 남긴다 (컴파일된 CSS에 `Work Sans`가 없음)
- [x] 2.4 `_base.scss`의 `body` 배경·글자색·서체를 토큰으로 바꾸고 전역 `:focus-visible` outline을 white로 바꾼다 (미리보기에서 `body` computed style이 spec 값과 일치)

## 3. 헤더 SCSS

- [x] 3.1 `components/_site-header.scss`를 만들고 `style.scss`의 components 구역에 `@use`로 추가한다. 모바일 기본(스크립트 없음) 배치: 40×40 로고, 토글 숨김, 줄바꿈 링크 목록 (375·320px에서 링크 4개가 보이고 가로 넘침 없음)
- [x] 3.2 태블릿 배치: 48×48 로고, 장식선 없음, 높이 96px 반투명 블러 내비 바, 링크 간격 48px (768·1023px 측정값이 Figma와 일치, 한 줄 배치)
- [x] 3.3 데스크톱 배치: 상단 패딩 40px, `::after` 장식선, 내비 바 `min-inline-size` 664px·좌우 패딩 64px (1024·1440px 측정값이 Figma와 일치, 넘침 없음)
- [x] 3.4 링크 상태: 현재 3px white 아래 표시선, hover white 50%, 크기 변화 없음, focus-visible outline이 잘리지 않음, reduced motion에서 transition 없음 (hover·focus 캡처와 computed style로 확인)
- [x] 3.5 모바일 활성화·열림 상태 스타일(`.is-enhanced`, `.is-menu-open`): 햄버거 표시와 목록 숨김, 열림 시 오른쪽 패널·세로 링크·닫기 아이콘, 오른쪽 3px 현재 표시, 토글 누름 영역 44×44 (검증 스크립트에서만 클래스를 붙여 375px 캡처를 Figma 120:2725와 비교, 768px 이상에서는 영향 없음)

## 4. 통합 검증과 보고

- [x] 4.1 SCSS 컴파일과 스크래치 미리보기 빌드를 실행하고 `dist`가 생성·변경되지 않았음을 확인한다
- [x] 4.2 Chromium으로 320·375·767·768·1023·1024·1440px 헤더 캡처를 Figma 스크린샷과 나란히 비교하고, 로고 크기·내비 높이·간격·패딩·글자 크기·자간·색 computed style 표를 만든다 (차이는 보고서에 기록)
- [x] 4.3 12개 페이지에서 가로 넘침·탭 순서·현재 링크 표시를 확인하고, 텍스트 200% 확대(루트 글꼴 확대와 브라우저 zoom)에서 헤더 겹침·넘침을 확인한다 (Firefox 미설치 시 미검증으로 기록)
- [x] 4.4 범위 확인: `git diff --stat`에 `src/js`, `src/pages` 변경이 없고 `src/partials` 변경이 있으면 이유를 기록, 인라인 style 없음, `git diff --check` 통과. 결과 보고에 검증 표, 모바일 임시 배치, `aria-current` 선택자 판단, JS 단계용 클래스 계약을 정리한다

## Workflow follow-up

- 사용자 검토 후 커밋 범위를 확인받아 커밋한다.
- 메뉴 스크립트 change에서 `is-enhanced`·`is-menu-open`과 `aria-expanded`를 함께 갱신한다.
