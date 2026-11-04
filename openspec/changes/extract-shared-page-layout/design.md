# Design

## Context

동기는 proposal.md의 Why를 따른다. 네 페이지 SCSS의 `.c-page--*`는 같은 골격 선언 다섯 개와 서로 다른 반응형 배경을 함께 담고 있다. 12개 HTML의 body 모두 `.c-page`와 페이지 modifier를 함께 가진다. 현재 `.c-page` 자체의 스타일 규칙은 없다.

`style.scss`는 base → layout → components → pages → utilities 순서로 로드한다. reset은 모든 margin을 0으로 설정하며, 스킵 링크는 고정 배치여서 body Grid의 행을 차지하지 않는다.

## Goals / Non-Goals

**Goals:** 기존 `.c-page`에 공통 골격을 부여하고, 헤더와 본문의 공간 배분·최소 높이·좁은 화면의 열 너비를 보존한다.

**Non-Goals:** 배경 처리 공통화, 본문 subgrid 재설계, 클래스명 변경, 새 유틸리티·mixin 도입, HTML·JS·메타데이터 변경.

## Decisions

### 공통 page 컴포넌트

`components/_page.scss`에 `.c-page` 규칙을 만들고 `style.scss`의 components 구간에서 pages보다 먼저 로드한다. 기존 프로젝트가 재사용 스타일을 components에 두도록 안내하고 있고, 이미 모든 페이지가 공통 클래스를 갖고 있어 추가 마크업 없이 적용할 수 있다.

body 전역 규칙에 넣으면 `.c-page`가 없는 문서에도 영향을 준다. mixin은 소스 호출만 줄이고 동일 CSS 선언을 네 번 출력한다. modifier 선택자들을 묶으면 공통 클래스가 있는데도 네 페이지 이름에 결합된다. 따라서 공통 클래스를 직접 사용한다.

### 다섯 선언의 값과 순서 보존

```scss
.c-page {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: minmax(0, 1fr);
  min-block-size: 100vh;
  min-block-size: 100svh;
}
```

`100vh` 다음 `100svh`를 유지해 미지원 환경의 fallback을 보존한다. 높이를 고정하지 않아 긴 콘텐츠가 문서를 늘릴 수 있다. `minmax(0, 1fr)`도 유지해 열의 자동 최소 너비로 인한 확장을 방지한다. 이 선언은 요소의 최소 크기나 모든 종류의 넘침을 자동으로 해결하는 보장은 아니다.

네 modifier에서는 이 다섯 선언만 제거한다. 각 배경 shorthand와 tablet·desktop의 background-image는 그대로 둔다. 공통 골격 설명은 새 partial로 옮기고 페이지 상단 주석은 배경 역할에 맞게 정리한다.

### 검증 방법

구현 전 원본으로 SCSS와 12개 HTML을 메모리에 생성해 기준을 확보한다. 구현 후 같은 방법으로 생성하고 같은 브라우저·viewport·루트 글꼴·자산 조건에서 비교한다. dist 삭제가 포함된 build/dev 명령은 실행하지 않는다.

- 정적 검토: 다섯 선언이 공통 규칙 한 곳에 있고 네 modifier에서 제거됐는지, `@use` 순서와 12개 body의 클래스 연결을 확인한다.
- 컴파일: `node -e "require('sass').compile('src/scss/style.scss')"`로 출력 파일 없이 검사한다.
- Chrome 및 실행 가능한 Firefox에서 12개 URL의 기본 상태를 375×812, 768×1024, 1440×900으로 비교한다. body의 display·계산된 Grid 행/열·min-block-size·배경과 헤더/main의 위치·크기가 기준과 같아야 한다.
- 네 그룹의 대표 페이지는 767/768px 및 1023/1024px 경계, 320×568, 667×375, 375×667에서 루트 글꼴 200% 상태를 추가로 확인한다. 긴 콘텐츠가 늘어나는지, 기존 대비 가로 넘침·겹침이 생기는지 확인한다.
- 대표 페이지에서 모바일 메뉴 열림·닫힘, 메뉴를 연 채 767→768→767px 전환, JS 비활성 상태를 확인한다. body 골격 추출로 헤더/main 배치나 메뉴 스크롤에 회귀가 생기지 않아야 한다.
- 브라우저를 실행할 수 없는 항목은 미검증으로 남긴다. 컴파일이나 측정값 비교만으로 시각적 정확성·접근성 전체 통과를 주장하지 않는다.

## Risks / Trade-offs

- [선택자와 로드 위치 이동에 따른 캐스케이드 변화] → 기존과 동일한 클래스 명시도를 사용하고, computed style 및 요소 크기를 변경 전후 비교한다.
- [공통 선언 제거 누락 또는 높이 fallback 순서 변경] → 네 원본과 컴파일 CSS를 대조한다.
- [본문의 가변 높이·메뉴 상태에서만 나타나는 회귀] → 작은 화면·가로 모드·확대·메뉴 전환을 대표 페이지에서 확인한다.

## Migration Plan

기준 생성 후 공통 partial 추가·로드와 네 modifier의 중복 제거를 함께 적용한다. 검증에서 회귀가 발견되면 이 리팩터링의 변경분만 수정하거나 복원한다. 데이터 이관과 패키지 추가는 없다.
