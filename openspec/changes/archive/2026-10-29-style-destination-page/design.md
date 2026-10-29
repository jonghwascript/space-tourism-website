# Design

## Context

- 마크업(`src/partials/destination-tabs.html`, 4개 페이지가 `selected`만 바꿔 include): `<main class="c-destination" id="main">` 안에 순서대로
  1. `h1.c-page-title.l-cluster`(`__number` aria-hidden "01", `__text`)
  2. `div.c-tabs.c-tabs--underline.l-cluster[role=tablist]` + `button.c-tabs__tab` ×4
  3. `div.c-destination__panel[role=tabpanel][tabindex=0]` ×4(선택 외 `hidden`) — 안에 `picture.c-destination__image`(img 480×480 속성), `div.c-destination__text.l-stack`(h2 `__name`, p `__description`), `dl.c-destination__stats`(`div.__stat.l-stack` ×2: dt `__stat-label`, dd `__stat-value`)
- `c-page`, `c-page-title`, `c-tabs`, `c-destination`에 대한 SCSS는 아직 없다(`grep` 확인). `c-page-title`은 Crew·Technology partial에서도 같은 구조로 쓰인다. `c-tabs`는 Crew(`--dots`)·Technology에서도 쓰인다.
- 리셋(`_reset.scss`): `* { margin: 0 }`, `img { display: block; max-width: 100% }`, `button` 초기화(`inline-flex`, 배경·테두리 없음). `[hidden]`에 대한 규칙은 없다 — UA의 `display: none`만 있어, 패널에 `display`를 지정하면 숨긴 패널이 다시 보인다.
- `.l-cluster`는 `display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center`. `.l-stack`은 세로 flex, `gap: 1.5rem`.
- 전역 `:focus-visible`: 2px white outline, offset 4px.
- 홈 change가 정한 패턴: `.c-page--home`을 `auto 1fr` 2행 그리드 + `min-block-size: 100vh → 100svh` + `minmax(0, 1fr)` 열, 분기점별 `background-image`. 데스크톱 본문 폭은 `inline-size: min(69.375rem, 100% - 5rem); margin-inline: auto`.
- Figma(파일 `N4sbXDrXrbiUYYF6ZUUZZh`) 값은 `doc/figma-values.md` 3·6·9절과 이번 계획에서 조회한 스크린샷(91:1358·49:1019·9:2089)을 기준으로 한다. 스크린샷 측정: 데스크톱 이미지 왼쪽 ≈195px, 텍스트 묶음 왼쪽 ≈783px·폭 445px, 태블릿 통계 두 열 중심 ≈249·518px. 이 값은 "같은 폭 2열(1110 − 32)/2 = 539px 안에 각각 가운데"와 "통계 (514 − 24)/2 열"로 설명된다.
- 작업 트리에 사용자 미커밋 변경(`AGENTS.md`, `doc/figma-guide.md`, `_site-header.scss`, `docs/`)이 있다. 이 change는 그 파일들을 수정하지 않는다.
- 검증 환경: Playwright Chromium + 스크래치 미리보기 빌드(`dist` 미사용). Firefox는 이전 change 기준 미설치 — 실행 시 다시 확인한다.

## Goals / Non-Goals

**Goals:**
- `specs/destination-page/spec.md`의 추가 요구사항을 측정 가능하게 구현한다.
- 페이지 제목과 탭 바탕은 Crew·Technology가 재사용할 수 있는 컴포넌트로 만든다.

**Non-Goals:**
- `.c-page` 골격(배경·2행 그리드)을 홈과 공통화하는 리팩터링. 홈 회귀 위험을 피하려고 이번에는 Destination 전용으로 두고, 세 페이지가 끝난 뒤 별도 change로 묶는다.
- Crew 점 탭·Technology 숫자 탭의 변형 스타일.
- Figma B~D 프레임(Mars·Europa·Titan) 개별 대조는 이미지·텍스트만 다르므로 데스크톱 캡처 육안 확인으로 대신한다.

