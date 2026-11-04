# Design

## Context

- **스크립트:** `src/js/main.js`(50줄)에 모바일 메뉴 블록 하나가 있습니다. 블록 스코프(`{ ... }`)로 감싸 전역 변수를 만들지 않습니다. `head.html`이 모든 페이지에서 `defer`로 불러오고, 실패 시 `has-js` 클래스를 지웁니다. gulp는 `src/js`를 변환 없이 복사합니다.
- **탭 마크업** (`src/partials/{destination,crew,technology}-tabs.html`)
  - 탭 목록 `[role=tablist]`, 탭 `button[role=tab]`. id 형식은 `<그룹>-tab-<항목>`이고 `aria-controls`로 패널을 가리킵니다.
  - 패널 `[role=tabpanel][tabindex=0]`. id 형식은 `<그룹>-panel-<항목>`이고 `aria-labelledby`로 탭을 가리킵니다. 선택 외 패널은 `hidden`입니다.
  - 그룹·항목 이름이 페이지 파일 이름과 같습니다(`destination-mars.html`, `crew-pilot.html`, `technology-capsule.html`).
  - 패널 `<h2>` 텍스트가 페이지 `<title>`의 첫 부분과 같습니다("Mars | Destination | Frontend Mentor | Space tourism website").
- **스타일**
  - 선택 모양은 모두 `[aria-selected='true']` 선택자에 걸려 있습니다(`_tabs.scss`).
  - 숨김은 리셋의 `[hidden] { display: none !important; }`가 맡습니다.
  - 보이는 패널은 subgrid로 배치됩니다. 한 번에 하나만 보이므로 `hidden`만 바꾸면 배치도 따라옵니다.
- **배치 방향:** Technology 탭 목록은 64em 이상에서 `flex-direction: column`(세로)이고, 그 밖의 탭 목록은 가로입니다.
- **검증 방식:** 캡처는 남기지 않습니다(AGENTS.md). Playwright Chromium과 스크래치 미리보기 빌드(`dist` 미사용, 로컬 HTTP 서버)로 DOM·ARIA·URL·computed style을 측정합니다. Firefox는 미설치였습니다.

## Goals / Non-Goals

**Goals:**
- `specs/content-tabs/spec.md`의 추가 요구사항을 세 페이지 공통 코드 하나로 구현합니다.
- 마크업과 SCSS를 바꾸지 않습니다. 기존 ARIA·id 규칙과 `[aria-selected]`·`[hidden]` 스타일을 그대로 활용합니다.

**Non-Goals:**
- 스와이프, 자동 재생, 슬라이드 애니메이션, 라이브러리(Splide 등) 도입
- `popstate`(뒤로 가기)로 탭 되돌리기. `replaceState`를 쓰므로 필요 없습니다.
- 스크립트 파일 분리, 모듈 번들링

## Decisions

### 1. 위치: `main.js`에 독립 블록 추가
메뉴 블록 아래에 `// 탭 전환` 머리 주석(관계·제한·전환)과 블록 스코프를 하나 더 둡니다.
- 페이지마다 `document.querySelectorAll('[role="tablist"]')`를 돌며 탭 목록마다 초기화합니다. 탭 목록이 없는 홈에서는 아무것도 하지 않습니다.
- 메뉴 블록과 변수·리스너를 공유하지 않습니다. 탭 블록에서 예외가 나도 메뉴 블록은 이미 실행된 뒤라 영향이 없습니다. 탭 블록은 필요한 요소(`aria-controls` 대상)가 없는 탭 목록을 건너뜁니다.
- 대안(새 `tabs.js` 파일): `head.html`에 스크립트 태그를 추가하고 `site-layout`의 스크립트 로딩 요구사항도 손봐야 해서 제외합니다. 파일이 50줄 남짓이라 한 파일로 충분합니다.

### 2. 선택 함수 하나로 상태 동기화
`select(tab, { focus })` 하나가 모든 경로(클릭, Enter·Space, 방향키, Home·End)를 처리합니다.
1. 같은 목록의 모든 탭에 `aria-selected`·`tabindex`를 설정하고, 각 탭의 `aria-controls` 패널에 `hidden`을 토글합니다.
2. `focus`가 참이면 탭에 포커스를 줍니다(방향키 이동).
3. 이미 선택된 탭이면 아무것도 하지 않습니다(페이드·주소 교체 없음).
4. 페이드(결정 5)와 주소 교체(결정 4)를 실행합니다.

버튼은 Enter·Space에서 브라우저가 `click`을 보내므로, 실행은 `click` 리스너 하나로 처리합니다. 키 이벤트는 방향키·Home·End만 다룹니다.

### 3. 방향키와 방향 판단
- 탭 목록의 computed `flex-direction`이 `column`으로 시작하면 세로, 아니면 가로로 봅니다.
  - Technology 데스크톱만 세로입니다. CSS가 정한 실제 배치를 그대로 따르므로, 분기점 값을 JS에 중복해서 적지 않습니다.
