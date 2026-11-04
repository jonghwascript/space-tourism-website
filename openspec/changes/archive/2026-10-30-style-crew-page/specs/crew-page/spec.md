# Spec Delta

## ADDED Requirements

### Requirement: Crew 배경 이미지
Crew 페이지는 화면 크기에 맞는 배경 이미지를 SHALL 표시한다. 768px 미만은 mobile, 768px 이상 1024px 미만은 tablet, 1024px 이상은 desktop 이미지를 쓰며, 이미지는 비율을 유지한 채 화면 전체를 덮는다. 이미지를 불러오기 전과 실패 시에는 배경색 `#0B0D17`이 보인다.

#### Scenario: 분기점별 이미지
- **WHEN** `crew-commander.html`을 375px, 767px, 768px, 1023px, 1024px, 1440px로 열고 배경 이미지 URL을 확인한다
- **THEN** 375·767px은 `background-crew-mobile.jpg`, 768·1023px은 `background-crew-tablet.jpg`, 1024·1440px은 `background-crew-desktop.jpg`이며 요청이 성공한다

#### Scenario: 이미지 실패
- **WHEN** 배경 이미지 요청을 차단하고 페이지를 연다
- **THEN** 배경이 `rgb(11, 13, 23)`이고 모든 텍스트가 읽힌다

#### Scenario: 다른 페이지 영향 없음
- **WHEN** 홈·Destination·Technology 페이지의 `body` 배경 이미지와 본문 측정값을 변경 전과 비교한다
- **THEN** 값이 바뀌지 않는다

### Requirement: Crew 본문 높이
Crew 본문은 헤더 아래 남은 화면 높이를 최소한으로 SHALL 채우며, 내용이 더 길면 페이지가 세로로 늘어나 잘리지 않는다.

#### Scenario: 데스크톱 최소 높이
- **WHEN** 1440×1024(Figma 프레임)에서 헤더와 `<main>`의 높이를 측정한다
- **THEN** 두 높이의 합이 1024px 이상이고 세로 스크롤이 생기지 않는다

#### Scenario: 낮은 화면
- **WHEN** 667×375(가로 모드)에서 페이지를 연다
- **THEN** 제목·텍스트·점 탭·사진이 겹치지 않고 페이지 스크롤로 모두 닿을 수 있다

### Requirement: 모바일 Crew 배치
768px 미만에서 본문은 패딩 24px 안에 제목, 역할·이름·소개 묶음, 점 탭, 사진을 이 순서로 위에서 아래로 SHALL 보여 주며 모두 가로 가운데 정렬이다. 텍스트 묶음 최대 폭은 514px이다. 간격은 제목–텍스트 64px(24 + 위 패딩 40), 텍스트–점 탭 24px, 점 탭–사진 32px 이상이다. 점 탭 목록은 DOM에서 패널보다 앞에 있지만 화면에서는 텍스트 아래에 온다.

#### Scenario: 375px 순서
- **WHEN** viewport 375×812에서 각 요소의 위치를 측정한다
- **THEN** 위 끝 좌표가 제목 < 역할 < 이름 < 소개 < 점 탭 < 사진 순이고, 텍스트와 점 탭과 사진의 가로 중심이 화면 중심과 1px 이내이며, 텍스트는 가운데 정렬이다

#### Scenario: 분기점 직전
- **WHEN** viewport 767px에서 같은 측정을 한다
- **THEN** 모바일 배치가 적용되고 텍스트 묶음 폭이 514px 이하이며 가로 넘침이 없다

### Requirement: 태블릿 Crew 배치
768px 이상 1024px 미만에서 본문은 패딩 40px 안에 모바일과 같은 순서로 요소를 SHALL 쌓는다. 텍스트 묶음은 최대 폭 512px로 가운데 정렬이고, 점 탭과 사진도 가로 가운데에 놓인다.

#### Scenario: 768px 배치
- **WHEN** viewport 768×1024에서 본문을 측정한다
- **THEN** 제목 왼쪽 끝이 화면 왼쪽에서 40px이고, 텍스트 묶음 폭이 512px 이하로 가운데에 있으며, 점 탭·사진의 가로 중심이 화면 중심과 1px 이내다

#### Scenario: 분기점 직전
- **WHEN** viewport 1023px에서 같은 측정을 한다
- **THEN** 태블릿 배치가 적용된다

