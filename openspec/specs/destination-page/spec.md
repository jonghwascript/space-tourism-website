# destination-page Specification

## Purpose

Destination 페이지 4개(Moon, Mars, Europa, Titan)의 제목, 목적지 이미지, 설명, 거리와 이동 시간 정보를 정의해 방문자가 여행지를 비교할 수 있게 한다.

## Requirements

### Requirement: Destination 페이지 제목
Destination 페이지는 "Pick your destination"을 `<h1>`으로 SHALL 제공하며, 번호 "01"은 화면에 보이되 제목의 접근 가능한 이름에 중복되지 않게 장식으로 처리한다.

#### Scenario: 제목 이름
- **WHEN** `destination-moon.html`의 `<h1>` 접근 가능한 이름을 확인한다
- **THEN** "Pick your destination"이다

### Requirement: 목적지 패널 내용
각 목적지 패널은 목적지 이미지, 목적지 이름 `<h2>`, 설명 문단, 그리고 "Avg. distance"와 "Est. travel time"을 용어-값 쌍으로 묶은 목록을 SHALL 이 순서로 가진다. 텍스트는 starter 페이지 및 `data.json`과 일치한다.

#### Scenario: Moon 패널
- **WHEN** Moon 패널을 확인한다
- **THEN** `<h2>`가 "Moon"이고, 거리 값 "384,400 km"와 이동 시간 값 "3 days"가 각 용어와 짝지어져 있다

#### Scenario: 제목 계층
- **WHEN** 페이지의 제목 단계를 순서대로 나열한다
- **THEN** `<h1>` 다음에 패널별 `<h2>`가 오고 단계를 건너뛰지 않는다

### Requirement: 목적지 이미지
각 패널 이미지는 제공 자산의 webp를 우선하고 png로 대체하는 형태로 SHALL 제공되며, 목적지의 모습을 보여 주는 정보 이미지이므로 행성·위성을 설명하는 `alt`를 가진다. `width`·`height`는 표시 크기 기준이다.

#### Scenario: 이미지 자산
- **WHEN** Europa 패널의 이미지 소스를 확인한다
- **THEN** `./images/destination/image-europa.webp`와 `./images/destination/image-europa.png`를 참조하고 `alt`가 비어 있지 않다

#### Scenario: 이미지 로드
- **WHEN** Chromium에서 4개 Destination 페이지를 연다
- **THEN** 표시 중인 패널 이미지의 `naturalWidth`가 0보다 크고 콘솔에 404 오류가 없다

### Requirement: Destination 배경 이미지
Destination 페이지는 화면 크기에 맞는 배경 이미지를 SHALL 표시한다. 768px 미만은 mobile, 768px 이상 1024px 미만은 tablet, 1024px 이상은 desktop 이미지를 쓰며, 이미지는 비율을 유지한 채 화면 전체를 덮는다. 이미지를 불러오기 전과 실패 시에는 배경색 `#0B0D17`이 보인다.

#### Scenario: 분기점별 이미지
- **WHEN** `destination-moon.html`을 375px, 767px, 768px, 1023px, 1024px, 1440px로 열고 배경 이미지 URL을 확인한다
- **THEN** 375·767px은 `background-destination-mobile.jpg`, 768·1023px은 `background-destination-tablet.jpg`, 1024·1440px은 `background-destination-desktop.jpg`이며 요청이 성공한다

#### Scenario: 이미지 실패
- **WHEN** 배경 이미지 요청을 차단하고 페이지를 연다
- **THEN** 배경이 `rgb(11, 13, 23)`이고 모든 텍스트가 읽힌다

#### Scenario: 다른 페이지 영향 없음
- **WHEN** 홈과 Crew·Technology 페이지의 `body` 배경 이미지를 변경 전과 비교한다
- **THEN** 값이 바뀌지 않는다

### Requirement: Destination 본문 높이
Destination 본문은 헤더 아래 남은 화면 높이를 최소한으로 SHALL 채우며, 내용이 더 길면 페이지가 세로로 늘어나 잘리지 않는다.

