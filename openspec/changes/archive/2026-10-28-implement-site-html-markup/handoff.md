# HTML 단계 인계 보고서

[doc/figma-html.md](../../../doc/figma-html.md) 절차에 따른 HTML 구현 결과와 CSS·JS 단계를 위한 인계 자료입니다.

## 1. 시작 전 확인

| 항목 | 결과 |
| --- | --- |
| 사용자 변경 | `git status --short src` 결과 없음. `src/pages`, `src/partials`, `src/images`에 기존 사용자 변경 없음(`doc/figma-guide.md`만 수정 상태, 이번 작업 대상 아님) |
| 의존성 | `npm ci` 성공(495 packages). `require('gulp-file-include')`, `require('sass')` 정상 |
| `dist` | 작업 전후 모두 존재하지 않음. `npm run build`/`dev`, `gulp html/scss/static`을 실행하지 않음 |

## 2. Figma 자료 확보

파일 `yxbe3VJDYJjy4OzccnLVYJ`. `get_design_context`(DC)는 스크린샷 제외 옵션으로 받고, 스크린샷(SS)은 `get_screenshot`으로 따로 받아 스크래치 폴더에 저장했습니다.

| 구분 | 프레임 | 노드 | DC | SS |
| --- | --- | --- | --- | --- |
| 스타일 가이드 | Colors/Typography | 1:152 | `get_variable_defs` | 확보 |
| 스타일 가이드 | Components | 9:4197 | `get_variable_defs` | 확보 |
| 배경 | Home/Destination/Crew/Technology | 1:3203, 1:3380, 9:392, 9:1649 | 생략(CSS 배경, 제공 자산 사용) | 확보 |
| 내비 | Mobile Navigation Menu - Preview | 91:2336 | 생략(A~D와 동일 구성) | 확보 |
| 내비 | Mobile Navigation A | 120:2725 | 확보 | 확보 |
| 내비 | Mobile Navigation B~D | 120:2773, 120:2814, 120:2855 | 생략(선택 항목만 다름) | 확보 |
| 모바일 | Home / Destination A / Crew A / Technology A | 91:1207, 91:1358, 91:1765, 91:2090 | 확보 | 확보 |
| 태블릿 | Home / Destination A / Crew A / Technology A | 49:792, 49:1019, 49:1527, 49:2171 | 확보 | 확보 |
| 데스크톱 | Home / Destination A / Crew A / Technology A | 9:2078, 9:2089, 9:2118, 9:2139 | 확보 | 확보 |
| 상태 | Home / Destination / Crew / Technology Hover | 99:1496, 99:1739, 99:1808, 99:1864 | 생략(기본 프레임과 구조 동일) | 확보 |

### 디자인 변수 (`get_variable_defs` 1:152)

| 종류 | 값 |
| --- | --- |
| 색 | `color/white #FFFFFF`, `color/blue-300 #D0D6F9`, `color/blue-900 #0B0D17` |
| 간격 | `spacing/25 2`, `/50 4`, `/100 8`, `/150 12`, `/200 16`, `/300 24`, `/400 32`, `/500 40`, `/600 48`, `/800 64`, `/1000 80`, `/1200 96`, `/1600 128` (px) |
| 서체 | Bellefair 400, Barlow 400, Barlow Condensed 400·700 |

| 프리셋 | 서체 | 데스크톱 | 태블릿 | 모바일 | 자간 | 줄 간격 |
| --- | --- | --- | --- | --- | --- | --- |
| text-preset-1 | Bellefair | 144 | 144 | 80 | 0 | 100% |
| text-preset-2 | Bellefair | 96 | 80 | 56 | 0 | 100% |
| text-preset-3 | Bellefair | 56 | 40 | 24 | 0 | 100% |
| text-preset-4 | Bellefair | 32 | 24 | 18 | 0 | 100% |
| text-preset-5 | Barlow Condensed | 28 | 20 | 16 (mobile preset-6) | 4px / 15% | 100% |
| text-preset-6 | Bellefair | 28 | 28 | 28 | 0 | 100% |
| text-preset-7 | Barlow Condensed | 14 | 14 | 14 | 2px | 100% |
| text-preset-8 | Barlow Condensed | 16 | 16 | 14 | 2px (모바일 2.1px) | 100% |
| text-preset-8-bold | Barlow Condensed 700 | 16 | 16 | 16 | 2.7px | 100% |
| text-preset-9 | Barlow | 18 | 16 | 15 | 0 | 180% |

