# Spec Delta

## ADDED Requirements

### Requirement: 탭 실행으로 패널 전환
스크립트가 동작하는 환경에서 탭을 클릭하거나, 포커스된 탭에서 Enter 또는 Space를 누르면 그 탭이 SHALL 선택된다. 선택된 탭의 패널만 보이고 같은 그룹의 다른 패널은 `hidden` 속성을 가진다. 포커스는 실행한 탭에 남는다.

#### Scenario: 클릭으로 전환
- **WHEN** `destination-moon.html`에서 "Mars" 탭을 클릭한다
- **THEN** Mars 패널만 `hidden`이 없고 Moon·Europa·Titan 패널은 `hidden`이며, `<h2>`가 "Mars"인 패널이 보인다

#### Scenario: 키보드로 실행
- **WHEN** `crew-commander.html`에서 Tab으로 선택된 탭에 포커스를 둔 뒤 →를 눌러 두 번째 탭으로 옮기고 Space를 누른다
- **THEN** Mark Shuttleworth 패널이 보이고 포커스는 두 번째 탭에 있다

#### Scenario: 이미 선택된 탭
- **WHEN** 선택된 탭을 다시 클릭한다
- **THEN** 패널과 ARIA 상태가 그대로이고 콘솔 오류가 없다

### Requirement: 선택 상태 동기화
탭 선택이 바뀌면 그룹 안에서 선택된 탭 하나만 `aria-selected="true"`와 `tabindex="0"`을 SHALL 가지고, 나머지 탭은 `aria-selected="false"`와 `tabindex="-1"`을 가진다. 탭 모양(선택 표시선·점·원)은 기존 스타일 규칙에 따라 새 선택 상태를 따른다.

#### Scenario: 전환 후 ARIA
- **WHEN** `technology-vehicle.html`에서 "3" 탭을 클릭한다
- **THEN** 세 번째 탭만 `aria-selected="true"`·`tabindex="0"`이고, 첫 번째·두 번째 탭은 `aria-selected="false"`·`tabindex="-1"`이다

#### Scenario: 전환 후 모양
- **WHEN** 1440px `crew-commander.html`에서 세 번째 점을 클릭한다
- **THEN** 세 번째 점의 색이 white이고 첫 번째 점은 비선택 색이다

#### Scenario: 전환 후 Tab 순서
- **WHEN** 전환한 뒤 Shift+Tab과 Tab으로 탭 그룹에 다시 들어온다
- **THEN** 새로 선택된 탭 하나만 포커스를 받고, 다음 Tab에서 보이는 패널에 포커스가 간다

### Requirement: 방향키 탐색과 자동 활성화
탭에 포커스가 있을 때 방향키로 이전·다음 탭에, Home·End로 첫·마지막 탭에 SHALL 포커스를 옮기며, 포커스를 받은 탭이 바로 선택된다. 양 끝에서 다음·이전으로 가면 반대쪽 끝으로 순환한다. 가로로 놓인 탭 목록은 ←·→, 세로로 놓인 탭 목록은 ↑·↓를 쓰고, 처리한 키는 페이지 스크롤을 일으키지 않는다.

#### Scenario: 가로 탭 목록
- **WHEN** 375px `destination-moon.html`에서 선택된 "Moon" 탭에 포커스를 두고 ←를 누른다
- **THEN** 포커스와 선택이 "Titan"으로 순환하고 Titan 패널이 보인다

#### Scenario: Home·End
- **WHEN** `crew-pilot.html`에서 선택된 탭에 포커스를 두고 End, Home을 차례로 누른다
- **THEN** End 후에는 네 번째(Anousheh Ansari), Home 후에는 첫 번째(Douglas Hurley) 탭이 포커스·선택된다

#### Scenario: 세로 탭 목록
- **WHEN** 1440px `technology-vehicle.html`에서 선택된 탭에 포커스를 두고 ↓를 누른다
- **THEN** "2" 탭이 포커스·선택되고 Spaceport 패널이 보이며, 페이지가 스크롤되지 않는다

