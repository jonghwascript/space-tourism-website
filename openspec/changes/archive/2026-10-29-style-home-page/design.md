# Design

## Context

- 홈 마크업(`src/pages/index.html`): `<body class="c-page c-page--home">` → 헤더 partial → `<main class="c-hero" id="main">` 안에 `.c-hero__content.l-stack`(h1의 `.c-hero__eyebrow`·`.c-hero__headline`, `p.c-hero__text`)과 `a.c-explore`. `c-page`, `c-hero`, `c-explore`에 대한 SCSS는 아직 없다(`grep`으로 확인). `src/scss/pages/_home.scss`는 주석만 있다.
- `body`는 `_base.scss`에서 배경 `#0B0D17`, Barlow, white를 받는다. 전역 `:focus-visible`은 2px white outline, offset 4px.
- 헤더(`.c-site-header`)는 문서 흐름 안에 있고 `position: relative; z-index: 10`. 높이는 모바일 약 88px(패딩 24 + 로고 40), 태블릿 96px, 데스크톱 136px(위 패딩 40 + 바 96). 이 change는 헤더를 건드리지 않는다.
- 분기점 믹스인: `mq('tablet')`=48em 이상, `mq('desktop')`=64em 이상, `mq-below(...)`. em 기준이라 루트 글꼴을 키우면 분기점도 커진다.
- 출력 구조: SCSS → `dist/css/style.css`, 이미지 → `dist/images/...`. CSS에서 배경 경로는 `../images/home/...`.
- 디자인 값은 `doc/figma-values.md` 3·5·9절(Figma 노드 9:2078, 49:792, 91:1207, hover 99:1496)을 기준으로 한다.
- 현재 작업 트리에 사용자 미커밋 변경(`AGENTS.md`, `doc/figma-guide.md`, `_site-header.scss` 주석, `docs/`)이 있다. 이 change는 그 파일들을 수정하지 않는다.
- 검증 환경: 이전 change와 같이 Playwright Chromium + 스크래치 미리보기 빌드(`dist` 미사용). Firefox는 설치되어 있지 않다.

## Goals / Non-Goals

**Goals:**
- `specs/home-page/spec.md`의 추가 요구사항을 `_home.scss` 한 파일 중심으로 구현하고 측정 가능하게 검증한다.
- 다른 페이지와 헤더에 계산 스타일 변화가 없게 한다.

**Non-Goals:**
- 다른 페이지가 공유할 페이지 골격(`.c-page` 공통 그리드·배경) 일반화. 다른 페이지 change에서 같은 패턴이 필요해지면 그때 공통 모듈로 옮긴다.
- 헤더 모양·동작 변경, 마크업 텍스트 변경.
- Firefox·실제 OS 고대비·스크린 리더 검증(미검증으로 기록).

## Decisions

### 1. 스타일 위치: `pages/_home.scss`에 홈 전용 선택자로 둔다
`c-hero`, `c-explore`는 홈에서만 쓰므로 `pages/_home.scss`에 둔다(파일 머리 주석의 규칙). 페이지 배경과 높이는 `.c-page--home`에만 적용해 다른 11개 페이지에 영향이 없게 한다.
- 대안: `.c-page`에 공통 그리드를 넣기 → 지금 다른 페이지에 본문 스타일이 없어 검증 대상이 늘고 범위를 벗어나므로 제외(Non-Goals).
- 서체 크기 토큰은 `_home.scss` 안에서 숫자 주석과 함께 rem으로 쓴다. 다른 페이지 change에서 같은 text-preset이 다시 필요해지면 그때 `_variables.scss`로 올린다.

### 2. 전체 높이: body를 2행 그리드로 만들고 main이 남은 높이를 채운다
`.c-page--home { min-block-size: 100svh; display: grid; grid-template-rows: auto 1fr; }`로 헤더 아래 `main`이 남은 높이를 채운다. `svh`를 쓰는 이유는 모바일 주소창 높이 변화로 내용이 흔들리지 않게 하기 위해서이며, 미지원 환경을 위해 `100vh`를 먼저 선언한다. `min-` 높이라 내용이 길면 늘어난다.
- 대안: 헤더를 `position: absolute`로 띄우고 main에 100vh → 헤더 규칙을 바꿔야 해서 제외.