## 3. 내용 대조 (B~D 프레임)

데스크톱 Destination B~D(9:2406, 9:2434, 9:2462), Crew B~D(9:2280, 9:2322, 9:2364), Technology B~C(9:2179, 9:2219) 스크린샷의 문구를 starter 페이지·`data.json`과 비교했습니다(텍스트 영역을 잘라 육안 대조).

| 항목 | 결과 |
| --- | --- |
| 이름·설명·거리·이동 시간 | 일치. 대문자 표시는 CSS `text-transform`으로 처리하고 원문 대소문자 유지 |
| "The terminology..." | Figma는 말줄임표 문자 `…`(U+2026), starter는 마침표 3개. **Figma 레이어 기준으로 `…` 사용** |
| Victor Glover 소개 "F/A-18.He" | Figma·starter·`data.json` 모두 마침표 뒤 공백 없음. 오타 의심이지만 원문 유지 |
| Crew 역할 "Commander " | Figma 레이어 끝에 공백이 있음. HTML에서는 공백 제거 |
| 모바일·태블릿 Crew 소개 | Figma 레이어에 빈 문단(폭 없는 공백) 1~2개가 붙어 있음. 내용이 없어 HTML에 넣지 않음 |
| 태블릿 Home 내비 | 선택된 "HOME"에만 번호 "00"이 없음(다른 태블릿 프레임은 "00 HOME"). Figma 불일치로 보고 번호를 유지 |

## 4. 자산

| Figma 요소 | 사용 자산 | 픽셀 크기 | 비고 |
| --- | --- | --- | --- |
| 로고 | `shared/logo.svg` | 48×48 | Figma와 같은 그림 |
| 햄버거 메뉴 | `shared/icon-hamburger.svg` | 24×21 | Figma는 막대 도형 3개(24×3, 간격 9)로 그려져 있으나 같은 모양 |
| 닫기 | `shared/icon-close.svg` | 20×21 | Figma는 회전한 막대 2개 |
| 목적지 이미지 | `destination/image-*.{webp,png}` | 445×445 | 데스크톱 표시 480, 태블릿 300, 모바일 150. 데스크톱에서 원본보다 약 8% 확대됨 |
| 승무원 사진 | `crew/image-*.{webp,png}` | 514×700 | Figma 표시 영역 539×676(데스크톱)으로 비율이 다름. HTML `width`·`height`는 자산 비율 기준 496×676 |
| 기술 이미지 portrait | `technology/image-*-portrait.jpg` | 515×527 | Figma 표시 영역 약 608×600(잘림). HTML은 자산 비율 기준 586×600 |
| 기술 이미지 landscape | `technology/image-*-landscape.jpg` | 768×310 | 태블릿·모바일. Figma는 폭 768 기준으로 잘라 표시 |
| Crew 점, Technology 원 | 없음 | — | 단색 원과 테두리라 CSS로 그림(자산 아님) |
| 페이지 배경 | `*/background-*-{mobile,tablet,desktop}.jpg` | — | CSS 단계에서 `background-image`로 사용 |

새로 추가한 자산은 없습니다. 소스에 Figma 임시 URL이나 localhost 주소를 쓰지 않았습니다.

## 5. HTML 구조

| 파일 | 내용 |
| --- | --- |
| `src/partials/head.html` | meta, 파비콘, Google Fonts(`preconnect` 2줄 + Barlow 400, Barlow Condensed 400·700, Bellefair, `display=swap`), `./css/style.css` |
| `src/partials/header.html` | 건너뛰기 링크, 로고 링크, 메뉴 토글 버튼, `nav[aria-label=Main]`. 인자 `current`(`home`·`destination`·`crew`·`technology`)로 `aria-current="page"` 출력 |
| `src/partials/{destination,crew,technology}-tabs.html` | 그룹의 `<main>` 전체(h1, tablist, 모든 패널). 인자 `selected`로 `aria-selected`·`tabindex`·`hidden` 출력 |
| `src/pages/*.html` | 12개 페이지. 각 파일은 head·header·탭 partial include와 고유 `<title>`만 가짐 |

