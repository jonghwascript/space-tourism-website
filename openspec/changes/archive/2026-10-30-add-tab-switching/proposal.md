# Proposal

## Why

Destination·Crew·Technology 페이지의 탭은 `role="tab"` 버튼이지만 전환 스크립트가 없습니다. 비선택 탭은 hover 표시만 있고, 눌러도 패널이 바뀌지 않습니다. 각 페이지 파일이 처음 선택만 다르게 빌드되어 있어, 사용자는 다른 항목을 볼 방법이 없습니다. 세 페이지 스타일 작업을 모두 마쳤으므로, 그때 미뤄 둔 전환 동작을 공통 스크립트로 추가합니다. README의 "탭으로 정보를 전환해 볼 수 있다"는 요구도 여기에 해당합니다.

## What Changes

- 세 페이지에 공통으로 동작하는 탭 전환 스크립트를 추가합니다. 마크업에 이미 있는 ARIA 탭 구조(`role=tablist/tab/tabpanel`, `aria-controls`, `aria-labelledby`)를 그대로 씁니다.
- **클릭·Enter·Space:** 탭을 실행하면 그 탭이 선택되고 연결된 패널만 보입니다.
  - 선택 탭은 `aria-selected="true"`·`tabindex="0"`, 나머지는 `"false"`·`-1`이 됩니다.
  - 패널은 `hidden` 속성으로 전환합니다. 기존 SCSS는 `aria-selected` 기준이라 모양이 그대로 따라옵니다.
- **방향키·Home·End(자동 활성화):** 포커스가 가는 탭이 바로 선택됩니다(WAI-ARIA 탭 패턴, 양 끝에서 반대쪽으로 순환).
  - 가로 탭 목록은 ←·→로 움직입니다.
  - 데스크톱 Technology처럼 세로로 놓인 탭 목록은 ↑·↓로 움직입니다. 탭 목록의 `aria-orientation`도 배치에 맞춰 갱신합니다.
- **URL과 제목:** 선택이 바뀌면 주소를 그 항목의 페이지 파일(예: `destination-mars.html`)로 교체하고(`history.replaceState`, 방문 기록은 쌓지 않음), 문서 제목도 그 페이지의 `<title>` 형식으로 바꿉니다. 그래서 새로고침하거나 주소를 공유해도 같은 항목이 보입니다.
- **페이드:** 새 패널이 약 0.3초 동안 나타납니다. 움직임 줄이기 설정에서는 즉시 바뀝니다.
- **스크립트가 없을 때:** 스크립트가 없거나 실패해도 지금처럼 파일별 초기 패널이 보입니다.
- **spec 정리:** 스타일 단계에서 넣었던 "전환 미지원" 요구사항 4개를 제거합니다.

범위 밖:
- 스와이프 제스처, 자동 재생, Splide 같은 슬라이드 라이브러리(사용자 결정)
- 탭 모양(SCSS)과 마크업 텍스트 변경. 스크립트만 추가하며, 필요하면 연결용 속성만 추가합니다.
- 헤더 내비게이션의 "현재 페이지" 표시. 같은 그룹 안 전환이라 `aria-current`가 바뀌지 않습니다.

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `content-tabs`: "전환 동작 범위 제외" 요구사항을 제거합니다. 다음 요구사항을 추가합니다.
  - 클릭·키보드 전환, ARIA 상태 동기화, 방향(orientation)
  - URL·제목 교체, 페이드와 움직임 줄이기
  - 스크립트 없을 때 동작
- `destination-page`: "탭 전환 미지원 표시" 요구사항을 제거합니다.
- `crew-page`: "Crew 탭 전환 미지원 표시" 요구사항을 제거합니다.
- `technology-page`: "Technology 탭 전환 미지원 표시" 요구사항을 제거합니다.

## Impact

- `src/js/main.js`: 메뉴 블록 아래에 독립된 탭 블록을 추가합니다. 메뉴 동작은 바꾸지 않습니다.
- `src/partials/*-tabs.html`, `src/scss/**`: 변경하지 않는 것을 목표로 합니다(설계에서 확인).
- 빌드: `src/js`는 이미 그대로 복사되므로 gulp 설정 변경이 없습니다. 의존성 추가도 없습니다.
- `doc/ENGINEERING_NOTES.md` 등 문서의 "탭 전환은 아직 없다"는 설명이 있으면 갱신합니다.
