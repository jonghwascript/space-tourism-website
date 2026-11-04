# Design

## Context

- 동기는 [proposal.md](proposal.md) "Why" 참고. 요구사항은 `specs/*/spec.md` 참고.
- 현재 `src/pages/*.html` 12개는 starter 평문뿐이고 `src/partials/`는 없다. `gulpfile.js`의 `htmlTask`는 `gulp-file-include`(`prefix: '@@'`, `basepath: '@file'`)로 `src/pages/*.html`을 `dist/`에 출력한다.
- 기존 SCSS 자산: `.c-skip-link`, `.u-sr-only`, `.u-hidden`, Every Layout 기반 `l-*` 클래스. desktop 분기점은 `$breakpoints`의 1024px(`64em`), tablet은 768px.
- 제공 자산: `src/images/{home,destination,crew,technology}/background-*-{mobile,tablet,desktop}.jpg`, destination·crew의 `image-*.{webp,png}`, technology의 `image-*-{portrait,landscape}.jpg`, `shared/{logo,icon-hamburger,icon-close}.svg`.
- Figma(`yxbe3VJDYJjy4OzccnLVYJ`): 페이지별 A~D 프레임이 375/768/1440 폭으로 있다. 사용자가 지정한 프레임은 각 페이지의 A, 모바일 내비 A~D·미리보기, 스타일 가이드(`1:152`, `9:4197`), 배경(`1:3203`, `1:3380`, `9:392`, `9:1649`), 데스크톱 hover 4종이다. `get_metadata`는 프레임 하위 노드를 반환하지 않아 구조는 `get_design_context`로 확인해야 한다.
- 이번 단계는 `src/scss`, `src/js`, `dist`를 수정할 수 없다. `node_modules`가 설치되어 있지 않다.

## Goals / Non-Goals

**Goals:**

- 공통 마크업을 partial 하나로 유지하면서 페이지별 현재 표시·초기 탭을 빌드 시점에 결정한다.
- CSS 단계가 레이아웃 차이(모바일/태블릿/데스크톱 배치, hover)를 HTML 변경 없이 처리할 수 있는 클래스와 DOM 순서를 제공한다.
- `dist`를 건드리지 않는 미리보기·검증 경로를 마련한다.

**Non-Goals:**

- 탭 전환, 메뉴 열기/닫기, 포커스 관리 스크립트(JS 단계).
- 배경 이미지, 장식선, 시각적 일치(CSS 단계). 배경 이미지는 CSS `background`로 처리할 장식이므로 HTML에 `<img>`로 넣지 않는다.
- `data.json`을 이용한 동적 렌더링.

## Decisions

### 1. 공통 마크업은 `gulp-file-include` context 변수로 partial화

- `src/partials/head.html`(meta, 파비콘, 글꼴, CSS 링크)과 `src/partials/header.html`(건너뛰기 링크, 로고, 메뉴 토글, nav)을 만든다. 페이지는 `@@include('../partials/header.html', {"current": "crew"})`처럼 현재 그룹을 넘기고, partial에서 `@@if (context.current === 'crew') { aria-current="page" }` 형태로 속성을 출력한다. `<title>`은 페이지 파일에 직접 둔다(페이지마다 다르고 한 줄이라 partial로 얻는 이점이 없음).
- 대안: 12개 파일에 헤더 복사 → 수정 시 불일치 위험(`site-layout` "공통 마크업 단일 원본" 위반 가능). 페이지별 문자열 변수(`{"crewCurrent": "aria-current=\"page\""}`) → `@@if`가 동작하지 않을 때의 대체안으로 남긴다.
- 확인 필요: `@@if`가 속성 위치에서 정상 출력되는지 첫 작업에서 실제 빌드로 검증한다.

### 2. 탭 그룹은 그룹별 partial 하나 + 초기 선택 변수

- `src/partials/destination-tabs.html`, `crew-tabs.html`, `technology-tabs.html`에 그룹의 모든 탭·패널을 작성하고, 페이지 파일은 `{"selected": "mars"}` 같은 값만 넘긴다. partial은 `@@if`로 `aria-selected`, `tabindex`, 패널 `hidden`을 출력한다.
- 이렇게 하면 12개 파일이 같은 패널 내용을 공유하고, 각 파일은 JS 없이도 자기 항목을 보여 준다(`content-tabs` "파일별 초기 선택 상태").
- 대안: 그룹별 1개 페이지로 통합 → 사용자가 12개 페이지 유지를 선택했으므로 제외. 탭을 페이지 간 링크로 구현 → 사용자가 ARIA 탭 위젯을 선택했으므로 제외.
- 패널에는 포커스 가능한 요소가 없으므로 APG 권장대로 `tabindex="0"`을 둔다.

### 3. DOM 순서: 탭 목록 → 패널, 시각 순서 차이는 CSS로

