# 구현 보고: add-mobile-menu-toggle

## 변경 파일

| 파일 | 내용 |
| --- | --- |
| `src/partials/head.html` | 스타일시트 다음에 `<script src="./js/main.js" defer></script>` 추가 → 12개 페이지에 반영 |
| `src/js/main.js` | 헤더 활성화(`.is-enhanced`), 상태 갱신 함수(`.is-menu-open`·`aria-expanded`·숨김 텍스트), 토글 클릭, Escape, 헤더 바깥 클릭, `matchMedia('(width < 48em)')` 분기점 초기화 |

SCSS와 헤더 HTML 구조는 바꾸지 않았다.

## 준비 확인 (1.1)

- 시작 시 `src/js`, `src/partials`에 사용자 변경이 없었다.
- 작업 전부터 `doc/figma-guide.md`, `src/scss/components/_site-header.scss`(주석 2줄)에 사용자 변경이 있었다. 이 변경은 건드리지 않았고, 미리보기 빌드에는 그대로 포함되었다(주석만이라 출력 CSS 영향 없음).

## 검증

환경: Chromium(Playwright 1.63, headless), 스크래치 폴더 미리보기 빌드(`dist` 미사용, 수정 시각 변화 없음 확인), 로컬 HTTP 서버.

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| JS 문법 | 검증 완료 | `node --check src/js/main.js` |
| 12개 HTML에 `defer` 스크립트, `js/main.js` 복사 | 검증 완료 | 미리보기 결과 grep 12건, 파일 존재 |
| 375px 활성화: 햄버거만 보이고 목록 숨김, 링크가 접근성 트리에 없음 | 검증 완료 | computed display, `getByRole('link')` 0건 |
| JS 꺼짐: 토글 숨김, 링크 보임, 가로 넘침 없음 | 검증 완료 | `javaScriptEnabled: false` |
| 클릭으로 열기·닫기: 패널(254px, 오른쪽), 닫기 아이콘, `aria-expanded`, 이름 "Open menu"↔"Close menu" | 검증 완료 | `getByRole('button', { name: 'Close menu', expanded: true })`, 캡처 |
| 현재 링크 오른쪽 3px white(열린 패널) | 검증 완료 | `crew-pilot.html` computed style |
| Tab 순서 건너뛰기 → 로고 → 토글, Enter·Space 실행 후 포커스 유지, 열고 Tab → 첫 링크 | 검증 완료 | 키보드 입력 자동화 |
| 패널 링크에서 Escape → 닫힘 + 토글 포커스 | 검증 완료 | |
| 본문 클릭 → 닫힘, 패널 빈 곳 클릭 → 열림 유지 | 검증 완료 | |
| 375에서 열고 768 → 767: 768은 태블릿 배치·닫힘, 767은 닫힘·`aria-expanded="false"` | 검증 완료 | viewport 변경 |
| 12페이지 × 320·375·767·768·1023·1024·1440(84건): 콘솔 오류·가로 넘침 없음, 모바일 열기·닫기, 태블릿 이상 한 줄 배치, JS 유무에 따른 헤더 배치 차이 없음 | 검증 완료 | 글꼴 로딩 완료 후 측정 |
| Firefox | 미검증 | 설치된 Firefox 없음 |
| 실제 스크린 리더 읽기 | 미검증 | 접근성 트리 이름·상태만 자동 확인 |

### 4.2 첫 그리기 위험 (확인됨, 수정은 범위 밖)

`main.js` 응답을 1.5초 늦추면 375px에서 활성화 전에 링크 목록(스크립트 없는 배치)이 먼저 그려진 뒤 햄버거 배치로 바뀐다. 실제 환경에서는 스크립트가 작고 같은 출처라 지연이 짧지만, 느린 네트워크에서는 배치가 한 번 바뀌어 보일 수 있다. 개선 방향은 design의 위험 항목대로 `<head>` 인라인으로 활성화 신호를 먼저 붙이는 방식이며, 후속에서 검토한다.

### 검증 중 관찰 (범위 밖)

웹 글꼴(Barlow Condensed)이 아직 적용되지 않은 순간에는 대체 글꼴 폭 때문에 768px·1440px에서도 내비 링크가 두 줄로 넘어가 헤더 높이가 커진다(예: 768px 헤더 높이 96 → 192px). 스크립트와 무관한 기존 SCSS·글꼴 로딩 동작이며, 글꼴 로딩 실패 시의 배치로 별도 검토가 필요하다.

## 해당 없음(후속)

`doc/a11y-checklist.md` 대조에서 나온 아래 항목은 사용자 결정(A안)에 따라 이번 범위에서 제외하고 후속 change(헤더 접근성 보완)로 넘겼다.

| 항목 | 제외 사유 |
| --- | --- |
| 열린 패널에서 Tab으로 빠져나간 포커스가 패널 뒤에 가려지는 문제 | 대응 방식(헤더 밖 포커스 시 닫기 등) 결정 필요 |
| 낮은 화면·텍스트 200%에서 패널 내용 잘림 | SCSS 변경 필요 |
| 버튼 이름 정책(이름 고정 + `aria-expanded`만 변경) | spec 변경 필요 |
| 고대비(강제 색상) 모드 | 별도 검증 환경 필요 |
| 열린 패널의 포커스 표시, 패널 글자·아이콘 대비 | 별도 측정 필요 |

## 범위 확인

- 이 change가 바꾼 파일은 `src/js/main.js`, `src/partials/head.html`뿐이다. `git diff --check -- src/js/main.js src/partials/head.html` 통과.
- 저장소 전체 `git diff --check`는 사용자 변경 파일(`doc/figma-guide.md`, `_site-header.scss` 166행)의 줄 끝 공백 때문에 실패한다. 이 change의 변경이 아니므로 수정하지 않았다.
- `dist`는 변경·삭제하지 않았다.
