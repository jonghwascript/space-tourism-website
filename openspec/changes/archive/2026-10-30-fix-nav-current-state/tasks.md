# Tasks

## 1. 준비와 변경 전 측정

- [x] 1.1 `git status`로 사용자 미커밋 변경을 확인한다. 수정 대상(`src/partials/header.html`, 대표 페이지 4개, `_site-header.scss`, `main.js`)에 사용자 변경이 없는지 확인한다. (결과를 `report.md`에 기록)
- [x] 1.2 스크래치 미리보기를 빌드한다(`dist` 미사용). 12개 페이지의 다음 값을 375·768·1440px 기준값 JSON으로 저장한다. 캡처는 하지 않는다.
  - 헤더 링크별 `aria-current`
  - 현재 표시선 computed `border-*-color`
  - 헤더 요소 상자

## 2. 빌드 시점 표시

- [x] 2.1 대표 페이지 4개(`index`, `destination-moon`, `crew-commander`, `technology-vehicle`)의 header include에 `"landing": true`를 추가한다. `header.html` 링크 4개의 조건을 `page`(그룹 + 대표)와 `true`(그룹 + 비대표) 두 개로 나눈다(design 결정 1). (확인 기준)
  - 빌드된 12개 페이지에서 `aria-current="page"` 링크의 `href`가 그 페이지 파일과 같다.
  - 비대표 8개 페이지는 그룹 링크만 `aria-current="true"`다.
  - 빌드된 HTML에 `@@`가 남지 않는다.
  - `prettier-ignore` 주석이 각 링크 위에 그대로 있다.
  - `npx prettier`로 `header.html`을 표준 출력에 돌려도 `@@if`가 깨지지 않는다.
- [x] 2.2 `_site-header.scss`의 현재 표시선 선택자를 기본·강제 색상 두 곳 모두 `page`·`true` 값으로 넓힌다(design 결정 2). (확인 기준)
  - SCSS 컴파일이 통과한다.
  - `destination-mars.html` 1440px "Destination" 아래 3px white다.
  - `crew-pilot.html` 375px 열린 패널 "Crew" 오른쪽 3px white다.
  - `forced-colors` 1440px에서 현재 링크만 배경과 다른 색이다.
  - 12개 페이지 × 3개 폭의 표시선 색이 1.2 기준값과 같다.

## 3. 탭 전환 동기화

- [x] 3.1 `main.js` 탭 블록 `updateLocation()`에서 주소 교체를 시도한 뒤 헤더 현재 링크의 `aria-current`를 실제 `location.pathname` 기준으로 갱신한다(design 결정 3). (확인 기준)
  - `node --check`가 통과한다.
  - `destination-moon.html`에서 Mars 클릭 시 Destination 링크가 `true`이고 표시선이 유지된다.
  - `crew-pilot.html`에서 첫 점 클릭 시 Crew 링크가 `page`다.
  - Technology에서 키보드로 전환해도 같다.
  - JS를 끈 `technology-spaceport.html`에서는 빌드 값 `true`다.

## 4. 통합 검증과 보고

- [x] 4.1 회귀를 확인한다. (확인 기준)
  - 12개 페이지 × 320·375·768·1024·1440px에서 콘솔 오류가 없다.
  - 375px 메뉴 열기·닫기·Escape가 동작한다.
  - 헤더 요소 상자가 1.2 기준값과 같다.
  - 탭 전환 기존 동작(주소·제목·페이드)이 그대로다.
  - Firefox·스크린 리더는 실행할 수 없으면 미검증으로 기록한다.
- [x] 4.2 범위를 확인한다. (확인 기준)
  - 변경 파일이 `header.html`, 대표 페이지 4개, `_site-header.scss`, `main.js`와 이 change 폴더뿐이다.
  - `dist`와 사용자 미커밋 파일(`doc/figma-guide.md`, `README.md`, `screenshot.jpg`)에 변경이 없다.
  - `git diff --check`가 통과한다.
  - `report.md`에 검증 표와 측정값을 정리한다.

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 위 파일과 change 폴더만 명시적으로 스테이징).
- 검토가 끝나면 `/opsx:archive`로 보관하고 `site-layout` 주 spec 반영(수정 1개·추가 2개)을 확인한다.
