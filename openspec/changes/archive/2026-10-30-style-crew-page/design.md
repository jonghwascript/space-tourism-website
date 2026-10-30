# Design

## Context

- **마크업** (`src/partials/crew-tabs.html`): 4개 페이지가 `selected`만 바꿔 include합니다. `<main class="c-crew" id="main">` 안에 아래 순서로 있습니다.
  1. `h1.c-page-title.l-cluster`
  2. `div.c-tabs.c-tabs--dots.l-cluster[role=tablist]` 안에 `button.c-tabs__tab` 4개. 버튼 안 글자는 `.u-sr-only` 승무원 이름뿐입니다.
  3. `div.c-crew__panel[role=tabpanel][tabindex=0]` 4개(선택 외에는 `hidden`). 패널 안에는 다음이 있습니다.
     - `div.c-crew__text.l-stack` > `div.c-crew__heading.l-stack`(`p.c-crew__role`, `h2.c-crew__name`) + `p.c-crew__bio`
     - `picture.c-crew__image`. img 속성은 모두 `width="496" height="676"`입니다.
- **이미 적용된 스타일**
  - `c-page-title`: 공통 컴포넌트입니다. 모바일 가운데, 태블릿 이상 왼쪽 정렬이 이미 적용되어 있습니다.
  - `c-tabs__tab` 공통 바탕: blue-300, 선택 white, 대문자, transition. 점 탭은 글자가 숨김 텍스트라 화면 영향은 없습니다.
  - 리셋의 `[hidden] { display: none !important; }`
  - `c-crew`, `c-crew__*`, `c-tabs--dots`: 스타일이 없습니다(`grep` 확인).
- **원본 사진 크기와 비율이 서로 다릅니다**
  - Douglas Hurley 514×700 (0.734)
  - Mark Shuttleworth 433×640 (0.677)
  - Victor Glover 549×645 (0.851)
  - Anousheh Ansari 575×602 (0.955)

  Figma 표시 영역은 271×340 / 447×560 / 539×676이고, 사진이 영역 아래쪽에 맞춰져 있습니다.
- **Figma DC 값**
  - 모바일 91:1765: 제목–내용 24, 텍스트 묶음 위 패딩 40, 텍스트–점 24, 내용–사진 32. 사진 영역은 flex-1이고 사진이 가운데에 놓입니다.
  - 데스크톱 9:2118: 위아래 패딩 48, 2열(flex-1, 간격 32, 세로 가운데). 왼쪽 열은 텍스트(flex-1, 세로 가운데)와 점(아래 패딩 48)이 간격 40으로 놓입니다. 텍스트 최대 640, 최소 445입니다.
  - 마스크: 세로 linear-gradient, 0~77.394%는 불투명하고 100%에서 투명합니다.
  - 점: 선택 white, 비선택 white opacity 0.174363. hover는 `doc/figma-values.md`의 SS 값(white 50%)입니다.
  - 태블릿 49:1527: DC를 조회하지 못해 `doc/figma-values.md` 7절 값과 스크린샷을 씁니다. 모바일과 같은 세로 구조, 패딩 40, 텍스트 최대 512, 사진 447×560입니다.
- **Destination에서 확립한 패턴** (`doc/ENGINEERING_NOTES.md`): main 영역 그리드와 보이는 패널 subgrid로 DOM 순서와 화면 순서를 다르게 배치합니다. 탭에는 `z-index: 1`을 주고, subgrid 미지원 시 세로 flex로 대체합니다.
- **검증 방식**: 화면 캡처는 남기지 않습니다(사용자 결정, AGENTS.md). Playwright Chromium과 스크래치 미리보기 빌드(`dist` 미사용)로 computed style·요소 측정을 합니다. Firefox는 미설치였습니다.

## Goals / Non-Goals

**Goals:**
- `specs/crew-page/spec.md`의 추가 요구사항을 측정 가능하게 구현합니다.
- 점 탭 변형을 Destination 밑줄형과 같은 파일·같은 상태 규칙(ARIA 속성 기준 선택, hover 미디어 쿼리, 강제 색상)으로 만듭니다.

**Non-Goals:**
- 승무원 전환 동작과 Splide 도입(사용자 결정)
- `.c-page--*` 골격(홈·Destination·Crew에 반복)을 공통화하는 리팩터링. 세 페이지가 끝난 뒤 별도 change에서 다룹니다.
- 이미지 `width`·`height` 속성을 원본 비율에 맞추는 마크업 수정. 레이아웃 이동(CLS) 가능성만 보고서에 기록합니다.
- Figma B~D 프레임 개별 대조. 사진·텍스트만 다르므로 4개 페이지 측정으로 대신합니다.

## Decisions

### 1. 파일 구성
- `pages/_crew.scss`(신규): `.c-page--crew`, `.c-crew`, `.c-crew__*`. `style.scss`에서 `pages/destination` 뒤에 `@use`합니다.
- `components/_tabs.scss`: `.c-tabs--dots` 변형을 밑줄형 아래에 추가합니다. 공통 바탕과 밑줄형은 바꾸지 않습니다.
- `crew-tabs.html`: 탭 목록에 `c-crew__tabs` 클래스만 추가합니다(Destination의 `c-destination__tabs`와 같은 방식).