### 3. 배경 이미지: `background-image`를 분기점별로 교체
`.c-page--home`에 `background: $blue-900 url(mobile) center / cover no-repeat`를 기본으로 두고 `mq('tablet')`, `mq('desktop')`에서 이미지만 바꾼다. 배경색이 먼저 있으므로 이미지 실패 시 `#0B0D17`이 보인다. body 배경이 루트로 전파되어 viewport 전체를 덮는다.
- `background-attachment: fixed`는 쓰지 않는다(모바일 Safari 미지원, 스크롤 성능).
- 대안: `<img>`/`<picture>`로 넣기 → 장식 이미지라 CSS가 맞고 마크업 변경이 필요해 제외.

### 4. 본문 배치: 모바일·태블릿은 세로 flex, 데스크톱은 가로 flex
- `.c-hero`(main): 모바일 `display: flex; flex-direction: column; align-items: center; gap: 3rem; padding: 1.5rem`. 텍스트는 위쪽에서 시작하고, Explore는 `margin-block: auto`로 남은 높이의 세로 가운데에 온다(Figma 91:1207: Hero `justify-between`, Button 영역 `flex-1` + `justify-center`). 텍스트 묶음 `max-inline-size: 33.75rem`(540px), `text-align: center`.
- 태블릿: 패딩 `8rem 2.5rem`(128/40), 텍스트 묶음 `inline-size: min(32rem, 100%)`(512px). Explore는 `margin-block: auto 0`으로 맨 아래에 붙는다(Figma 49:792: Hero `justify-between`).
- 데스크톱: `flex-direction: row; flex-wrap: wrap; align-content: flex-end; align-items: center; justify-content: space-between;` 줄 전체는 아래로 보내고, 줄 안에서 텍스트 묶음과 Explore는 세로 가운데를 맞춘다(Figma 9:2081 `items-end` 안의 9:2082 `items-center`). 한 줄 flex는 `align-content`를 무시하므로 `wrap`을 켠다. 너비가 모두 rem이라 64em 이상에서는 줄바꿈되지 않는다(내용 53.75rem ≤ 영역 59rem). Explore 여백은 `margin-block: 0`. 영역 폭은 main 자체에 `inline-size: min(69.375rem, 100% - 5rem); margin-inline: auto`(최대 1110px, 좌우 최소 여백 40px)로 맞추고 위아래 패딩 128px. 좌우 패딩 대신 폭으로 여백을 만들어 1024~1190px 구간에서도 여백이 40px 아래로 줄지 않는다. 최소 여백 40px은 Figma 기록에 없어 태블릿 본문 좌우 패딩(40px)과 이어지도록 정했다. 텍스트 묶음 `text-align: start`, `max-inline-size: 540px`, `flex: 0 1 auto`로 줄어들 수 있게 해 1024px에서도 Explore(272px, 줄지 않음)와 겹치지 않게 한다. 간격은 `gap: 3rem`(48px) 최소.
- main이 남은 높이를 채우므로 더 높은 텍스트 묶음의 아래 끝이 viewport 아래에서 128px 위에 오고, Explore는 그 묶음의 세로 가운데에 맞춰진다.
- 처음 구현에서는 `doc/figma-values.md`의 "아래 정렬"을 행 안의 정렬로 해석해 두 요소의 아래 끝을 맞췄고, 모바일·태블릿은 묶어서 세로 가운데에 뒀다. Figma 파일 키 변경 후 `get_design_context`로 세 프레임을 조회해 위와 같이 고쳤다.
- 텍스트 묶음 내부 간격 24px은 기존 `.l-stack`의 `--space: 1.5rem` 기본값을 그대로 쓴다.
- `<h1>` 안의 두 `<span>`은 `display: block`으로 줄을 나누고, 두 span 사이 간격(Figma 24px)은 eyebrow에 `margin-block-end`로 둔다(h1이 `.l-stack`의 자식이라 내부 span에는 gap이 적용되지 않음).
- 태블릿·모바일의 세로 열에는 Figma 간격 값이 없다(분산 배치). 내용이 길어질 때 붙지 않도록 최소 간격 48px(`gap: 3rem`)을 둔다.

