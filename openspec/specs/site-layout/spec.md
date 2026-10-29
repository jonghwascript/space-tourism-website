# site-layout Specification

## Purpose

Space tourism 사이트의 모든 페이지가 공유하는 문서 골격, 건너뛰기 링크, 헤더와 주 내비게이션 마크업을 정의해 페이지 간 일관된 구조와 접근성 기반을 제공한다.

## Requirements

### Requirement: 문서 기본 정보
모든 페이지는 `lang="en"`, 파비콘, `./css/style.css` 링크, 그리고 챌린지 이름과 페이지(및 선택 항목) 이름을 담은 페이지별 고유 `<title>`을 SHALL 가진다.

#### Scenario: 페이지 제목이 고유하다
- **WHEN** 빌드된 12개 HTML 파일의 `<title>`을 모은다
- **THEN** 모든 값이 "Space tourism"을 포함하고 서로 중복되지 않는다

#### Scenario: 언어와 스타일시트
- **WHEN** 임의의 페이지 `<head>`를 확인한다
- **THEN** `html[lang="en"]`, 파비콘 링크, `./css/style.css` 링크가 있다

### Requirement: Figma 글꼴 로딩
모든 페이지는 Figma 스타일 가이드가 지정한 웹 글꼴을 `preconnect`와 `display=swap`이 포함된 링크로 `<head>`에서 SHALL 불러온다.

#### Scenario: 글꼴 링크 확인
- **WHEN** 페이지 `<head>`를 확인한다
- **THEN** 스타일 가이드의 서체 family가 모두 포함된 글꼴 링크 하나와 `preconnect` 링크가 있다

### Requirement: 건너뛰기 링크와 main 랜드마크
모든 페이지는 첫 포커스 요소로 `main` 요소를 가리키는 건너뛰기 링크를 SHALL 가지며, 주요 콘텐츠는 페이지당 하나의 `<main>`에 있어야 한다.

#### Scenario: 건너뛰기 링크로 본문 이동
- **WHEN** 페이지를 열고 Tab 키를 한 번 누른 뒤 Enter를 누른다
- **THEN** 건너뛰기 링크가 첫 포커스를 받고, 링크의 `href` 대상 ID를 가진 `<main>`으로 이동한다

### Requirement: 헤더 로고
헤더는 로고를 홈(`index.html`)으로 가는 링크로 SHALL 제공하며, 링크는 목적지를 알 수 있는 접근 가능한 이름을 가진다.

#### Scenario: 로고 링크 이름
- **WHEN** 접근성 트리에서 헤더의 첫 링크를 확인한다
- **THEN** 링크의 `href`가 `./index.html`이고 이름이 비어 있지 않다

### Requirement: 주 내비게이션
헤더는 `aria-label`이 붙은 `<nav>` 안의 목록으로 Home, Destination, Crew, Technology 4개 링크를 Figma 순서대로 SHALL 제공한다. 각 링크는 해당 그룹의 첫 페이지로 이동하고, 현재 페이지 그룹의 링크만 `aria-current="page"`를 가진다. 숫자 접두사(00~03)는 장식으로 처리해 링크 이름에 중복되지 않게 한다.

#### Scenario: 링크 목적지
- **WHEN** 내비게이션 링크의 `href`를 확인한다
- **THEN** 순서대로 `./index.html`, `./destination-moon.html`, `./crew-commander.html`, `./technology-vehicle.html`이다

#### Scenario: 현재 페이지 표시
- **WHEN** `crew-pilot.html`의 내비게이션을 확인한다
- **THEN** "Crew" 링크만 `aria-current="page"`를 가진다

#### Scenario: 링크 이름
- **WHEN** 접근성 트리에서 내비게이션 링크 이름을 확인한다
- **THEN** 이름이 "Home", "Destination", "Crew", "Technology"이고 숫자 접두사가 포함되지 않는다

### Requirement: 모바일 메뉴 토글 마크업
헤더는 주 내비게이션 목록을 제어하는 `<button type="button">`을 SHALL 가지며, 초기값 `aria-expanded="false"`, 목록 ID를 가리키는 `aria-controls`, 숨긴 텍스트로 된 접근 가능한 이름 "Menu"를 갖는다. 이름은 열림·닫힘에 따라 바뀌지 않고, 상태는 `aria-expanded`로만 전달한다. 햄버거·닫기 아이콘은 버튼 글자색(`currentColor`)으로 그려지는 인라인 SVG이며, 장식이므로 보조 기술에서 숨긴다. 열고 닫는 동작은 "모바일 메뉴 열기·닫기" 요구사항이 정의한다.

#### Scenario: 토글 초기 상태
- **WHEN** 임의의 페이지에서 메뉴 토글 버튼을 확인한다
- **THEN** `aria-expanded="false"`이고 `aria-controls` 값과 같은 ID의 요소가 존재하며 버튼 이름이 "Menu"다

#### Scenario: 아이콘 중복 읽기 방지
- **WHEN** 버튼 안의 아이콘 SVG를 확인한다
- **THEN** 모든 아이콘이 `aria-hidden="true"`와 `focusable="false"`를 가지고, 접근성 트리에서 버튼의 자식으로 노출되지 않는다

