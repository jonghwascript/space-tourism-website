# Proposal

## Why

홈 페이지(`index.html`)는 마크업만 있고 `c-page--home`, `c-hero`, `c-explore`에 스타일이 없어 기본 서체로 쌓인 글자와 일반 링크만 보인다. README는 "기기 화면 크기에 맞는 최적 레이아웃"과 "모든 인터랙티브 요소의 hover 상태"를 요구하고, 헤더는 이미 모바일·태블릿·데스크톱 배치를 마쳤으므로 첫 화면인 홈 본문을 같은 분기점(768px, 1024px)으로 맞춘다.

## What Changes

- 홈 페이지에 화면 크기별 배경 이미지(`background-home-{mobile,tablet,desktop}.jpg`)를 화면 전체에 채운다.
- 헤더 아래 본문을 최소 화면 높이까지 채우고, Figma 값에 따라 배치한다.
  - 모바일(768px 미만): 세로, 가운데 정렬, 패딩 24px
  - 태블릿(768px 이상 1024px 미만): 세로, 가운데 정렬, 위아래 패딩 128px·좌우 40px, 텍스트 폭 512px
  - 데스크톱(1024px 이상): 최대 폭 1110px 가로 배치, 텍스트 왼쪽·Explore 오른쪽, 아래 정렬, 위아래 패딩 128px
- 제목·소개문 타이포그래피를 Figma text-preset 값(eyebrow 16/28px, "Space" 80/144px, 소개문 15/16/18px)으로 적용한다.
- Explore 링크를 흰 원(모바일 144px, 태블릿·데스크톱 272px)으로 표시하고, hover·키보드 포커스 상태와 움직임 줄이기·강제 색상 모드 대응을 추가한다.
- 작은 화면, 가로 모드, 텍스트 200%에서 가로 넘침이 생기지 않게 한다.

범위 밖: Destination·Crew·Technology 페이지 스타일, 헤더 변경, 마크업 구조 변경(필요하면 클래스 추가만).

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `home-page`: 기존 마크업 요구사항은 유지하고, 배경 이미지, 화면 크기별 본문 배치, 타이포그래피, Explore 원형 버튼과 상태(hover·포커스·움직임 줄이기·강제 색상), 넘침 방지 요구사항을 추가한다.

## Impact

- `src/scss/pages/_home.scss`: 홈 배경·본문·Explore 스타일 추가(주 변경 파일)
- `src/scss/abstracts/_variables.scss`: 홈에서 필요한 서체 크기 토큰을 추가할 수 있다
- `src/pages/index.html`: 스타일 연결에 필요한 경우에만 클래스 추가. 텍스트·링크·제목 구조는 바꾸지 않는다
- 다른 11개 페이지와 헤더: 변경 없음(회귀 캡처로 확인)
- 의존성 추가 없음