### Requirement: 탭 목록 방향 표시
세로로 놓인 탭 목록은 `aria-orientation="vertical"`, 가로로 놓인 탭 목록은 `aria-orientation="horizontal"`을 SHALL 가지며, 화면 크기가 바뀌어 배치 방향이 바뀌면 값도 바뀐다.

#### Scenario: Technology 분기점
- **WHEN** `technology-vehicle.html`을 1440px로 연 뒤 viewport를 1023px로 줄인다
- **THEN** 1440px에서는 `aria-orientation`이 `vertical`이고, 1023px에서는 `horizontal`이며 ←·→로 탭이 이동한다

#### Scenario: 가로 그룹
- **WHEN** Destination·Crew 탭 목록을 375px과 1440px에서 확인한다
- **THEN** `aria-orientation`이 `horizontal`이다

### Requirement: 주소와 제목 교체
탭 선택이 바뀌면 주소를 그 항목의 페이지 파일(`<그룹>-<항목>.html`, 예: `destination-mars.html`)로 SHALL 교체하고, 문서 제목을 그 페이지 파일과 같은 형식(`<항목 이름> | <그룹> | Frontend Mentor | Space tourism website`)으로 바꾼다. 방문 기록 항목은 추가하지 않는다. 주소를 바꿀 수 없는 환경에서는 오류 없이 전환만 한다.

#### Scenario: 주소와 제목
- **WHEN** `destination-moon.html`에서 "Europa" 탭을 클릭한다
- **THEN** `location.pathname`이 `destination-europa.html`로 끝나고 `document.title`이 "Europa | Destination | Frontend Mentor | Space tourism website"이며, `history.length`가 클릭 전과 같다

#### Scenario: 새로고침
- **WHEN** 위 상태에서 페이지를 새로고침한다
- **THEN** Europa 패널이 선택된 상태로 열린다

#### Scenario: 뒤로 가기
- **WHEN** 다른 페이지에서 `destination-moon.html`로 이동해 여러 탭을 바꾼 뒤 뒤로 가기를 누른다
- **THEN** 이전 페이지로 돌아간다(탭마다 기록이 쌓이지 않는다)

### Requirement: 패널 전환 페이드
새로 보이는 패널은 약 0.3초 동안 투명에서 불투명으로 SHALL 나타난다. 사용자가 움직임 줄이기를 설정했으면 즉시 바뀐다. 페이드 중에도 패널 내용은 처음부터 접근성 트리와 키보드에서 사용할 수 있다.

#### Scenario: 기본 페이드
- **WHEN** 탭을 바꾼 직후(0.1초 이내) 새 패널의 computed `opacity`를 확인한다
- **THEN** 1보다 작고, 0.4초 뒤에는 1이다

#### Scenario: reduced motion
- **WHEN** `prefers-reduced-motion: reduce`로 탭을 바꾼다
- **THEN** 새 패널의 `opacity`가 바로 1이고 진행 중인 애니메이션이 없다

### Requirement: 스크립트 없을 때 동작
스크립트를 쓸 수 없거나 탭 스크립트를 불러오지 못하면 각 페이지 파일은 지금처럼 파일별 초기 선택 패널을 SHALL 보여 주며, 탭 그룹의 구조와 ARIA 초기값은 바뀌지 않는다. 탭 스크립트의 오류는 메뉴 스크립트 동작을 막지 않는다.

#### Scenario: JavaScript 비활성화
- **WHEN** JavaScript를 끄고 `crew-pilot.html`을 연다
- **THEN** Victor Glover 패널만 보이고 탭 ARIA 값이 빌드된 초기값과 같다

#### Scenario: 메뉴 독립
- **WHEN** 탭이 없는 `index.html`을 375px로 연다
- **THEN** 콘솔 오류가 없고 모바일 메뉴가 열리고 닫힌다

## REMOVED Requirements

### Requirement: 전환 동작 범위 제외
**Reason**: 이번 변경에서 탭 전환 스크립트를 추가하므로 "스크립트를 추가하지 않는다"는 요구사항이 더 이상 맞지 않습니다.
**Migration**: 전환 동작은 이 spec의 "탭 실행으로 패널 전환", "선택 상태 동기화", "방향키 탐색과 자동 활성화" 요구사항으로 대체합니다.