### DOM 순서와 Figma 시각 순서의 차이 (CSS 단계에서 처리)

DOM은 모든 그룹에서 `h1` → tablist → 패널 순서입니다. 패널 내부 순서와 Figma 배치가 다른 곳은 아래와 같습니다.

| 페이지 | 화면 | Figma 배치 | DOM 순서 | CSS 처리 제안 |
| --- | --- | --- | --- | --- |
| Destination | 데스크톱 | 왼쪽 열: 이미지 / 오른쪽 열: 탭 → 이름·설명 → 구분선 → 통계 | tablist, 패널(이미지 → 텍스트 → 통계) | `main`을 grid로 두고 tablist를 오른쪽 열 첫 행, 패널은 `grid-row` 범위를 넘겨 배치. 패널에 `display: contents`는 쓰지 않음(일부 브라우저에서 tabpanel 역할이 사라짐) |
| Destination | 모바일·태블릿 | 이미지 → 탭 → 텍스트 → 통계(세로) | tablist가 이미지보다 앞 | 위와 같은 grid에서 이미지 행을 tablist보다 위로 배치 |
| Crew | 전체 | 역할·이름·소개 → 점 탭 → 사진 | tablist가 패널(텍스트·사진)보다 앞 | grid로 점 탭 행을 텍스트와 사진 사이에 배치 |
| Technology | 데스크톱 | 숫자 탭(세로) │ 텍스트 │ 이미지(오른쪽 가장자리까지) | tablist, 패널(텍스트 → 이미지) | 3열 grid. 탭은 세로 배치 |
| Technology | 모바일·태블릿 | 이미지(화면 폭 가득) → 숫자 탭(가로) → 텍스트 | tablist가 이미지보다 앞 | 이미지 행을 tablist보다 위로 배치 |

## 6. 스타일 인계표

값은 Figma px 기준이며 1rem = 16px입니다. 서체 프리셋은 §2 표를 참고합니다. `l-stack`의 기본 간격은 24px(1.5rem), `l-cluster`는 16px(1rem)입니다.

> figma-guide.md는 `l-stack[data-space]`, `l-cluster[data-gap]` 프리셋을 안내하지만 [_every-layout.scss](../../../src/scss/layout/_every-layout.scss)에는 정의가 없습니다. 그래서 `data-space`·`data-gap`을 쓰지 않았고, 기본값과 다른 간격은 컴포넌트 SCSS에서 `--space`로 지정해야 합니다.

### 공통