### 2. 화면 순서: main 영역 그리드 + 패널 subgrid
Destination과 같은 구조입니다. DOM은 `제목 → 탭 → 패널(텍스트, 사진)`입니다. 화면 배치는 다음과 같습니다.
- 모바일·태블릿: 1열, 영역 `title / text / tabs / image`, 행 `auto auto auto 1fr`. 사진 행이 남은 높이를 채우고, 사진은 그 안에서 세로 가운데에 놓입니다(Figma 사진 영역 flex-1 + items-center).
- 데스크톱: 2열 `repeat(2, minmax(0, 1fr))`, 열 간격 32px. 영역은 `'title title' / 'text image' / 'tabs image'`, 행 `auto 1fr auto`입니다. 텍스트는 1fr 행 안에서 세로 가운데, 점 탭은 아래 행에 `margin-block-end: 48px`로 놓습니다. 사진은 두 행에 걸쳐 세로 가운데입니다.
- 보이는 패널은 `grid-row: 2 / -1; grid-column: 1 / -1; grid-template-rows/columns: subgrid`입니다. 탭은 `z-index: 1`로 패널 위에 둡니다(Destination에서 발견한 포인터 가로채기 대응).
- subgrid 미지원 시에는 세로 flex(DOM 순서: 점 탭 → 텍스트 → 사진)로 대체합니다. 간격은 margin으로 두어 두 배치가 같은 여백을 갖게 합니다.
- 대안(`display: contents`, 마크업 이동, absolute 배치)을 버린 이유는 Destination과 같습니다(`doc/ENGINEERING_NOTES.md`).

### 3. 간격 매핑(margin)
| 구간 | 모바일 | 태블릿 | 데스크톱 |
| --- | --- | --- | --- |
| 본문 패딩 | 24 | 40 | 위아래 48, 폭 `min(1110px, 100% − 80px)` 가운데 |
| 제목 아래 | 24 | 24 | 24 |
| 텍스트 위 | 40 | 40 | 0(1fr 행 안에서 세로 가운데) |
| 텍스트–점 탭 | 24 | 24 | 40 이상(점 탭 `margin-block-start`) |
| 점 탭 아래 | 32(사진까지) | 32 | 48 |

텍스트 묶음 폭은 모바일 `min(514px, 100%)`, 태블릿 `min(512px, 100%)`이고 둘 다 가운데입니다. 데스크톱은 왼쪽 열 전체 폭이며 최대 640px입니다. 1440px의 열 폭은 539px라 640px에 닿지 않습니다.

### 4. 사진: 높이 기준, 비율 유지, 아래쪽 기준
- `picture.c-crew__image`는 그리드 항목입니다. `img`에는 아래를 적용합니다.
  - `block-size: min(340px, …)`(태블릿 560, 데스크톱 676)와 `inline-size: auto`, `max-inline-size: 100%`, `object-fit: contain`, `object-position: bottom`
  - 원본 비율이 사진마다 달라 폭을 고정하면 높이가 들쭉날쭉해집니다. 그래서 Figma 영역 높이를 기준으로 삼습니다.
  - 열이 좁아 폭이 줄면 `contain`으로 비율을 지키며 아래쪽에 붙습니다.
- `width`·`height` 속성(496×676)은 로드 전 비율 예약에만 쓰입니다. 로드 후에는 `aspect-ratio: auto`(UA 기본)로 원본 비율이 우선합니다. 렌더 비율을 측정해 원본과 1% 이내인지 확인합니다.
- 마스크: `mask-image: linear-gradient(to bottom, #000 77.394%, transparent)`를 img에 적용합니다. `-webkit-mask-image`도 함께 씁니다(Chromium 120 이전과 Safari). 마스크는 img 상자 기준이라, `contain`으로 상자 안에 빈 공간이 생기면 흐려지는 위치가 사진 아래 끝과 어긋날 수 있습니다. 폭이 줄어드는 1024~1100px 구간과 텍스트 200%에서 측정합니다. 어긋나면 `inline-size`를 사진 비율로 계산하는 방식(`aspect-ratio` 지정)으로 바꿉니다.
- **구현 중 변경:** 높이 고정과 `object-fit: contain`을 쓰면 열이 사진보다 좁을 때(1024px에서는 4장 모두, 1440px에서는 Victor·Anousheh) 상자 안에 빈 공간이 생겨 마스크가 사진이 아닌 상자를 기준으로 흐려집니다. 그래서 `inline-size/block-size: auto`와 `max-block-size`(340/560/676)·리셋의 `max-inline-size: 100%`만 두는 방식으로 바꿨습니다. 상자가 항상 사진과 같아 마스크가 사진 아래 끝에 맞습니다. 원본 높이가 모두 602px 이상이고 데스크톱 열 폭 상한(539px) 때문에, 확대하지 않아도 각 폭의 표시 크기가 이전 방식과 같습니다. `object-fit`은 쓰지 않습니다.
- 높이 상한에는 viewport 단위를 섞지 않습니다. 낮은 화면에서는 페이지가 세로로 늘어납니다(본문 min-height 방식).

