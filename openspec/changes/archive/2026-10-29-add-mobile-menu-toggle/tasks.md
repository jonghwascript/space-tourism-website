# Tasks

## 1. 준비

- [x] 1.1 `git status`로 `src/js`, `src/partials`에 사용자 변경이 없는지 확인하고, 있으면 덮어쓰기 전에 알린다 (결과를 보고서에 기록)

## 2. 스크립트 연결

- [x] 2.1 `src/partials/head.html`의 스타일시트 링크 다음에 `<script src="./js/main.js" defer></script>`를 추가한다 (스크래치 미리보기 빌드의 12개 HTML `<head>`에 모두 포함되고, 미리보기 결과에 `js/main.js`가 복사됨. `dist`는 건드리지 않음)

## 3. 메뉴 스크립트

- [x] 3.1 `src/js/main.js`에 헤더·토글·목록 요소 조회와 `.is-enhanced` 추가를 작성한다. 요소가 하나라도 없으면 아무것도 하지 않는다 (`node --check src/js/main.js` 통과, 375px에서 햄버거만 보이고 목록이 숨겨짐, JavaScript를 끈 상태에서는 기존 대체 배치 유지, 콘솔 오류 없음)
- [x] 3.2 상태 갱신 함수(`.is-menu-open`, `aria-expanded`, 숨김 텍스트 "Open menu"/"Close menu")와 토글 클릭 처리를 추가한다 (375px에서 클릭·Enter·Space로 열고 닫을 때 패널·아이콘·ARIA·접근 가능한 이름이 함께 바뀌고 포커스가 버튼에 남음, 열고 Tab 시 첫 링크로 이동)
- [x] 3.3 Escape와 헤더 바깥 클릭으로 닫기를 추가한다 (패널 링크에서 Escape → 닫힘 + 토글 포커스, 본문 클릭 → 닫힘, 패널 빈 곳 클릭 → 열림 유지)
- [x] 3.4 `matchMedia('(width < 48em)')`의 `change`에서 일치하지 않게 되면 닫힘으로 초기화한다 (375px에서 연 뒤 768px → 767px로 바꿨을 때 768px은 태블릿 배치, 767px은 닫힘·`aria-expanded="false"`)

## 4. 통합 검증과 보고

- [x] 4.1 스크래치 미리보기 빌드로 Chrome(가능하면 Firefox)에서 12개 페이지를 320·375·767·768·1023·1024·1440px로 확인한다: 모바일 활성화·열림·닫힘, 태블릿·데스크톱 배치 변화 없음, 가로 넘침 없음, 콘솔 오류 없음 (Firefox가 없으면 미검증으로 기록)
- [x] 4.2 첫 그리기 시 모바일 링크 목록이 잠깐 보이는지 느린 네트워크 조건으로 확인한다 (보이면 위험 항목으로 보고, 수정은 범위 밖)
- [x] 4.3 범위 확인: `git diff --stat`가 `src/js/main.js`, `src/partials/head.html`만 바꾸고 `src/scss`·`dist` 변경이 없음, `git diff --check` 통과. 결과를 변경 폴더의 `report.md`에 검증 표(검증 완료·미검증·해당 없음)로 정리하고, 후속 change로 넘긴 접근성 항목은 제외 사유와 함께 "해당 없음(후속)"으로 적는다

## Workflow follow-up

- 후속 change(헤더 접근성 보완)를 proposal의 "후속 change로 넘기는 항목" 목록으로 제안한다.