| 클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이 |
| --- | --- | --- | --- | --- | --- | --- |
| `c-page`, `c-page--{home,destination,crew,technology}` | 9:2078 외 프레임 배경 | 최소 높이: 화면 높이 | — | 배경 `blue-900 #0B0D17` + 그룹별 배경 이미지(cover) | — | 배경 이미지 mobile/tablet/desktop 교체 |
| `c-skip-link` | 없음(접근성 추가) | 기존 SCSS 사용 | — | — | focus 시 표시 | — |
| `c-site-header` | 9:2079 Navigation | 데스크톱 상단 패딩 40, 로고 영역 왼쪽 패딩 64 | — | — | — | 태블릿 상단 패딩 0·로고 왼쪽 40, 모바일 상하 24·좌우 24 |
| `c-site-header` 장식선 | I9:2079;1:2984 | 로고와 nav 사이 1px 선, 로고와 간격 64, nav 위로 32 겹침 | — | white 25% | — | 데스크톱만. HTML 없이 `::after` 등으로 처리 |
| `c-site-header__logo(-image)` | I9:2079;1:2982 | 48×48 | — | — | hover·focus 미정의 | 모바일 40×40 |
| `c-nav-toggle`, `__icon--open/--close` | I120:2494;91:1266, 120:2733 | 아이콘 24×21 / 20×21 | — | blue-300 | 열림 시 close 아이콘 | 모바일만 표시(태블릿 이상 숨김) |
| `c-nav` / `c-nav__list` | I9:2079;1:2958 | 높이 96, 좌우 패딩 64, 항목 간격 48, 최소 폭 664 | — | 배경 white 5% + `backdrop-filter: blur(40px)` | — | 태블릿 좌우 패딩 40·최소 폭 488. 모바일: 오른쪽 패널(폭 254, 좌측 패딩 32, 닫기 영역 상하 32, 항목 세로 간격 32, 배경 `rgba(11,13,23,.15)` + blur 40) |
| `c-nav__link` | Navigation States | 데스크톱·태블릿 높이 96, 아래 테두리 3px | text-preset-8 (16, 자간 2) | white | 현재: 아래 테두리 white. hover: 아래 테두리 white 50% (99:1496) | 모바일: 폭 222, 오른쪽 테두리 3px로 현재 표시 |
| `c-nav__number` | 1:2501 | 번호–이름 간격 12 | text-preset-8-bold (16, 700, 자간 2.7) | white | — | 태블릿에서 표시 여부는 §3 불일치 참고 |
| `c-page-title`, `__number`, `__text` | 9:2093 Page Title | 번호–문구 간격 24 (`l-cluster`, `--space: 1.5rem`) | text-preset-5 (28, 자간 4). 번호는 Bold, 자간 4.725 | white, 번호 opacity 25% | — | 태블릿 20/자간 3, 모바일 16/자간 2.4 가운데 정렬 |

### Home

| 클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이 |
| --- | --- | --- | --- | --- | --- | --- |
| `c-hero` (`main`) | 9:2080, 9:2081 | 상하 패딩 128, 최대 폭 1110, 텍스트와 버튼 간격 48, 아래 정렬 | — | — | — | 태블릿 상하 128·좌우 40 세로 배치·가운데 정렬. 모바일 패딩 24, 세로, 텍스트 가운데 |
| `c-hero__content` (`l-stack`) | 9:2083 | 최대 폭 540, 간격 24 | — | — | — | 태블릿 폭 512 |
| `c-hero__eyebrow` | 9:2084 | 블록 표시(제목과 24 간격) | text-preset-5 (28, 자간 4), 대문자 | blue-300 | — | 모바일 16 / 자간 2.4 |
| `c-hero__headline` | 9:2085 | 블록 표시 | text-preset-1 (144), 대문자 | white | — | 모바일 80 |
| `c-hero__text` | 9:2086 | — | text-preset-9 (18, 줄 간격 1.8) | blue-300 | — | 태블릿 16, 모바일 15 |
| `c-explore` | 9:2088 | 원형 272×272 | text-preset-4 (32), 대문자 | 배경 white, 글자 blue-900 | hover: 바깥 반투명 white halo 원과 흐려진 글자 (99:1496 스크린샷 기준. 지름·불투명도 수치는 미확인) | 모바일 144×144, 글자 18 |

### Destination