### 5. 점 탭: 버튼은 24px 클릭 영역, 점은 `::before`
- 버튼 상자는 `1.5rem`(24px) 정사각형이고(WCAG 2.5.8 목표 크기), 점은 `::before`(`--dot`: 10px, 데스크톱 15px)로 가운데에 그립니다.
- 점 사이 시각 간격을 Figma와 같게 하려고 버튼 간격을 `calc(var(--dot-gap) - (1.5rem - var(--dot)))`로 둡니다.
  - 모바일·태블릿: 16 − 14 = 2px
  - 데스크톱: 40 − 9 = 31px
- `.l-cluster`의 `--space`를 이 값으로 덮어씁니다.
- 색: 공통 `c-tabs__tab`의 `color`를 `::before`의 `background: currentColor`로 쓰지 않고 따로 지정합니다. 비선택 `rgb(255 255 255 / 17.4%)`, 선택 `$white`, hover(`@media (hover: hover)`, 비선택) `rgb(255 255 255 / 50%)`입니다. 선택은 `[aria-selected='true']`로 겁니다.
- 포커스: 전역 `:focus-visible` outline(버튼 24px 상자 기준, offset 4px)을 씁니다. 버튼 간격이 2px라 outline이 이웃 점 위로 겹칠 수 있지만, 가려지지 않는지 측정·확인합니다.
- 전환: `::before`에 `transition: background-color 0.3s ease`, `prefers-reduced-motion: reduce`에서 `none`을 둡니다.
- 강제 색상: 배경색이 시스템 색으로 덮여 점이 사라집니다. `::before`에 `forced-color-adjust: none`을 두고 다음과 같이 시스템 색을 직접 지정합니다.
  - 비선택: `border: 1px solid CanvasText`, 배경 `Canvas`
  - 선택: 배경 `CanvasText`
  - hover: `LinkText`
  - 헤더·Destination 탭의 시스템 색 선택과 맞춥니다.
- 정렬: 모바일·태블릿 가운데(`l-cluster` 기본), 데스크톱 `justify-content: flex-start`(`_crew.scss`의 `.c-crew__tabs`)입니다.

### 6. 타이포그래피와 넘침
- 역할·이름은 `text-transform: uppercase`로 대문자 처리해 접근 가능한 이름을 유지합니다. 역할의 white 50%는 `opacity: 0.5` 대신 `color: rgb(255 255 255 / 50%)`로 줍니다. 강제 색상에서 글자가 흐려지지 않게 하기 위해서입니다.
- 이름은 두 단어 이상이라 줄바꿈되므로 viewport 상한이 필요 없습니다. 320px·200%에서 측정만 합니다.
- 줄 간격: 역할·이름 1.15(Figma 100%, Bellefair 대문자에서 줄바꿈 시 겹치지 않게 약간 여유), 소개 1.8입니다.

### 7. 배경과 골격
`.c-page--crew`는 Destination과 같습니다: 2행 그리드, `100vh → 100svh`, `minmax(0, 1fr)` 열, 분기점별 `background-crew-*.jpg`, blue-900 대체 배경.

## Risks / Trade-offs

- [비선택 점 white 17.4%는 배경 대비 약 1.6:1이라 WCAG 1.4.11(비텍스트 3:1)에 미달할 가능성이 큼] → 3개 폭에서 점 주변 배경과 대비를 측정합니다. 미달이면 Figma 값을 임의로 바꾸지 않고 사용자에게 보정 여부를 묻습니다(홈·Destination 대비 처리와 같은 절차). 선택 상태는 white라 구분됩니다.
- [역할 white 50%가 배경의 밝은 부분 위에서 4.5:1 미만일 가능성] → 같은 방식으로 측정하고 미달이면 사용자에게 묻습니다.
- [태블릿 768×1024에서 Figma 자체가 사진이 화면 아래로 잘림(내용 합 > 1024)] → min-height 방식이라 페이지가 세로로 늘어나 잘리지 않습니다. 측정값을 보고서에 적습니다.
- [사진 `width`·`height` 속성과 실제 비율 불일치로 로드 시 레이아웃 이동] → 이번 범위 밖입니다. 보고서에 기록합니다.
- [점 버튼 간격 2px에서 포커스 outline(offset 4px)이 이웃 점에 겹침] → outline은 겹쳐도 가려지지 않습니다. 겹침이 시각적으로 혼란스러우면 offset을 줄이는 안을 보고서에 제안합니다.
- [subgrid 미지원 시 점 탭이 텍스트 위에 옴] → 대체 배치이며 내용·순서는 모두 읽힙니다.

## Migration Plan

CSS 추가와 partial 클래스 1개 추가뿐입니다. 되돌릴 때는 `_crew.scss`, `style.scss`의 `@use`, `_tabs.scss`의 점 변형, partial 클래스를 되돌립니다.

## Open Questions

- 태블릿(49:1527) DC 수치(텍스트 위 패딩, 점–사진 간격)는 과제 2.1에서 재조회합니다. 실패하면 모바일 값을 씁니다. spec·접근 방식에는 영향이 없습니다.
