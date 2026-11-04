# Design

## Context

- **헤더 partial** `src/partials/header.html`: 링크 4개마다 `@@if (context.current === '<그룹>') { aria-current="page"}` 조건이 있습니다. 각 줄 위에는 `<!-- prettier-ignore -->`가 있습니다. 페이지들은 `@@include('../partials/header.html', {"current": "<그룹>"})`로 그룹만 넘깁니다.
- **링크 목적지:** `./index.html`, `./destination-moon.html`, `./crew-commander.html`, `./technology-vehicle.html`
  - 목적지와 같은 페이지는 4개뿐입니다.
  - 나머지 8개 그룹 페이지(Mars·Europa·Titan, Specialist·Pilot·Engineer, Spaceport·Capsule)에서는 목적지가 다른데도 `page`입니다.
- **스타일** `src/scss/components/_site-header.scss`: `.c-nav__link`의 `&[aria-current='page']`가 현재 표시선을 칠합니다. 기본(145행)과 강제 색상(162행) 두 곳입니다. 모바일 패널은 같은 규칙의 `border-color`를 쓰고, 테두리 방향만 오른쪽으로 바뀝니다.
- **탭 스크립트** `src/js/main.js`의 `updateLocation()`: 탭이 바뀌면 `history.replaceState`로 주소를 바꿉니다. 헤더는 건드리지 않습니다.
- **검증 방식:** 캡처는 남기지 않습니다(AGENTS.md). Playwright Chromium과 스크래치 미리보기 빌드(`dist` 미사용)로 DOM 속성·computed style을 측정합니다.

## Goals / Non-Goals

**Goals:**
- 빌드된 HTML(스크립트 없이도)과 탭 전환 뒤 상태 모두에서 `aria-current`가 실제 페이지와 맞게 합니다.
- 화면의 현재 표시선은 지금과 똑같이 유지합니다.

**Non-Goals:**
- 링크 목적지 변경. 예를 들어 Mars 페이지의 Destination 링크를 Mars로 보내는 방식은 하지 않습니다. 그룹 링크는 대표 페이지로 가는 것이 Figma와 기존 spec의 동작입니다.
- 헤더 디자인 변경

## Decisions

### 1. 빌드 시점: 대표 페이지 여부를 context로 넘긴다
- 대표 페이지 4개만 include context에 `"landing": true`를 추가합니다.
  - 예: `{"current": "destination", "landing": true}`
  - 다른 8개 페이지는 바꾸지 않습니다. 값이 없으면 대표 페이지가 아닌 것으로 봅니다.
- `header.html`의 각 링크 조건을 둘로 나눕니다. 링크 하나에 조건 두 개가 있지만 최대 하나만 참입니다.

  ```text
  @@if (context.current === 'destination' && context.landing) { aria-current="page"}@@if (context.current === 'destination' && !context.landing) { aria-current="true"}
  ```

- Home은 그룹에 페이지가 하나뿐이라 `index.html`도 `landing: true`를 넘기고 같은 식을 씁니다. 네 링크의 패턴을 같게 유지하기 위해서입니다.
- `gulp-file-include`의 `@@if`는 JS 식을 평가하므로 `&&`·`!`를 쓸 수 있습니다. 구현 첫 단계에서 빌드 결과로 확인합니다.
- 대안 1(파일 이름으로 판단, 예: `context.page === 'destination-moon'`): 12개 페이지 모두 include를 바꿔야 해서 변경이 커집니다.
- 대안 2(스크립트만으로 처리): JS가 없으면 잘못된 `page`가 남아 제외합니다.

### 2. 스타일: 값과 상관없이 같은 표시선
- 기본 규칙과 강제 색상 규칙 모두 `&[aria-current='page']`를 `&[aria-current='page'], &[aria-current='true']`로 넓힙니다.
- `[aria-current]`만으로 쓰면 미래에 `aria-current="false"`가 붙었을 때도 칠해집니다. 그래서 값을 명시합니다.
- 명시도는 그대로이고 순서도 같아, hover보다 현재 표시가 이기는 관계가 유지됩니다.

### 3. 탭 전환 뒤 동기화
- `updateLocation()`의 `replaceState` 시도 뒤, 실제 `location.pathname`을 기준으로 헤더 링크를 다시 정합니다.
  - 주소를 못 바꿨으면 기존 값이 그대로 유지됩니다.
- 대상은 이미 `aria-current`를 가진 헤더 링크(현재 그룹 링크) 하나입니다. 같은 그룹 안 전환이라 그룹은 바뀌지 않습니다. 그 링크의 목적지 경로가 새 경로와 같으면 `page`, 아니면 `true`로 설정합니다.
- 헤더가 없거나 현재 링크가 없으면 아무것도 하지 않습니다. 탭 블록 안에서 끝나므로 메뉴 블록과는 독립적입니다.

## Risks / Trade-offs

- **[`@@if` 식 지원]** `&&`가 동작하지 않으면 → 링크마다 중첩 조건이나 다른 context 키로 바꿉니다. 1번 작업에서 빌드 결과로 바로 확인합니다.
- **[Prettier]** 조건 줄이 길어지지만 `prettier-ignore`로 보호되어 그대로입니다.
- **[`file://`에서 주소 미교체]** 주소가 그대로면 `aria-current`도 그대로라 페이지와 일치합니다.

## Migration Plan

마크업 속성과 선택자, 스크립트 몇 줄만 바뀝니다. 되돌리면 이전처럼 그룹 링크가 항상 `page`가 됩니다.

## Open Questions

없음. 값(`true`)은 사용자 결정으로 확정했습니다.