### Requirement: 데스크톱 Crew 배치
1024px 이상에서 본문은 가운데 정렬된 최대 폭 1110px 영역(좌우 최소 여백 40px, 위아래 패딩 48px) 안에 제목을 위에, 그 아래 같은 폭 2열(간격 32px)을 SHALL 둔다. 왼쪽 열에는 왼쪽 정렬된 텍스트 묶음이 남은 높이의 세로 가운데에, 점 탭이 열 아래쪽(아래 여백 48px)에 오고, 오른쪽 열에는 사진이 세로 가운데에 온다.

#### Scenario: 1440px 배치
- **WHEN** viewport 1440×1024에서 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 가운데에 있으며, 텍스트 묶음 왼쪽 끝이 165px(±2px)이고 왼쪽 정렬이며, 점 탭 왼쪽 끝이 텍스트 왼쪽 끝과 2px 이내로 같고(점 탭 버튼 기준), 마지막 줄 점의 아래 끝이 `<main>` 아래 패딩 위 끝보다 48px(±2px) 위에 있으며, 사진이 오른쪽 열(x 736px 이상) 안에 있다

#### Scenario: 분기점 직후
- **WHEN** viewport 1024px에서 같은 측정을 한다
- **THEN** 2열 배치가 적용되고 영역 좌우 여백이 각각 40px이며, 텍스트와 사진이 겹치지 않고 가로 넘침이 없다

#### Scenario: 넓은 화면
- **WHEN** viewport 1920×1080에서 본문을 측정한다
- **THEN** 영역 폭이 1110px이고 좌우 여백이 같다

### Requirement: 승무원 텍스트 타이포그래피
패널 텍스트는 Figma 서체 값을 SHALL 따른다. 크기는 모바일·태블릿·데스크톱 순이다.
- 역할: Bellefair·대문자·white 50%, 18/24/32px
- 이름: Bellefair·대문자·white, 24/40/56px
- 역할–이름 간격: 8/16/16px
- 소개: Barlow·blue-300·줄 간격 180%, 15/16/18px. 이름 묶음과 24px 간격

#### Scenario: 화면별 글자
- **WHEN** 375px, 768px, 1440px에서 Douglas Hurley 패널 텍스트의 computed `font-size`·`font-family`·`color`·`opacity`·`text-transform`과 요소 간격을 확인한다
- **THEN** 위 값과 일치한다

#### Scenario: 이름과 읽기 순서 유지
- **WHEN** 접근성 트리에서 Douglas Hurley 패널을 확인한다
- **THEN** 역할 "Commander"가 `<h2>` "Douglas Hurley"보다 먼저 오고, 이름은 마크업 원문 대소문자 그대로다

### Requirement: 승무원 사진 표시
승무원 사진은 원본 비율을 유지한 채 높이 모바일 340px, 태블릿 560px, 데스크톱 676px 이하로 SHALL 표시된다. 열이나 화면이 더 좁으면 폭에 맞춰 줄어들며 아래쪽 기준으로 놓인다. 사진 아래쪽 약 23%는 위에서 아래로 투명해지는 마스크로 흐려진다.

#### Scenario: 4명 공통
- **WHEN** 375px, 768px, 1440px에서 4개 Crew 페이지의 표시 중인 사진을 측정한다
- **THEN** 높이가 각각 340·560·676px 이하이고, 렌더링된 가로세로 비율이 원본과 1% 이내로 같으며, `naturalWidth`가 0보다 크고, 사진 상자가 화면 밖으로 넘치지 않는다

#### Scenario: 아래쪽 마스크
- **WHEN** 사진 요소의 computed `mask-image`를 확인한다
- **THEN** 위에서 아래로 불투명에서 투명으로 바뀌는 그라데이션이고, 투명해지기 시작하는 지점이 높이의 약 77%다

### Requirement: 점 탭 표시 상태
점 탭은 원형 점으로 SHALL 표시된다. 점 지름과 간격은 모바일·태블릿 10px·16px, 데스크톱 15px·40px이다. 선택된 탭은 white, 비선택 탭은 white 17.4% 점이다. 점 묶음은 모바일·태블릿에서 가운데, 데스크톱에서 왼쪽 정렬이다. 각 탭의 클릭 영역은 24×24px 이상이며, 점의 시각 크기·간격은 위 값과 같다.

#### Scenario: 선택 상태
- **WHEN** `crew-pilot.html`을 1440px로 열고 점 탭을 확인한다
- **THEN** 세 번째 점(Victor Glover)만 white이고 나머지 점은 white에 알파 0.17~0.18이다(17.4%는 8비트 알파로 0.173이 된다)

