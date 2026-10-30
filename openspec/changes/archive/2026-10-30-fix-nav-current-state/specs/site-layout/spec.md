# Spec Delta

## MODIFIED Requirements

### Requirement: 주 내비게이션
헤더는 `aria-label`이 붙은 `<nav>` 안의 목록으로 Home, Destination, Crew, Technology 4개 링크를 Figma 순서대로 SHALL 제공한다. 각 링크는 해당 그룹의 첫 페이지로 이동한다. 링크 목적지가 지금 페이지와 같으면 그 링크가 `aria-current="page"`를, 지금 페이지가 그 링크 그룹의 다른 페이지이면 `aria-current="true"`를 가지며, 나머지 링크는 `aria-current`가 없다. 숫자 접두사(00~03)는 장식으로 처리해 링크 이름에 중복되지 않게 한다.

#### Scenario: 링크 목적지
- **WHEN** 내비게이션 링크의 `href`를 확인한다
- **THEN** 순서대로 `./index.html`, `./destination-moon.html`, `./crew-commander.html`, `./technology-vehicle.html`이다

#### Scenario: 현재 페이지 표시
- **WHEN** `crew-pilot.html`의 내비게이션을 확인한다
- **THEN** "Crew" 링크만 `aria-current="true"`를 가지고, 어떤 링크도 `aria-current="page"`를 가지지 않는다

#### Scenario: 대표 페이지
- **WHEN** `index.html`, `destination-moon.html`, `crew-commander.html`, `technology-vehicle.html`의 내비게이션을 각각 확인한다
- **THEN** 목적지가 그 페이지인 링크만 `aria-current="page"`를 가진다

#### Scenario: 12개 페이지 전체
- **WHEN** 빌드된 12개 페이지에서 `aria-current="page"`인 링크를 모두 찾는다
- **THEN** 각 링크의 `href`가 그 페이지 파일과 같고, 그 밖의 현재 그룹 링크는 `aria-current="true"`다

#### Scenario: 링크 이름
- **WHEN** 접근성 트리에서 내비게이션 링크 이름을 확인한다
- **THEN** 이름이 "Home", "Destination", "Crew", "Technology"이고 숫자 접두사가 포함되지 않는다

## ADDED Requirements

### Requirement: 현재 그룹 표시선
`aria-current`가 `page`이든 `true`이든 현재 그룹 링크는 같은 현재 표시선을 SHALL 보인다. 태블릿·데스크톱은 아래 3px white, 열린 모바일 패널은 오른쪽 3px white, 강제 색상 모드는 시스템 글자색이다.

#### Scenario: 대표 페이지가 아닌 그룹 페이지
- **WHEN** `destination-mars.html`을 1440px로 열고 "Destination" 링크를 확인한다
- **THEN** 아래 테두리가 3px solid white이고, 다른 링크의 표시선은 보이지 않는다

#### Scenario: 모바일 패널과 강제 색상
- **WHEN** `crew-pilot.html`을 375px에서 메뉴를 열어 확인하고, `forced-colors: active`로 1440px에서도 확인한다
- **THEN** "Crew" 링크만 표시선이 보이고(모바일 오른쪽 3px white, 강제 색상은 배경과 다른 시스템 색), 다른 링크의 표시선 색은 배경과 같다

### Requirement: 탭 전환 후 현재 표시 갱신
탭 전환으로 주소가 바뀌면 헤더 링크의 `aria-current`가 새 주소 기준으로 SHALL 다시 정해진다. 목적지가 새 주소와 같은 링크는 `page`, 같은 그룹의 다른 페이지이면 `true`다. 주소를 바꿀 수 없어 그대로인 경우에는 값도 그대로다.

#### Scenario: 대표 페이지에서 다른 항목으로
- **WHEN** `destination-moon.html`에서 "Mars" 탭을 클릭한다
- **THEN** 주소가 `destination-mars.html`이고, "Destination" 링크가 `aria-current="true"`이며 표시선이 유지된다

#### Scenario: 다른 항목에서 대표 페이지로
- **WHEN** `crew-pilot.html`에서 첫 번째 점(Douglas Hurley)을 클릭한다
- **THEN** 주소가 `crew-commander.html`이고, "Crew" 링크가 `aria-current="page"`다

#### Scenario: 스크립트 없음
- **WHEN** JavaScript를 끄고 `technology-spaceport.html`을 연다
- **THEN** "Technology" 링크가 빌드된 값 그대로 `aria-current="true"`다
