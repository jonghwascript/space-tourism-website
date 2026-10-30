# Report: add-tab-switching

2026-10-30. Chromium(Playwright 1.63, headless)으로 검증했습니다. 스크래치 미리보기 빌드(HTML include·SCSS 컴파일·이미지·JS 복사)와 로컬 HTTP 서버를 썼고 `dist`는 사용하지 않았습니다. 화면 캡처는 남기지 않고(AGENTS.md), DOM·ARIA·URL·computed style·요소 상자를 측정했습니다.

## 준비 (1.1, 1.2)

- 사용자 미커밋 변경: `doc/figma-guide.md`. 이 change는 이 파일을 수정하지 않았습니다.
- 수정 대상 `src/js/main.js`에는 작업 전 사용자 변경이 없었습니다.
- 변경 전 기준값: 12개 페이지 × 375·768·1440px의 다음 값을 JSON으로 저장했습니다(스크래치).
  - 탭 `aria-selected`·`tabindex`
  - 패널 `hidden`
  - `document.title`, `location.pathname`, `aria-orientation`
  - `main` 안 요소 상자, 콘솔 오류

## 구현 요약

`src/js/main.js`의 메뉴 블록 아래에 독립된 탭 블록(90줄)을 추가했습니다. 마크업과 SCSS는 바꾸지 않았습니다.
- **초기화:** 탭 목록마다 초기화하고, 연결된 패널이 없는 목록은 건너뜁니다.
- **`select()` 함수:** `aria-selected`·`tabindex`·`hidden`을 동기화하고, 이미 선택된 탭이면 아무것도 하지 않습니다.
- **이벤트:** `click` 위임 하나로 클릭과 Enter·Space를 처리합니다. `keydown`은 방향키·Home·End만 처리하며, 자동 활성화하고 양 끝에서 순환합니다.
- **방향:** 탭 목록의 computed `flex-direction`으로 가로·세로를 판단하고 `aria-orientation`을 설정합니다. `matchMedia('(min-width: 64em)')` 변경 때 다시 계산합니다.
- **주소·제목:** 주소를 `<그룹>-<항목>.html`로 바꾸고(`history.replaceState`, `try/catch`), 제목을 `<패널 h2> | …`로 바꿉니다.
- **페이드:** Web Animations API로 300ms 동안 나타나게 합니다. 진행 중인 애니메이션은 취소하고, `prefers-reduced-motion: reduce`에서는 생략합니다.

