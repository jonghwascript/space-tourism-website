# technology-page Specification

## Purpose

Technology 페이지 3개(Launch vehicle, Spaceport, Space capsule)의 제목, 용어 소개, 설명, 화면 방향에 맞는 이미지를 정의해 방문자가 우주 발사 기술 용어를 익힐 수 있게 한다.

## Requirements

### Requirement: Technology 페이지 제목
Technology 페이지는 "Space launch 101"을 `<h1>`으로 SHALL 제공하며, 번호 "03"은 장식으로 처리해 제목 이름에 중복되지 않게 한다.

#### Scenario: 제목 이름
- **WHEN** `technology-vehicle.html`의 `<h1>` 접근 가능한 이름을 확인한다
- **THEN** "Space launch 101"이다

### Requirement: 기술 패널 내용
각 기술 패널은 "The terminology…" 소개 문구, 기술 이름 `<h2>`, 설명 문단, 이미지를 SHALL 가지며, 소개 문구는 이름보다 먼저 읽힌다. 텍스트는 starter 페이지 및 `data.json`과 일치한다.

#### Scenario: Spaceport 패널
- **WHEN** Spaceport 패널을 확인한다
- **THEN** 소개 문구 다음에 `<h2>` "Spaceport"가 오고 설명이 starter 원문과 같다

### Requirement: 화면별 기술 이미지
각 패널 이미지는 데스크톱 분기점 이상에서 portrait 자산을, 그 미만에서 landscape 자산을 SHALL 표시하며, 분기점은 SCSS의 desktop 분기점과 같은 값을 사용한다. 이미지는 기술을 설명하는 `alt`와 표시 크기 기준 `width`·`height`를 가진다.

#### Scenario: 데스크톱 이미지
- **WHEN** Chromium viewport 1440px에서 `technology-capsule.html`을 연다
- **THEN** 표시 이미지의 `currentSrc`가 `image-space-capsule-portrait.jpg`이다

#### Scenario: 모바일 이미지
- **WHEN** Chromium viewport 375px에서 같은 페이지를 연다
- **THEN** 표시 이미지의 `currentSrc`가 `image-space-capsule-landscape.jpg`이다

#### Scenario: 분기점 경계
- **WHEN** viewport 1023px과 1024px에서 각각 확인한다
- **THEN** 1023px은 landscape, 1024px은 portrait 자산을 표시한다

### Requirement: Technology 배경 이미지
Technology 페이지는 화면 크기에 맞는 배경 이미지를 SHALL 표시한다. 768px 미만은 mobile, 768px 이상 1024px 미만은 tablet, 1024px 이상은 desktop 이미지를 쓰며, 이미지는 비율을 유지한 채 화면 전체를 덮는다. 이미지를 불러오기 전과 실패 시에는 배경색 `#0B0D17`이 보인다.

#### Scenario: 분기점별 이미지
- **WHEN** `technology-vehicle.html`을 375px, 767px, 768px, 1023px, 1024px, 1440px로 열고 배경 이미지 URL을 확인한다
- **THEN** 375·767px은 `background-technology-mobile.jpg`, 768·1023px은 `background-technology-tablet.jpg`, 1024·1440px은 `background-technology-desktop.jpg`이며 요청이 성공한다

#### Scenario: 이미지 실패
- **WHEN** 배경 이미지 요청을 차단하고 페이지를 연다
- **THEN** 배경이 `rgb(11, 13, 23)`이고 모든 텍스트가 읽힌다

#### Scenario: 다른 페이지 영향 없음
- **WHEN** 홈·Destination·Crew 페이지의 `body` 배경 이미지와 본문 측정값을 변경 전과 비교한다
- **THEN** 값이 바뀌지 않는다

### Requirement: Technology 본문 높이
Technology 본문은 헤더 아래 남은 화면 높이를 최소한으로 SHALL 채우며, 내용이 더 길면 페이지가 세로로 늘어나 잘리지 않는다.

