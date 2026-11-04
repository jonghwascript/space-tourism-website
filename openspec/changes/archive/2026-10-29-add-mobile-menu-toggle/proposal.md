# Proposal

## Why

헤더에는 메뉴 토글 버튼 마크업과 `.is-enhanced` / `.is-menu-open` 상태 스타일이 이미 준비되어 있지만, `src/js/main.js`가 비어 있고 페이지가 스크립트를 불러오지 않는다. 그래서 768px 미만에서도 Figma의 햄버거 메뉴 대신 링크가 로고 아래에 늘어서는 임시 배치만 보인다. 메뉴 스크립트를 연결해 Figma 모바일 디자인(햄버거 → 오른쪽 패널)을 실제로 동작하게 한다.

## What Changes

- 12개 페이지가 공통 `<head>` 원본에서 `./js/main.js`를 `defer`로 불러온다.
- 스크립트가 실행되면 헤더에 `.is-enhanced`를 붙인다. 768px 미만에서는 토글만 보이고 목록이 숨겨진다. 스크립트가 없거나 실패하면 지금의 임시 배치가 그대로 유지된다.
- 토글 버튼 클릭(Enter·Space 포함)으로 메뉴를 열고 닫는다. 이때 `.is-menu-open`, `aria-expanded`, 버튼의 접근 가능한 이름("Open menu" ↔ "Close menu")을 함께 바꾼다.
- 메뉴가 열려 있을 때 Escape를 누르거나 헤더 바깥을 클릭하면 닫힌다. Escape로 닫으면 포커스가 토글로 돌아온다.
- 열린 상태로 768px 이상으로 넓히면 닫힌 상태로 초기화해 표시와 ARIA 값이 어긋나지 않게 한다.
- SCSS와 헤더 HTML 구조는 바꾸지 않는다. 상태 클래스 계약은 이전 변경(`style-site-header`)에서 정의한 그대로 쓴다.

### 후속 change로 넘기는 항목

`doc/a11y-checklist.md` 대조에서 나온 아래 항목은 설계 결정이나 별도 검증 환경이 필요하므로 이번 범위에서 제외하고 후속 change(헤더 접근성 보완)에서 다룬다.

- 열린 패널에서 Tab으로 빠져나간 포커스가 패널 뒤에 가려지는 문제와 대응 방식(헤더 밖으로 포커스가 나가면 닫기 등)
- 낮은 화면·텍스트 200% 확대에서 패널 내용이 잘릴 때의 대응(SCSS `overflow-y`)
- 버튼 이름 정책(이름 고정 + `aria-expanded`만 변경 여부)
- 고대비(강제 색상) 모드 점검
- 열린 패널의 포커스 표시, 패널 링크 글자·아이콘 대비 점검

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `site-layout`: "모바일 메뉴 토글 마크업" 요구사항에서 "열고 닫는 동작은 포함하지 않는다"는 제외 문구를 없애고, 메뉴 스크립트 로딩과 열기·닫기 동작(ARIA·포커스·Escape·바깥 클릭·분기점 전환)을 요구사항으로 추가한다.

## Impact

- `src/js/main.js`: 메뉴 스크립트 작성
- `src/partials/head.html`: `<script src="./js/main.js" defer>` 추가 → 빌드 시 12개 페이지에 반영
- `src/partials/header.html`: 구조 변경 없음. 버튼 이름은 스크립트가 바꾼다.
- `src/scss/components/_site-header.scss`: 변경 없음(기존 상태 규칙 사용)
- 의존성 추가 없음. 빌드(`gulp`)의 정적 복사가 이미 `src/js/**`를 `dist`로 복사한다.
