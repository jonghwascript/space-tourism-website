# Spec Delta

## Purpose

홈 페이지(`index.html`)의 히어로 콘텐츠와 Explore 링크를 정의해 방문자가 사이트 소개를 읽고 목적지 탐색으로 이동할 수 있게 한다.

## ADDED Requirements

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
