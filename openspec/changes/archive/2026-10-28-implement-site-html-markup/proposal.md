# Proposal

## Why

`src/pages/*.html` 12개 파일은 Frontend Mentor starter의 평문 텍스트만 담고 있어 랜드마크·제목·링크·이미지가 없다. [doc/figma-html.md](../../../doc/figma-html.md) 지침에 따라 Figma 디자인(스타일 가이드, 배경, 내비 메뉴, 모바일·태블릿·데스크톱 A 프레임, hover 상태)을 기준으로 CSS 없이도 내용과 읽기 순서가 맞는 시맨틱 HTML을 먼저 완성해, 이후 SCSS 단계(figma-html-css.md)가 클래스를 다시 설계하지 않고 바로 스타일을 입힐 수 있게 한다.

## What Changes

- 12개 페이지(`index`, `destination-{moon,mars,europa,titan}`, `crew-{commander,pilot,specialist,engineer}`, `technology-{vehicle,spaceport,capsule}`)를 시맨틱 HTML로 작성한다.
- 모든 페이지가 공유하는 `<head>` 요소·건너뛰기 링크·헤더(로고, 주 내비게이션, 모바일 메뉴 토글)를 `src/partials/`로 분리하고 `@@include`로 불러온다. 현재 페이지는 `aria-current="page"`로 표시한다.
- Destination·Crew·Technology는 사용자 결정에 따라 **ARIA 탭 위젯** 마크업(tablist/tab/tabpanel)으로 작성한다. 각 페이지 파일은 같은 그룹의 모든 탭 패널을 담고, 파일 이름에 해당하는 탭을 초기 선택 상태로 둔다.
- 탭 전환·모바일 메뉴 열기의 **동작(JavaScript)은 이번 변경에 포함하지 않는다**. ARIA 초기값만 작성하고 미동작 상태를 보고서에 적는다.
- 이미지는 `src/images`의 제공 자산(webp/png, portrait/landscape)을 사용하고, 새 자산은 Figma에 있는데 제공 자산에 없는 경우에만 추가한다.
- CSS 단계를 위한 스타일 인계표(클래스별 Figma 값, 상태, 반응형 차이)를 change 폴더의 `handoff.md`로 남긴다.
- `src/scss/**`, `src/js/**`, `dist/`는 수정하지 않는다. 인라인 `style`과 `<style>`을 쓰지 않는다.

## Capabilities

### New Capabilities

- `site-layout`: 모든 페이지 공통의 문서 골격(lang, 고유 title, 글꼴 링크, 건너뛰기 링크, `main` 랜드마크)과 헤더·주 내비게이션·모바일 메뉴 토글 마크업
- `content-tabs`: Destination·Crew·Technology가 공유하는 탭 위젯의 구조·ARIA 초기 상태·페이지 파일별 초기 선택 규칙
- `home-page`: 홈 히어로의 제목·소개문·Explore 링크
- `destination-page`: 목적지 4곳의 이미지·이름·설명·거리/이동 시간 정보
- `crew-page`: 승무원 4명의 역할·이름·소개·사진
- `technology-page`: 기술 3종의 용어 소개·이름·설명·화면 방향별 이미지

### Modified Capabilities

(없음 — `openspec/specs`에 기존 capability가 없다.)

## Impact

- 수정: `src/pages/*.html` 12개 파일
- 추가: `src/partials/*.html`(공통 head·헤더), 필요 시 `src/images/`의 누락 자산
- 추가: `openspec/changes/implement-site-html-markup/handoff.md`(스타일 인계표·검증 보고)
- 빌드: `gulp html` 작업이 `@@include`와 context 변수를 처리한다. 현재 `node_modules`가 없어 미리보기 전에 `npm ci`가 필요하다.
- 영향 없음: `src/scss`, `src/js`, `dist`(직접 수정·삭제 금지)
- 알려진 제약: JS 단계 전까지 비선택 탭 패널은 `hidden`이라 해당 파일에서 볼 수 없고(각 패널은 자기 페이지 파일에서 초기 선택으로 확인 가능), 모바일 메뉴는 열리지 않는다.
