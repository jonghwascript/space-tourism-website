# 결과 보고: style-site-header

## 변경 파일

| 파일 | 내용 |
| --- | --- |
| `src/scss/abstracts/_variables.scss` | 이전 템플릿 토큰 삭제. 서체 3종, 색 3종, 내비 글자 크기·자간 토큰 추가. 분기점 유지 |
| `src/scss/abstracts/_mixins.scss` | `font-style()`에 `$family` 인자(기본 Barlow) 추가, `mq-below()` 추가 |
| `src/scss/base/_fonts.scss` | Work Sans `@font-face` 삭제, Google Fonts 사용 주석 |
| `src/scss/base/_base.scss` | `body` 배경 blue-900·글자 white·Barlow, 전역 `:focus-visible` 2px white(기존 `button:focus-visible` 3px blue 대체) |
| `src/scss/components/_site-header.scss` | 신규. 헤더·로고·장식선·내비 바·링크 상태·토글·모바일 상태 |
| `src/scss/style.scss` | `components/site-header` 추가 |

## 검증 (Chromium, Playwright 1.63, 스크래치 미리보기 — `dist` 미사용)

| 검사 | 결과 | 상태 |
| --- | --- | --- |
| SCSS 컴파일 | 성공. 출력 CSS에 Work Sans·Roboto 없음, 이전 토큰 사용처 없음 | 검증 완료 |
| `body` | `rgb(11, 13, 23)` / `rgb(255, 255, 255)` / `Barlow, sans-serif` | 검증 완료 |
| 1440px | 로고 48×48 (64, 64), 내비 바 x=704·폭 736·높이 96, 장식선 560px·white 25%, 링크 간격 48, 마지막 링크 끝 1376 | 검증 완료(Figma 9:2078 일치) |
| 1024px | 내비 바 664px, 장식선 216px, 한 줄, 넘침 없음 | 검증 완료 |
| 768·1023px | 장식선 없음, 로고 (40, 24), 내비 바 x=128·폭 640(768), 마지막 링크 끝 728(768), 토글 숨김 | 검증 완료(Figma 49:792 일치) |
| 링크 글꼴 | Barlow Condensed 16px, 자간 2px, 대문자, 번호 700·자간 2.7px | 검증 완료 |
| 현재·hover | 현재 3px white, hover 3px white 50%, 위치·크기 변화 없음(`crew-pilot.html`에서 Crew만 현재) | 검증 완료 |
| 포커스 | 로고·링크 포커스 링이 잘리지 않고 글자를 가리지 않음(캡처 확인) | 검증 완료 |
| reduced motion | `transition-duration: 0s` | 검증 완료 |
| 모바일 기본(320·375·767px) | 로고 40×40, 토글 숨김, 링크 4개 줄바꿈 목록, 넘침 없음 | 검증 완료 |
| `.is-enhanced`(375px, 검증용 주입) | 토글 표시(누름 영역 44×44), 목록 `display: none`·접근성 트리에서 제외 | 검증 완료 |
| `.is-menu-open`(375px, 검증용 주입) | 패널 x=121·폭 254·전체 높이, 링크 x=153·y=133부터 51px 간격·폭 222, 현재 링크 오른쪽 3px white, 닫기 아이콘 표시 | 검증 완료(Figma 120:2725 일치) |
| 같은 클래스(768px) | 태블릿 배치 그대로 | 검증 완료 |
| 루트 글꼴 200%(375·768·1024·1440px) | 가로 넘침 0, 링크 줄바꿈 | 검증 완료 |
| 12개 페이지 × 320~1440px 7개 폭 | 가로 넘침·이미지·탭·현재 링크·제목 문제 0건 | 검증 완료 |
| 범위 | `src/js`·`src/pages`·`src/partials` 변경 없음, 인라인 style 없음, `git diff --check -- src` 통과 | 검증 완료 |
| 브라우저 zoom 200%(Chrome 기본 글꼴 크기 설정) | 실행하지 않음. 뷰포트 폭 축소(320~767px)와 루트 글꼴 확대로 대신 확인 | 미검증 |
| Firefox | 미설치 | 미검증 |

## Figma와의 의도적 차이와 판단

- **모바일 기본 배치**: 메뉴 스크립트가 없어 토글을 숨기고 링크를 로고 아래 줄바꿈 목록으로 보여 준다. Figma 모바일(햄버거만 표시)과 다르며, JS 단계에서 `is-enhanced`를 붙이면 Figma 모양이 된다.
- **토글 누름 영역**: 닫기 아이콘(20×21)일 때 40×44로, 햄버거(24×21)일 때 44×44보다 조금 좁다. 최소 기준 24×24는 넘는다.
- **현재 링크 선택자**: `[aria-current='page']` 사용. scss-guide.md §4가 피하라는 것은 연결용 ARIA 속성이고, 이 값은 상태 자체라 상태 선택자로 판단했다.
- **전역 포커스**: 기존 `button:focus-visible`(파란색)을 모든 요소의 white outline으로 바꿨다. 본문 버튼·링크에도 적용된다.

## JS 단계 클래스 계약

| 클래스(헤더 루트 `.c-site-header`) | 붙이는 시점 | 함께 갱신할 것 |
| --- | --- | --- |
| `is-enhanced` | 스크립트 초기화 직후 | — |
| `is-menu-open` | 메뉴 열기 | 토글 `aria-expanded="true"`, 숨긴 텍스트 "Close menu", Escape로 닫기, 포커스 복원, 768px 이상 전환 시 해제, 필요 시 `body.no-scroll` |

## 기타

- `dist` 폴더가 작업 중 생성되어 있다(18:45). 이 작업의 미리보기는 스크래치 폴더만 사용했으므로 사용자 빌드로 보이며 건드리지 않았다.
- `doc/figma-guide.md`의 줄 끝 공백(6곳)은 이번 범위 밖이라 그대로 두었다.
