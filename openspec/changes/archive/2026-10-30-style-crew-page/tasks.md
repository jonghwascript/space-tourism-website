# Tasks

## 1. 준비와 변경 전 측정

- [x] 1.1 `git status`로 사용자 미커밋 변경을 확인한다. 이 change가 수정할 `src/scss/components/_tabs.scss`, `src/scss/style.scss`, `src/partials/crew-tabs.html`에 사용자 변경이 없는지 확인한다. (결과를 `report.md`에 기록)
- [x] 1.2 스크래치 미리보기를 빌드한다(`dist` 미사용). 측정 스크립트로 변경 전 기준값을 JSON으로 스크래치에 저장한다. 캡처는 하지 않는다. (회귀 비교 대상: 홈·`destination-moon.html`·`technology-vehicle.html`의 375·768·1440px `body` 배경, `main`·주요 요소 상자, 탭 computed style. Crew 4개 페이지는 현재 상태를 기록한다. 같은 스크립트를 5.2에서 다시 실행할 수 있다.)

## 2. 페이지 골격과 점 탭

- [x] 2.1 태블릿 49:1527 `get_design_context`를 다시 조회해 텍스트 위 패딩과 점–사진 간격을 확정한다. (조회 값 또는 실패 사유를 `report.md`에 기록한다. 실패하면 design 결정 3의 모바일 값을 쓴다.)
- [x] 2.2 `pages/_crew.scss`를 만들고 `style.scss`에 `@use`한다. `.c-page--crew`에 배경색, 분기점별 `background-crew-*.jpg`, `100vh → 100svh` 최소 높이, `auto 1fr` 2행 그리드, `minmax(0, 1fr)` 열을 추가한다. (확인 기준)
  - SCSS 컴파일이 통과한다.
  - 375·767·768·1023·1024·1440px의 배경 URL이 spec 표와 같고 요청이 성공한다.
  - 이미지를 차단하면 배경이 `rgb(11, 13, 23)`이다.
  - 1440×1024에서 헤더 + main ≥ 1024이고 세로 스크롤이 없다.
- [x] 2.3 `components/_tabs.scss`에 `.c-tabs--dots`를 추가한다. 24px 버튼과 `::before` 점(10/15px), 버튼 간격 계산식, 선택·비선택 색, `@media (hover: hover)` hover, transition과 reduced motion, 강제 색상 규칙을 넣는다. `crew-tabs.html` 탭 목록에 `c-crew__tabs`를 추가한다. (확인 기준)
  - `crew-pilot.html` 1440px에서 세 번째 점만 white이고 나머지는 알파 0.17~0.18이다.
  - 375px 지름 10·간격 16, 1440px 지름 15·간격 40이다.
  - 버튼이 모두 24×24 이상이고 서로 겹치지 않는다.
  - 탭 접근 가능한 이름이 승무원 이름이다.
  - `destination-moon.html` 밑줄 탭의 computed style이 1.2 기준값과 같다.

## 3. 본문 배치와 패널

- [x] 3.1 `.c-crew`에 모바일·태블릿 1열 영역(`title / text / tabs / image`)과 데스크톱 2열 영역(`'title title' / 'text image' / 'tabs image'`) 그리드, 본문 패딩, design 결정 3의 간격을 추가한다. 보이는 패널을 subgrid로 만들고, `.c-crew__tabs`에 `z-index: 1`과 정렬을 준다. (확인 기준)
  - 375·767·768·1023·1024·1440·1920px에서 spec "모바일/태블릿/데스크톱 Crew 배치" 시나리오 값이 맞는다.
    - 375px 위 끝 순서, 가운데 1px 이내
    - 768px 제목 왼쪽 40, 텍스트 ≤ 512 가운데
    - 1440px 텍스트 왼쪽 165±2, 점 아래 여백 48±2, 사진 x ≥ 736
    - 1024px 좌우 40
    - 1920px 좌우 여백 같음
  - 점 탭 hover·클릭이 패널에 가로채이지 않는다.
  - 포커스 순서가 탭 → 패널이다.
- [x] 3.2 역할·이름·소개 타이포그래피와 역할–이름(8/16/16)·이름–소개(24) 간격, 모바일·태블릿 가운데·데스크톱 왼쪽 정렬, 텍스트 묶음 폭(514/512/열 폭, 최대 640)을 추가한다. (확인 기준)
  - `document.fonts.ready` 후 375·768·1440px computed 값이 spec "승무원 텍스트 타이포그래피"와 같다.
  - 접근성 트리에서 역할이 `<h2>`보다 먼저 온다.
