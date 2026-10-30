# Tasks

## 1. 준비

- [x] 1.1 `git status`로 미커밋 변경을 확인한다. `src/pages/index.html`에는 직전 change(헤더 `landing` 값)의 변경만 있고 23행 Explore 링크는 원본 그대로인지 확인한다. 스크래치 미리보기(`dist` 미사용)에서 375·768·1440px Explore 링크 상자, 글자 상자, 접근 가능한 이름, 페이지 `scrollWidth`를 기준값으로 기록한다. 캡처는 하지 않는다. (결과를 `report.md`에 기록)

## 2. 구현

- [x] 2.1 `index.html` 23행 Explore 링크를 `Explore<span class="u-sr-only"> destinations</span>`로 바꾼다. 앞 공백을 스팬 안에 두어 이름이 "Explore destinations"로 이어지게 한다. 다른 줄과 직전 change의 변경은 건드리지 않는다. (확인 기준)
  - `git diff`에서 23행만 바뀐다.
  - 빌드 결과에 스팬이 들어간다.
  - Playwright 접근성 스냅샷의 링크 이름이 "Explore destinations"다.

## 3. 검증과 보고

- [x] 3.1 화면과 동작을 회귀 확인한다. (확인 기준)
  - 375·768·1440px 링크 상자(144/272/272)가 1.1 기준값과 같다.
  - 보이는 글자 상자와 원 중심의 차이가 1px 이내로 기준값과 같다.
  - `scrollWidth`가 viewport를 넘지 않는다.
  - hover halo, 포커스 outline, 강제 색상 경계선의 computed style이 기준값과 같다.
  - Enter로 `destination-moon.html`로 이동한다.
  - 320px·텍스트 200%에서 가로 넘침이 없다.
  - 콘솔 오류가 없다.
  - Firefox·실제 스크린 리더는 미검증으로 기록한다.
- [x] 3.2 범위를 확인한다. (확인 기준)
  - 이번 change로 바뀐 것이 `src/pages/index.html` 23행과 이 change 폴더뿐이다.
  - `dist`와 다른 미커밋 파일에 변경이 없다.
  - `git diff --check`가 통과한다.
  - `report.md`에 검증 표를 정리한다.

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다. `index.html`에는 직전 change의 변경도 있으므로, 커밋을 나누려면 줄 단위로 스테이징한다.
- 검토가 끝나면 `/opsx:archive`로 보관하고 `home-page` 주 spec 반영(추가 1개)을 확인한다.
