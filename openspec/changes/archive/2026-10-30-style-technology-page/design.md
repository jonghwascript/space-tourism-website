# Design

## Context

- **마크업** (`src/partials/technology-tabs.html`): 3개 페이지가 `selected`만 바꿔 include합니다. `<main class="c-technology" id="main">` 안에 아래 순서로 있습니다.
  1. `h1.c-page-title.l-cluster`
  2. `div.c-tabs.c-tabs--numbers[role=tablist]`. 다른 탭 목록과 달리 `l-cluster`가 없습니다. `button.c-tabs__tab` 3개 안에는 숫자와 `.u-sr-only` 이름이 있습니다.
  3. `div.c-technology__panel[role=tabpanel][tabindex=0]` 3개(`hidden`, 각 앞에 `<!-- prettier-ignore -->`). 패널 안에는 다음이 있습니다.
     - `div.c-technology__text.l-stack` > `div.c-technology__heading.l-stack`(`p.c-technology__eyebrow`, `h2.c-technology__name`) + `p.c-technology__description`
     - `picture.c-technology__image` > `source[media=(min-width: 64em)]`(portrait) + `img`(landscape)
- **이미 적용된 스타일**
  - `c-page-title`: 공통 컴포넌트입니다(모바일 가운데, 태블릿 이상 왼쪽).
  - `c-tabs__tab` 공통 바탕: blue-300, 선택 white, 대문자, transition. 숫자 탭은 이 색을 덮어써야 합니다.
  - 리셋의 `[hidden] { display: none !important; }`, `img { max-width: 100% }`
  - `c-technology*`, `c-tabs--numbers`: 스타일이 없습니다(`grep` 확인).
- **자산 크기**: landscape 768×310(마크업 속성 768×310 일치), portrait 515×527(마크업 `<source>` 속성은 586×600으로 다름)
- **Figma DC·메타데이터** (`doc/figma-values.md` 8절 + 이번 조회)
  - 모바일 91:2090
    - 본문 패딩 위 24·좌우 24·아래 48, 제목–내용 24
    - 이미지 영역 위 패딩 64. 이미지 상자 768×258(x −220.5, 가운데를 잘라 보임)
    - 이미지–탭 묶음 32, 탭–텍스트 40
    - 탭 40px 원·가로 간격 16
    - 텍스트 최대 514, 이름 묶음–설명 16
  - 태블릿 49:2171: 패딩 40, 이미지 상자 768×357(x −40, 화면 폭 전체), 나머지는 모바일과 같은 구조, 탭 56px, 텍스트 최대 512
  - 데스크톱 9:2139
    - 본문 위아래 48, 영역 최대 폭 1275·오른쪽 정렬(`items-end`), 제목–내용 24
    - 내용 행: 세로 가운데, 간격 32
    - 왼쪽 묶음: `flex-1`, 최소 635. 그 안에서 탭(세로, 간격 32, 80px 원)과 텍스트(491, 최대 640)가 간격 64
    - 이미지: `flex-1`, 608×600
  - 상태: 선택 white 배경·blue-900 숫자, 비선택 1px `rgba(255,255,255,0.25)` 테두리·white 숫자, hover(99:1864 SS) 테두리 white
  - Figma 이미지는 화면 크기마다 다른 크기의 비트맵을 잘라 씁니다(모바일 373×376, 태블릿 768×778, 데스크톱 608×1021). 저장소에는 landscape·portrait 두 장만 있습니다.
- **Destination·Crew에서 확립한 패턴** (`doc/ENGINEERING_NOTES.md`): main 영역 그리드와 보이는 패널 subgrid로 DOM 순서와 화면 순서를 다르게 배치합니다. 탭에는 `z-index: 1`을 주고, subgrid 미지원 시 세로 flex로 대체합니다.
- **검증 방식**: 캡처는 남기지 않습니다(AGENTS.md). Playwright Chromium과 스크래치 미리보기 빌드(`dist` 미사용)로 computed style·요소 측정을 합니다. Firefox는 미설치였습니다.

## Goals / Non-Goals

**Goals:**
- `specs/technology-page/spec.md`의 추가 요구사항을 측정 가능하게 구현합니다.
- 숫자 탭 변형을 기존 탭 변형과 같은 파일·같은 상태 규칙(ARIA 속성 기준 선택, hover 미디어 쿼리, 강제 색상)으로 만듭니다.

**Non-Goals:**
- 탭 전환 동작
- `.c-page--*` 골격(홈·Destination·Crew·Technology 4곳 반복)의 공통화. 이번 change 뒤 별도 리팩터링 change에서 다룹니다.
- 마크업 `<source>` 크기 속성 수정, 화면 크기별 비트맵 자산 추가
- Figma B·C 프레임(9:2179, 9:2219) 개별 대조. 이미지·텍스트만 다르므로 3개 페이지 측정으로 대신합니다.