- [x] 3.3 사진에 높이 상한(340/560/676)과 `auto` 크기, `max-inline-size: 100%`(design 결정 4의 구현 중 변경), 아래쪽 마스크(`-webkit-` 포함)를 추가한다. (확인 기준)
  - 4개 페이지 × 375·768·1024·1440px에서 높이 상한을 지킨다.
  - 렌더 비율이 원본과 1% 이내이고, `naturalWidth` > 0이며, 콘솔에 404가 없다.
  - computed `mask-image`의 그라데이션 정지점이 77.394%다.
  - 1024px처럼 열이 좁은 폭에서 마스크가 사진 아래 끝과 맞는지 측정한다. 어긋나면 design 결정 4의 대안을 적용하고 결과를 기록한다.
- [x] 3.4 넘침을 확인한다. (확인 기준)
  - 4개 페이지 320px, 375×812·1440×900 텍스트 200%, 767·768·1023·1024px, 667×375에서 `scrollWidth ≤ viewport`이고 요소 겹침이 없다.
  - 넘치면 해당 요소 폭·글자 상한을 보정하고 원인과 함께 기록한다.

## 4. 상태와 접근성

- [x] 4.1 hover·터치·reduced motion·전환 미지원을 확인한다. (확인 기준)
  - 1440px 두 번째 점 hover에서 `rgba(255, 255, 255, 0.5)`이고, 탭·패널 상자 변화가 없다.
  - `hasTouch`(hover: none)에서 누른 뒤 hover 색이 남지 않는다.
  - reduced motion에서 `transition-duration` 0s다.
  - 두 번째 점을 클릭해도 Douglas Hurley 패널이 유지되고 콘솔 오류가 없다.
  - `git diff --stat src/js package.json`에 변경이 없다.
- [x] 4.2 키보드 포커스를 확인한다. (확인 기준)
  - 375·768·1440px에서 Tab 순서가 헤더 → 선택된 점 탭 → 패널이다.
  - 점 탭 outline이 `solid` 2px이고 네 변이 viewport·부모 클리핑 안에 있다(요소 상자 + outline offset 측정, 부모 `overflow` 확인).
- [x] 4.3 강제 색상 모드를 확인한다. (확인 기준)
  - Playwright `forcedColors: 'active'` 375·1440px에서 점 4개의 `::before` 색·테두리가 배경과 다르고, 첫 번째 점만 채워진다.
  - 강제 색상이 아닐 때 computed style이 바뀌지 않는다.
- [x] 4.4 대비를 측정한다. 글자·점을 투명하게 한 배경 픽셀 기준으로 375·768·1440px에서 다음을 잰다.
  - 비선택 점(white 17.4% 합성색)과 주변 배경의 대비: 기준 3:1
  - 역할(white 50%) 글자와 뒤 배경의 대비: 기준 4.5:1
  - 소개(blue-300) 글자와 뒤 배경의 대비: 기준 4.5:1

  측정표를 `report.md`에 기록한다. 기준에 못 미치면 수정하지 않고 사용자에게 보정 방법을 묻는다.

## 5. 통합 검증과 보고

- [x] 5.1 Crew 4개 페이지 전체를 회귀 검증한다. (확인 기준)
  - 320·375·767·768·1023·1024·1440·1920px과 667×375에서 콘솔 오류·가로 넘침·요소 겹침이 없다.
  - 375px에서 모바일 메뉴가 열리고 닫히며, 열린 패널 링크가 본문 위에 그려진다(elementFromPoint).
  - `node --check src/js/main.js`가 통과한다.
  - Chromium으로 검증한다. Firefox·실제 OS 고대비·스크린 리더는 실행할 수 없으면 미검증으로 기록한다.
- [x] 5.2 1.2의 측정 스크립트를 수정 후 다시 실행해 홈·Destination·Technology 기준값과 비교한다. (확인 기준)
  - 차이가 없어야 한다. 다르면 원인과 의도 여부를 `report.md` 표에 적는다.
  - 캡처는 남기지 않는다. 시각 확인이 필요하면 사용자에게 먼저 묻는다.
- [x] 5.3 범위를 확인한다. (확인 기준)
  - 변경 파일이 `pages/_crew.scss`, `components/_tabs.scss`, `style.scss`, `crew-tabs.html`과 이 change 폴더뿐이다.
  - `dist`와 사용자 미커밋 파일에 변경이 없다.
  - 변경 파일 대상 `git diff --check`가 통과한다.
  - `report.md`에 다음을 정리한다.
    - 검증 표(검증 완료·미검증·해당 없음)
    - 측정값
    - 알려진 제한: 전환 미지원, subgrid 미지원 대체 배치, 이미지 속성 비율 불일치, 태블릿 세로 길이

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 위 파일과 change 폴더만 명시적으로 스테이징).
- 승무원·목적지·기술 탭 전환은 별도 탭 스크립트 change로 진행한다. 이때 Splide 필요 여부를 다시 판단한다.
- 검토가 끝나면 `/opsx:archive`로 보관하고 `crew-page` 주 spec 반영을 확인한다.