#### Scenario: 데스크톱 최소 높이
- **WHEN** 1440×1024(Figma 프레임)에서 헤더와 `<main>`의 높이를 측정한다
- **THEN** 두 높이의 합이 1024px 이상이고 세로 스크롤이 생기지 않는다

#### Scenario: 낮은 화면
- **WHEN** 667×375(가로 모드)에서 페이지를 연다
- **THEN** 제목·이미지·탭·패널 텍스트가 겹치지 않고 페이지 스크롤로 모두 닿을 수 있다

### Requirement: 페이지 제목 표시
페이지 제목은 번호 "01"과 "Pick your destination"을 한 줄로 Barlow Condensed·대문자·white로 SHALL 표시한다. 번호는 굵기 700, white 25% 투명도다. 글자 크기와 자간은 모바일·태블릿·데스크톱 순으로 16/20/28px, 2.4/3/4px이다. 제목은 모바일에서 가운데, 태블릿·데스크톱에서 본문 영역 왼쪽 끝에 맞춘다.

#### Scenario: 화면별 제목
- **WHEN** 375px, 768px, 1440px에서 제목 텍스트와 번호의 computed style과 위치를 확인한다
- **THEN** 글자 크기·자간·서체가 위 값과 같고, 375px에서는 제목의 가로 중심이 화면 중심과 1px 이내, 768px에서는 왼쪽 끝이 화면 왼쪽에서 40px, 1440px에서는 165px이다

#### Scenario: 제목 이름 유지
- **WHEN** 스타일 적용 후 접근성 트리에서 `<h1>` 이름을 확인한다
- **THEN** 이름이 여전히 "Pick your destination"이고 "01"이 포함되지 않는다

### Requirement: 모바일 Destination 배치
768px 미만에서 본문은 패딩 24px 안에 제목, 목적지 이미지(150×150), 탭, 목적지 이름·설명, 구분선, 통계를 이 순서로 위에서 아래로 SHALL 보여 주며 모두 가로 가운데 정렬이다. 통계 두 항목은 세로로 쌓이고 간격은 24px이다. 탭 목록은 DOM에서 패널보다 앞에 있지만 화면에서는 이미지 아래에 온다.

#### Scenario: 375px 순서
- **WHEN** viewport 375×812에서 각 요소의 위치를 측정한다
- **THEN** 위 끝 좌표가 제목 < 이미지 < 탭 < 이름 < 설명 < 구분선 < 거리 통계 < 이동 시간 통계 순이고, 이미지가 150×150이며 가로 중심이 화면 중심과 1px 이내다

#### Scenario: 분기점 직전
- **WHEN** viewport 767px에서 같은 측정을 한다
- **THEN** 모바일 배치가 적용되고 텍스트 묶음 폭이 514px 이하이며 가로 넘침이 없다

### Requirement: 태블릿 Destination 배치
768px 이상 1024px 미만에서 본문은 패딩 40px 안에 모바일과 같은 순서로 요소를 SHALL 쌓는다. 이미지는 300×300으로 가운데, 탭·이름·설명·구분선·통계 묶음은 최대 폭 514px으로 가운데 정렬이며, 통계 두 항목은 같은 폭의 2열(간격 24px)로 나란히 놓인다.

#### Scenario: 768px 배치
- **WHEN** viewport 768×1024에서 본문을 측정한다
- **THEN** 이미지가 300×300이고 가운데에 있으며, 텍스트 묶음 폭이 514px 이하이고 가운데에 있고, 두 통계 항목의 위 끝이 같으며 각 항목 글자가 가운데 정렬이다

#### Scenario: 분기점 직전
- **WHEN** viewport 1023px에서 같은 측정을 한다
- **THEN** 태블릿 배치가 적용된다

### Requirement: 데스크톱 Destination 배치
1024px 이상에서 본문은 가운데 정렬된 최대 폭 1110px 영역(좌우 최소 여백 40px, 위아래 패딩 48px) 안에 제목을 위에, 그 아래 같은 폭 2열(간격 32px)을 SHALL 둔다. 왼쪽 열 가운데에 이미지(480×480), 오른쪽 열 가운데에 폭 445px 묶음(탭·이름·설명·구분선·통계, 왼쪽 정렬)이 오고, 두 열은 서로 세로 가운데를 맞춘다. 통계는 같은 폭 2열(간격 24px)이다.

