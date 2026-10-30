# Design

## Context

동기는 proposal.md의 Why를 따른다. `style.scss`가 Every Layout 전체를 로딩하며 페이지·partial에서 사용하는 레이아웃은 `.l-stack`과 `.l-cluster`다. JavaScript는 메뉴 상태 클래스를 변경하지만 추가 레이아웃 클래스를 생성하지 않는다. 현재 Storybook 샘플은 Hello World만 출력하며 preview는 같은 SCSS 진입점을 로딩한다.

`_base.scss`의 `--s0`, `--s1`은 페이지와 헤더에서 사용하고 `--ratio`는 body의 line-height에서도 사용한다. 레이아웃 제거를 이유로 이 의존성을 지우면 안 된다. Gulp build/default는 cleanTask로 `dist`를 삭제하므로 검증에 사용할 수 없다.

## Goals / Non-Goals

**Goals:** 제거 목록을 명시하고, 살아 있는 선택자의 선언·순서와 토큰 의존성을 보존한다.

**Non-Goals:** 클래스 이름·파일 구조 변경, 레이아웃 대체 구현, 전체 토큰 체계나 Sass mixin 정리는 하지 않는다.

## Decisions

### 1. 기본 Stack·Cluster를 현재 모듈에 유지

유지할 규칙은 `.l-stack`, `.l-stack > *`, `.l-cluster`다. 각 규칙의 `--space` 기본값, gap fallback, 자식 margin 초기화, flex 속성을 그대로 둔다. 파일 분할이나 inline 스타일로 대체하는 방법은 불필요하게 cascade 변경 범위를 늘리므로 선택하지 않는다.

참조가 없는 다음 규칙을 관련 주석·전용 @supports 블록과 함께 제거한다.

- Stack 옵션: `[data-recursive]` 관련 세 규칙, `.push-bottom`, `.l-stack-divided`.
- Box·Center·Content Grid 및 모든 data 속성 옵션과 자식 규칙.
- Cluster의 `[data-justify='start']`, `[data-justify='between']` 옵션.
- Sidebar, Switcher, Cover, Grid, Frame, Reel, Imposter, Icon, With Icon의 기본·자식·상태·pseudo-element 규칙.

기존 archive 문서와 생성된 dist의 문자열은 현재 소스의 소비자로 보지 않는다. 구현 시 최신 pages·partials·stories·JS를 다시 대조하고 새 소비자가 있으면 해당 규칙은 보존한다.

### 2. 제거 대상 전용 색상·테두리 토큰만 정리

`_base.scss`의 `--color-light`, `--color-dark`, `--border-thin`, `--border-color`, `--border-radius`는 현재 Box·Reel 규칙에서만 소비한다. 이 규칙을 지운 뒤 남은 소스 소비자가 없음을 확인하고 다섯 선언과 해당 설명 주석을 제거한다. 모듈러 스케일 전체 정리는 범위 밖이며 `--base-size → --s0 → --s1` 및 `--ratio`를 유지한다. 전역 토큰을 전부 유지하는 대안은 제거한 기능의 잔여물만 남기므로 선택하지 않는다.

### 3. 삭제 없는 CSS 대조로 회귀 여부 확인

수정 전에 Sass 메모리 컴파일로 CSS 기준본을 확보한다. 수정 후 기준본에서 명시한 미사용 규칙·다섯 토큰만 제외한 결과와 비교해 나머지 선택자의 선언 및 순서가 같은지 확인하고 CSS 바이트 수 변화를 기록한다. 컴파일 성공과 CSS 감소만으로 시각적 정확성을 판정하지 않는다.

브라우저 확인에는 gulp-file-include로 12개 페이지를 메모리 또는 별도 임시 출력 폴더에 생성하고 최신 컴파일 CSS·원본 정적 자산을 제공한다. dist는 수정·삭제하지 않는다. Chrome·Firefox 중 실행 가능한 브라우저에서 4개 대표 페이지를 375×812, 768×1024, 1440×900으로 확인하고, 탭별 숨김/선택 상태 및 모바일 메뉴를 점검한다. 767/768px·1023/1024px 전환, 320px, 가로 667×375, 텍스트 200% 확대는 기존 배치 대비 회귀가 없는지 확인한다. 실행할 수 없는 브라우저·항목은 미검증으로 기록한다.

## Risks / Trade-offs

- [참조 검색에서 동적 클래스나 숨긴 탭을 놓칠 위험] → JS·Storybook과 모든 partial을 포함하고, 모든 탭의 마크업을 대조한다.
- [변수 상속·cascade 변경으로 간격이 달라질 위험] → 살아 있는 규칙과 import 순서를 유지하고 CSS 대조 및 브라우저 확인을 함께 한다.
- [외부에서 범용 클래스를 소비할 가능성] → 현재 저장소 소스를 기준으로 정리한다. 배포된 독립 CSS 라이브러리의 호환성을 제공하는 작업은 아니다.

## Migration Plan

의존성이나 데이터 마이그레이션은 없다. 구현 diff에서 지정한 미사용 규칙·전용 토큰만 삭제하고 검증한다. 회귀가 확인되면 해당 삭제분만 복원하며 기존 사용자 변경을 되돌리지 않는다.