| 클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이 |
| --- | --- | --- | --- | --- | --- | --- |
| `c-destination` (`main`) | 9:2091, 9:2092 | 상하 패딩 48, 최대 폭 1110, 제목–본문 간격 24, 이미지 열–설명 열 간격 32 | — | — | — | 태블릿 패딩 40, 모바일 24, 세로 배치 |
| `c-tabs--underline` (`l-cluster`) | 9:2106 | 탭 간격 32(`--space: 2rem`) | — | — | — | 모바일·태블릿 가운데 정렬 |
| `c-tabs--underline .c-tabs__tab` | Tabs Menu | 높이 32(글자–밑줄 간격 8), 아래 테두리 3 | text-preset-8 (16, 자간 2), 대문자 | 기본 blue-300, 선택 white | 선택: 테두리 white. hover: 테두리 white 50% (99:1739) | 모바일 14 / 자간 2.1 |
| `c-destination__panel` | 9:2096 | — | — | — | focus 표시 필요(`tabindex=0`) | §5 배치 참고 |
| `c-destination__image` | 9:2098 | 480×480 | — | — | — | 태블릿 300, 모바일 150 |
| `c-destination__text` (`l-stack`) | 9:2107 | 최대 폭 445, 이름–설명 간격 16 (`--space: 1rem`) | — | — | — | 모바일·태블릿 최대 폭 514, 가운데 정렬 |
| `c-destination__name` | 9:2108 | — | text-preset-2 (96), 대문자 | white | — | 태블릿 80, 모바일 56 |
| `c-destination__description` | 9:2109 | — | text-preset-9 | blue-300 | — | 태블릿 16, 모바일 15 |
| `c-destination__stats` | 9:2110, 9:2111 | 위 구분선 1px, 설명 블록–구분선–통계 간격 40, 항목 간격 24, 가로 2열 | — | 구분선 white 25% | — | 태블릿 간격 24·가로. 모바일 세로·가운데 |
| `c-destination__stat` (`l-stack`) | 9:2112 | 라벨–값 간격 12 (`--space: 0.75rem`) | — | — | — | — |
| `c-destination__stat-label` | 9:2113 | — | text-preset-7 (14, 자간 2), 대문자 | blue-300 | — | — |
| `c-destination__stat-value` | 9:2114 | — | text-preset-6 (28), 대문자 | white | — | — |

### Crew

| 클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이 |
| --- | --- | --- | --- | --- | --- | --- |
| `c-crew` (`main`) | 9:2120, 9:2121 | 상하 패딩 48, 최대 폭 1110, 텍스트 열 최소 폭 445, 열 간격 32 | — | — | — | 태블릿 패딩 40·세로 배치, 모바일 24 |
| `c-tabs--dots` (`l-cluster`) | 9:2134 | 점 15×15, 간격 40, 아래 패딩 48 | — | 기본: 흐린 white(불투명도는 Figma SVG 값 미확인), 선택 white | hover: white 50% (99:1808) | 태블릿·모바일 점 10×10, 간격 16, 가운데 |
| `c-crew__text` (`l-stack`) | 9:2128 | 최대 폭 540(텍스트 640), 간격 24 | — | — | — | 모바일·태블릿 최대 폭 512, 가운데 정렬, 위 패딩 40 |
| `c-crew__heading` (`l-stack`) | 9:2129 | 역할–이름 간격 16 (`--space: 1rem`) | — | — | — | 모바일 8 |
| `c-crew__role` | 9:2130 | — | text-preset-4 (32), 대문자 | white 50% | — | 태블릿 24, 모바일 18 |
| `c-crew__name` | 9:2131 | — | text-preset-3 (56), 대문자 | white | — | 태블릿 40, 모바일 24 |
| `c-crew__bio` | 9:2132 | — | text-preset-9 | blue-300 | — | 태블릿 16, 모바일 15 |
| `c-crew__image` | 9:2136 | 표시 영역 539×676, 아래쪽이 배경으로 흐려지는 마스크 | — | — | — | 태블릿 447×560, 모바일 271×340 |

### Technology

| 클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이 |
| --- | --- | --- | --- | --- | --- | --- |
| `c-technology` (`main`) | 9:2141, 9:2142 | 상하 패딩 48, 최대 폭 1275(오른쪽 정렬, 이미지가 화면 오른쪽 끝까지), 열 간격 32 | — | — | — | 태블릿 패딩 40, 모바일 위 24·아래 48·좌우 24 |
| `c-tabs--numbers` | 9:2148 | 세로, 간격 32, 탭–텍스트 간격 64 | — | — | — | 태블릿·모바일 가로, 간격 16, 가운데 |
| `c-tabs--numbers .c-tabs__tab` | Large Pagination | 원 80×80 | text-preset-4 (32), 가운데 | 기본: 테두리 1px white 25%·글자 white. 선택: 배경 white·글자 blue-900 | hover: 테두리 white (99:1864) | 태블릿 56·글자 24, 모바일 40·글자 18 |
| `c-technology__text` (`l-stack`) | 9:2149 | 최대 폭 640, 간격 24 | — | — | — | 태블릿·모바일 최대 폭 512, 간격 16, 가운데 정렬 |
| `c-technology__heading` (`l-stack`) | 9:2150 | 간격 16 (`--space: 1rem`) | — | — | — | — |
| `c-technology__eyebrow` | 9:2151 | — | text-preset-4 (32), 대문자 | white 50% | — | 태블릿 24, 모바일 18 |
| `c-technology__name` | 9:2152 | — | text-preset-3 (56), 대문자 | white | — | 태블릿 40, 모바일 24 |
| `c-technology__description` | 9:2153 | — | text-preset-9 | blue-300 | — | 태블릿 16, 모바일 15 |
| `c-technology__image` | 9:2155 | 높이 600, 남은 폭 채움, `object-fit: cover` | — | — | — | 태블릿·모바일: 화면 폭 가득, 위 패딩 64, landscape 자산 |

