# Proposal

## Why

`add-mobile-menu-toggle`에서 모바일 메뉴 열기·닫기를 구현했지만, `doc/a11y-checklist.md` 대조에서 나온 항목을 후속으로 미뤘다. 열린 패널에서 Tab으로 나간 포커스가 패널 뒤에 가려질 수 있고, 버튼 이름과 `aria-expanded`가 상태를 이중으로 전달하며, 낮은 화면에서 패널 링크가 잘려 닿을 수 없을 수 있다. 또 느린 환경에서는 첫 화면에 링크 목록이 보였다가 햄버거로 바뀐다(`add-mobile-menu-toggle` 보고서 4.2). 이 change에서 이를 정리하고, 고대비 모드·포커스 표시·대비를 실제로 측정한다.

## What Changes

- 메뉴가 열린 상태에서 포커스가 헤더 밖 요소로 이동하면 메뉴를 닫는다.
- 토글 버튼의 접근 가능한 이름을 "Menu"로 고정하고 상태는 `aria-expanded`로만 전달한다. **BREAKING**(spec): 기존 "Open menu"/"Close menu" 이름 전환을 없앤다.
- 열린 패널이 화면 높이보다 길어지면 패널 안에서 세로 스크롤되어 모든 링크에 닿을 수 있게 한다.
- 스타일시트 적용 전에 문서 루트에 스크립트 사용 신호를 붙여, 첫 그리기부터 모바일 햄버거 배치가 나오게 한다. 메뉴 스크립트를 불러오지 못하거나 필요한 요소가 없으면 신호를 지워 스크립트 없는 배치로 돌아간다.
- 햄버거·닫기 아이콘을 `<img>`에서 버튼 글자색을 따르는 인라인 SVG(`currentColor`)로 바꿔 CSS와 강제 색상 모드에서 색을 정할 수 있게 한다.
- 강제 색상(고대비) 모드에서 열린 패널과 토글이 보이도록 하고, 열린 패널의 포커스 표시와 글자·아이콘 대비를 측정해 기준에 못 미치면 고친다.

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `site-layout`: 메뉴 토글 이름(Menu 고정)과 아이콘(인라인 SVG, `currentColor`), 메뉴 스크립트 로딩(첫 그리기 전 활성화와 로딩 실패 시 복귀), 메뉴 열기·닫기(이름 전환 삭제), 닫기 보조 동작(포커스 이탈 시 닫기) 요구사항을 바꾸고, 열린 패널 넘침과 고대비·대비 요구사항을 추가한다.

## Impact

- `src/partials/head.html`: 인라인 신호 스크립트, `main.js` 로딩 실패 처리
- `src/partials/header.html`: 토글 숨김 텍스트 "Open menu" → "Menu", 아이콘 `<img>` 2개 → 인라인 SVG
- `src/images/shared/icon-hamburger.svg`, `icon-close.svg`: 헤더에서 참조가 끊긴다(파일 삭제는 범위 밖)
- `src/js/main.js`: 이름 전환 제거, 포커스 이탈 닫기, 활성화 방식 변경
- `src/scss/components/_site-header.scss`: 활성화 선택자 변경, 패널 세로 스크롤, 강제 색상 모드 규칙, 측정 결과에 따른 포커스·대비 보정
- 12개 페이지 출력 HTML(빌드로 반영). 의존성 추가 없음.
