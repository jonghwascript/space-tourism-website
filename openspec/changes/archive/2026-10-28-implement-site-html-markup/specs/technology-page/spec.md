# Spec Delta

## Purpose

Technology 페이지 3개(Launch vehicle, Spaceport, Space capsule)의 제목, 용어 소개, 설명, 화면 방향에 맞는 이미지를 정의해 방문자가 우주 발사 기술 용어를 익힐 수 있게 한다.

## ADDED Requirements

### Requirement: Technology 페이지 제목
Technology 페이지는 "Space launch 101"을 `<h1>`으로 SHALL 제공하며, 번호 "03"은 장식으로 처리해 제목 이름에 중복되지 않게 한다.

#### Scenario: 제목 이름
- **WHEN** `technology-vehicle.html`의 `<h1>` 접근 가능한 이름을 확인한다
- **THEN** "Space launch 101"이다

### Requirement: 기술 패널 내용
각 기술 패널은 "The terminology…" 소개 문구, 기술 이름 `<h2>`, 설명 문단, 이미지를 SHALL 가지며, 소개 문구는 이름보다 먼저 읽힌다. 텍스트는 starter 페이지 및 `data.json`과 일치한다.

#### Scenario: Spaceport 패널
- **WHEN** Spaceport 패널을 확인한다
- **THEN** 소개 문구 다음에 `<h2>` "Spaceport"가 오고 설명이 starter 원문과 같다

### Requirement: 화면별 기술 이미지
각 패널 이미지는 데스크톱 분기점 이상에서 portrait 자산을, 그 미만에서 landscape 자산을 SHALL 표시하며, 분기점은 SCSS의 desktop 분기점과 같은 값을 사용한다. 이미지는 기술을 설명하는 `alt`와 표시 크기 기준 `width`·`height`를 가진다.

#### Scenario: 데스크톱 이미지
- **WHEN** Chromium viewport 1440px에서 `technology-capsule.html`을 연다
- **THEN** 표시 이미지의 `currentSrc`가 `image-space-capsule-portrait.jpg`이다

#### Scenario: 모바일 이미지
- **WHEN** Chromium viewport 375px에서 같은 페이지를 연다
- **THEN** 표시 이미지의 `currentSrc`가 `image-space-capsule-landscape.jpg`이다

#### Scenario: 분기점 경계
- **WHEN** viewport 1023px과 1024px에서 각각 확인한다
- **THEN** 1023px은 landscape, 1024px은 portrait 자산을 표시한다
