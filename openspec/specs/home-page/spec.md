# home-page Specification

## Purpose

홈 페이지(`index.html`)의 히어로 콘텐츠와 Explore 링크를 정의해 방문자가 사이트 소개를 읽고 목적지 탐색으로 이동할 수 있게 한다.

## Requirements

### Requirement: 홈 히어로 제목
홈 페이지는 "So, you want to travel to"와 "Space"를 하나의 `<h1>`로 SHALL 제공하며, 두 부분은 CSS에서 따로 꾸밀 수 있는 별도 요소로 나뉜다.

#### Scenario: 대표 제목
- **WHEN** `index.html`의 제목 구조를 확인한다
- **THEN** `<h1>`이 하나이고 접근 가능한 이름이 "So, you want to travel to Space"이다

### Requirement: 홈 소개문
홈 페이지는 Figma 텍스트 레이어와 같은 소개 문단 하나를 `<h1>` 다음에 SHALL 제공한다.

#### Scenario: 소개문 내용
- **WHEN** `<h1>` 다음 문단을 확인한다
- **THEN** "Let’s face it; if you want to go to space"로 시작하고 "out of this world experience!"로 끝나며 starter 원문에 없는 단어가 추가되지 않았다

### Requirement: Explore 링크
홈 페이지는 "Explore" 텍스트를 가진 링크를 SHALL 제공하며, 이 링크는 Destination 그룹의 첫 페이지(`./destination-moon.html`)로 이동한다. 원형 모양은 CSS 단계에서 입힌다.

#### Scenario: Explore 이동
- **WHEN** Explore 링크에 포커스를 두고 Enter를 누른다
- **THEN** `destination-moon.html`로 이동한다

#### Scenario: 요소 종류
- **WHEN** Explore 요소를 확인한다
- **THEN** `<button>`이 아닌 `href`가 있는 `<a>`이다

### Requirement: 홈 배경 이미지
홈 페이지는 화면 크기에 맞는 배경 이미지를 SHALL 표시한다. 768px 미만은 mobile, 768px 이상 1024px 미만은 tablet, 1024px 이상은 desktop 이미지를 쓰며, 이미지는 비율을 유지한 채 화면(최소 viewport 높이) 전체를 덮는다. 이미지를 불러오기 전과 실패 시에는 배경색 `#0B0D17`이 보인다.

#### Scenario: 분기점별 이미지
- **WHEN** `index.html`을 375px, 767px, 768px, 1023px, 1024px, 1440px로 열고 배경 이미지 URL을 확인한다
- **THEN** 375·767px은 `background-home-mobile.jpg`, 768·1023px은 `background-home-tablet.jpg`, 1024·1440px은 `background-home-desktop.jpg`이며 요청이 성공한다

#### Scenario: 화면 덮기
- **WHEN** 375×812, 768×1024, 1440×900에서 페이지 하단을 확인한다
- **THEN** 배경 이미지가 viewport의 가로·세로를 빈틈 없이 덮고 늘어나 보이지 않는다

#### Scenario: 이미지 실패
- **WHEN** 배경 이미지 요청을 차단하고 페이지를 연다
- **THEN** 배경이 `rgb(11, 13, 23)`이고 글자와 Explore가 그대로 읽힌다

### Requirement: 홈 본문 높이
홈 본문은 헤더 아래 남은 화면 높이를 최소한으로 SHALL 채우며, 내용이 더 길면 페이지가 세로로 늘어나 잘리지 않는다.

#### Scenario: 최소 높이
- **WHEN** 1440×900에서 헤더와 `<main>`의 높이를 측정한다
- **THEN** 두 높이의 합이 900px 이상이고 세로 스크롤이 생기지 않는다

#### Scenario: 낮은 화면
- **WHEN** 667×375(가로 모드)에서 페이지를 연다
- **THEN** 제목·소개문·Explore가 겹치지 않고 페이지 스크롤로 모두 닿을 수 있다

### Requirement: 모바일 홈 배치
768px 미만에서 홈 본문은 텍스트 묶음을 본문 위쪽(패딩 24px 안)에 두고, Explore를 텍스트 묶음 아래 남은 공간의 세로 가운데에 SHALL 두며, 두 요소는 가로 가운데 정렬이다. 본문 패딩은 24px, 텍스트 묶음의 최대 폭은 540px, 텍스트–Explore 최소 간격은 48px이다.

