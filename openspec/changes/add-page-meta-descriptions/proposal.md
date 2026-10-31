# Proposal

## Why

12개 페이지가 공유하는 `src/partials/head.html`에 메타 설명이 없어, 사용자가 Lighthouse SEO 감사에서 모든 페이지가 지적된다고 보고했다. 각 URL의 초기 콘텐츠를 설명하는 메타 정보를 정적 HTML에 제공한다.

## What Changes

- 공통 head partial에서 `<meta name="description" content="...">`을 한 번 출력한다.
- 홈·목적지 4개·승무원 4개·기술 3개 페이지가 각 콘텐츠에 맞는 고유한 영어 설명을 전달한다.
- JavaScript 없이도 처음 받은 HTML에 완성된 설명을 제공한다.
- 공통 head가 페이지별 설명 값을 허용하도록 기존 단일 원본 요구사항을 조정한다.
- 탭 전환 시 메타 설명 동적 갱신, Open Graph·canonical·구조화 데이터 추가, SEO 전체 점수 개선은 범위 밖이다.

## Capabilities

### New Capabilities

없음.

### Modified Capabilities

- `site-layout`: 페이지별 메타 설명을 추가하고 공통 마크업의 페이지별 가변 값에 설명을 포함한다.

## Impact

- `src/partials/head.html`, `src/pages/*.html` 12개 파일.
- 기존 제목·스타일·스크립트·본문과 Gulp 파이프라인은 유지한다. 새 패키지는 필요하지 않다.
- dist 삭제 금지 지침에 따라 메모리/별도 임시 출력으로 HTML을 생성해 검증한다.
