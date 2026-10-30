# Proposal

## Why

헤더 내비게이션은 그룹 단위로 `aria-current="page"`를 붙입니다(`src/partials/header.html`, 페이지가 넘기는 `current` 값). 그런데 각 링크의 목적지는 그룹의 대표 페이지(`destination-moon.html`, `crew-commander.html`, `technology-vehicle.html`)로 고정되어 있습니다.

그래서 대표 페이지가 아닌 8개 페이지에서는, "현재 페이지"라고 알린 링크를 누르면 다른 페이지로 이동합니다. 예를 들어 `destination-mars.html`에서는 Destination 링크가 현재 페이지로 안내되지만, 누르면 Moon으로 갑니다. `aria-current="page"`는 "지금 표시된 페이지를 가리키는 링크"라는 뜻이므로, 보조 기술 사용자에게 사실과 다른 정보를 줍니다.

탭 전환 스크립트도 같은 문제를 만듭니다. Moon 페이지에서 Mars 탭을 누르면 주소는 `destination-mars.html`로 바뀌지만, 헤더의 Moon 링크는 여전히 `aria-current="page"`입니다.

## What Changes

- 링크 목적지가 지금 페이지와 같을 때만 그 링크가 `aria-current="page"`를 가집니다. 홈과 각 그룹의 대표 페이지가 여기에 해당합니다.
- 같은 그룹이지만 대표 페이지가 아닐 때는 그 그룹 링크가 `aria-current="true"`(현재 항목)를 가집니다(사용자 결정).
- 화면의 현재 표시선(태블릿·데스크톱 아래 3px, 모바일 패널 오른쪽 3px, 강제 색상 시스템 색)은 두 값 모두에 그대로 보입니다.
- 탭을 바꿔 주소가 바뀌면, 스크립트가 헤더 링크의 `aria-current`를 새 주소에 맞춰 `page`나 `true`로 갱신합니다.
- 링크 목적지, 링크 이름, 숫자 접두사 처리는 바꾸지 않습니다.

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `site-layout`
  - "주 내비게이션": 현재 표시 규칙을 "그룹 링크는 `page`"에서 "목적지가 현재 페이지면 `page`, 같은 그룹이면 `true`"로 바꿉니다.
  - 추가: 탭 전환으로 주소가 바뀔 때 헤더의 현재 표시를 갱신하는 요구사항

## Impact

- `src/partials/header.html`: 링크 4개의 `@@if` 조건을 그룹과 대표 페이지 여부로 나눕니다. `prettier-ignore` 주석은 그대로 둡니다.
- `src/pages/index.html`, `destination-moon.html`, `crew-commander.html`, `technology-vehicle.html`: header include에 대표 페이지 표시(context 값)를 추가합니다. 나머지 8개 페이지는 바꾸지 않습니다.
- `src/scss/components/_site-header.scss`: 현재 표시선 선택자를 `[aria-current='page']`에서 두 값을 모두 포함하도록 넓힙니다(기본·강제 색상).
- `src/js/main.js`: 탭 블록의 주소 교체 뒤에 헤더 `aria-current`를 동기화하는 몇 줄을 추가합니다.
- 의존성 추가 없음