### 4-1. 1440px 초과 화면: 헤더는 전체 폭, 본문은 1110px 가운데 유지
헤더는 기존 spec대로 화면 끝까지 넓어지고(로고 왼쪽 64px, 내비 바 오른쪽 끝), 본문은 1110px에서 멈춰 가운데에 남는다. 1440px에서도 로고(64px)와 본문 왼쪽(165px)은 이미 정렬되지 않는 Figma 구조이고, 넓은 화면은 Figma 프레임이 없어 이 구조를 그대로 연장한다.
- 대안 B(본문 폭 제한 해제, 좌우 여백 고정) → 텍스트는 540px 제한으로 왼쪽에 남고 Explore만 오른쪽 끝으로 멀어져 넓은 화면에서 배치가 더 어색해지므로 제외.
- 대안 C(헤더 내용도 최대 폭에 맞추고 내비 바 배경만 오른쪽 끝까지 연장) → 1440px의 로고 위치가 Figma와 달라지고 헤더 change가 필요해 이번 범위 밖. 1920px 캡처를 본 뒤 필요하면 별도 헤더 change로 다룬다(사용자 결정).

### 5. 타이포그래피 크기와 넘침 방지
spec 값대로 rem으로 지정한다. "Space"는 한 단어라 줄바꿈이 안 되므로 `font-size: min(5rem, 25vw)`(모바일), `min(9rem, …)`처럼 viewport 상한을 둬 320px과 루트 글꼴 200%에서 넘치지 않게 한다. 기본 크기(16px 루트)에서는 상한이 적용되지 않아 spec 값(80/144px)과 같다. 실제 상한 계수는 320px·200% 측정으로 정한다.
- 줄 간격: eyebrow·headline `line-height: 1`(Figma 100%), 소개문 1.8.
- 대문자는 마크업을 바꾸지 않고 `text-transform: uppercase`로 처리해 접근 가능한 이름("So, you want to travel to Space")을 유지한다.

### 6. Explore 원과 상태
- `display: grid; place-items: center; inline-size: 9rem; aspect-ratio: 1; border-radius: 50%; background: $white; color: $blue-900;` 태블릿 이상 `17rem`(272px). Bellefair 18px → 32px, 대문자. `flex-shrink: 0`. 모바일 원은 `max-inline-size: 100%`로 루트 200%에서도 화면을 넘지 않게 한다.
- hover: `@media (hover: hover)` 안에서 `:hover`에 `box-shadow: 0 0 0 <halo> rgb(255 255 255 / 10%)`. halo 폭은 데스크톱·태블릿 88px(5.5rem), 모바일은 원 크기 비율(144 × 88/272 ≈ 47px, 약 2.9375rem). `box-shadow`는 레이아웃과 스크롤 넘침에 영향이 없어 spec의 "크기·위치 불변"과 "가로 넘침 없음"을 만족한다.
- hover 글자 투명도: Figma는 글자 opacity 50%다. blue-900 50%를 흰 원에 겹치면 약 3.7:1이라 32px(큰 글자, 3:1 기준)에서는 허용되지만 모바일 18px(4.5:1 기준)에서는 미달이다. 그래서 글자 50%는 `mq('tablet')` 이상에서만 적용하고 모바일은 halo만 보여 준다. 실제 대비는 측정으로 확인한다.
- 포커스: 전역 `:focus-visible` outline(2px white, offset 4px)이 `border-radius`를 따라 원형으로 그려진다. hover halo와 같은 시각 효과를 `:focus-visible`에도 주어 키보드 사용자에게 같은 피드백을 준다. 원 주변(데스크톱 오른쪽, 모바일 아래)에 outline이 잘릴 `overflow` 요소가 없음을 캡처로 확인한다.
- 전환: `transition: box-shadow 0.3s ease, color 0.3s ease`, `prefers-reduced-motion: reduce`에서 `transition: none`(헤더와 같은 방식).
- 강제 색상: `@media (forced-colors: active)`에서 원에 `border: 2px solid LinkText`(또는 기본 `border: 2px solid transparent`를 두어 강제 모드에서 시스템 색으로 보이게 함)를 준다. 강제 모드에서는 배경이 `Canvas`로 바뀌어 원 모양이 사라지므로 경계선이 필요하다. `box-shadow`는 강제 모드에서 제거되므로 hover는 경계선 색 변화(`Highlight`)로 대체한다.

