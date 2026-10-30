# Proposal

## Why

Technology 페이지 3개(`technology-{vehicle,spaceport,capsule}.html`)는 마크업만 있습니다. 페이지 제목과 공통 탭 바탕 색만 적용되어 있고, 본문(`c-technology`)과 숫자 탭(`c-tabs--numbers`)에는 스타일이 없습니다. 그래서 숫자 "1 2 3"이 원 없이 글자로만 보이고, 이미지는 원본 크기로 쌓입니다. 마지막 남은 본문 페이지이므로 헤더·홈·Destination·Crew와 같은 분기점(768px, 1024px)과 Figma 값(모바일 91:2090, 태블릿 49:2171, 데스크톱 9:2139, hover 99:1864)으로 맞춥니다.

## What Changes

- Technology 페이지에 화면 크기별 배경 이미지(`background-technology-{mobile,tablet,desktop}.jpg`)를 채우고, 본문이 헤더 아래 남은 화면 높이를 최소한으로 채우게 합니다.
- 화면 크기별 본문 배치를 적용합니다.
  - 모바일(768px 미만): 제목 → 이미지 → 숫자 탭(가로) → 텍스트 순서, 가운데 정렬입니다. 이미지는 화면 폭 끝까지(full-bleed) 높이 258px이고, 768px 폭 기준 가운데를 잘라 보여 줍니다.
  - 태블릿(768px 이상 1024px 미만): 같은 순서입니다. 이미지는 화면 폭 끝까지 높이 357px입니다.
  - 데스크톱(1024px 이상): 오른쪽 정렬된 최대 폭 1275px 영역에서 숫자 탭(세로) → 텍스트 → 이미지(높이 600px, 화면 오른쪽 끝까지) 가로 배치입니다.
- 마크업은 숫자 탭이 패널(텍스트·이미지)보다 앞에 있지만, 모바일·태블릿에서는 Figma처럼 이미지가 탭 위에 보이게 배치합니다. DOM 순서는 바꾸지 않습니다(Destination·Crew와 같은 subgrid 방식).
- "The terminology…"·이름·설명 타이포그래피를 Figma text-preset 값으로 적용합니다.
- 숫자 탭 변형(`c-tabs--numbers`)을 추가합니다.
  - 모양: 원 지름 40/56/80px, Bellefair 숫자 18/24/32px
  - 색: 선택은 white 배경에 blue-900 숫자, 비선택은 1px white 25% 테두리에 white 숫자, hover는 테두리 white
  - 그 밖에 키보드 포커스, 움직임 줄이기, 강제 색상 대응을 포함합니다.
- 320px, 가로 모드, 텍스트 200%에서 가로 넘침과 겹침이 없게 합니다.

범위 밖:
- 탭 전환 동작(사용자 요청이 SCSS 구현이며, Destination·Crew와 같이 별도 탭 스크립트 change에서 다룹니다). 비선택 탭은 hover 표시만 있고 눌러도 바뀌지 않으며, 보고서에 알려진 제한으로 기록합니다.
- 헤더·홈·Destination·Crew 변경, 마크업 텍스트·구조 변경(스타일 연결용 클래스 추가만 허용)
- `<source>`의 `width="586" height="600"` 속성과 실제 portrait 원본 크기(515×527) 차이 수정(보고서에 기록)
- Figma가 화면 크기마다 다르게 자른 비트맵을 쓰는 점. 저장소의 landscape·portrait 자산 두 장을 `object-fit: cover`로 잘라 표시하므로 잘린 범위가 Figma와 조금 다를 수 있습니다.

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `technology-page`: 기존 마크업과 화면별 이미지 자산 요구사항은 유지합니다. 다음 요구사항을 추가합니다.
  - 배경 이미지, 본문 높이
  - 화면 크기별 배치, 타이포그래피, 이미지 표시 크기·자르기
  - 숫자 탭 표시 상태(선택·hover·포커스·움직임 줄이기·강제 색상)
  - 넘침 방지

`content-tabs`의 구조·ARIA·초기 선택 요구사항은 바뀌지 않습니다.

## Impact

- `src/scss/pages/_technology.scss`(신규): 페이지 배경, 본문 배치, 패널 스타일
- `src/scss/components/_tabs.scss`: 숫자 탭 변형 `.c-tabs--numbers` 추가. 기존 공통 바탕·밑줄형·점형은 바꾸지 않습니다.
- `src/scss/style.scss`: `pages/technology` `@use` 추가
- `src/partials/technology-tabs.html`: 탭 목록에 배치용 클래스 추가만 합니다. 텍스트·ARIA·순서와 `prettier-ignore` 주석은 바꾸지 않습니다.
- 홈·Destination·Crew·헤더: 변경 없음(측정값으로 회귀 확인)
- 의존성 추가 없음
