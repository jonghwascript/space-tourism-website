# Spec Delta

## Purpose

Destination, Crew, Technology 페이지가 공유하는 탭 위젯의 구조, ARIA 초기 상태, 페이지 파일별 초기 선택 규칙을 정의해 이후 JavaScript 단계가 일관된 마크업 위에서 전환 동작을 구현할 수 있게 한다.

## ADDED Requirements

### Requirement: 탭 위젯 구조
탭 그룹은 `role="tablist"`와 접근 가능한 이름을 가진 컨테이너 안에 항목별 `<button type="button" role="tab">`을 SHALL 두고, 각 탭은 `aria-controls`로 자기 `role="tabpanel"`을 가리키며 각 패널은 `aria-labelledby`로 자기 탭을 가리킨다. 탭 목록은 DOM에서 패널보다 앞에 둔다.

#### Scenario: 탭과 패널 연결
- **WHEN** 임의의 탭 그룹에서 모든 탭의 `aria-controls`와 모든 패널의 `aria-labelledby`를 확인한다
- **THEN** 탭과 패널이 1:1로 서로를 가리키고, 가리키는 ID가 문서에 존재한다

#### Scenario: 탭 순서
- **WHEN** 탭 목록의 탭 순서를 확인한다
- **THEN** 데이터(`src/pages/data.json`) 및 Figma의 항목 순서와 같다

### Requirement: 그룹 내 전체 패널 포함
각 페이지 파일은 자기 그룹(Destination 4개, Crew 4개, Technology 3개)의 모든 탭과 패널을 SHALL 포함한다.

#### Scenario: 그룹 패널 수
- **WHEN** `destination-mars.html`의 탭 패널 수를 센다
- **THEN** 4개이며 Moon, Mars, Europa, Titan 내용을 각각 담는다

### Requirement: 파일별 초기 선택 상태
각 페이지 파일은 파일 이름에 해당하는 탭 하나만 `aria-selected="true"`와 `tabindex="0"`으로 SHALL 표시하고, 나머지 탭은 `aria-selected="false"`와 `tabindex="-1"`을 가진다. 선택된 탭의 패널만 표시되고 나머지 패널은 `hidden` 속성을 가진다.

#### Scenario: 초기 선택
- **WHEN** `crew-engineer.html`을 연다
- **THEN** "Anousheh Ansari" 탭만 선택 상태이고 해당 패널만 `hidden`이 없다

#### Scenario: 키보드 탭 순서
- **WHEN** 탭 그룹에 Tab 키로 진입한다
- **THEN** 선택된 탭 하나만 포커스를 받고 비선택 탭은 Tab 순서에서 제외된다

### Requirement: 탭의 접근 가능한 이름
모든 탭은 해당 항목을 식별하는 접근 가능한 이름을 SHALL 가진다. 화면에 글자가 없는 탭(점 모양)은 숨긴 텍스트로 이름을 제공하고, 화면에 숫자만 있는 탭은 이름이 그 숫자로 시작하면서 항목 이름을 포함한다.

#### Scenario: 점 모양 탭 이름
- **WHEN** Crew 탭의 접근 가능한 이름을 확인한다
- **THEN** 각 이름이 승무원 이름이다

#### Scenario: 숫자 탭 이름
- **WHEN** Technology 첫 번째 탭의 접근 가능한 이름을 확인한다
- **THEN** 이름이 "1"로 시작하고 "Launch vehicle"을 포함한다

### Requirement: 전환 동작 범위 제외
이 변경은 탭 전환 스크립트를 SHALL NOT 추가하며, 미동작 상태를 인계 보고서에 기록한다.

#### Scenario: 스크립트 미변경
- **WHEN** 변경 후 `git diff --stat src/js`를 실행한다
- **THEN** 변경 사항이 없고, 인계 보고서에 탭 전환이 JS 단계 작업으로 기록되어 있다
