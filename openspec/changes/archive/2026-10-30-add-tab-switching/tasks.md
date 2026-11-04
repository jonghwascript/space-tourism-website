# Tasks

## 1. 준비와 변경 전 측정

- [x] 1.1 `git status`로 사용자 미커밋 변경을 확인한다. 이 change가 수정할 `src/js/main.js`에 사용자 변경이 없는지 확인한다. (결과를 `report.md`에 기록)
- [x] 1.2 스크래치 미리보기를 빌드한다(`dist` 미사용). 측정 스크립트로 변경 전 기준값을 JSON으로 스크래치에 저장한다. 캡처는 하지 않는다. (기준값 범위)
  - 11개 탭 페이지 각각의 탭 ARIA 값(`aria-selected`·`tabindex`)
  - 패널 `hidden`, `document.title`, `location.pathname`
  - 375·768·1440px의 `main` 안 요소 상자
  - 홈 메뉴 동작
  - 같은 스크립트를 4.2에서 다시 실행할 수 있다.

## 2. 탭 전환 스크립트

- [x] 2.1 `main.js` 메뉴 블록 아래에 탭 블록을 추가한다(design 결정 1·2·6). 넣을 내용은 다음과 같다.
  - 머리 주석(관계·제한·전환)
  - 탭 목록별 초기화(필요한 패널이 없는 목록은 건너뜀)
  - `select()` 함수: `aria-selected`·`tabindex`·`hidden` 동기화, 이미 선택된 탭은 무시
  - `click` 위임

  (확인 기준)
  - `node --check src/js/main.js`가 통과한다.
  - `destination-moon.html`에서 "Mars"를 클릭하면 Mars 패널만 보이고, ARIA 값이 spec "선택 상태 동기화"와 같다.
  - 키보드 Enter·Space로도 같은 결과다.
  - 선택된 탭을 다시 클릭해도 변화와 오류가 없다.
  - 1440px Crew 점·Technology 원 모양이 새 선택을 따른다(computed style).
  - 전환 후 Tab 순서가 새 선택 탭 → 패널이다.
- [x] 2.2 방향키·Home·End 처리와 자동 활성화, 방향 판단(`flex-direction`), `aria-orientation` 설정, `matchMedia('(min-width: 64em)')` 변경 시 재계산을 추가한다(design 결정 3). (확인 기준)
  - 375px Destination에서 첫 탭 ←로 마지막 탭으로 순환한다.
  - Crew에서 End·Home이 동작한다.
  - 1440px Technology에서 ↓로 다음 탭이 선택되고 `scrollY`가 변하지 않는다.
  - Technology `aria-orientation`이 1440px `vertical`이고, viewport를 1023px로 줄이면 `horizontal`이며 →가 동작한다.
  - Destination·Crew는 항상 `horizontal`이다.
  - 가로 목록에서 ↑·↓는 처리하지 않는다(기본 동작 유지).
- [x] 2.3 주소·제목 교체(`replaceState`, `try/catch`)를 추가한다(design 결정 4). (확인 기준)
  - `destination-moon.html`에서 "Europa" 클릭 후 `location.pathname`이 `destination-europa.html`로 끝나고, `document.title`이 "Europa | Destination | Frontend Mentor | Space tourism website"다.
  - `history.length`가 그대로다.
  - 새로고침하면 Europa가 선택된 채 열린다.
  - 세 그룹 11개 항목 모두 교체된 주소와 제목이 빌드된 해당 페이지의 `<title>`과 같다.
  - 다른 페이지에서 들어와 탭을 여러 번 바꾼 뒤 `goBack()`하면 이전 페이지로 간다.
- [x] 2.4 페이드(Web Animations API, 진행 중 애니메이션 취소, reduced motion 확인)를 추가한다(design 결정 5). (확인 기준)
  - 전환 직후 새 패널 `opacity` < 1이고, 0.4초 뒤 1이다.
  - `prefers-reduced-motion: reduce`에서는 전환 직후 `opacity`가 1이고 `getAnimations()`가 비어 있다.
  - 빠르게 세 번 연속 전환해도 마지막 패널만 보이고 남은 애니메이션이 없다.

## 3. 접근성과 회귀

- [x] 3.1 스크립트가 없을 때를 확인한다. (확인 기준)
  - Playwright `javaScriptEnabled: false`로 `crew-pilot.html`을 열면 Victor Glover 패널만 보이고, 탭 ARIA가 1.2 기준값과 같다.
  - 메뉴 스크립트 요청을 차단해도 같다.
  - 홈 375px에서 콘솔 오류가 없고 메뉴가 열리고 닫힌다.
- [x] 3.2 전환 후 배치를 확인한다. (확인 기준)
  - 세 그룹의 모든 항목으로 전환한 뒤 375·768·1440px에서 가로 넘침·요소 겹침이 없다.
  - 숨긴 패널은 `display: none`이다.
  - 전환된 패널의 요소 상자가 같은 항목 페이지를 직접 열었을 때(1.2 기준값)와 같다.
  - 탭 클릭이 패널에 가로채이지 않는다(elementFromPoint).

## 4. 통합 검증과 보고

- [x] 4.1 Chromium 전체 회귀를 확인한다. (확인 기준)
  - 11개 탭 페이지와 홈을 320·375·768·1024·1440px로 열어 콘솔 오류가 없다.
  - 375px 모바일 메뉴 열기·닫기·Escape가 동작한다.
  - `node --check src/js/main.js`가 통과한다.
  - Firefox·실제 스크린 리더·실기기 터치는 실행할 수 없으면 미검증으로 기록한다.
- [x] 4.2 1.2 스크립트를 다시 실행해 전환 전(초기 로드) 상태가 기준값과 같은지 비교한다. (확인 기준)
  - 차이가 없어야 한다. 다르면 원인과 의도 여부를 `report.md` 표에 적는다.
  - 캡처는 남기지 않는다.
- [x] 4.3 범위를 확인한다. (확인 기준)
  - 변경 파일이 `src/js/main.js`와 이 change 폴더뿐이다(마크업·SCSS 변경 없음).
  - `dist`와 사용자 미커밋 파일에 변경이 없다.
  - `git diff --check`가 통과한다.
  - `report.md`에 다음을 정리한다.
    - 검증 표(검증 완료·미검증·해당 없음)
    - 측정값
    - 알려진 제한: `file://`에서 주소 미교체, 스크린 리더 미검증 등

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다(요청 시 `src/js/main.js`와 change 폴더만 명시적으로 스테이징).
- 검토가 끝나면 `/opsx:archive`로 보관하고, `content-tabs`(추가·제거)와 `destination-page`·`crew-page`·`technology-page`(제거) 주 spec 반영을 확인한다.
