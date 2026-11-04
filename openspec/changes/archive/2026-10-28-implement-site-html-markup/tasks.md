# Tasks

## 1. 준비와 Figma 자료 확보

- [x] 1.1 `git status`로 `src/pages`, `src/partials`, `src/images`에 사용자 변경이 없는지 확인하고, 있으면 덮어쓰기 전에 사용자에게 알린다 (확인 결과를 handoff.md에 기록)
- [x] 1.2 `npm ci`로 의존성을 설치하고 `node -e "require('gulp-file-include'); require('sass')"`가 오류 없이 끝나는지 확인한다 (`dist`가 그대로인지 `ls dist` 전후 비교)
- [x] 1.3 figma-design-to-code 스킬을 불러온 뒤 지정 프레임(스타일 가이드 2, 배경 4, 모바일 내비 5, 모바일·태블릿·데스크톱 A 12, hover 4)마다 `get_design_context`·`get_screenshot`을 받고, `get_variable_defs`로 색·서체 변수를 기록한다 (프레임 ID별 확보 여부를 handoff.md 표로 남김. 실패 시 중단하고 보고)
- [x] 1.4 Destination B~D, Crew B~D, Technology B~C 프레임을 내용 대조용으로 조회해 starter 텍스트와의 차이를 목록화한다 (차이 목록을 handoff.md에 기록)
- [x] 1.5 Figma 자산과 `src/images` 제공 자산을 대조해 누락 자산만 `icon-*`/`image-*` 이름으로 추가한다 (추가 파일 목록과 `file` 픽셀 크기를 기록하고, 소스에 localhost 주소가 없음을 `grep -r localhost src` 로 확인)

## 2. 공통 partial과 include 동작 확인

- [x] 2.1 `src/partials/head.html`(meta, 파비콘, 1.3에서 확정한 Google Fonts `preconnect`·`display=swap` 링크, CSS 링크)을 만든다 (빌드 결과 `<head>`에 각 요소가 있는지 확인)
- [x] 2.2 `src/partials/header.html`에 건너뛰기 링크, 로고 링크, 메뉴 토글 버튼(`aria-expanded="false"`, `aria-controls="primary-navigation"`, "Open menu"), `<nav aria-label="Main">` 목록을 작성하고 `@@if (context.current === …)`로 `aria-current="page"`를 출력한다 (스크래치 빌드에서 `current` 값별 출력 확인. `@@if`가 속성 위치에서 실패하면 design 결정 1의 문자열 변수 방식으로 바꾸고 design.md에 기록)
- [x] 2.3 스크래치 폴더에 `dist`를 쓰지 않는 미리보기 스크립트(gulp-file-include → 스크래치 출력, sass 컴파일, 이미지·js 복사)를 만든다 (실행 후 스크래치에 12개 HTML이 생기고 `dist` 수정 시각이 변하지 않음)

## 3. Home 페이지

- [x] 3.1 `src/pages/index.html`을 `<body class="c-page c-page--home">`, head·header include, `<main id="main">` 안의 히어로(`h1` 두 부분, 소개문, Explore 링크 → `./destination-moon.html`)로 작성하고 고유 `<title>`을 둔다 (미리보기에서 `h1` 이름 "So, you want to travel to Space", Explore `href` 확인)
- [x] 3.2 Home 모바일·태블릿·데스크톱·hover(Explore, nav) 값을 handoff.md 스타일 인계표에 기록한다 (Home 관련 클래스가 모두 표에 있음)

## 4. Destination 페이지

- [x] 4.1 `src/partials/destination-tabs.html`에 tablist(Moon·Mars·Europa·Titan)와 4개 패널(picture webp/png, `h2`, 설명, `dl` 거리·이동 시간)을 작성하고 `selected` 값으로 `aria-selected`·`tabindex`·`hidden`을 출력한다 (스크래치 빌드에서 탭–패널 ID 연결과 초기 선택 확인)
- [x] 4.2 `destination-{moon,mars,europa,titan}.html`을 `c-page--destination`, `h1`("01" `aria-hidden`), 각자 `selected` 값의 include로 작성한다 (4개 파일 모두 선택 탭 1개, 표시 패널 1개, 이미지 `naturalWidth > 0`)
- [x] 4.3 Destination 탭 hover·선택 상태, 이미지–tablist 배치 차이(design 결정 3), 분기점별 값을 handoff.md에 기록한다

## 5. Crew 페이지

- [x] 5.1 `src/partials/crew-tabs.html`에 점 모양 탭 4개(숨긴 텍스트로 승무원 이름)와 패널(역할 `p` → `h2` → 소개 → picture webp/png)을 작성한다 (탭 접근 가능한 이름이 승무원 이름인지 확인)
- [x] 5.2 `crew-{commander,specialist,pilot,engineer}.html`을 `c-page--crew`, `h1`("02" `aria-hidden`), 파일별 `selected`로 작성한다 (crew-page 스펙의 파일–인물 대응 확인, "F/A-18.He" 원문 유지)
- [x] 5.3 Crew 점 탭 hover·선택 상태, 본문–탭–사진 배치 차이, 분기점별 값과 오타 의심 문구를 handoff.md에 기록한다

## 6. Technology 페이지

- [x] 6.1 `src/partials/technology-tabs.html`에 숫자 탭 3개(보이는 숫자 + 숨긴 기술 이름)와 패널(소개 문구 → `h2` → 설명 → picture: `(min-width: 64em)` portrait, 기본 landscape)을 작성한다 (탭 이름이 "1"로 시작하고 기술 이름 포함)
- [x] 6.2 `technology-{vehicle,spaceport,capsule}.html`을 `c-page--technology`, `h1`("03" `aria-hidden`), 파일별 `selected`로 작성한다 (Chromium 375·1023·1024·1440px에서 `currentSrc`가 스펙대로 바뀜)
- [x] 6.3 Technology 숫자 탭 hover·선택 상태, 탭–본문–이미지 배치 차이, 분기점별 값을 handoff.md에 기록한다

## 7. 통합 검증과 보고

- [x] 7.1 콘텐츠 대조: 1.3·1.4의 Figma 텍스트·이미지·인터랙티브 요소 목록과 12개 빌드 결과를 비교해 누락·추가가 없음을 확인한다 (차이와 placeholder를 handoff.md에 기록)
- [x] 7.2 Chromium으로 12개 페이지의 이미지 로드·콘솔 404·첫 Tab이 건너뛰기 링크인지·탭 순서·제목 계층·링크/버튼 이름·`<title>` 고유성·가로 넘침을 측정한다 (결과 표와 사용 viewport를 handoff.md에 기록. Firefox 미설치 시 미검증으로 기록)
- [x] 7.3 범위 확인: `git diff --stat`에 `src/scss`, `src/js` 변경이 없고, `grep -rn 'style=\|<style' src/pages src/partials` 결과가 없으며, `git diff --check`가 통과한다
- [x] 7.4 handoff.md에 스타일 인계표(클래스 | Figma 노드 | 크기·간격·패딩 | 글꼴 | 색 | 상태 | 반응형 차이), JS 단계 작업(탭 전환·키보드 화살표 이동·메뉴 열기/닫기·포커스 복원), 미검증 항목을 정리하고 figma-html.md 완료 기준 체크리스트 결과를 적는다

## Workflow follow-up

- 사용자 검토 후 커밋 범위를 확인받아 커밋한다(현재 브랜치 `main`).
- 이후 figma-html-css.md 단계에서 handoff.md를 입력으로 SCSS를 작성한다.
- 구현·검토가 끝나면 change를 archive한다.
