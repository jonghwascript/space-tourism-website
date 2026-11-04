# Spec Delta

## MODIFIED Requirements

### Requirement: 모바일 메뉴 토글 마크업
헤더는 주 내비게이션 목록을 제어하는 `<button type="button">`을 SHALL 가지며, 초기값 `aria-expanded="false"`, 목록 ID를 가리키는 `aria-controls`, 숨긴 텍스트로 된 접근 가능한 이름을 갖는다. 햄버거·닫기 아이콘은 장식(`alt=""`)이다. 열고 닫는 동작은 "모바일 메뉴 열기·닫기" 요구사항이 정의한다.

#### Scenario: 토글 초기 상태
- **WHEN** 임의의 페이지에서 메뉴 토글 버튼을 확인한다
- **THEN** `aria-expanded="false"`이고 `aria-controls` 값과 같은 ID의 요소가 존재하며 버튼 이름이 "Open menu"처럼 동작을 설명한다

#### Scenario: 아이콘 중복 읽기 방지
- **WHEN** 버튼 안의 아이콘 이미지를 확인한다
- **THEN** 모든 아이콘이 `alt=""`를 가진다

## ADDED Requirements

### Requirement: 메뉴 스크립트 로딩
모든 페이지는 공통 `<head>` 원본에서 메뉴 스크립트를 문서 파싱을 막지 않는 방식으로 SHALL 불러오며, 스크립트가 실행되면 헤더를 활성화 상태로 표시한다. 스크립트가 없거나 실행되지 않으면 "스크립트 없는 모바일 내비게이션" 배치가 유지된다.

#### Scenario: 스크립트 연결
- **WHEN** 빌드된 12개 HTML 파일의 `<head>`를 확인한다
- **THEN** 모두 `./js/main.js`를 `defer`로 불러오고, 빌드 결과의 `js/main.js` 파일이 존재한다

#### Scenario: 활성화
- **WHEN** viewport 375px에서 페이지를 연다
- **THEN** 햄버거 버튼이 보이고 링크 목록은 보이지 않으며, 콘솔 오류가 없다

#### Scenario: 스크립트 비활성화
- **WHEN** 브라우저에서 JavaScript를 끄고 viewport 375px에서 페이지를 연다
- **THEN** 토글 버튼은 보이지 않고 4개 링크가 화면 안에 보인다

### Requirement: 모바일 메뉴 열기·닫기
768px 미만에서 토글 버튼을 실행하면 메뉴가 SHALL 열리거나 닫힌다. 열림 상태에서는 패널과 닫기 아이콘이 보이고, 버튼의 `aria-expanded`는 `"true"`, 이름은 닫기 동작("Close menu")을 설명한다. 닫힘 상태에서는 목록이 화면과 보조 기술에서 숨겨지고, `aria-expanded="false"`, 이름은 "Open menu"다.

#### Scenario: 클릭으로 열기
- **WHEN** 375px에서 닫힌 메뉴의 토글 버튼을 클릭한다
- **THEN** 오른쪽 패널에 링크 4개가 세로로 보이고, 버튼은 닫기 아이콘·`aria-expanded="true"`·이름 "Close menu"를 가진다

#### Scenario: 다시 눌러 닫기
- **WHEN** 열린 상태에서 토글 버튼을 다시 클릭한다
- **THEN** 패널이 사라지고 버튼은 햄버거 아이콘·`aria-expanded="false"`·이름 "Open menu"로 돌아온다

#### Scenario: 키보드로 실행
- **WHEN** 토글 버튼에 포커스를 두고 Enter 또는 Space를 누른다
- **THEN** 클릭과 같이 열림·닫힘이 전환되고 포커스는 버튼에 남는다

#### Scenario: 열린 패널의 키보드 이동
- **WHEN** 메뉴를 연 뒤 Tab을 누른다
- **THEN** 포커스가 패널의 첫 링크로 이동하고, 이후 링크를 차례로 거칠 수 있다

### Requirement: 모바일 메뉴 닫기 보조 동작
메뉴가 열려 있을 때 Escape 키를 누르거나 헤더 바깥을 클릭하면 메뉴가 SHALL 닫히고 토글 버튼의 상태도 닫힘으로 돌아간다. Escape로 닫으면 포커스는 토글 버튼으로 이동한다.

#### Scenario: Escape
- **WHEN** 패널의 링크에 포커스가 있는 상태에서 Escape를 누른다
- **THEN** 메뉴가 닫히고 포커스가 토글 버튼에 있으며 `aria-expanded="false"`다

#### Scenario: 바깥 클릭
- **WHEN** 메뉴가 열린 상태에서 패널과 토글 바깥의 본문 영역을 클릭한다
- **THEN** 메뉴가 닫힌다

#### Scenario: 패널 안 클릭
- **WHEN** 메뉴가 열린 상태에서 패널의 링크가 아닌 빈 영역을 클릭한다
- **THEN** 메뉴는 열린 상태를 유지한다

### Requirement: 분기점 전환 시 메뉴 상태 초기화
메뉴가 열린 상태에서 viewport가 768px 이상으로 바뀌면 메뉴 상태를 SHALL 닫힘으로 초기화해, 다시 768px 미만으로 돌아왔을 때 닫힌 메뉴와 `aria-expanded="false"`가 일치한다.

#### Scenario: 열고 넓혔다가 다시 좁힘
- **WHEN** 375px에서 메뉴를 열고 viewport를 768px로 넓힌 뒤 767px로 다시 좁힌다
- **THEN** 768px에서는 태블릿 배치가 보이고, 767px에서는 메뉴가 닫혀 있으며 토글이 `aria-expanded="false"`다