## 7. JavaScript 단계 작업

이번 단계에서는 `src/js`를 수정하지 않았고 스크립트를 연결하지 않았습니다.

| 기능 | 현재 상태 | 필요한 작업 |
| --- | --- | --- |
| 탭 전환 | 각 파일의 초기 탭만 표시. 다른 탭을 눌러도 바뀌지 않음 | 클릭·Enter·Space로 선택 변경, `aria-selected`·`tabindex`·`hidden` 갱신 |
| 탭 키보드 이동 | 없음 | 좌·우 화살표(Technology 데스크톱 세로 배치는 위·아래도), Home·End. 필요하면 `aria-orientation` 갱신 |
| 페이지 제목·URL | 파일별 고정 | 탭 전환 시 `document.title`과 URL(해당 페이지 파일 또는 hash) 동기화 여부 결정 |
| 모바일 메뉴 | 열리지 않음. 버튼 `aria-expanded="false"` | 열기·닫기, `aria-expanded`와 숨긴 텍스트("Open menu"/"Close menu") 갱신, Escape로 닫기, 포커스 복원, 분기점을 넘을 때 상태 초기화. 기존 `.no-scroll` 유틸리티 활용 가능 |

## 8. Placeholder와 확인이 필요한 부분

| 항목 | 내용 |
| --- | --- |
| 목적지를 모르는 링크 | 없음. 로고 → `index.html`, Explore → `destination-moon.html`(Figma 프로토타입 연결은 확인하지 않음, 사이트 흐름상 Destination 첫 페이지로 판단) |
| 로고 hover·focus | Figma에 상태 프레임 없음 |
| 메뉴 토글 hover | Figma에 상태 프레임 없음 |
| 탭 패널 focus | 패널에 `tabindex="0"`을 두었으므로 CSS에서 포커스 표시가 필요함 |

## 9. 검증 결과

미리보기는 `dist`를 쓰지 않고 스크래치 폴더에 만들었습니다(gulp-file-include로 `src/pages/*.html` 처리 + sass 컴파일 + `src/images`·`src/js` 복사). 화면에는 기존 SCSS만 적용되므로 **시각적 일치는 판단하지 않았습니다**.

