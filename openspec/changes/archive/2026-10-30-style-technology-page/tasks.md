# Tasks

## 1. 준비와 변경 전 측정

- [x] 1.1 `git status`로 사용자 미커밋 변경을 확인한다. 이 change가 수정할 `src/scss/components/_tabs.scss`, `src/scss/style.scss`, `src/partials/technology-tabs.html`에 사용자 변경이 없는지 확인한다. (결과를 `report.md`에 기록)
- [x] 1.2 스크래치 미리보기를 빌드한다(`dist` 미사용). 측정 스크립트로 변경 전 기준값을 JSON으로 스크래치에 저장한다. 캡처는 하지 않는다. (기준값 범위)
  - 회귀 비교 대상: 홈·`destination-moon.html`·`crew-commander.html`의 375·768·1440px `body` 배경, `main`·주요 요소 상자, 탭 computed style
  - Technology 3개 페이지는 현재 상태를 기록한다.
  - 같은 스크립트를 5.2에서 다시 실행할 수 있다.

## 2. 페이지 골격과 숫자 탭

- [x] 2.1 `pages/_technology.scss`를 만들고 `style.scss`에 `@use`한다. `.c-page--technology`에 배경색, 분기점별 `background-technology-*.jpg`, `100vh → 100svh` 최소 높이, `auto 1fr` 2행 그리드, `minmax(0, 1fr)` 열을 추가한다. (확인 기준)
  - SCSS 컴파일이 통과한다.
  - 375·767·768·1023·1024·1440px의 배경 URL이 spec 표와 같고 요청이 성공한다.
  - 이미지를 차단하면 배경이 `rgb(11, 13, 23)`이다.
- [x] 2.2 `components/_tabs.scss`에 `.c-tabs--numbers`를 추가한다(design 결정 5). `technology-tabs.html` 탭 목록에 `c-technology__tabs`를 추가한다. 넣을 내용은 다음과 같다.
  - 원 크기·숫자 서체(40/56/80, 18/24/32)
  - 선택·비선택·hover 색
  - 가로·세로 묶음 배치
  - `background-color`를 포함한 transition과 변형 안의 reduced motion 규칙
  - 강제 색상 규칙

  (확인 기준)
  - `technology-spaceport.html` 1440px에서 두 번째 탭만 white 배경·`rgb(11, 13, 23)` 글자이고, 나머지는 투명 배경·`rgba(255, 255, 255, 0.25)` 테두리·white 글자다.
  - 375·768·1440px 탭 크기가 40/56/80px이고 원형이며, 간격은 가로 16 / 세로 32px이다.
  - 탭 이름이 "1"로 시작하고 기술 이름을 포함한다.
  - `prettier-ignore` 주석과 패널 줄이 그대로다.
  - Destination 밑줄 탭과 Crew 점 탭의 computed style이 1.2 기준값과 같다.

## 3. 본문 배치와 패널

- [x] 3.1 `.c-technology`에 그리드와 영역 폭을 추가한다(design 결정 2·3). 넣을 내용은 다음과 같다.
  - 모바일·태블릿 1열 영역(`title / image / tabs / text`)
  - 데스크톱 3열 영역(`'title title title' / 'tabs text image'`, 열 `auto max(30.6875rem, 50% - 10rem) minmax(0, 1fr)`, 간격 32 + 탭 오른쪽 margin 32)
  - 본문 패딩(모바일 24/24/48, 태블릿 40, 데스크톱 위아래 48)
  - 데스크톱 영역 폭(`min(1275px, 100% - 40px)`, 오른쪽 정렬)
  - 보이는 패널 subgrid, `.c-technology__tabs`의 `z-index: 1`과 간격(이미지–탭 32, 탭–텍스트 40)

  (확인 기준) 375·767·768·1023·1024·1440·1920px에서 spec "모바일/태블릿/데스크톱 Technology 배치" 시나리오 값이 맞는다.
  - 375px: 위 끝 순서, 이미지 상자 0~375, 탭·텍스트 가운데 1px 이내
  - 768px: 제목 왼쪽 40, 텍스트 ≤ 512
  - 1440px: 탭 x 165, 텍스트 x 309·폭 491, 이미지 x 832~1440, 세로 중심 차 ≤ 2
  - 1024px: 왼쪽 여백 40, 텍스트 ≥ 491
  - 1920px: 영역 1275·오른쪽 끝 1920
  - 숫자 탭 hover·클릭이 패널에 가로채이지 않는다.
  - 포커스 순서가 탭 → 패널이다.
- [x] 3.2 소개 문구·이름·설명의 타이포그래피와 간격(소개–이름 16, 이름 묶음–설명 16/16/24), 모바일·태블릿 가운데·데스크톱 왼쪽 정렬, 텍스트 폭(514/512/열 폭, 최대 640)을 추가한다. (확인 기준)
  - `document.fonts.ready` 후 375·768·1440px computed 값이 spec "기술 텍스트 타이포그래피"와 같다.
  - 접근성 트리에서 소개 문구가 `<h2>`보다 먼저 온다.