#### Scenario: 데스크톱 최소 높이
- **WHEN** 1440×1024(Figma 프레임)에서 헤더와 `<main>`의 높이를 측정한다
- **THEN** 두 높이의 합이 1024px 이상이고 세로 스크롤이 생기지 않는다

#### Scenario: 낮은 화면
- **WHEN** 667×375(가로 모드)에서 페이지를 연다
- **THEN** 제목·이미지·숫자 탭·텍스트가 겹치지 않고 페이지 스크롤로 모두 닿을 수 있다

### Requirement: 모바일 Technology 배치
768px 미만에서 본문은 제목, 이미지, 숫자 탭, 텍스트 묶음을 이 순서로 위에서 아래로 SHALL 보여 준다.
- 본문 패딩: 위 24px·좌우 24px·아래 48px
- 정렬: 제목·숫자 탭·텍스트는 가로 가운데. 텍스트 묶음 최대 폭 514px
- 이미지: 본문 패딩을 넘어 화면 왼쪽 끝부터 오른쪽 끝까지 채운다
- 간격: 제목–이미지 88px(24 + 위 패딩 64), 이미지–숫자 탭 32px, 숫자 탭–텍스트 40px

숫자 탭 목록은 DOM에서 패널보다 앞에 있지만 화면에서는 이미지 아래에 온다.

#### Scenario: 375px 순서
- **WHEN** viewport 375×812에서 각 요소의 위치를 측정한다
- **THEN** 위 끝 좌표가 제목 < 이미지 < 숫자 탭 < 소개 문구 < 이름 < 설명 순이고, 이미지 상자의 왼쪽 끝이 0·오른쪽 끝이 375이며, 숫자 탭·텍스트의 가로 중심이 화면 중심과 1px 이내다

#### Scenario: 분기점 직전
- **WHEN** viewport 767px에서 같은 측정을 한다
- **THEN** 모바일 배치가 적용되고 이미지가 화면 폭 전체를 채우며 가로 넘침이 없다

### Requirement: 태블릿 Technology 배치
768px 이상 1024px 미만에서 본문은 패딩 40px 안에 모바일과 같은 순서로 요소를 SHALL 쌓는다. 텍스트 묶음은 최대 폭 512px로 가운데 정렬이고, 이미지는 화면 폭 전체를 채운다.

#### Scenario: 768px 배치
- **WHEN** viewport 768×1024에서 본문을 측정한다
- **THEN** 제목 왼쪽 끝이 화면 왼쪽에서 40px이고, 이미지 상자가 0~768px을 채우며, 텍스트 묶음 폭이 512px 이하로 가운데에 있다

#### Scenario: 분기점 직전
- **WHEN** viewport 1023px에서 같은 측정을 한다
- **THEN** 태블릿 배치가 적용되고 이미지가 0~1023px을 채운다

### Requirement: 데스크톱 Technology 배치
1024px 이상에서 본문은 화면 오른쪽에 붙은 최대 폭 1275px 영역(왼쪽 최소 여백 40px, 위아래 패딩 48px) 안에 제목을 위에 SHALL 둔다. 그 아래 한 줄에 다음을 놓는다.
- 숫자 탭: 세로 묶음
- 텍스트 묶음: 왼쪽 정렬, 폭 491px 이상
- 이미지: 남은 폭을 채우고 화면 오른쪽 끝에 닿는다

간격은 숫자 탭–텍스트 64px, 텍스트–이미지 32px이며, 세 요소는 서로 세로 가운데를 맞춘다.

#### Scenario: 1440px 배치
- **WHEN** viewport 1440×1024에서 본문을 측정한다
- **THEN** 다음 값이 모두 맞는다(±2px)
  - 제목과 숫자 탭의 왼쪽 끝이 165px
  - 텍스트 묶음 왼쪽 끝이 309px(165 + 80 + 64), 폭 491px
  - 이미지가 x 832~1440px(폭 608), 높이 600px
  - 숫자 탭 묶음·텍스트 묶음·이미지의 세로 중심이 서로 2px 이내

