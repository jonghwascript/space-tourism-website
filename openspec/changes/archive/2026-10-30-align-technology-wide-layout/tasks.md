# Tasks

## 1. 준비

- [x] 1.1 `git status`로 `src/scss/pages/_technology.scss`에 사용자 변경이 없는지 확인한다. 스크래치 미리보기(`dist` 미사용)에서 Technology 3개 페이지 × 1024·1280·1440·1920·2560px의 다음 값을 기준값 JSON으로 저장한다. 모바일·태블릿(375·768px)과 Destination·Crew 1920px도 회귀용으로 함께 저장한다. 캡처는 하지 않는다. (결과를 `report.md`에 기록)
  - main·제목·탭·텍스트·이미지 상자
  - 세로 중심, `scrollWidth`

## 2. 구현

- [x] 2.1 `_technology.scss` 데스크톱 규칙을 바꾼다(design 결정 1~3). 해당 주석의 "전환"·"제한" 설명도 새 동작에 맞게 고친다.
  - `.c-technology`: `inline-size` 제거, `margin-inline-start: max(2.5rem, (100% - 69.375rem) / 2)`
  - 그리드 열: `auto 30.6875rem minmax(0, 1fr)`
  - 데스크톱 `.c-technology__image`: `justify-self: end; inline-size: min(38rem, 100%)`

  (확인 기준)
  - SCSS 컴파일이 통과한다.
  - 1024·1440px 측정값이 1.1 기준값과 같다(1440px: 탭 165, 텍스트 309·491, 이미지 832~1440·608×600).
  - 1280px은 시작선이 Destination과 같다(85, 구현 중 확인한 변경·사용자 결정).
  - 1920·2560px에서 제목·탭 왼쪽 끝이 Destination 제목과 같고(405·725), 텍스트 491px, 이미지 608×600·오른쪽 끝이 화면 끝이다.
  - 세 요소의 세로 중심 차이가 2px 이내이고, 가로 넘침이 없다.

## 3. 검증과 보고

- [x] 3.1 회귀를 확인한다. (확인 기준)
  - 375·768px Technology와 Destination·Crew 1920px 측정값이 기준값과 같다.
  - 데스크톱 패널 포커스 outline 네 변이 1440·1920px에서 화면 안에 있다.
  - 텍스트 200%(1440×900)에서 넘침·겹침이 없다.
  - 탭 전환 후에도 이미지·텍스트 위치가 같다.
  - 콘솔 오류가 없다.
  - Firefox는 미검증으로 기록한다.
- [x] 3.2 범위를 확인한다. (확인 기준)
  - 이번 change로 바뀐 소스가 `_technology.scss`뿐이다.
  - `dist`와 다른 미커밋 파일에 변경이 없다.
  - `git diff --check`가 통과한다.
  - `report.md`에 검증 표와 측정값을 정리한다.

## Workflow follow-up

- 사용자가 결과를 확인한 뒤 커밋 여부를 정한다.
- 검토가 끝나면 `/opsx:archive`로 보관하고 `technology-page` 주 spec 반영(수정 1개)을 확인한다.