- 방향은 초기화할 때와 `matchMedia('(min-width: 64em)')` `change` 이벤트에서 다시 계산합니다. 탭 목록에 `aria-orientation`을 설정합니다.
  - 64em은 SCSS `mq('desktop')`과 같은 식입니다. 메뉴 블록이 48em을 쓰는 방식과 같습니다.
- 키 처리:
  - 가로: ←는 이전, →는 다음
  - 세로: ↑는 이전, ↓는 다음
  - Home은 처음, End는 마지막. 양 끝에서는 반대쪽으로 순환합니다.
  - 처리한 키는 `preventDefault()`로 스크롤을 막습니다. 처리하지 않은 키(가로 목록의 ↑·↓ 등)는 그대로 둬 페이지 스크롤이 됩니다.
- 자동 활성화(사용자 결정): 방향키로 포커스가 간 탭을 바로 선택합니다. 패널이 모두 DOM에 있어 지연이 없습니다.

### 4. 주소·제목 교체(`replaceState`)
- 주소: 탭 id에서 `-tab-`을 `-`로 바꾸고 `.html`을 붙여 파일 이름을 만듭니다(`destination-tab-mars` → `destination-mars.html`). `new URL(name, location.href)`로 현재 위치 기준 주소를 만들어 `history.replaceState(null, '', url)`을 호출합니다. 방문 기록은 늘지 않습니다(사용자 결정).
- 제목: 새 패널 `<h2>`의 텍스트와 현재 제목의 첫 `|` 뒤 부분을 이어 붙입니다(`"Europa" + " | Destination | Frontend Mentor | Space tourism website"`). 빌드된 페이지 제목과 같은 문자열이 됩니다.
- `file://`로 열었을 때 등 `replaceState`가 예외를 던지는 환경에서는 `try/catch`로 무시하고 화면 전환만 합니다.
- 대안(`pushState` + `popstate`): 뒤로 가기가 탭마다 걸려 다른 페이지로 나가기 어렵습니다. 사용자가 replace를 골랐습니다.

### 5. 페이드: Web Animations API, CSS 변경 없음
- 새 패널에 `panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease' })`를 실행합니다.
  - 이전 애니메이션이 남아 있으면 `getAnimations()`로 취소합니다(빠른 연속 전환).
  - 이전 패널은 바로 `hidden`이 되어, 두 패널이 겹쳐 보이는 구간이 없습니다.
- `matchMedia('(prefers-reduced-motion: reduce)').matches`이면 실행하지 않습니다. 매번 확인하므로 설정 변경이 바로 반영됩니다.
- `opacity` 애니메이션은 접근성 트리·포커스에 영향이 없어, 패널은 처음부터 사용할 수 있습니다.
- 대안(CSS `@keyframes` + 상태 클래스): SCSS 세 파일에 같은 규칙을 넣거나 공통 규칙을 새로 만들어야 하고, 첫 로드 때는 애니메이션이 없도록 구분해야 합니다. JS에서 전환할 때만 실행하는 편이 단순합니다.

### 6. 이벤트 위임
탭 목록마다 `click`·`keydown` 리스너를 하나씩 둡니다. `event.target.closest('[role="tab"]')`로 탭을 찾습니다. 탭 안의 `.u-sr-only` 스팬을 눌러도 같은 탭으로 처리됩니다.

## Risks / Trade-offs

- **[subgrid 패널이 탭을 덮는 배치]** 탭에 이미 `z-index: 1`이 있어 클릭이 패널에 가로채이지 않습니다(스타일 단계에서 검증). 전환 후에도 같은지 측정합니다.
- **[`replaceState` 뒤 다른 그룹 페이지의 헤더 `aria-current`]** 같은 그룹 안 전환이라 바뀔 필요가 없습니다.
- **[새로고침 시 빌드 파일 기준 초기 선택]** 주소가 바뀐 파일을 다시 열면 그 파일의 빌드된 초기 선택이 보이므로 일치합니다.
- **[Prettier 보호 주석]** 마크업을 바꾸지 않으므로 `prettier-ignore` 주석에 영향이 없습니다.
- **[`file://`에서 주소 교체 불가]** 화면 전환은 동작합니다. 실제 배포(HTTP)에서만 주소가 바뀝니다. 보고서에 기록합니다.
- **[스크린 리더의 패널 변경 안내]** 탭 패턴에서는 선택된 탭 이름이 읽히고 패널은 탭 다음 Tab 위치에 있어 별도 `aria-live`가 필요 없습니다. 실제 스크린 리더 검증은 미검증으로 기록합니다.

## Migration Plan

`main.js`에 블록 하나를 추가할 뿐입니다. 되돌리면 이전처럼 파일별 초기 패널만 보입니다.

## Open Questions

없음. URL 방식·페이드·활성화 방식은 사용자 결정으로 확정했습니다.