## Decisions

### 1. 파일 구성
- `pages/_destination.scss`: `.c-page--destination`(배경·2행 그리드), `.c-destination`(본문 배치), `.c-destination__*`(패널 내용).
- `components/_page-title.scss`: `.c-page-title` — Figma text-preset-5와 번호 스타일이 세 페이지에서 같다. 정렬(모바일 가운데, 태블릿 이상 왼쪽)도 Crew·Technology Figma와 같아 컴포넌트에 둔다.
- `components/_tabs.scss`: `.c-tabs__tab` 공통 바탕(버튼 리셋 위 서체·색·커서)과 `.c-tabs--underline` 변형. 점·숫자 변형은 각 페이지 change에서 같은 파일에 추가한다.
- `style.scss`에 components 2개는 `site-header` 뒤, page는 `home` 뒤에 `@use`한다.
- 대안: 모두 `_destination.scss`에 두기 → Crew·Technology에서 제목을 다시 옮겨야 하고 중복이 생겨 제외.

### 2. 숨긴 패널: `[hidden]`을 리셋에서 보강
패널에 `display: grid`를 주면 UA `[hidden] { display: none }`을 이긴다. `_reset.scss`에 `[hidden] { display: none !important; }`를 추가한다. 리셋 계층의 일반 규칙이고, 현재 저장소에 `hidden`을 쓰는 다른 곳은 탭 패널뿐이라(검색으로 재확인) 다른 화면 영향이 없다.
- 대안: `.c-destination__panel:not([hidden])`에만 display 지정 → 이후 Crew·Technology 패널마다 같은 주의가 필요해 제외.

### 3. 화면 순서(이미지 → 탭 → 텍스트): main 그리드 + 패널 subgrid
DOM은 `제목 → 탭 목록 → 패널(이미지, 텍스트, 통계)`이고 화면은 `제목 → 이미지 → 탭 → 텍스트 → 통계`(모바일·태블릿) 또는 `이미지 | 탭+텍스트+통계`(데스크톱)다. `content-tabs` spec이 탭 목록을 패널보다 앞에 두도록 정했으므로 DOM은 유지하고 CSS 그리드로 배치한다.
- `.c-destination`을 `grid-template-areas`가 있는 그리드로 만든다.
  - 모바일·태블릿: 1열, 행 `title / image / tabs / text / stats`.
  - 데스크톱: 2열 `minmax(0,1fr) minmax(0,1fr)`, 열 간격 32px. 행 `title title / image tabs / image text / image stats`, 이미지 영역 세로 가운데, 오른쪽 세 행 묶음은 `align-content: center`로 이미지와 세로 중심을 맞춘다.
- 보이는 패널은 `grid-row`·`grid-column`으로 title 아래 전체를 차지하고 `display: grid; grid-template-rows/columns: subgrid`로 main의 트랙을 물려받아, 자식 `picture`·`__text`·`__stats`가 각 영역에 놓인다. 탭 목록은 main의 `tabs` 영역에 직접 놓인다. 패널 상자가 tabs 행을 덮지만 배경이 없어 보이지 않는다.
- subgrid 지원: Chrome 117+, Firefox 71+, Safari 16+. 미지원 환경에서는 패널이 한 칸에 세로로 쌓여 "탭 → 이미지 → 텍스트" 순서로 보이며 내용은 모두 읽힌다(점진적 향상).
- 대안 A: 패널에 `display: contents` → `role=tabpanel`과 `tabindex=0`의 포커스·접근성 트리 노출이 브라우저마다 불안정해 제외.
- 대안 B: 이미지를 패널 밖으로 옮기는 마크업 변경 → `destination-page` spec("패널은 이미지·h2·설명·통계를 이 순서로 가진다")을 바꿔야 해 제외.
- 대안 C: 탭을 `position: absolute`로 이미지 아래 띄우기 → 이미지 높이·글자 확대에 따라 겹침이 생겨 제외.
- 탭은 시각 순서상 이미지 뒤지만 포커스 가능한 요소 순서(탭 → 패널)는 DOM과 화면이 같아 WCAG 2.4.3 문제가 없다. 이미지는 포커스 대상이 아니다.
- 패널 포커스 outline은 패널 상자(탭 행 포함)를 둘러싼다. 포커스 표시로는 충분하지만 모양이 어색하면 구현 중 캡처로 확인하고 보고서에 기록한다.