### 6-1. 구현 중 결정(사용자 결정 포함)
- **그리드 열**: 암묵 열이 내용 최소 폭으로 늘어나 텍스트 200%·375px에서 넘쳤으므로 `grid-template-columns: minmax(0, 1fr)`을 둔다.
- **소개문 대비(사용자 결정)**: 별 점 몇 픽셀 때문에 생기는 "가장 밝은 픽셀" 기준 미달은 예외로 기록한다. 텍스트 200%에서 소개문이 지구 불빛과 겹치는 부분은 `text-shadow: 0 0 0.15em blue-900` ×6 + `0 0 0.5em blue-900`으로 글자 바로 옆 배경을 어둡게 한다. em 단위라 확대에 비례하고, 어두운 배경에서는 거의 보이지 않는다. Figma에 없는 처리다.
  - 대안: 소개문 뒤 반투명 배경 → 화면 모양이 Figma와 더 달라져 제외. px 단위·흐림 없는 외곽선 그림자 → 200%에서 상대적으로 얇아져 효과가 작아 제외(측정 비교).
- **열린 모바일 패널 대비(사용자 결정)**: 375px에서 "03 Technology" 뒤로 흰 "SPACE"가 비쳐 `site-layout` 패널 대비 기준(4.5:1)에 못 미친다(2.74:1). 헤더 Figma 값(15% + blur)을 유지하고 예외로 기록한다. 코드는 바꾸지 않는다.

### 7. 캡처와 검증 방식
- 이전 change처럼 소스에서 스크래치 폴더로 미리보기를 빌드(HTML include, SCSS 컴파일, 이미지·JS 복사)하고 로컬 HTTP 서버 + Playwright Chromium으로 캡처·측정한다. `npm run build`/`npm run dev`는 `dist`를 지우므로 쓰지 않는다.
- 같은 스크립트·파일 이름·viewport·상태로 `screenshots/before/`와 `screenshots/after/`를 만든다. 홈 외 회귀 비교용으로 `crew-pilot.html`(헤더 열림 포함)도 캡처한다.
- 대비 측정은 Explore 글자(기본·hover, 흰 원 위)와 소개문 blue-300 글자 뒤 배경 이미지의 가장 밝은 픽셀을 기준으로 한다.

## Risks / Trade-offs

- [모바일 hover의 halo가 터치 기기에서 남아 보임] → `@media (hover: hover)`로 제한한다.
- [소개문 blue-300 글자가 배경 이미지의 밝은 부분 위에서 대비가 낮을 수 있음] → 375·768·1440에서 글자 영역 뒤 가장 밝은 배경 색으로 대비를 측정하고, 4.5:1 미만이면 보고서에 기록한 뒤 사용자와 보정 방법을 정한다(Figma 값 변경이므로 임의로 고치지 않음).
- [태블릿 768×1024에서 내용(패딩 256 + 텍스트 + 원 272)이 남은 높이보다 길어 세로 스크롤이 생길 수 있음] → `min-` 높이라 잘리지 않는다. spec은 데스크톱 1440×900에서만 스크롤 없음을 요구한다. 실제 높이를 측정해 보고서에 기록한다.
- [`100svh` 미지원 브라우저] → `100vh`를 먼저 선언해 대체한다.
- [Bellefair 웹 글꼴 로딩 전 대체 서체로 측정이 달라짐] → 측정은 `document.fonts.ready` 이후 수행한다.
- [헤더 높이가 바뀌면 데스크톱 아래 여백 128px 계산이 달라짐] → 그리드 `1fr`로 남은 높이를 채우므로 헤더 높이에 의존하지 않는다.

## Migration Plan

CSS 추가만 있으므로 배포 절차 변경이 없다. 되돌릴 때는 `_home.scss` 변경을 되돌리면 된다.

## Open Questions

- 없음. 태블릿·모바일 세로 배치는 Figma(파일 `N4sbXDrXrbiUYYF6ZUUZZh`) 조회로 확정했다.