#### Scenario: 분기점 직후
- **WHEN** viewport 1024px에서 같은 측정을 한다
- **THEN** 가로 배치가 적용되고 영역 왼쪽 여백이 40px이며, 텍스트 묶음 폭이 491px 이상이고 요소가 겹치지 않으며 가로 넘침이 없다

#### Scenario: 넓은 화면
- **WHEN** viewport 1920×1080에서 본문을 측정한다
- **THEN** 영역 폭이 1275px이고 오른쪽 끝이 1920px이며, 이미지 오른쪽 끝이 화면 오른쪽 끝과 같다

### Requirement: 기술 텍스트 타이포그래피
패널 텍스트는 Figma 서체 값을 SHALL 따른다. 크기와 간격은 모바일·태블릿·데스크톱 순이다.
- "The terminology…": Bellefair·대문자·white 50%, 18/24/32px
- 이름: Bellefair·대문자·white, 24/40/56px
- 소개 문구–이름 간격: 16px
- 설명: Barlow·blue-300·줄 간격 180%, 15/16/18px
- 이름 묶음–설명 간격: 16/16/24px
- 정렬: 모바일·태블릿 가운데, 데스크톱 왼쪽

#### Scenario: 화면별 글자
- **WHEN** 375px, 768px, 1440px에서 Launch vehicle 패널 텍스트의 computed `font-size`·`font-family`·`color`·`text-transform`·`text-align`과 요소 간격을 확인한다
- **THEN** 위 값과 일치한다

#### Scenario: 이름과 읽기 순서 유지
- **WHEN** 접근성 트리에서 Spaceport 패널을 확인한다
- **THEN** "The terminology…"가 `<h2>` "Spaceport"보다 먼저 오고, 이름은 마크업 원문 대소문자 그대로다

### Requirement: 기술 이미지 표시 크기
기술 이미지는 화면 크기별로 정해진 상자에 SHALL 표시되며, 상자를 비율 유지로 덮고(cover) 남는 부분은 잘린다. 상자 크기는 다음과 같다.
- 모바일: 높이 258px, 768px 폭 기준으로 가운데를 잘라 화면 폭만큼 보인다
- 태블릿: 높이 357px, 화면 폭 전체
- 데스크톱: 높이 600px, 남은 열 폭

기존 요구사항대로 1024px 이상은 portrait, 그 미만은 landscape 자산이다.

#### Scenario: 화면별 상자
- **WHEN** 375px, 768px, 1440px에서 3개 Technology 페이지의 표시 중인 이미지를 측정한다
- **THEN** 높이가 각각 258·357·600px이고, 375px의 렌더링된 이미지 폭이 768px이며 가로 중심이 화면 중심과 1px 이내이고, computed `object-fit`이 1440px에서 `cover`이며, `naturalWidth`가 0보다 크다

#### Scenario: 넘침 없음
- **WHEN** 375px과 767px에서 이미지가 화면보다 넓게 그려지는지 확인한다
- **THEN** 화면 밖 부분은 잘려 `document.documentElement.scrollWidth`가 viewport 폭 이하다

### Requirement: 숫자 탭 표시 상태
숫자 탭은 원 안의 Bellefair 숫자로 SHALL 표시된다.
- 원 지름·숫자 크기: 모바일 40px·18px, 태블릿 56px·24px, 데스크톱 80px·32px
- 선택 탭: white 배경에 blue-900 숫자
- 비선택 탭: 투명 배경에 1px `rgba(255, 255, 255, 0.25)` 테두리와 white 숫자
- 탭 묶음: 모바일·태블릿은 가로 간격 16px 가운데, 데스크톱은 세로 간격 32px

#### Scenario: 선택 상태
- **WHEN** `technology-spaceport.html`을 1440px로 열고 숫자 탭을 확인한다
- **THEN** 두 번째 탭만 배경 `rgb(255, 255, 255)`·글자 `rgb(11, 13, 23)`이고, 나머지는 배경 투명·테두리 `rgba(255, 255, 255, 0.25)`·글자 white이다