### 4. 영역별 크기와 간격
- 본문 패딩: 모바일 24px, 태블릿 40px, 데스크톱 위아래 48px + 폭 `min(69.375rem, 100% - 5rem)` 가운데(홈과 같은 방식, 1024px에서 좌우 40px).
- 제목–본문 간격 24px(Figma 데스크톱 값을 세 화면에 공통 적용).
- 이미지: `inline-size: min(9.375rem, 100%)` / `18.75rem` / `30rem`, `aspect-ratio: 1`, `justify-self: center`. 데스크톱 원본(445px)보다 크게 늘어나는 것은 Figma 지시(480 표시)대로다.
- 텍스트 묶음: 모바일·태블릿 `max-inline-size: 32.125rem`(514px) 가운데, 데스크톱 `inline-size: min(27.8125rem, 100%)`(445px) 오른쪽 열 가운데.
- 세로 간격(Figma 값): 탭–이름·이름 묶음–구분선·구분선–통계는 데스크톱 40px, 태블릿·모바일 24px. 이름–설명 16px. 통계 라벨–값 12px.
- 이미지–탭 간격(모바일·태블릿)과 태블릿에서 남은 높이 분배는 `doc/figma-values.md`에 수치가 없다. 첫 구현 과제에서 `get_design_context`로 91:1358·49:1019를 조회해 값을 확정하고, 조회할 수 없으면 스크린샷 측정값(모바일 약 64px)을 쓰고 미확인으로 기록한다. 이 값은 spec 시나리오(순서·겹침 없음)에 영향이 없다.
- 구분선: `.c-destination__stats`의 `border-block-start: 1px solid rgb(255 255 255 / 25%)` + `padding-block-start`. 별도 요소를 추가하지 않는다.
- 통계: 모바일 `l-stack` 세로(간격 24px), 태블릿 이상 `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px`. 각 `__stat`의 `l-stack` 간격은 `--space: 0.75rem`(12px)으로 덮어쓴다.
- `.l-cluster`(`gap: 1rem`, 가운데)를 쓰는 제목·탭은 컴포넌트에서 `--space`를 덮어쓴다(제목 번호–텍스트 Figma 간격, 탭 32px). 데스크톱 탭은 `justify-content: flex-start`.

### 5. 타이포그래피와 넘침
- spec 값대로 rem으로 지정하고 대문자는 `text-transform`으로 처리해 접근 가능한 이름을 유지한다.
- 이름(56/80/96px)은 한 단어라 줄바꿈되지 않는다. 가장 긴 "EUROPA"가 320px·텍스트 200%에서 넘치지 않도록 `min(<rem>, <vw 상한>)`을 둔다. 기본 루트 글꼴에서는 상한이 적용되지 않아 spec 값과 같다. 계수는 320px·200% 측정으로 정한다(홈 "Space"와 같은 방식).
- 탭은 `l-cluster`의 `flex-wrap`으로 200%에서 줄바꿈될 수 있다. 줄바꿈 시 선택 표시선이 다른 탭과 겹치지 않는지 확인한다.
- 그리드 열은 모두 `minmax(0, 1fr)`로 두어 내용 최소 폭 때문에 화면을 넘지 않게 한다.