- [x] 3.3 이미지에 화면 크기별 상자와 자르기를 추가한다(design 결정 4).
  - 모바일·태블릿: 패딩을 넘는 full-bleed, `overflow: clip`, 폭 `max(48rem, 100%)`, 가운데 margin, 높이 258/357, `cover`
  - 데스크톱: 열 폭, 높이 600, `cover`

  (확인 기준)
  - 3개 페이지 × 375·768·1024·1440px에서 이미지 높이가 258·357·600px이다.
  - 375px 렌더 폭이 768px이고 가로 중심이 화면 중심과 1px 이내다.
  - 1023px에서 landscape, 1024px에서 portrait이다(기존 spec 유지).
  - `naturalWidth` > 0이고 404가 없으며, `scrollWidth ≤ viewport`이다.
- [x] 3.4 넘침을 확인한다. (확인 기준)
  - 3개 페이지 320px, 375×812·1440×900 텍스트 200%, 767·768·1023·1024px, 667×375에서 `scrollWidth ≤ viewport`이고 요소 겹침이 없다.
  - 넘치면 해당 요소 폭·글자 상한을 보정하고 원인과 함께 기록한다.

## 4. 상태와 접근성

- [x] 4.1 hover·터치·reduced motion·전환 미지원을 확인한다. (확인 기준)
  - 1440px 두 번째 탭 hover에서 테두리가 `rgb(255, 255, 255)`이고, 탭·텍스트·이미지 상자 변화가 없다.
  - `hasTouch`(hover: none)에서 누른 뒤 hover 테두리가 남지 않는다.
  - reduced motion에서 숫자 탭 `transition-duration`이 0s다.
  - 두 번째 탭을 클릭해도 Launch vehicle 패널이 유지되고 콘솔 오류가 없다.
  - `git diff --stat src/js package.json`에 변경이 없다.
- [x] 4.2 키보드 포커스를 확인한다. (확인 기준)
  - 375·768·1440px에서 Tab 순서가 헤더 → 선택 숫자 탭 → 패널이다.
  - outline이 `solid` 2px이고, outline 범위가 viewport 안이며 클리핑하는 부모가 없다.
  - 모바일·태블릿에서 패널 outline이 이미지(`overflow: clip`) 때문에 잘리지 않는지 확인한다.
- [x] 4.3 강제 색상 모드를 확인한다. (확인 기준)
  - Playwright `forcedColors: 'active'` 375·1440px에서 세 탭의 테두리가 배경과 다르고 숫자가 읽히며, 첫 번째 탭만 채워진 배경이다.
  - 강제 색상이 아닐 때 computed style이 바뀌지 않는다.
- [x] 4.4 대비를 측정한다. 글자·테두리를 숨긴 배경 픽셀 기준으로 375·768·1440px에서 다음을 잰다.
  - 비선택 탭 테두리(white 25% 합성색)와 주변 배경: 기준 3:1
  - 소개 문구(white 50%)와 뒤 배경: 18px 글자는 4.5:1, 24px 이상은 3:1
  - 설명(blue-300)과 뒤 배경: 기준 4.5:1
  - 비선택 숫자(white)와 배경: 기준 3:1

  측정표를 `report.md`에 기록한다. 기준에 못 미치면 수정하지 않고 사용자에게 보정 방법을 묻는다.

## 5. 통합 검증과 보고

- [x] 5.1 Technology 3개 페이지 전체를 회귀 검증한다. (확인 기준)
  - 320·375·767·768·1023·1024·1440·1920px과 667×375에서 콘솔 오류·가로 넘침·요소 겹침이 없다.
  - 375px에서 모바일 메뉴가 열리고 닫히며, 열린 패널 링크가 본문(이미지 포함) 위에 그려진다(elementFromPoint).
  - `node --check src/js/main.js`가 통과한다.
  - Chromium으로 검증한다. Firefox·실제 OS 고대비·스크린 리더는 실행할 수 없으면 미검증으로 기록한다.
- [x] 5.2 1.2의 측정 스크립트를 수정 후 다시 실행해 홈·Destination·Crew 기준값과 비교한다. (확인 기준)
  - 차이가 없어야 한다. 다르면 원인과 의도 여부를 `report.md` 표에 적는다.
  - 캡처는 남기지 않는다. 시각 확인이 필요하면 사용자에게 먼저 묻는다.
- [x] 5.3 범위를 확인한다. (확인 기준)
  - 변경 파일이 `pages/_technology.scss`, `components/_tabs.scss`, `style.scss`, `technology-tabs.html`과 이 change 폴더뿐이다.
  - `dist`와 사용자 미커밋 파일에 변경이 없다.
  - 변경 파일 대상 `git diff --check`가 통과한다.
  - `report.md`에 다음을 정리한다.
    - 검증 표(검증 완료·미검증·해당 없음)
    - 측정값
    - 알려진 제한: 전환 미지원, subgrid 미지원 대체 배치, Figma 비트맵과 자산 잘림 차이, portrait 확대, `<source>` 크기 속성 불일치

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 위 파일과 change 폴더만 명시적으로 스테이징).
- Destination·Crew·Technology 세 페이지의 탭 전환(클릭·Enter·Space, 방향키·Home·End, 패널 `hidden` 전환, 필요 시 짧은 페이드와 reduced motion 대응, URL 갱신 여부 결정)은 공통 탭 스크립트 change로 진행한다. 이때 `content-tabs`의 "전환 동작 범위 제외" 요구사항을 수정한다. Splide는 쓰지 않는다(사용자 결정).
- `.c-page--*` 골격 공통화는 별도 리팩터링 change로 검토한다.
- 검토가 끝나면 `/opsx:archive`로 보관하고 `technology-page` 주 spec 반영을 확인한다.