- 세 그룹 모두 `h1` → tablist → panels 순서로 통일한다(APG 관례, 예측 가능한 키보드 흐름).
- 패널 내부 순서: Destination `picture → h2 → p → dl`, Crew `역할 → h2 → p → picture`, Technology `소개 문구 → h2 → p → picture`.
- Figma와의 시각 순서 차이는 인계표에 적는다: Destination 데스크톱은 이미지가 tablist 왼쪽, 모바일은 tablist 위. Crew 데스크톱은 점 탭이 본문 아래, 사진이 오른쪽. Technology는 숫자 탭이 본문 왼쪽(데스크톱) 또는 위(모바일/태블릿), 이미지는 데스크톱에서 오른쪽, 모바일에서 위.
- 역할·소개 문구는 제목 일부가 아니므로 `<p>`로 두고 `<h2>` 앞에 둔다. 여러 줄 묶음은 `hgroup` 대신 `div`(`c-*__heading`)로 감싸 CSS가 간격을 제어하게 한다. 대안 `hgroup`은 지원·해석이 일관되지 않아 제외.

### 4. 이미지 마크업

- Destination·Crew: `<picture><source type="image/webp" srcset="….webp"><img src="….png" …></picture>`.
- Technology: `<picture><source media="(min-width: 64em)" srcset="…-portrait.jpg"><img src="…-landscape.jpg" …></picture>`. `64em`은 SCSS `respond-to('desktop')` 믹스인이 만드는 `min-width: 64em`과 같은 값이다.
- `width`·`height`는 `get_design_context`의 데스크톱 표시 크기를 쓰고, 비율이 자산과 다르면 `file`/이미지 크기로 확인해 인계표에 기록한다.
- 로고 링크: 링크 안 로고 이미지에 `alt="Space tourism home"`을 써서 링크 이름으로 삼는다. nav의 "Home" 링크와 이름이 겹치지 않게 사이트 이름을 포함한다.

### 5. 내비게이션과 토글

- `<nav aria-label="Main">` 안에 `<ul id="primary-navigation">`. 각 링크: `<a href><span class="c-nav__number" aria-hidden="true">00</span> Home</a>`.
- 토글 버튼은 하나이며 햄버거·닫기 아이콘을 모두 담는다(아이콘 전환은 CSS/JS 단계). 숨긴 텍스트 "Open menu". 데스크톱에서 숨기는 처리는 CSS 단계.

### 6. 클래스 이름

- 블록: `c-site-header`, `c-logo`, `c-nav`, `c-nav-toggle`, `c-hero`, `c-explore`, `c-page-title`, `c-tabs`(공통 tablist), `c-destination`, `c-crew`, `c-technology`, 변형 `c-tabs--underline`(Destination), `c-tabs--dots`(Crew), `c-tabs--numbers`(Technology).
- 페이지 루트: 그룹별 배경 이미지를 CSS에서 지정할 수 있도록 `<body class="c-page c-page--home">`(`--destination`, `--crew`, `--technology`)를 둔다.
- `l-` 클래스: Auto Layout gap이 프리셋과 정확히 같을 때만 `data-space`/`data-gap`을 쓰고, 다르면 인계표에 Figma 값을 적는다.

### 7. 미리보기와 검증 경로 (`dist` 비사용)

- `npm ci`로 의존성 설치(lockfile 기준, `dist` 영향 없음).
- 스크래치 폴더에 node 스크립트로 `gulp.src('src/pages/*.html').pipe(fileInclude({prefix:'@@', basepath:'@file'})).pipe(gulp.dest(<scratch>))`를 실행하고, figma-guide.md §6 방법 A처럼 이미지·CSS를 같은 구조로 복사한다. `npm run build`/`dev`와 방법 B는 쓰지 않는다.
- Chromium(`@playwright/test`)으로 이미지 로드, 탭 순서, 제목 계층, 접근 가능한 이름, `currentSrc`를 측정한다. Firefox가 없으면 미검증으로 기록한다.

## Risks / Trade-offs

- [`@@if`가 속성 위치에서 동작하지 않음] → 첫 작업에서 실제 빌드로 확인하고, 실패 시 결정 1의 문자열 변수 대체안으로 전환한다.
- [비선택 패널이 JS 없이 `hidden`이라 해당 파일에서 접근 불가] → 각 패널은 자기 페이지 파일에서 초기 선택으로 접근 가능하다. JS 단계 전까지의 제약으로 인계 보고서에 기록한다.
- [모바일 메뉴가 JS 없이 열리지 않음] → CSS 단계에서 목록 기본 표시 방식을 정할 때 고려하도록 인계표에 기록한다.
- [Destination 이미지가 패널 안에 있어 데스크톱에서 tablist 옆 배치가 CSS로 까다로움] → 인계표에 grid 배치 요구(이미지 열과 tablist+본문 열)를 명시한다. 패널에 `display: contents`를 쓰면 일부 브라우저에서 role이 사라지므로 피하도록 함께 적는다.
- [Figma 텍스트와 starter 텍스트 불일치(대소문자·문장부호)] → 대문자는 CSS `text-transform`으로 처리한다고 보고 원문 대소문자를 유지한다. 단어 차이는 Figma 레이어를 기준으로 하되 보고서에 차이를 적는다.
- [Figma가 사용자가 지정하지 않은 B~D 프레임을 가짐] → 패널 내용은 starter·`data.json`을 원본으로 하고, B~D 프레임은 내용 대조용으로만 조회한다.

## Open Questions

- Figma 스타일 가이드의 정확한 글꼴 family·굵기 조합(Google Fonts URL)은 `get_design_context`/`get_variable_defs` 결과로 확정한다. 접근 방식에는 영향이 없다.