### 6. 탭 상태
- 기본: 높이 32px 상자에서 글자 아래 8px 위치에 `border-block-end: 3px solid transparent`(또는 같은 크기의 `box-shadow inset`)를 두어 상태가 바뀌어도 상자 크기가 고정된다. 비선택 `color: $blue-300`, 선택(`[aria-selected='true']`) `color: $white; border-color: $white`. 선택 상태를 클래스가 아닌 ARIA 속성으로 걸어 이후 JS가 속성만 바꾸면 스타일이 따라오게 한다.
- hover: `@media (hover: hover)`에서 비선택 탭 `:hover`에 `border-color: rgb(255 255 255 / 50%)`. 선택 탭은 white 유지.
- 포커스: 전역 `:focus-visible` outline 사용. 탭 목록·main에 `overflow` 클리핑이 없어 잘리지 않는다.
- 전환: `transition: border-color 0.3s ease, color 0.3s ease`, `prefers-reduced-motion: reduce`에서 `transition: none`(헤더·홈과 같은 방식).
- 강제 색상: 투명 테두리는 강제 모드에서도 투명으로 남고, 선택 탭 white 테두리는 `CanvasText` 계열로 바뀐다. 구현 후 캡처로 확인하고, 구분되지 않으면 `@media (forced-colors: active)`에서 선택 탭 `border-color: Highlight`를 지정한다. 구분선은 `border`라 시스템 색으로 남는다.
- 탭 전환 동작이 없어 비선택 탭이 hover 피드백은 주지만 눌러도 바뀌지 않는다. 사용자 결정으로 다음 change(탭 스크립트)에서 해결하며, 보고서의 알려진 제한에 적는다.

### 7. 캡처와 검증 방식
- 홈 change와 같은 스크래치 미리보기 빌드(HTML include·SCSS 컴파일·이미지·JS 복사)와 로컬 HTTP 서버 + Playwright Chromium을 쓴다. `npm run build`/`npm run dev`는 `dist`를 지우므로 쓰지 않는다.
- 같은 스크립트·파일 이름·viewport·상태로 `screenshots/before/`와 `screenshots/after/`를 만든다. 회귀 비교용으로 홈, `crew-pilot.html`, `technology-vehicle.html`도 캡처한다(Crew·Technology는 제목 변화가 의도된 차이).
- Figma 스크린샷(91:1358·49:1019·9:2089)과 같은 viewport 캡처를 육안 대조한다.

## Risks / Trade-offs

- [subgrid 미지원 브라우저에서 탭이 이미지 위에 표시됨] → 내용·순서가 모두 읽히는 대체 배치라 허용한다. 보고서에 기록한다.
- [`[hidden] !important` 리셋이 미래의 `hidden` + 표시 애니메이션 패턴을 막음] → 현재 그런 사용처가 없다. 필요해지면 해당 요소만 예외 처리한다.
- [데스크톱 이미지가 원본 445px보다 큰 480px로 늘어나 약간 흐릿함] → Figma 지시를 따르고 보고서에 기록한다.
- [설명 blue-300 글자와 배경 이미지의 밝은 부분(별) 대비] → 375·768·1440px에서 측정하고, 4.5:1 미만이면 홈처럼 사용자와 보정 방법을 정한다(임의로 Figma 값을 바꾸지 않음).
- [태블릿 768×1024에서 내용이 남은 높이보다 길어 세로 스크롤] → `min-` 높이라 잘리지 않는다. spec은 데스크톱 1440×1024만 스크롤 없음을 요구한다. 측정값을 보고서에 적는다.
- [텍스트 200%에서 em 분기점이 커져 1440px이 태블릿 배치가 됨] → 의도된 동작(분기점이 글꼴과 함께 커짐)이며 넘침·겹침만 확인한다.
- [Crew·Technology 제목 모양이 바뀜] → 의도된 영향. 회귀 캡처에서 제목 외 차이가 없는지 확인한다.

## Migration Plan

CSS 추가와 리셋 규칙 1개 추가뿐이라 배포 절차 변경이 없다. 되돌릴 때는 새 SCSS 파일과 `style.scss`의 `@use`, 리셋 규칙을 되돌린다.

## Open Questions

- 모바일·태블릿 이미지–탭 간격과 태블릿 세로 분배의 정확한 Figma 수치(과제 2.1에서 조회. spec과 접근 방식에는 영향 없음).