## 검증 결과

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| JS 문법 | 검증 완료 | `node --check src/js/main.js` |
| 클릭 전환 | 검증 완료 | `destination-moon.html` "Mars" 클릭: Mars 패널만 보임, 탭 `.-1 S0 .-1 .-1`(선택 탭만 `true`/0), 숨긴 패널 `display: none` |
| 재클릭 | 검증 완료 | 선택된 탭 재클릭 시 상태 변화·오류 없음 |
| 키보드 실행 | 검증 완료 | Crew에서 →(자동 선택) 후 Space·Enter: Mark Shuttleworth 유지, 포커스는 탭 |
| 선택 모양 | 검증 완료 | 1440px Crew 세 번째 점 클릭 후 그 점만 white, 나머지 `rgba(255,255,255,0.173)`. Technology "3" 클릭 후 세 번째 원만 white 배경 |
| 전환 후 Tab 순서 | 검증 완료 | 3개 그룹에서 헤더 로고부터 Tab: 새 선택 탭 → 보이는 패널. 패널에서 Shift+Tab은 선택 탭 |
| 방향키(가로) | 검증 완료 | 375px Destination Moon에서 ← → Titan(순환). Crew End → Anousheh Ansari, Home → Douglas Hurley |
| 방향키(세로) | 검증 완료 | 1440px Technology ↓ → Spaceport, `scrollY` 0 유지. ←·→는 처리하지 않음 |
| 처리하지 않는 키 | 검증 완료 | 가로 목록의 ↑·↓·PageDown·문자, 세로 목록의 ←·→: `defaultPrevented` false, 선택 변화 없음 |
| `aria-orientation` | 검증 완료 | Technology 1440px `vertical` → 1023px로 줄이면 `horizontal`, 이후 →로 Space capsule 선택. Destination·Crew는 375·1440px 모두 `horizontal` |
| 주소·제목 | 검증 완료 | Europa 클릭 후 `destination-europa.html`, 제목 "Europa \| Destination \| Frontend Mentor \| Space tourism website", `history.length` 변화 없음(2 → 2) |
| 11개 항목 주소·제목 | 검증 완료 | 세 그룹 모든 탭 전환 후 주소와 제목이 빌드된 해당 페이지와 일치(불일치 0) |
| 새로고침 | 검증 완료 | Europa 전환 후 새로고침해도 Europa 선택 |
| 뒤로 가기 | 검증 완료 | `index.html` → `destination-moon.html`에서 3번 전환 후 `goBack()` → `/index.html` |
| 페이드 | 검증 완료 | 전환 60ms 뒤 opacity 0.35, 460ms 뒤 1, 남은 애니메이션 0 |
| 빠른 연속 전환 | 검증 완료 | 3번 연속 클릭 후 마지막(Moon) 패널만 보이고 남은 애니메이션 0 |
| reduced motion | 검증 완료 | 전환 직후 opacity 1, 애니메이션 0 |
| JavaScript 끔 | 검증 완료 | `crew-pilot.html`: Victor Glover 패널만, 탭 ARIA가 빌드 초기값과 같음, `aria-orientation` 없음 |
| `main.js` 요청 차단 | 검증 완료 | 같은 결과, 콘솔 오류 없음(로드 실패 메시지 제외) |
| 홈·메뉴 독립 | 검증 완료 | 홈 375px 메뉴 열기·Escape(포커스 토글 복귀), 콘솔 오류 없음 |
| 전환 후 배치 | 검증 완료 | 3개 그룹 × 375·768·1440px × 모든 항목(33회): 전환 후 `main` 요소 상자가 그 항목 페이지를 직접 연 기준값과 같음, 가로 넘침 없음, 탭 클릭 지점의 최상단 요소가 탭 |
| 초기 로드 회귀 | 검증 완료 | 12개 페이지 × 3개 폭: 제목·주소·탭 ARIA·패널·요소 상자 모두 같음. 차이는 `aria-orientation`이 생긴 것뿐(의도) |
| 전체 콘솔 | 검증 완료 | 12개 페이지 × 320·375·768·1024·1440px 콘솔 오류 없음. 375px 메뉴 열기·Escape 정상 |
| Firefox | 미검증 | 미설치 |
| 실제 스크린 리더·실기기 터치 | 미검증 | 에뮬레이션·DOM 확인만 함 |
| `file://`에서 주소 교체 | 미검증 | HTTP 서버로만 검증. 코드상 예외를 무시하고 화면 전환만 함 |

## 범위 (4.3)

- 변경: `src/js/main.js`(탭 블록 추가, 메뉴 블록 변경 없음), 이 change 폴더
- 마크업(`src/partials`)과 SCSS 변경은 없습니다.
- `dist` 변경 없음. 사용자 미커밋 파일(`doc/figma-guide.md`)은 수정하지 않았습니다.
- `git diff --check -- src/js`를 통과했습니다.

## 알려진 제한

- 로컬 파일(`file://`)로 열면 `replaceState`가 막힐 수 있어, 그때는 주소가 바뀌지 않고 화면만 전환됩니다.
- 스와이프·자동 재생은 없습니다(범위 밖).
- 스크린 리더(NVDA·VoiceOver)에서 실제로 탭 이름과 선택 상태를 읽는지는 확인하지 않았습니다.
- 헤더 내비의 `aria-current`는 같은 그룹 안 전환이라 바뀌지 않습니다(의도).