#### Scenario: 375px 배치
- **WHEN** viewport 375×812에서 홈 본문을 측정한다
- **THEN** 텍스트 묶음 위 끝이 헤더 아래 끝에서 24px 아래에 있고, Explore의 세로 중심이 텍스트 묶음 아래 끝과 본문 아래 패딩 위 끝의 가운데와 1px 이내로 같으며, 제목·소개문·Explore의 가로 중심이 본문 중심과 1px 이내로 같고, 텍스트는 가운데 정렬이며 좌우 여백이 24px 이상이다

#### Scenario: 분기점 직전
- **WHEN** viewport 767px에서 같은 측정을 한다
- **THEN** 모바일 배치가 적용되고 텍스트 묶음 폭이 540px 이하다

### Requirement: 태블릿 홈 배치
768px 이상 1024px 미만에서 홈 본문은 텍스트 묶음을 위쪽 패딩 끝에, Explore를 아래쪽 패딩 끝에 SHALL 두고 둘 다 가로 가운데 정렬한다. 본문 패딩은 위아래 128px·좌우 40px, 텍스트 묶음 폭은 512px, 텍스트–Explore 최소 간격은 48px이다.

#### Scenario: 768px 배치
- **WHEN** viewport 768×1024에서 홈 본문을 측정한다
- **THEN** 텍스트 묶음 폭이 512px이고 가운데에 있으며 위 끝이 본문 위 끝에서 128px 아래에 있고, 텍스트는 가운데 정렬이며, Explore가 그 아래 가운데에 있고 아래 끝이 viewport 아래 끝에서 128px 위에 있다

#### Scenario: 분기점 직전
- **WHEN** viewport 1023px에서 같은 측정을 한다
- **THEN** 태블릿 배치가 적용된다

### Requirement: 데스크톱 홈 배치
1024px 이상에서 홈 본문은 가운데 정렬된 최대 폭 1110px 영역(좌우 최소 여백 40px) 안에 텍스트 묶음(최대 540px, 왼쪽 정렬)을 왼쪽에, Explore를 오른쪽에 가로로 SHALL 배치한다. 두 요소는 서로 세로 가운데를 맞춘 한 줄로 본문 아래쪽에 두며(더 높은 요소가 아래 패딩 끝에 닿음), 사이 간격은 48px 이상, 본문 위아래 패딩은 128px이다. 헤더가 화면 전체로 넓어져도 본문 영역은 1110px을 넘지 않는다.

#### Scenario: 1440px 배치
- **WHEN** viewport 1440×1024(Figma 프레임)와 1440×900에서 홈 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 가운데에 있으며, 텍스트 묶음이 왼쪽·Explore가 오른쪽에 있고, 두 요소의 세로 중심이 1px 이내로 같으며, 텍스트 묶음 아래 끝과 viewport 아래 끝 사이가 128px이다

#### Scenario: 분기점 직후
- **WHEN** viewport 1024px에서 같은 측정을 한다
- **THEN** 가로 배치가 적용되고 영역의 좌우 여백이 각각 40px이며, 두 요소가 겹치지 않고 가로 넘침이 없다

#### Scenario: 넓은 화면
- **WHEN** viewport 1920×1080에서 홈 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 좌우 여백이 405px로 같으며, 헤더는 기존 데스크톱 배치대로 화면 폭 전체를 쓴다

### Requirement: 홈 타이포그래피
홈 텍스트는 Figma 서체 값을 SHALL 따른다. 상단 문구는 Barlow Condensed·대문자·blue-300, "Space"는 Bellefair·대문자·white·줄 간격 100%, 소개문은 Barlow·blue-300·줄 간격 180%다. 크기는 모바일·태블릿·데스크톱 순으로 상단 문구 16/28/28px(자간 2.4/4/4px), "Space" 80/144/144px, 소개문 15/16/18px이다.

#### Scenario: 화면별 글자 크기
- **WHEN** 375px, 768px, 1440px에서 세 텍스트의 computed `font-size`·`font-family`·`letter-spacing`·`color`를 확인한다
- **THEN** 위 값과 일치하고 상단 문구와 "Space"는 대문자로 표시된다

