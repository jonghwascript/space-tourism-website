# Report: align-technology-wide-layout

2026-10-30. Chromium(Playwright 1.63, headless)으로 검증했습니다. 스크래치 미리보기 빌드와 로컬 HTTP 서버를 썼고 `dist`는 사용하지 않았습니다. 캡처는 남기지 않고(AGENTS.md) 요소 상자를 측정했습니다.

## 준비 (1.1)

- `src/scss/pages/_technology.scss`에는 작업 전 사용자 변경이 없었습니다. 다른 미커밋 변경(앞선 두 change, `README.md`, `screenshot.jpg`)은 건드리지 않았습니다.
- 변경 전 기준값 25개(스크래치 JSON)를 저장했습니다. 저장한 값은 main·제목·탭·텍스트·이미지 상자, 세로 중심, `scrollWidth`, 패널 포커스입니다.
  - Technology 3개 페이지 × 1024·1280·1440·1920·2560px
  - Technology 375·768px
  - Destination·Crew 1920·2560px
  - 포커스 1440·1920px, 텍스트 200%, 탭 전환 후 1920px

## 구현 (2.1)

`src/scss/pages/_technology.scss` 데스크톱 규칙(+9/−6줄, 주석 포함):
- `.c-technology`: `inline-size: min(1275px, 100% − 40px); margin-inline-start: auto`를 `margin-inline-start: max(2.5rem, (100% - 69.375rem) / 2)`로 바꿨습니다. 폭은 자동이고 화면 오른쪽 끝까지입니다.
- 그리드 열: `auto max(30.6875rem, 50% - 10rem) minmax(0, 1fr)`를 `auto 30.6875rem minmax(0, 1fr)`로 바꿨습니다.
- `.c-technology__image` 데스크톱: `justify-self: end; inline-size: min(38rem, 100%)`를 추가했습니다(608px 상한, 오른쪽 끝 정렬).

## 구현 중 확인한 계획과의 차이(사용자 결정)

design에서 "1024~1440px은 지금과 같다"고 적었지만, 두 끝점만 같았습니다. 그 사이 폭에서는 시작선이 다른 페이지와 같은 쪽으로 옮겨 갑니다. 사용자 결정으로 그대로 두고 artifact를 고쳤습니다.

| 폭 | 변경 전 시작선 | 변경 후 | Destination·Crew | 이미지 폭(전 → 후) |
| --- | --- | --- | --- | --- |
| 1024 | 40 | 40 | 40 | 317 → 317 |
| 1100 | 40 | 40 | 40 | — |
| 1200 | 40 | 45 | 45 | — |
| 1280 | 40 | 85 | 85 | 568 → 528 |
| 1366 | 91 | 128 | 128 | — |
| 1440 | 165 | 165 | 165 | 608 → 608 |

## 검증 결과

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| SCSS 컴파일 | 검증 완료 | `sass.compile` 통과 |
| 1440px(Figma) | 검증 완료 | 3개 페이지 모두 변경 전과 같음: 탭 165, 텍스트 309·491px, 이미지 832~1440·608×600, 세로 중심 606/606/606 |
| 1024px | 검증 완료 | 3개 페이지 모두 변경 전과 같음: 탭 40, 텍스트 184·491px, 이미지 707~1024·317×600 |
| 넓은 화면 | 검증 완료 | 1920px: 탭 405(Destination 405), 텍스트 549·491px, 이미지 1312~1920·608×600. 2560px: 탭 725(Destination 725), 텍스트 869·491px, 이미지 1952~2560·608×600. 세로 중심 일치, 가로 넘침 없음 |
| 중간 폭 시작선 | 검증 완료 | 1100·1200·1280·1366px에서 Technology·Destination·Crew 제목 x가 같음(40·45·85·128) |
| 모바일·태블릿 | 검증 완료 | 375·768px 변경 전과 같음 |
| 다른 페이지 | 검증 완료 | Destination·Crew 1920·2560px 변경 전과 같음 |
| 패널 포커스 | 검증 완료 | 1440·1920px에서 outline(offset −2px) 네 변이 화면 안 |
| 텍스트 200% | 검증 완료 | 1440×900에서 변경 전과 같음(모바일 배치), 넘침 없음 |
| 탭 전환 후 | 검증 완료 | 1920px에서 Space capsule로 전환 후에도 같은 위치 |
| 콘솔 | 검증 완료 | 오류 없음 |
| Firefox | 미검증 | 미설치 |

## 범위 (3.2)

- 이 change로 바뀐 소스: `src/scss/pages/_technology.scss`(+9/−6)
- `dist` 변경 없음. 다른 미커밋 파일은 수정하지 않았습니다.
- `git diff --check -- src/scss`를 통과했습니다.
