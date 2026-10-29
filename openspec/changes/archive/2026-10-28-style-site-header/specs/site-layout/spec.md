# Spec Delta

## ADDED Requirements

### Requirement: 사이트 기본 색과 서체
모든 페이지의 `body`는 Figma 스타일 가이드의 배경색 `#0B0D17`, 글자색 white, 기본 서체 Barlow를 SHALL 사용한다. 헤더 내비게이션 글자는 Barlow Condensed를 쓴다.

#### Scenario: body 기본 스타일
- **WHEN** Chromium에서 임의의 페이지를 열고 `body`의 computed style을 확인한다
- **THEN** `background-color`가 `rgb(11, 13, 23)`, `color`가 `rgb(255, 255, 255)`, `font-family`가 Barlow로 시작한다

#### Scenario: 내비게이션 서체
- **WHEN** 헤더 내비게이션 링크의 computed style을 확인한다
- **THEN** `font-family`가 Barlow Condensed로 시작하고, 이름은 대문자로 표시되며, 번호는 굵기 700이다

### Requirement: 데스크톱 헤더 배치
1024px 이상에서 헤더는 왼쪽에 48×48 로고, 로고 오른쪽의 가는 장식선, 오른쪽에 반투명·블러 배경의 높이 96px 내비게이션 바를 SHALL 표시하고, 4개 링크를 한 줄로 배치한다. 메뉴 토글 버튼은 표시하지 않는다.

#### Scenario: 1440px 배치
- **WHEN** viewport 1440px에서 헤더를 측정한다
- **THEN** 로고는 48×48, 내비게이션 바 높이는 96px, 링크 간격은 48px이고, 장식선이 보이며 토글 버튼은 보이지 않는다

#### Scenario: 분기점 직후
- **WHEN** viewport 1024px에서 헤더를 측정한다
- **THEN** 4개 링크가 한 줄에 있고 가로 넘침이 없다

### Requirement: 태블릿 헤더 배치
768px 이상 1024px 미만에서 헤더는 장식선 없이 48×48 로고와 높이 96px 내비게이션 바를 SHALL 표시하고, 4개 링크를 한 줄로 배치한다. 메뉴 토글 버튼은 표시하지 않는다.

#### Scenario: 768px 배치
- **WHEN** viewport 768px에서 헤더를 측정한다
- **THEN** 장식선과 토글 버튼이 보이지 않고, 4개 링크가 한 줄에 있으며 가로 넘침이 없다

#### Scenario: 분기점 직전
- **WHEN** viewport 1023px에서 헤더를 측정한다
- **THEN** 태블릿 배치(장식선 없음)가 적용된다

### Requirement: 내비게이션 링크 상태
태블릿·데스크톱에서 현재 페이지 링크는 아래쪽 3px white 표시선을, hover된 비현재 링크는 50% 투명도의 white 표시선을 SHALL 가진다. 표시선 때문에 링크 위치나 높이가 바뀌지 않는다.

#### Scenario: 현재 링크
- **WHEN** `crew-pilot.html`을 1440px로 열고 "Crew" 링크를 확인한다
- **THEN** 아래 테두리가 3px solid white이고 다른 링크의 아래 테두리는 보이지 않는다

#### Scenario: hover
- **WHEN** 비현재 링크에 마우스를 올린다
- **THEN** 아래 표시선이 white 50%로 나타나고 링크의 크기와 위치는 그대로다

### Requirement: 헤더 포커스 표시
헤더의 건너뛰기 링크, 로고 링크, 메뉴 토글, 내비게이션 링크는 키보드 포커스 시 배경과 3:1 이상 대비되는 outline을 SHALL 표시하며, 포커스 표시가 내비게이션 바 등에 잘려 가려지지 않는다.

#### Scenario: 키보드 포커스
- **WHEN** 페이지에서 Tab 키로 헤더 요소를 차례로 이동한다
- **THEN** 각 요소에 white outline이 보이고 잘리지 않는다

### Requirement: 움직임 줄이기
헤더의 상태 전환 애니메이션은 사용자가 움직임 줄이기를 설정하면 SHALL 비활성화된다.

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 페이지를 열고 헤더 요소의 computed style을 확인한다
- **THEN** `transition-duration`이 0초다

### Requirement: 스크립트 없는 모바일 내비게이션
768px 미만에서 메뉴 스크립트가 헤더를 활성화하지 않은 상태라면, 헤더는 40×40 로고와 4개 내비게이션 링크를 화면 안에 SHALL 표시하고 동작하지 않는 메뉴 토글 버튼은 숨긴다. 링크는 키보드로 도달할 수 있고 가로 넘침이 없다.

#### Scenario: 375px 기본 상태
- **WHEN** viewport 375px에서 스크립트 없이 페이지를 연다
- **THEN** 로고가 40×40이고, 4개 링크가 화면 안에 보이며, 토글 버튼은 보이지 않고, 가로 넘침이 없다

#### Scenario: 320px
- **WHEN** viewport 320px에서 같은 페이지를 연다
- **THEN** 링크가 겹치거나 화면 밖으로 넘치지 않는다

### Requirement: 모바일 메뉴 열림 상태 스타일
768px 미만에서 스크립트가 헤더를 활성화하면 토글 버튼(햄버거 아이콘)만 보이고 링크 목록은 숨겨진다. 메뉴가 열린 상태로 표시되면 오른쪽에 반투명·블러 패널이 SHALL 나타나 4개 링크를 세로로 보여 주고, 토글 버튼은 닫기 아이콘으로 바뀌어 패널 위에 남는다. 현재 링크는 오른쪽 3px white 표시선을 가진다.

#### Scenario: 활성화되었지만 닫힘
- **WHEN** 375px에서 헤더에 활성화 상태를 표시한다
- **THEN** 햄버거 아이콘 버튼이 보이고 링크 목록은 보이지 않으며 보조 기술에도 노출되지 않는다

#### Scenario: 열림
- **WHEN** 같은 화면에서 메뉴 열림 상태를 표시한다
- **THEN** 화면 오른쪽에 폭 254px 이하의 패널이 링크 4개를 세로로 보여 주고, 닫기 아이콘 버튼이 패널 위에 보인다

#### Scenario: 태블릿 이상에서는 무시
- **WHEN** 768px 이상에서 같은 상태를 표시한다
- **THEN** 태블릿·데스크톱 배치가 그대로 유지된다
