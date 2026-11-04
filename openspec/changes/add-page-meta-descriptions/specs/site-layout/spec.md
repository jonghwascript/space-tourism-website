# Spec Delta

## ADDED Requirements

### Requirement: 페이지별 메타 설명
모든 페이지는 초기 HTML의 `<head>`에 비어 있지 않은 `<meta name="description" content="...">`을 정확히 하나 SHALL 가진다. 설명은 문서 언어에 맞는 영어로 작성하고, 해당 URL에서 처음 표시되는 콘텐츠를 정확히 요약하며 12개 페이지 간 서로 달라야 한다. JavaScript 실행에 의존하지 않는다.

#### Scenario: 전체 페이지 설명
- **WHEN** 12개 페이지의 생성 HTML에서 description 메타 태그를 확인한다
- **THEN** 각 head에 정확히 하나씩 있고 content가 공백·placeholder가 아니며 12개 값이 모두 고유하다

#### Scenario: 선택 항목에 맞는 요약
- **WHEN** `destination-mars.html`, `crew-pilot.html`, `technology-capsule.html`을 직접 연다
- **THEN** 설명은 각각 Mars, Victor Glover, Space capsule을 식별하고 해당 페이지 본문의 내용을 요약한다

#### Scenario: 스크립트 비활성화
- **WHEN** JavaScript를 끄고 임의의 페이지를 직접 연다
- **THEN** 설명이 초기 HTML에 완성된 상태로 있으며 해당 URL의 초기 선택 항목과 일치한다

#### Scenario: 설명 속성의 안전한 출력
- **WHEN** 생성 HTML을 HTML 파서로 해석한다
- **THEN** 설명 전체가 하나의 content 속성 값으로 읽히고 설명 텍스트 때문에 추가 속성이나 요소가 생기지 않는다

## MODIFIED Requirements

### Requirement: 공통 마크업 단일 원본
헤더와 공통 `<head>` 요소는 하나의 원본에서 SHALL 생성되어 12개 페이지에서 구조가 일치하며, 페이지마다 다른 값은 현재 페이지 표시와 제목 및 메타 설명이다.

#### Scenario: 헤더 일치
- **WHEN** 빌드된 12개 페이지의 헤더 HTML을 `aria-current` 속성만 제외하고 비교한다
- **THEN** 모두 동일하다

#### Scenario: 공통 head 구조
- **WHEN** 12개 페이지의 head를 제목 텍스트와 description의 content 값만 제외하고 비교한다
- **THEN** 공통 메타·링크·스크립트 구조가 모두 동일하다