## Decisions

### 1. 파일 구성
- `pages/_technology.scss`(신규): `.c-page--technology`, `.c-technology`, `.c-technology__*`. `style.scss`에서 `pages/crew` 뒤에 `@use`합니다.
- `components/_tabs.scss`: `.c-tabs--numbers`를 점형 아래에 추가합니다. 기존 규칙은 바꾸지 않습니다.
- `technology-tabs.html`: 탭 목록에 `c-technology__tabs` 클래스만 추가합니다(다른 페이지와 같은 방식). `prettier-ignore` 주석과 패널 줄은 건드리지 않습니다.

### 2. 화면 순서: main 영역 그리드 + 패널 subgrid
DOM은 `제목 → 탭 → 패널(텍스트, 이미지)`입니다.
- **모바일·태블릿:** 1열, 영역 `title / image / tabs / text`, 행 `auto auto auto auto`입니다. 이미지가 탭 위에 오므로 subgrid가 필요합니다.
- **데스크톱:** 3열, 영역 `'title title title' / 'tabs text image'`입니다. 열 정의는 아래와 같습니다.

  ```text
  grid-template-columns: auto max(30.6875rem, 50% - 10rem) minmax(0, 1fr);
  column-gap: 2rem;
  ```

  - Figma는 왼쪽 묶음(탭 80 + 64 + 텍스트)과 이미지가 남은 폭을 반씩 나누되, 왼쪽 묶음이 최소 635px입니다.
  - 텍스트 열 = `max(491px, (영역 − 32px) / 2 − 144px)`이므로 `max(30.6875rem, 50% − 10rem)`로 씁니다.
  - 탭–텍스트 64px는 열 간격 32px에 탭의 `margin-inline-end: 2rem`을 더해 만듭니다.
  - 1440px(영역 1275px)에서 텍스트 491px, 이미지 608px로 Figma와 같습니다. 1024px(영역 984px)에서는 텍스트 491px, 이미지 317px입니다.
  - 세 요소는 `align-self: center`로 세로 가운데를 맞춥니다.
- **패널 subgrid:** 보이는 패널은 `grid-row: 2 / -1; grid-column: 1 / -1; grid-template-rows/columns: subgrid`입니다. 데스크톱에서는 패널이 탭 열까지 덮으므로 탭에 `z-index: 1`을 줍니다.
- **대체 배치:** subgrid 미지원 시 세로 flex(DOM 순서: 탭 → 텍스트 → 이미지)로 대체합니다. 간격은 margin입니다.

### 3. 영역 폭과 화면 끝까지 채우는 이미지
- **모바일·태블릿:** main 패딩은 Figma 값(모바일 24/24/48, 태블릿 40)입니다. 이미지(`picture`)는 `margin-inline: calc(-1 * 패딩)`으로 패딩을 넘어 화면 폭 전체를 채웁니다(`justify-self: stretch`).
- **데스크톱:** main은 `inline-size: min(79.6875rem, 100% - 2.5rem); margin-inline-start: auto; padding: 3rem 0`입니다. 최대 1275px, 왼쪽 최소 여백 40px이고 오른쪽 패딩이 0이라 이미지 열이 화면 오른쪽 끝에 닿습니다. 1440px에서 왼쪽 여백 165px(제목과 Destination·Crew의 165px가 같은 선)입니다.

### 4. 이미지 자르기
- **모바일·태블릿:** `picture`에 `overflow: clip`을 줍니다. `img`는 다음과 같이 둡니다.

  ```text
  inline-size: max(48rem, 100%);
  max-inline-size: none;
  block-size: 16.125rem;        /* 258px, 태블릿 22.3125rem = 357px */
  object-fit: cover;
  margin-inline: calc((100% - max(48rem, 100%)) / 2);
  ```

  - 화면이 768px보다 좁으면 이미지는 768px 폭이고 가운데를 기준으로 양옆이 잘립니다(Figma x −220.5와 같은 방식).
  - 넓으면 화면 폭을 채웁니다.
  - `overflow: clip`이라 스크롤 폭에 영향이 없습니다.
- **데스크톱:** `img`는 `inline-size: 100%; block-size: 37.5rem; object-fit: cover`입니다. portrait 515×527이 608×600을 덮도록 약 1.18배 확대되고 위아래가 조금 잘립니다(Figma도 비트맵을 600 높이로 자름).
- `object-position`은 기본값 `center`입니다. Figma의 비트맵 위치는 세로 52~53% 지점이 중심이라 차이가 작습니다.
- 높이 상한에 viewport 단위를 섞지 않습니다. 낮은 화면에서는 페이지가 세로로 늘어납니다.