#### Scenario: 크기와 간격
- **WHEN** 375px, 768px, 1440px에서 숫자 탭 상자와 간격을 측정한다
- **THEN** 탭이 각각 40×40, 56×56, 80×80px이고 원형이며, 375·768px은 같은 y에 가로 간격 16px, 1440px은 같은 x에 세로 간격 32px이다

#### Scenario: 탭 이름 유지
- **WHEN** 접근성 트리에서 첫 번째 탭 이름을 확인한다
- **THEN** 이름이 "1"로 시작하고 "Launch vehicle"을 포함한다

### Requirement: 숫자 탭 hover 상태
마우스를 올릴 수 있는 환경에서 비선택 탭에 포인터를 올리면 테두리가 white로 SHALL 바뀌며, 탭과 주변 요소의 크기·위치가 바뀌지 않는다.

#### Scenario: 비선택 탭 hover
- **WHEN** `technology-vehicle.html` 1440px에서 두 번째 탭에 마우스를 올린다
- **THEN** 테두리 색이 `rgb(255, 255, 255)`이고 탭 상자와 패널 위치가 바뀌지 않는다

#### Scenario: 터치 환경
- **WHEN** hover를 지원하지 않는 환경(`hover: none`)으로 375px 페이지를 열고 비선택 탭을 누른다
- **THEN** hover 테두리가 남지 않는다

### Requirement: 숫자 탭 포커스 표시
선택된 숫자 탭과 패널은 키보드 포커스 시 배경과 3:1 이상 대비되는 표시를 SHALL 보이며, 표시가 잘리거나 다른 요소에 가려지지 않는다.

#### Scenario: Tab으로 이동
- **WHEN** 375px, 768px, 1440px에서 헤더 다음으로 Tab을 눌러 탭 그룹과 패널로 이동한다
- **THEN** 선택된 숫자 탭 하나에 포커스가 가고 white outline이 보이며, 다음 Tab에서 보이는 패널에 포커스가 간다

### Requirement: Technology 움직임 줄이기
숫자 탭의 상태 전환 애니메이션은 사용자가 움직임 줄이기를 설정하면 SHALL 비활성화된다.

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 페이지를 열고 숫자 탭의 computed style을 확인한다
- **THEN** `transition-duration`이 0초다

### Requirement: Technology 강제 색상 모드
강제 색상(고대비) 모드에서 숫자 탭 3개의 원 경계와 숫자가 모두 SHALL 보이고, 선택된 탭은 비선택 탭과 시스템 색으로 구분된다.

#### Scenario: forced colors
- **WHEN** `forced-colors: active`로 375px과 1440px의 `technology-vehicle.html`을 연다
- **THEN** 세 탭의 테두리가 배경과 다른 색이고 숫자가 읽히며, 첫 번째 탭만 채워진 배경(시스템 색)으로 구분된다

### Requirement: Technology 넘침 방지
Technology 페이지는 320px 이상 모든 폭과 텍스트 200% 확대에서 가로로 SHALL 넘치지 않으며, 텍스트·숫자 탭·이미지가 서로 겹치지 않는다.

#### Scenario: 좁은 화면
- **WHEN** viewport 320px에서 3개 Technology 페이지를 연다
- **THEN** `document.documentElement.scrollWidth`가 320 이하이고 이름·숫자 탭이 화면 안에 있다

#### Scenario: 텍스트 200%
- **WHEN** 루트 글꼴 크기를 200%로 키우고 375×812와 1440×900에서 페이지를 연다
- **THEN** 가로 넘침이 없고, 요소가 겹치지 않으며 세로 스크롤로 모두 닿을 수 있다

#### Scenario: 분기점 경계
- **WHEN** 767, 768, 1023, 1024px에서 페이지를 연다
- **THEN** 각 폭에서 가로 넘침과 요소 겹침이 없다
