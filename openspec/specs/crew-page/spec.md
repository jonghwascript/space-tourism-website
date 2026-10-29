# crew-page Specification

## Purpose

Crew 페이지 4개(Commander, Mission Specialist, Pilot, Flight Engineer)의 제목, 승무원 역할·이름·소개, 사진을 정의해 방문자가 승무원 정보를 확인할 수 있게 한다.

## Requirements

### Requirement: Crew 페이지 제목
Crew 페이지는 "Meet your crew"를 `<h1>`으로 SHALL 제공하며, 번호 "02"는 장식으로 처리해 제목 이름에 중복되지 않게 한다.

#### Scenario: 제목 이름
- **WHEN** `crew-commander.html`의 `<h1>` 접근 가능한 이름을 확인한다
- **THEN** "Meet your crew"이다

### Requirement: 승무원 패널 내용
각 승무원 패널은 역할, 이름 `<h2>`, 소개 문단, 사진을 SHALL 가지며, 역할은 화면에서 이름 위에 보이고 읽기 순서에서도 이름보다 먼저 온다. 텍스트는 starter 페이지 및 `data.json`과 일치한다.

#### Scenario: Commander 패널
- **WHEN** Douglas Hurley 패널을 확인한다
- **THEN** 역할 "Commander"가 `<h2>` "Douglas Hurley"보다 먼저 나오고 소개문이 starter 원문과 같다

#### Scenario: 원문 오타 보존
- **WHEN** Victor Glover 소개문을 확인한다
- **THEN** starter 원문 "F/A-18.He"가 수정되지 않은 채 유지되고, 인계 보고서에 오타 의심 문구로 기록되어 있다

### Requirement: 승무원 사진
각 패널 사진은 제공 자산의 webp를 우선하고 png로 대체하는 형태로 SHALL 제공되며, 사진 속 인물을 설명하는 `alt`와 표시 크기 기준 `width`·`height`를 가진다.

#### Scenario: 사진 자산
- **WHEN** Mark Shuttleworth 패널의 이미지 소스를 확인한다
- **THEN** `./images/crew/image-mark-shuttleworth.webp`와 `.png`를 참조하고 `alt`에 인물 이름이 포함된다

### Requirement: 승무원 파일과 항목 대응
Crew 페이지 파일은 다음 항목을 초기 선택으로 SHALL 가진다: `crew-commander.html` → Douglas Hurley, `crew-specialist.html` → Mark Shuttleworth, `crew-pilot.html` → Victor Glover, `crew-engineer.html` → Anousheh Ansari.

#### Scenario: 파일별 초기 항목
- **WHEN** `crew-specialist.html`을 연다
- **THEN** 표시되는 패널의 `<h2>`가 "Mark Shuttleworth"이다