### 5. 숫자 탭
- **원 모양:** 버튼은 `--size`(2.5rem/3.5rem/5rem) 정사각형, `border-radius: 50%`, `border: 1px solid rgb(255 255 255 / 25%)`, Bellefair `--font`(18/24/32px)입니다. 공통 바탕의 `color: $blue-300`을 `$white`로 덮습니다.
- **선택(`[aria-selected='true']`):** `background-color: $white; color: $blue-900; border-color: $white`
- **hover:** `@media (hover: hover)`에서 비선택 탭은 `border-color: $white`입니다.
- **묶음 배치:** 탭 목록에 `display: flex; gap: 1rem; justify-content: center`를 줍니다. 데스크톱은 `flex-direction: column; gap: 2rem`입니다. 탭 목록에 `l-cluster`가 없어 컴포넌트가 직접 배치합니다.
- **클릭 영역:** 40px 이상이라 Crew처럼 별도 보정이 필요 없습니다.
- **전환:** 공통 바탕의 `transition`(border-color, color)에 `background-color`를 더해 변형 안에서 다시 선언합니다. 이 선언(`.c-tabs--numbers .c-tabs__tab`)은 공통 바탕의 reduced motion 규칙(`.c-tabs__tab`)보다 명시도가 높습니다. 그래서 변형 안에도 `@media (prefers-reduced-motion: reduce) { transition: none; }`을 둡니다.
- **강제 색상:** 선택 탭의 white 배경이 시스템 색으로 사라지므로 `forced-color-adjust: none; background-color: CanvasText; color: Canvas`로 채웁니다. 비선택은 테두리 `CanvasText`, hover는 `LinkText`입니다(헤더·다른 탭과 같은 선택).
- **포커스:** 전역 `:focus-visible` outline(2px, offset 4px)이 원을 따라 그려집니다.

### 6. 타이포그래피와 넘침
- 소개 문구·이름은 `text-transform: uppercase`로 대문자 처리해 접근 가능한 이름을 유지합니다. 소개 문구의 white 50%는 `color: rgb(255 255 255 / 50%)`입니다(Crew 역할과 같은 이유).
- 줄 간격은 소개 문구·이름 1.15, 설명 1.8입니다.
- 데스크톱 텍스트 열 최소 491px + 탭 112px + 간격 64px = 667px이므로, 영역이 984px인 1024px에서도 이미지 열이 317px 남습니다. 텍스트 200%에서는 em 분기점 때문에 모바일 배치가 되어 가로 배치 넘침이 생기지 않습니다.

### 7. 배경과 골격
`.c-page--technology`는 Destination·Crew와 같습니다: 2행 그리드, `100vh → 100svh`, `minmax(0, 1fr)` 열, 분기점별 `background-technology-*.jpg`, blue-900 대체 배경.

## Risks / Trade-offs

- **[이미지 잘림이 Figma와 다름]** Figma는 화면 크기마다 다른 비트맵을 쓰지만 저장소 자산은 2장뿐입니다. → `cover` + 가운데 기준으로 비슷하게 맞추고, 차이를 보고서에 기록합니다. 시각 확인이 필요하면 사용자에게 먼저 묻습니다.
- **[데스크톱 portrait 1.18배 확대로 약간 흐림]** → Figma 표시 크기를 따르고 보고서에 기록합니다.
- **[비선택 탭 테두리 white 25%가 배경 대비 약 1.6~1.9:1]** 숫자(white)가 컨트롤을 식별하므로 1.4.11 위반은 아닐 수 있지만, 경계 대비를 측정해 기록합니다. 미달 처리 방식은 Crew 점과 같게 사용자에게 묻습니다.
- **[소개 문구 white 50%와 배경 밝은 부분 대비]** → Crew 역할과 같은 방식으로 측정합니다.
- **[1024~1100px에서 이미지 열이 좁음(317px)]** → 겹침·넘침 없이 `cover`로 잘립니다. 측정값을 기록합니다.
- **[`<source>` width·height(586×600)와 실제(515×527) 불일치]** → CSS가 크기를 정해 표시에는 영향이 없습니다. 보고서에 기록합니다.
- **[subgrid 미지원 시 탭이 이미지 위에 옴]** → 대체 배치이며 내용·순서는 모두 읽힙니다.

## Migration Plan

CSS 추가와 partial 클래스 1개 추가뿐입니다. 되돌릴 때는 `_technology.scss`, `style.scss`의 `@use`, `_tabs.scss`의 숫자 변형, partial 클래스를 되돌립니다.

## Open Questions

없음. 이미지 상자 크기와 데스크톱 열 폭은 Figma 메타데이터로 확정했습니다.
