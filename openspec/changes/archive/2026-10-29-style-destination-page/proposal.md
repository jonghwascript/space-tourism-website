# Proposal

## Why

Destination 페이지 4개(`destination-{moon,mars,europa,titan}.html`)는 마크업만 있고 `c-page--destination`, `c-page-title`, `c-tabs`, `c-destination`에 스타일이 없어 기본 서체로 쌓인 글자와 원본 크기(445px) 이미지만 보인다. 헤더와 홈은 768px·1024px 분기점으로 모바일·태블릿·데스크톱 배치를 마쳤으므로, 다음 화면인 Destination을 같은 분기점과 Figma 값(모바일 91:1358, 태블릿 49:1019, 데스크톱 9:2089, hover 99:1739)으로 맞춘다. README의 "기기 화면 크기에 맞는 최적 레이아웃"과 "모든 인터랙티브 요소의 hover 상태" 요구도 여기에 해당한다.

## What Changes

- Destination 페이지에 화면 크기별 배경 이미지(`background-destination-{mobile,tablet,desktop}.jpg`)를 채우고, 본문이 헤더 아래 남은 화면 높이를 최소한으로 채우게 한다.
- 페이지 제목("01 Pick your destination")을 Barlow Condensed 대문자로 표시한다. 모바일은 가운데, 태블릿·데스크톱은 왼쪽 정렬이다.
- 화면 크기별 본문 배치를 적용한다.
  - 모바일(768px 미만): 세로·가운데, 패딩 24px, 이미지 150px, 통계 세로 쌓기
  - 태블릿(768px 이상 1024px 미만): 세로·가운데, 패딩 40px, 이미지 300px, 텍스트 최대 514px, 통계 2열
  - 데스크톱(1024px 이상): 최대 폭 1110px 안에서 이미지(480px) 왼쪽 열·텍스트(445px) 오른쪽 열, 통계 2열 왼쪽 정렬
- 마크업에서 탭 목록이 패널(이미지 포함)보다 앞에 있지만, 화면에서는 Figma처럼 이미지 다음에 탭이 보이게 배치한다. DOM 순서는 바꾸지 않는다.
- 탭(밑줄형)의 선택·비선택 글자색, 선택 표시선, hover 표시선(white 50%), 키보드 포커스 표시, 움직임 줄이기·강제 색상 대응을 추가한다.
- 목적지 이름·설명·구분선·통계 라벨/값 타이포그래피를 Figma text-preset 값으로 적용한다.
- 320px, 가로 모드, 텍스트 200%에서 가로 넘침과 겹침이 없게 한다.

범위 밖:
- 탭 전환 JavaScript(사용자 결정: 이번에는 스타일만). 비선택 탭을 눌러도 패널이 바뀌지 않는 현재 상태는 그대로이며, 보고서에 알려진 제한으로 기록한다.
- 헤더·홈 변경, 마크업 텍스트·구조 변경(스타일 연결에 필요한 클래스 추가만 허용).
- Crew·Technology 본문 스타일. 단, 페이지 제목은 세 페이지가 같은 컴포넌트(`c-page-title`)를 쓰므로 Crew·Technology 제목에도 같은 스타일이 적용된다(의도된 영향, 회귀 캡처로 확인).

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `destination-page`: 기존 마크업 요구사항은 유지하고, 배경 이미지, 본문 높이, 화면 크기별 배치, 페이지 제목·패널 타이포그래피, 이미지 크기, 탭 표시 상태(선택·hover·포커스·움직임 줄이기·강제 색상), 넘침 방지 요구사항을 추가한다.

`content-tabs`의 구조·ARIA·초기 선택 요구사항은 바뀌지 않는다(탭 목록이 DOM에서 패널보다 앞에 있는 규칙도 유지).

## Impact

- `src/scss/pages/_destination.scss`(신규): 페이지 배경·본문 배치·패널 스타일
- `src/scss/components/_page-title.scss`(신규): 페이지 제목 공통 스타일(Destination·Crew·Technology)
- `src/scss/components/_tabs.scss`(신규): 탭 공통 바탕과 밑줄형(`c-tabs--underline`) 스타일
- `src/scss/style.scss`: 위 모듈 `@use` 추가
- `src/scss/base/_reset.scss` 또는 해당 컴포넌트: `display`를 지정한 패널에서도 `hidden` 속성이 유지되도록 하는 규칙
- `src/partials/destination-tabs.html`: 필요한 경우 클래스 추가만. 텍스트·ARIA·순서는 바꾸지 않는다
- 홈·헤더: 변경 없음(회귀 캡처로 확인). Crew·Technology: 제목 스타일이 바뀌고, 공통 탭 바탕(`.c-tabs__tab`의 blue-300·선택 white·대문자)이 함께 적용된다. 화면에 보이는 차이는 Technology 숫자 탭 글자색뿐이다(이전에는 버튼 기본 검정이라 거의 보이지 않았음). Crew 점 탭은 글자가 숨김 텍스트라 화면 변화가 없다(구현 중 확인 후 반영)
- 의존성 추가 없음
