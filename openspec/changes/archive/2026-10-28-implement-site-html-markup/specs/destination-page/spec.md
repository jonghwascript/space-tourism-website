# Spec Delta

## Purpose

Destination 페이지 4개(Moon, Mars, Europa, Titan)의 제목, 목적지 이미지, 설명, 거리와 이동 시간 정보를 정의해 방문자가 여행지를 비교할 수 있게 한다.

## ADDED Requirements

### Requirement: Destination 페이지 제목
Destination 페이지는 "Pick your destination"을 `<h1>`으로 SHALL 제공하며, 번호 "01"은 화면에 보이되 제목의 접근 가능한 이름에 중복되지 않게 장식으로 처리한다.

#### Scenario: 제목 이름
- **WHEN** `destination-moon.html`의 `<h1>` 접근 가능한 이름을 확인한다
- **THEN** "Pick your destination"이다

### Requirement: 목적지 패널 내용
각 목적지 패널은 목적지 이미지, 목적지 이름 `<h2>`, 설명 문단, 그리고 "Avg. distance"와 "Est. travel time"을 용어-값 쌍으로 묶은 목록을 SHALL 이 순서로 가진다. 텍스트는 starter 페이지 및 `data.json`과 일치한다.

#### Scenario: Moon 패널
- **WHEN** Moon 패널을 확인한다
- **THEN** `<h2>`가 "Moon"이고, 거리 값 "384,400 km"와 이동 시간 값 "3 days"가 각 용어와 짝지어져 있다

#### Scenario: 제목 계층
- **WHEN** 페이지의 제목 단계를 순서대로 나열한다
- **THEN** `<h1>` 다음에 패널별 `<h2>`가 오고 단계를 건너뛰지 않는다

### Requirement: 목적지 이미지
각 패널 이미지는 제공 자산의 webp를 우선하고 png로 대체하는 형태로 SHALL 제공되며, 목적지의 모습을 보여 주는 정보 이미지이므로 행성·위성을 설명하는 `alt`를 가진다. `width`·`height`는 표시 크기 기준이다.

#### Scenario: 이미지 자산
- **WHEN** Europa 패널의 이미지 소스를 확인한다
- **THEN** `./images/destination/image-europa.webp`와 `./images/destination/image-europa.png`를 참조하고 `alt`가 비어 있지 않다

#### Scenario: 이미지 로드
- **WHEN** Chromium에서 4개 Destination 페이지를 연다
- **THEN** 표시 중인 패널 이미지의 `naturalWidth`가 0보다 크고 콘솔에 404 오류가 없다