#### Scenario: 제목 이름 유지
- **WHEN** 스타일 적용 후 접근성 트리에서 `<h1>` 이름을 확인한다
- **THEN** 이름이 여전히 "So, you want to travel to Space"이다

### Requirement: Explore 원형 링크
Explore 링크는 흰 배경 원 안에 Bellefair·대문자·blue-900 글자로 SHALL 표시된다. 원 지름과 글자 크기는 모바일 144px·18px, 태블릿·데스크톱 272px·32px이며, 원 전체가 클릭 영역이다.

#### Scenario: 화면별 원 크기
- **WHEN** 375px, 768px, 1440px에서 Explore 링크의 크기와 글자를 측정한다
- **THEN** 링크 상자가 각각 144×144, 272×272, 272×272px이고, 모서리가 원형이며, 글자가 원의 가운데에 있다

#### Scenario: 원 가장자리 클릭
- **WHEN** 1440px에서 원의 중심에서 120px 떨어진 원 안쪽 지점을 클릭한다
- **THEN** `destination-moon.html`로 이동한다

### Requirement: Explore hover 상태
마우스를 올릴 수 있는 환경에서 Explore에 포인터를 올리면 원 둘레에 white 10% halo가 SHALL 나타난다. halo는 링크의 크기·위치나 주변 배치를 바꾸지 않고 가로 넘침을 만들지 않는다. 글자색은 바탕과 4.5:1(태블릿·데스크톱의 32px 글자는 3:1) 이상 대비를 유지한다.

#### Scenario: 1440px hover
- **WHEN** 1440px에서 Explore에 마우스를 올린다
- **THEN** 원 바깥으로 폭 88px의 white 10% halo가 보이고, 링크 상자는 272×272 그대로이며 다른 요소의 위치가 바뀌지 않는다

#### Scenario: 모바일 hover
- **WHEN** 375px에서 Explore에 마우스를 올린다
- **THEN** halo가 보이고 가로 스크롤이 생기지 않으며, 글자와 흰 원의 대비가 4.5:1 이상이다

### Requirement: Explore 포커스 표시
Explore 링크는 키보드 포커스 시 배경과 3:1 이상 대비되는 표시를 원 바깥에 SHALL 보여 주며, 표시가 잘리거나 다른 요소에 가려지지 않는다.

#### Scenario: Tab으로 포커스
- **WHEN** 375px, 768px, 1440px에서 Tab으로 Explore에 포커스를 둔다
- **THEN** 원을 둘러싼 white 포커스 표시가 네 방향 모두 보이고, Enter를 누르면 `destination-moon.html`로 이동한다

### Requirement: 홈 움직임 줄이기
홈의 상태 전환 애니메이션은 사용자가 움직임 줄이기를 설정하면 SHALL 비활성화된다.

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 홈을 열고 Explore의 computed style을 확인한다
- **THEN** `transition-duration`이 0초다

### Requirement: Explore 강제 색상 모드
강제 색상(고대비) 모드에서 Explore 링크의 원 경계와 글자가 SHALL 보이며, 링크임을 시스템 색으로 구분할 수 있다.

#### Scenario: forced colors
- **WHEN** `forced-colors: active`로 375px과 1440px 홈을 연다
- **THEN** Explore 원의 경계선이 배경과 다른 시스템 색으로 보이고, "Explore" 글자가 원 안에서 읽힌다

### Requirement: 홈 넘침 방지
홈 페이지는 320px 이상 모든 폭과 텍스트 200% 확대에서 가로 SHALL 넘치지 않으며, 텍스트와 Explore가 서로 겹치지 않는다.

#### Scenario: 좁은 화면
- **WHEN** viewport 320px에서 홈을 연다
- **THEN** `document.documentElement.scrollWidth`가 320 이하이고 "Space"와 Explore가 화면 안에 있다

#### Scenario: 텍스트 200%
- **WHEN** 루트 글꼴 크기를 200%로 키우고 375×812와 1440×900에서 홈을 연다
- **THEN** 가로 넘침이 없고, 모든 텍스트와 Explore가 겹치지 않으며 세로 스크롤로 닿을 수 있다

#### Scenario: 분기점 경계
- **WHEN** 767, 768, 1023, 1024px에서 홈을 연다
- **THEN** 각 폭에서 가로 넘침과 요소 겹침이 없다
