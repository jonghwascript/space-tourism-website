# Spec Delta

## Purpose

Space tourism 사이트의 모든 페이지가 공유하는 문서 골격, 건너뛰기 링크, 헤더와 주 내비게이션 마크업을 정의해 페이지 간 일관된 구조와 접근성 기반을 제공한다.

## ADDED Requirements

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
헤더는 주 내비게이션 목록을 제어하는 `<button type="button">`을 SHALL 가지며, 초기값 `aria-expanded="false"`, 목록 ID를 가리키는 `aria-controls`, 숨긴 텍스트로 된 접근 가능한 이름을 갖는다. 햄버거·닫기 아이콘은 장식(`alt=""`)이다. 열고 닫는 동작은 이 변경에 포함하지 않는다.

#### Scenario: 토글 초기 상태
- **WHEN** 임의의 페이지에서 메뉴 토글 버튼을 확인한다
- **THEN** `aria-expanded="false"`이고 `aria-controls` 값과 같은 ID의 요소가 존재하며 버튼 이름이 "Open menu"처럼 동작을 설명한다

#### Scenario: 아이콘 중복 읽기 방지
- **WHEN** 버튼 안의 아이콘 이미지를 확인한다
- **THEN** 모든 아이콘이 `alt=""`를 가진다

### Requirement: 공통 마크업 단일 원본
헤더와 공통 `<head>` 요소는 하나의 원본에서 SHALL 생성되어 12개 페이지에서 내용이 일치하며, 페이지마다 다른 값은 현재 페이지 표시와 제목뿐이다.

#### Scenario: 헤더 일치
- **WHEN** 빌드된 12개 페이지의 헤더 HTML을 `aria-current` 속성만 제외하고 비교한다
- **THEN** 모두 동일하다
