# Proposal

## Why

12개 페이지가 공유하는 헤더([src/partials/header.html](../../../src/partials/header.html))는 시맨틱 HTML만 있고 스타일이 없어, 로고·내비게이션이 브라우저 기본 모양으로 보인다. 또 SCSS 기반 값이 이전 챌린지 템플릿(Roboto, 회색 토큰, Work Sans `@font-face`, 흰 배경)으로 남아 있어 어떤 컴포넌트도 디자인 값으로 스타일링할 수 없다. [doc/figma-html-css.md](../../../doc/figma-html-css.md) 절차에 따라 기반 값을 이번 디자인으로 교체하고, 모든 페이지에 먼저 보이는 헤더를 Figma와 일치시킨다.

## What Changes

- **기반 값 교체**(figma-html-css.md §2)
  - `_variables.scss`: 이전 토큰(`$font-primary` Roboto, `$grey-*`, `$bg-*`, `$font-size-preset*`)을 지우고 Figma 색(`blue-900`, `blue-300`, `white`)과 서체(Bellefair, Barlow, Barlow Condensed), 헤더가 쓰는 글자 크기 토큰을 추가한다. 분기점(768px·1024px)은 유지한다.
  - `_mixins.scss`: `font-style()`에 서체 인자를 추가해 세 서체를 쓸 수 있게 한다.
  - `_fonts.scss`: 쓰지 않는 Work Sans `@font-face`를 지운다(글꼴은 Google Fonts `<link>`로 로드 중).
  - `_base.scss`: `body` 배경 `blue-900`, 글자색 white, 기본 서체 Barlow. 어두운 배경에서 보이도록 전역 `:focus-visible` outline을 white로 바꾼다.
- **헤더 SCSS**: 새 컴포넌트 파셜(`components/_site-header.scss`)에 로고, 데스크톱 장식선, 반투명 블러 내비게이션 바, 링크의 현재·hover·focus-visible 상태, 모바일 햄버거 버튼을 모바일 우선으로 작성한다.
- **모바일 메뉴**: 사용자 결정에 따라 **JavaScript는 이번 변경에 포함하지 않는다**.
  - 스크립트가 없을 때도 모바일에서 링크를 쓸 수 있도록, 기본 상태에서는 토글 버튼을 숨기고 내비게이션 목록을 헤더 아래에 보여 주는 임시 배치를 둔다(Figma 모바일 화면과 의도적으로 다름).
  - 이후 JS 단계가 붙일 상태 클래스(`is-enhanced`, `is-menu-open`)에 맞춘 오른쪽 패널 스타일을 미리 작성하고, 검증 때 클래스를 임시로 붙여 확인한다.
- HTML 구조는 바꾸지 않는다. 필요해지면 최소로 바꾸고 보고한다. 페이지별 배경 이미지와 본문 섹션 스타일은 범위 밖이다.

## Capabilities

### New Capabilities

(없음)

### Modified Capabilities

- `site-layout`: 기존 요구사항은 그대로 두고 헤더의 시각·상호작용 요구사항을 추가한다(사이트 기본 색·서체, 화면별 헤더 배치, 링크 상태, 포커스 표시, 움직임 줄이기, JS 없는 모바일 대체 배치, 메뉴 열림 상태 스타일).

## Impact

- 수정: `src/scss/abstracts/_variables.scss`, `src/scss/abstracts/_mixins.scss`, `src/scss/base/_fonts.scss`, `src/scss/base/_base.scss`, `src/scss/style.scss`
- 추가: `src/scss/components/_site-header.scss`
- 영향: `body` 배경·글자색·서체와 전역 포커스 outline이 바뀌므로 아직 스타일이 없는 본문도 어두운 배경의 흰 글자로 보인다(의도된 기반 변경).
- 변경 없음: `src/js`, `src/pages`, `dist`(직접 수정·삭제 금지). `src/partials/header.html`은 원칙적으로 그대로 둔다.
- 알려진 제약: JS 단계 전까지 모바일은 Figma의 햄버거 메뉴 대신 임시 목록 배치로 보인다.