#### Scenario: 1440px 배치
- **WHEN** viewport 1440×1024에서 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 가운데에 있으며, 이미지가 480×480으로 왼쪽 끝이 화면 왼쪽에서 195px(±2px), 텍스트 묶음 폭이 445px이고 왼쪽 끝이 783px(±2px)이며, 이미지와 텍스트 묶음의 세로 중심이 2px 이내로 같다

#### Scenario: 분기점 직후
- **WHEN** viewport 1024px에서 같은 측정을 한다
- **THEN** 2열 배치가 적용되고 영역 좌우 여백이 각각 40px이며, 이미지와 텍스트가 겹치지 않고 가로 넘침이 없다

#### Scenario: 넓은 화면
- **WHEN** viewport 1920×1080에서 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 좌우 여백이 같다

### Requirement: 목적지 패널 타이포그래피
패널 텍스트는 Figma 서체 값을 SHALL 따른다. 이름은 Bellefair·대문자·white(56/80/96px), 설명은 Barlow·blue-300·줄 간격 180%(15/16/18px), 통계 라벨은 Barlow Condensed 14px·자간 2px·대문자·blue-300, 통계 값은 Bellefair 28px·대문자·white다. 괄호 안 크기는 모바일·태블릿·데스크톱 순이다. 설명과 통계 사이에는 1px white 25% 구분선이 있다.

#### Scenario: 화면별 글자
- **WHEN** 375px, 768px, 1440px에서 Moon 패널 텍스트의 computed `font-size`·`font-family`·`color`·`text-transform`을 확인한다
- **THEN** 위 값과 일치한다

#### Scenario: 구분선
- **WHEN** 1440px에서 설명과 통계 사이를 확인한다
- **THEN** 높이 1px, 색 `rgba(255, 255, 255, 0.25)`인 선이 텍스트 묶음 폭 전체에 있다

#### Scenario: 이름 유지
- **WHEN** 접근성 트리에서 Moon 패널 `<h2>` 이름과 통계 값 텍스트를 확인한다
- **THEN** 이름이 "Moon", 값이 "384,400 km"로 마크업 원문과 같다

### Requirement: 목적지 이미지 표시 크기
목적지 이미지는 모바일 150px, 태블릿 300px, 데스크톱 480px 정사각형으로 SHALL 표시되고 비율이 바뀌지 않는다. 화면이나 열이 그보다 좁으면 폭에 맞춰 줄어든다.

#### Scenario: 4개 패널 공통
- **WHEN** 1440px에서 4개 Destination 페이지를 각각 열고 표시 중인 이미지 상자를 측정한다
- **THEN** 모두 480×480이고 `naturalWidth`가 0보다 크다

### Requirement: 숨긴 패널 유지
스타일 적용 후에도 `hidden` 속성이 있는 패널은 화면과 보조 기술에서 SHALL 숨겨지며, 페이지마다 패널 하나만 보인다.

#### Scenario: 패널 하나만 표시
- **WHEN** 375px, 768px, 1440px에서 `destination-europa.html`의 4개 패널 computed `display`를 확인한다
- **THEN** Europa 패널만 `none`이 아니고 나머지 3개는 `none`이다

### Requirement: 탭 표시 상태
밑줄형 탭은 Barlow Condensed·대문자로, 글자 크기·자간은 모바일 14px·2.1px, 태블릿 이상 16px·2px이고 탭 사이 간격은 32px이다. 선택된 탭은 white 글자와 아래 3px white 표시선을, 비선택 탭은 blue-300 글자에 표시선 없이 SHALL 보인다. 표시선은 글자 아래 8px에 있고 탭 위치·크기를 바꾸지 않는다. 모바일·태블릿은 탭 묶음이 가운데, 데스크톱은 왼쪽 정렬이다.

#### Scenario: 선택 상태
- **WHEN** `destination-mars.html`을 1440px로 열고 탭을 확인한다
- **THEN** "Mars" 탭만 글자가 white이고 아래 3px white 표시선이 있으며, 다른 탭은 `rgb(208, 214, 249)` 글자에 표시선이 보이지 않는다

