# Proposal

## Why

Home·Destination·Crew·Technology의 페이지 modifier에 동일한 Grid·최소 높이 선언 다섯 개가 반복되어, 공통 골격을 수정할 때 네 파일을 함께 관리해야 한다. 12개 페이지에 이미 있는 `.c-page`를 활용해 중복을 제거한다.

## What Changes

- 공통 `.c-page` 규칙에 `display: grid`, `grid-template-rows: auto 1fr`, `grid-template-columns: minmax(0, 1fr)`, `min-block-size: 100vh`와 `100svh`를 한 번 선언한다.
- 네 페이지 modifier에서 해당 선언을 제거하고 관련 주석을 실제 책임에 맞춘다.
- 페이지별 배경·분기점과 본문 레이아웃, 기존 화면 크기·동작은 보존한다.
- 기존 HTML 클래스와 JavaScript, 빌드 파이프라인은 유지한다.

## Capabilities

### New Capabilities

없음.

### Modified Capabilities

없음. 기존 동작을 보존하는 SCSS 리팩터링이므로 `.openspec.yaml`에 `skip_specs: true`를 선언한다. `site-layout`의 요구사항 변경이나 delta spec 추가는 필요하지 않다.

## Impact

- 새 `src/scss/components/_page.scss`와 이를 로드하는 `src/scss/style.scss`.
- `src/scss/pages/_home.scss`, `_destination.scss`, `_crew.scss`, `_technology.scss`의 공통 선언 및 주석.
- 추가 패키지 없음. `dist`는 수정·삭제하지 않고 메모리 또는 별도 임시 출력으로 검증한다.
- 진행 중인 `add-page-meta-descriptions`의 스펙 동기화·아카이브는 별도 작업이며 이 변경에서 수행하지 않는다.