| 검사 | 방법 | 상태 |
| --- | --- | --- |
| include 처리 | 12개 출력 HTML에 `@@`, localhost, Figma 임시 URL 없음 | 검증 완료 |
| 문서 기본 | `lang="en"`, `main` 1개, 건너뛰기 링크 `href="#main"`과 `main#main` 일치, 첫 Tab이 건너뛰기 링크, Enter 후 `#main` 이동 | 검증 완료 |
| 제목 | 12개 `<title>` 모두 고유하고 "Space tourism" 포함 | 검증 완료 |
| 제목 계층 | 각 페이지 `h1` 1개, 탭 페이지는 표시 패널의 `h2`만 이어짐. `h1` 이름에 장식 번호 미포함(예: "Pick your destination") | 검증 완료 |
| 내비게이션 | 링크 이름 "Home"·"Destination"·"Crew"·"Technology"(번호 미포함), 목적지 4개, 현재 그룹 링크만 `aria-current="page"` | 검증 완료 |
| 메뉴 토글 | 이름 "Open menu", `aria-expanded="false"`, `aria-controls` 대상 존재, 아이콘 `alt=""` | 검증 완료 |
| 탭 상태 | 선택 탭 1개(`tabindex=0`), 나머지 `aria-selected=false`·`tabindex=-1`, 표시 패널 1개, 모든 `aria-controls`·`aria-labelledby` 대상 존재. 파일별 초기 항목이 스펙과 일치 | 검증 완료 |
| 탭 이름 | Destination "Moon"…, Crew 승무원 이름, Technology "1 Launch vehicle"·"2 Spaceport"·"3 Space capsule" | 검증 완료 |
| 탭 순서 | 건너뛰기 → 로고 → 메뉴 버튼 → nav 4개 → (Home: Explore) / (탭 페이지: 선택 탭 → 패널) | 검증 완료 |
| 이미지 | 표시 중인 모든 이미지 `naturalWidth > 0`, 콘솔 오류·404 없음, Destination·Crew는 webp 사용 | 검증 완료 |
| Technology 분기 | 375·768·1023px landscape, 1024·1440px portrait | 검증 완료 |
| 가로 넘침 | 375·768·1023·1024·1440px에서 `scrollWidth`가 viewport 폭을 넘지 않음(기존 SCSS 기준) | 검증 완료 |
| 내용 대조 | `data.json`과 Home 원문 문구가 빌드 결과에 모두 있음(누락 0). Figma 요소 중 HTML에 없는 것은 장식선·배경(CSS 처리)뿐 | 검증 완료 |
| 범위 | 이번 작업의 변경은 `src/pages/*.html` 12개와 `src/partials/` 5개. 인라인 `style`·`<style>` 없음. 이 파일들에 `git diff --check` 오류 없음 | 검증 완료 |
| Firefox | Playwright Firefox 미설치 | 미검증 |
| 텍스트 200% 확대·고대비·스크린 리더 | 실행하지 않음 | 미검증 |
| HTML 유효성 검사 | 저장소에 도구 없음, 외부 서비스 미사용 | 미검증 |

사용 환경: Playwright 1.63 Chromium(headless), viewport 375·768·1023·1024·1440 × 900.

### 작업 중 발견한 사용자 변경 (이번 작업과 무관, 수정하지 않음)

- `src/js/vendor/jquery-4.0.0.js` 삭제
- `.gitignore`: `AGENTS.md` 무시 규칙 활성화, `openspec/*` 추가 → 이 change 폴더(handoff.md 포함)가 Git 추적 대상에서 빠짐
- `doc/SCSS-comment-guide.md` 추가, `doc/figma-guide.md` 수정(줄 끝 공백 6곳이 `git diff --check`에 걸림)

## 10. figma-html.md 완료 기준

- [x] Figma의 모든 텍스트·이미지·인터랙티브 요소가 HTML에 있고, 없는 요소를 추가하지 않았다 — 추가 요소는 접근성용 건너뛰기 링크와 숨긴 텍스트뿐
- [x] 랜드마크(`main`), 제목 계층, `lang`, `title`이 맞다
- [x] 링크와 버튼을 목적에 맞게 구분했고, 목적지를 모르는 링크는 보고서에 적었다 — 없음
- [x] 정보 이미지에는 설명 `alt`, 장식 이미지에는 `alt=""`를 넣었다
- [x] 자산이 `icon-*`/`image-*` 이름 규칙을 따르고, 중복 파일과 localhost 주소가 없다 — 새 자산 없음(제공 자산의 `logo.svg`는 기존 이름 유지)
- [x] 모든 요소에 BEM `c-` 클래스와 알맞은 `l-` 클래스가 있고, ID는 연결용으로만 썼다 — 화면별 방향이 바뀌는 묶음은 `l-` 없이 인계표에 기록
- [x] 인라인 스타일이 없고, `src/scss`·`src/js`를 수정하지 않았다 — `src/js`의 jquery 삭제는 사용자 변경
- [x] 보고서에 스타일 인계표, placeholder, 미검증 항목을 적었다