#### Scenario: 탭 높이
- **WHEN** 375px, 768px, 1440px에서 탭 4개의 상자를 측정한다
- **THEN** 높이가 모두 같고 한 줄에 놓이며 탭 사이 간격이 32px이다

### Requirement: 탭 hover 상태
마우스를 올릴 수 있는 환경에서 비선택 탭에 포인터를 올리면 아래 3px white 50% 표시선이 SHALL 나타나며, 탭과 주변 요소의 크기·위치가 바뀌지 않는다. 선택된 탭은 hover 시에도 white 표시선을 유지한다.

#### Scenario: 비선택 탭 hover
- **WHEN** `destination-moon.html` 1440px에서 "Titan" 탭에 마우스를 올린다
- **THEN** 아래 표시선이 `rgba(255, 255, 255, 0.5)`로 보이고 탭 상자와 패널 위치가 바뀌지 않는다

#### Scenario: 터치 환경
- **WHEN** hover를 지원하지 않는 환경(`hover: none`)으로 375px 페이지를 열고 탭을 누른다
- **THEN** hover 표시선이 남지 않는다

### Requirement: 탭 포커스 표시
선택된 탭과 패널은 키보드 포커스 시 배경과 3:1 이상 대비되는 표시를 SHALL 보이며, 표시가 잘리거나 다른 요소에 가려지지 않는다.

#### Scenario: Tab으로 이동
- **WHEN** 375px, 768px, 1440px에서 헤더 다음으로 Tab을 눌러 탭 그룹과 패널로 이동한다
- **THEN** 선택된 탭 하나에 포커스가 가고 white outline 네 변이 보이며, 다음 Tab에서 보이는 패널에 포커스가 가고 outline이 보인다

### Requirement: 탭 전환 미지원 표시
이 변경은 탭 전환 동작을 SHALL NOT 추가한다. 비선택 탭을 실행해도 페이지 오류가 생기지 않고 현재 패널이 유지되며, 이 제한을 보고서에 기록한다.

#### Scenario: 비선택 탭 클릭
- **WHEN** `destination-moon.html`에서 "Mars" 탭을 클릭한다
- **THEN** Moon 패널이 그대로 보이고 콘솔 오류가 없으며, `git diff --stat src/js`에 변경이 없다

### Requirement: Destination 움직임 줄이기
탭의 상태 전환 애니메이션은 사용자가 움직임 줄이기를 설정하면 SHALL 비활성화된다.

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 페이지를 열고 탭의 computed style을 확인한다
- **THEN** `transition-duration`이 0초다

### Requirement: Destination 강제 색상 모드
강제 색상(고대비) 모드에서 선택된 탭의 표시선이 SHALL 시스템 색으로 보이고, 비선택 탭과 구분된다. 설명–통계 구분선도 보인다.

#### Scenario: forced colors
- **WHEN** `forced-colors: active`로 375px과 1440px의 `destination-moon.html`을 연다
- **THEN** "Moon" 탭 표시선이 배경과 다른 시스템 색으로 보이고 다른 탭에는 표시선이 보이지 않으며, 구분선이 배경과 다른 색이다

### Requirement: Destination 넘침 방지
Destination 페이지는 320px 이상 모든 폭과 텍스트 200% 확대에서 가로로 SHALL 넘치지 않으며, 텍스트·이미지·탭이 서로 겹치지 않는다.

#### Scenario: 좁은 화면
- **WHEN** viewport 320px에서 4개 Destination 페이지를 연다
- **THEN** `document.documentElement.scrollWidth`가 320 이하이고 탭 4개와 목적지 이름이 화면 안에 있다

#### Scenario: 텍스트 200%
- **WHEN** 루트 글꼴 크기를 200%로 키우고 375×812와 1440×900에서 페이지를 연다
- **THEN** 가로 넘침이 없고, 요소가 겹치지 않으며 세로 스크롤로 모두 닿을 수 있다

#### Scenario: 분기점 경계
- **WHEN** 767, 768, 1023, 1024px에서 페이지를 연다
- **THEN** 각 폭에서 가로 넘침과 요소 겹침이 없다
