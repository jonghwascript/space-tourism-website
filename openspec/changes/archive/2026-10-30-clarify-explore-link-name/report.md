# Report: clarify-explore-link-name

2026-10-30. Chromium(Playwright 1.63, headless)으로 검증했습니다. 스크래치 미리보기 빌드와 로컬 HTTP 서버를 썼고 `dist`는 사용하지 않았습니다. 캡처는 남기지 않고(AGENTS.md) 요소 상자·computed style·접근성 스냅샷을 측정했습니다.

## 준비 (1.1)

- 미커밋 변경: 직전 change `fix-nav-current-state`의 소스 7개 파일(그중 `index.html` 8행의 `landing` 값), `README.md`, `screenshot.jpg`. 이 change는 `index.html` 23행만 수정했습니다.
- 변경 전 기준값(스크래치 JSON): 320·375·768·1440px 기본, 375·1440 hover, 375·768·1440 키보드 포커스, 375·1440 강제 색상, 375·1440 텍스트 200%에서 다음 값을 기록했습니다.
  - 링크 상자, 보이는 글자와 원 중심의 차이
  - `box-shadow`·글자색·테두리·outline
  - `scrollWidth`, 접근성 스냅샷
- 변경 전 링크 이름: "Explore"

## 구현 (2.1)

`src/pages/index.html` 23행:

```html
<a class="c-explore" href="./destination-moon.html">Explore<span class="u-sr-only"> destinations</span></a>
```

## 검증 결과

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| 접근 가능한 이름 | 검증 완료 | Playwright `ariaSnapshot`: `link "Explore destinations"`, `/url: ./destination-moon.html`. 화면 글자 "Explore"로 시작(WCAG 2.5.3) |
| 빌드 결과 | 검증 완료 | 미리보기 `index.html`에 스팬 포함, `@@` 없음 |
| 화면 표시 유지 | 검증 완료 | 13개 조건 모두 링크 상자(375 144×144, 768·1440 272×272), 글자 중심 차이(0, −0.5px), `box-shadow`·색·테두리·outline, `scrollWidth`가 변경 전과 같음 |
| 숨긴 글자 비노출 | 검증 완료 | 스팬은 1×1px, `position: absolute`, `clip: rect(0 0 0 0)`, 링크 안. 스팬을 빨간색으로 칠해도 375·1440px 링크 캡처 픽셀이 같음(비교용 메모리 캡처, 저장하지 않음) |
| hover·포커스·강제 색상 | 검증 완료 | 해당 조건의 computed style이 변경 전과 같음 |
| 목적지 | 검증 완료 | Enter로 `destination-moon.html` 이동 |
| 넘침 | 검증 완료 | 320px, 텍스트 200%(375·1440)에서 `scrollWidth` = viewport |
| 콘솔 | 검증 완료 | 오류 없음 |
| Firefox | 미검증 | 미설치 |
| 실제 스크린 리더 낭독 | 미검증 | 접근성 트리 이름만 확인. NVDA·VoiceOver 낭독은 확인하지 않음 |

참고: `innerText`는 "EXPLORE DESTINATIONS"로 바뀝니다. `innerText`가 `clip`으로 숨긴 글자도 포함하는 속성이라 생기는 차이이고, 화면 픽셀은 같습니다.

## 범위 (3.2)

- 이 change로 바뀐 소스: `src/pages/index.html` 23행(+1/−1). SCSS·JS 변경 없음
- 같은 파일 8행과 나머지 소스 변경은 직전 change(`fix-nav-current-state`)의 것입니다.
- `dist` 변경 없음. `git diff --check -- src` 통과
