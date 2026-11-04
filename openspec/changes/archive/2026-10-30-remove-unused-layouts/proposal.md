# Proposal

## Why

`src/scss/layout/_every-layout.scss`는 실제 페이지에서 쓰는 Stack·Cluster 외에도 여러 범용 레이아웃과 옵션을 모두 CSS로 출력한다. 참조가 없는 규칙을 제거해 유지보수 범위와 출력 CSS를 줄인다.

## What Changes

- `.l-stack`, `.l-stack > *`, `.l-cluster`의 현재 선언과 로딩 순서를 유지한다.
- 소스 HTML·partial·JavaScript·Storybook 참조가 없는 레이아웃과 Stack·Cluster 옵션을 제거한다.
- 제거한 레이아웃만 소비하는 전역 토큰은 남은 소비자와 토큰 간 의존성을 확인한 뒤 함께 정리한다.
- 화면 배치, 반응형 전환, 메뉴·탭 동작 및 접근성은 기존대로 유지한다.
- 페이지 골격 통합, 공통 mixin 정리, Storybook 구성 변경은 범위 밖이다.

## Capabilities

### New Capabilities

없음.

### Modified Capabilities

없음. 기존 사용자 동작과 요구사항을 유지하는 순수 리팩터링이므로 `.openspec.yaml`에 `skip_specs: true`를 지정한다.

## Impact

- 주 대상: `src/scss/layout/_every-layout.scss`.
- 연관 대상: `src/scss/base/_base.scss`의 제거 대상 전용 토큰과 주석.
- `src/scss/style.scss`의 기존 import는 유지한다. 의존성 추가나 HTML·JavaScript 수정은 필요하지 않다.
- 검증은 삭제 없는 메모리 컴파일과 변경 전후 CSS 대조를 우선한다. `dist`를 삭제하는 build/dev는 실행하지 않는다.