#### Scenario: 크기와 간격
- **WHEN** 375px과 1440px에서 점 4개의 지름, 인접 점 사이 간격, 탭 버튼 상자를 측정한다
- **THEN** 375px은 지름 10·간격 16px, 1440px은 지름 15·간격 40px이고, 모든 버튼 상자가 24×24px 이상이며 서로 겹치지 않는다

#### Scenario: 탭 이름 유지
- **WHEN** 접근성 트리에서 점 탭 이름을 확인한다
- **THEN** 각 이름이 승무원 이름이다

### Requirement: 점 탭 hover 상태
마우스를 올릴 수 있는 환경에서 비선택 점에 포인터를 올리면 점이 white 50%로 SHALL 밝아지며, 탭과 주변 요소의 크기·위치가 바뀌지 않는다.

#### Scenario: 비선택 점 hover
- **WHEN** `crew-commander.html` 1440px에서 두 번째 점에 마우스를 올린다
- **THEN** 점 색이 `rgba(255, 255, 255, 0.5)`이고 탭 상자와 패널 위치가 바뀌지 않는다

#### Scenario: 터치 환경
- **WHEN** hover를 지원하지 않는 환경(`hover: none`)으로 375px 페이지를 열고 비선택 점을 누른다
- **THEN** hover 색이 남지 않는다

### Requirement: 점 탭 포커스 표시
선택된 점 탭과 패널은 키보드 포커스 시 배경과 3:1 이상 대비되는 표시를 SHALL 보이며, 표시가 잘리거나 다른 요소에 가려지지 않는다.

#### Scenario: Tab으로 이동
- **WHEN** 375px, 768px, 1440px에서 헤더 다음으로 Tab을 눌러 탭 그룹과 패널로 이동한다
- **THEN** 선택된 점 탭 하나에 포커스가 가고 white outline이 보이며, 다음 Tab에서 보이는 패널에 포커스가 간다

### Requirement: Crew 탭 전환 미지원 표시
이 변경은 승무원 전환 동작을 SHALL NOT 추가한다. 비선택 점을 실행해도 페이지 오류가 생기지 않고 현재 패널이 유지되며, 이 제한을 보고서에 기록한다.

#### Scenario: 비선택 점 클릭
- **WHEN** `crew-commander.html`에서 두 번째 점을 클릭한다
- **THEN** Douglas Hurley 패널이 그대로 보이고 콘솔 오류가 없으며, `git diff --stat src/js package.json`에 변경이 없다

### Requirement: Crew 움직임 줄이기
점 탭의 상태 전환 애니메이션은 사용자가 움직임 줄이기를 설정하면 SHALL 비활성화된다.

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 페이지를 열고 점 탭과 점의 computed style을 확인한다
- **THEN** `transition-duration`이 0초다

### Requirement: Crew 강제 색상 모드
강제 색상(고대비) 모드에서 점 4개가 모두 SHALL 보이고, 선택된 점은 비선택 점과 시스템 색으로 구분된다.

#### Scenario: forced colors
- **WHEN** `forced-colors: active`로 375px과 1440px의 `crew-commander.html`을 연다
- **THEN** 점 4개가 배경과 다른 색으로 보이고, 첫 번째 점만 채워진 모양 또는 다른 시스템 색으로 구분된다

### Requirement: Crew 넘침 방지
Crew 페이지는 320px 이상 모든 폭과 텍스트 200% 확대에서 가로로 SHALL 넘치지 않으며, 텍스트·점 탭·사진이 서로 겹치지 않는다.

#### Scenario: 좁은 화면
- **WHEN** viewport 320px에서 4개 Crew 페이지를 연다
- **THEN** `document.documentElement.scrollWidth`가 320 이하이고 이름·점 탭·사진이 화면 안에 있다

#### Scenario: 텍스트 200%
- **WHEN** 루트 글꼴 크기를 200%로 키우고 375×812와 1440×900에서 페이지를 연다
- **THEN** 가로 넘침이 없고, 요소가 겹치지 않으며 세로 스크롤로 모두 닿을 수 있다

#### Scenario: 분기점 경계
- **WHEN** 767, 768, 1023, 1024px에서 페이지를 연다
- **THEN** 각 폭에서 가로 넘침과 요소 겹침이 없다