#### Scenario: 아이콘 색
- **WHEN** 375px에서 햄버거·닫기 아이콘의 계산된 `fill`과 버튼의 `color`를 비교한다
- **THEN** 두 값이 같고, 기본 화면에서는 `rgb(208, 214, 249)`(#D0D6F9)다

### Requirement: 공통 마크업 단일 원본
헤더와 공통 `<head>` 요소는 하나의 원본에서 SHALL 생성되어 12개 페이지에서 내용이 일치하며, 페이지마다 다른 값은 현재 페이지 표시와 제목뿐이다.

#### Scenario: 헤더 일치
- **WHEN** 빌드된 12개 페이지의 헤더 HTML을 `aria-current` 속성만 제외하고 비교한다
- **THEN** 모두 동일하다

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
헤더의 건너뛰기 링크, 로고 링크, 메뉴 토글, 내비게이션 링크는 키보드 포커스 시 배경과 3:1 이상 대비되는 outline을 SHALL 표시하며, 포커스 표시가 내비게이션 바나 열린 모바일 패널 등에 잘려 가려지지 않는다.

#### Scenario: 키보드 포커스
- **WHEN** 페이지에서 Tab 키로 헤더 요소를 차례로 이동한다
- **THEN** 각 요소에 white outline이 보이고 잘리지 않는다

#### Scenario: 열린 모바일 패널
- **WHEN** 375px에서 메뉴를 열고 Tab으로 토글과 패널 링크 4개를 차례로 이동한다
- **THEN** 각 요소의 outline 네 변이 모두 보이고 패널 경계에 잘리지 않는다

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

### Requirement: 메뉴 스크립트 로딩
모든 페이지는 공통 `<head>` 원본에서 메뉴 스크립트를 문서 파싱을 막지 않는 방식으로 SHALL 불러온다. 스크립트를 쓸 수 있는 환경이면 첫 그리기부터 768px 미만 헤더가 활성화 상태(햄버거)로 표시된다. 스크립트를 쓸 수 없거나, 메뉴 스크립트를 불러오지 못하거나, 필요한 요소가 없으면 "스크립트 없는 모바일 내비게이션" 배치가 표시된다.

#### Scenario: 스크립트 연결
- **WHEN** 빌드된 12개 HTML 파일의 `<head>`를 확인한다
- **THEN** 모두 `./js/main.js`를 `defer`로 불러오고, 빌드 결과의 `js/main.js` 파일이 존재한다

#### Scenario: 활성화
- **WHEN** viewport 375px에서 페이지를 연다
- **THEN** 햄버거 버튼이 보이고 링크 목록은 보이지 않으며, 콘솔 오류가 없다

#### Scenario: 첫 그리기
- **WHEN** 메뉴 스크립트 응답을 1.5초 늦추고 375px에서 페이지를 연다
- **THEN** 스크립트가 실행되기 전에도 링크 목록 대신 햄버거 배치가 그려진다

#### Scenario: 스크립트 로딩 실패
- **WHEN** 메뉴 스크립트 요청이 실패한 상태로 375px에서 페이지를 연다
- **THEN** 토글 버튼은 보이지 않고 4개 링크가 화면 안에 보인다

#### Scenario: 스크립트 비활성화
- **WHEN** 브라우저에서 JavaScript를 끄고 viewport 375px에서 페이지를 연다
- **THEN** 토글 버튼은 보이지 않고 4개 링크가 화면 안에 보인다

### Requirement: 모바일 메뉴 열기·닫기
768px 미만에서 토글 버튼을 실행하면 메뉴가 SHALL 열리거나 닫힌다. 열림 상태에서는 패널과 닫기 아이콘이 보이고 버튼의 `aria-expanded`는 `"true"`다. 닫힘 상태에서는 목록이 화면과 보조 기술에서 숨겨지고 `aria-expanded="false"`다. 두 상태 모두 버튼 이름은 "Menu"다.

#### Scenario: 클릭으로 열기
- **WHEN** 375px에서 닫힌 메뉴의 토글 버튼을 클릭한다
- **THEN** 오른쪽 패널에 링크 4개가 세로로 보이고, 버튼은 닫기 아이콘·`aria-expanded="true"`·이름 "Menu"를 가진다

#### Scenario: 다시 눌러 닫기
- **WHEN** 열린 상태에서 토글 버튼을 다시 클릭한다
- **THEN** 패널이 사라지고 버튼은 햄버거 아이콘·`aria-expanded="false"`·이름 "Menu"를 가진다

#### Scenario: 키보드로 실행
- **WHEN** 토글 버튼에 포커스를 두고 Enter 또는 Space를 누른다
- **THEN** 클릭과 같이 열림·닫힘이 전환되고 포커스는 버튼에 남는다

#### Scenario: 열린 패널의 키보드 이동
- **WHEN** 메뉴를 연 뒤 Tab을 누른다
- **THEN** 포커스가 패널의 첫 링크로 이동하고, 이후 링크를 차례로 거칠 수 있다

### Requirement: 모바일 메뉴 닫기 보조 동작
메뉴가 열려 있을 때 Escape 키를 누르거나, 헤더 바깥을 클릭하거나, 키보드 포커스가 헤더 바깥 요소로 이동하면 메뉴가 SHALL 닫히고 토글 버튼의 상태도 닫힘으로 돌아간다. Escape로 닫으면 포커스는 토글 버튼으로 이동한다. 포커스 이동으로 닫을 때는 포커스를 옮기지 않는다.

#### Scenario: Escape
- **WHEN** 패널의 링크에 포커스가 있는 상태에서 Escape를 누른다
- **THEN** 메뉴가 닫히고 포커스가 토글 버튼에 있으며 `aria-expanded="false"`다

#### Scenario: 바깥 클릭
- **WHEN** 메뉴가 열린 상태에서 패널과 토글 바깥의 본문 영역을 클릭한다
- **THEN** 메뉴가 닫힌다

#### Scenario: 패널 안 클릭
- **WHEN** 메뉴가 열린 상태에서 패널의 링크가 아닌 빈 영역을 클릭한다
- **THEN** 메뉴는 열린 상태를 유지한다

#### Scenario: 마지막 링크에서 Tab
- **WHEN** 메뉴가 열린 상태에서 패널의 마지막 링크에 포커스를 두고 Tab을 누른다
- **THEN** 메뉴가 닫히고, 포커스는 본문의 다음 요소에 있으며 그 요소가 패널에 가려지지 않는다

#### Scenario: Shift+Tab으로 헤더 안 이동
- **WHEN** 메뉴가 열린 상태에서 첫 링크에 포커스를 두고 Shift+Tab을 누른다
- **THEN** 포커스가 토글로 이동하고 메뉴는 열린 상태를 유지한다

### Requirement: 분기점 전환 시 메뉴 상태 초기화
메뉴가 열린 상태에서 viewport가 768px 이상으로 바뀌면 메뉴 상태를 SHALL 닫힘으로 초기화해, 다시 768px 미만으로 돌아왔을 때 닫힌 메뉴와 `aria-expanded="false"`가 일치한다.

#### Scenario: 열고 넓혔다가 다시 좁힘
- **WHEN** 375px에서 메뉴를 열고 viewport를 768px로 넓힌 뒤 767px로 다시 좁힌다
- **THEN** 768px에서는 태블릿 배치가 보이고, 767px에서는 메뉴가 닫혀 있으며 토글이 `aria-expanded="false"`다

### Requirement: 열린 모바일 패널 넘침
열린 모바일 패널은 내용이 화면 높이보다 길면 패널 안에서 SHALL 세로로 스크롤되어, 모든 링크가 키보드와 포인터로 닿을 수 있다. 페이지 전체에는 가로 넘침이 생기지 않는다.

#### Scenario: 가로 모드
- **WHEN** viewport 667×375(가로 모드)에서 메뉴를 연다
- **THEN** 4개 링크가 모두 보이거나 패널 스크롤로 닿을 수 있다

#### Scenario: 텍스트 200%
- **WHEN** 루트 글꼴 크기를 200%로 키우고 375×667에서 메뉴를 연 뒤 Tab으로 마지막 링크까지 이동한다
- **THEN** 마지막 링크가 화면 안으로 스크롤되어 보이고 가로 넘침이 없다

### Requirement: 모바일 메뉴 고대비와 대비
열린 모바일 패널의 링크 글자는 패널 뒤 배경 어디에서도 4.5:1 이상, 햄버거·닫기 아이콘은 주변 배경과 3:1 이상 SHALL 대비된다. 강제 색상(고대비) 모드에서도 토글 아이콘이 시스템 색으로 그려져 배경과 구분되고, 열린 패널의 링크가 본문 내용과 겹쳐 읽히지 않으며, 현재 링크만 표시선을 가진다.

#### Scenario: 패널 글자 대비
- **WHEN** 375px에서 12개 페이지의 메뉴를 열고 패널 링크 뒤 배경의 가장 밝은 색을 측정한다
- **THEN** white 글자와의 대비가 4.5:1 이상이다

#### Scenario: 아이콘 대비
- **WHEN** 375px에서 햄버거·닫기 아이콘 주변 배경의 가장 밝은 색을 측정한다
- **THEN** 아이콘 색(#D0D6F9)과의 대비가 3:1 이상이다

#### Scenario: 강제 색상 모드
- **WHEN** `forced-colors: active`로 375px 페이지를 열고 메뉴를 연다
- **THEN** 햄버거·닫기 아이콘의 `fill`이 버튼의 강제 글자색과 같고 버튼 배경과 다르며, 패널 배경이 불투명해 본문 글자가 링크 뒤로 비치지 않는다

#### Scenario: 강제 색상 모드의 현재 링크
- **WHEN** `forced-colors: active`로 `crew-pilot.html`을 375px(메뉴 열림)과 1440px에서 연다
- **THEN** "Crew" 링크의 표시선만 배경과 다른 색으로 보이고, 다른 링크의 표시선 색은 배경과 같다
