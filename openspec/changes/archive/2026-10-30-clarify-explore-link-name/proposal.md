# Proposal

## Why

홈의 Explore 링크(`src/pages/index.html` 23행)는 접근 가능한 이름이 "Explore" 한 단어입니다. 목적지는 Destination 그룹의 첫 페이지(`destination-moon.html`)인데, 스크린 리더의 링크 목록처럼 링크만 따로 보면 어디로 가는지 알기 어렵습니다.

제목("So, you want to travel to Space")과 소개문 같은 주변 문맥으로 이해할 여지가 있어, WCAG 2.4.4(Link Purpose, In Context) 위반으로 단정하지는 않습니다. 다만 W3C는 링크 이름만으로 목적을 알 수 있게 하는 방식(2.4.9, AAA)을 권장하므로 이름을 보강합니다.

## What Changes

- Explore 링크 안에 숨긴 텍스트 " destinations"를 추가해 접근 가능한 이름을 "Explore destinations"로 만듭니다(사용자 결정).
  - 방식은 헤더 번호·Technology 탭과 같은 `.u-sr-only` 스팬입니다.
- 화면 글자("EXPLORE"), 원 모양, 크기, hover·포커스·강제 색상 동작, 목적지(`./destination-moon.html`)는 바꾸지 않습니다.
- 화면 글자가 이름 맨 앞에 그대로 남아 WCAG 2.5.3(Label in Name)을 지킵니다. "click Explore" 같은 음성 명령도 계속 동작합니다.

## Capabilities

### New Capabilities

없음

### Modified Capabilities

- `home-page`: Explore 링크의 접근 가능한 이름 요구사항을 추가합니다. 기존 "Explore 링크"·"Explore 원형 링크" 등의 요구사항은 바꾸지 않습니다.

## Impact

- `src/pages/index.html`: 23행 링크 안에 스팬 하나 추가. 같은 파일에 있는 직전 change(헤더 `landing` 값)의 미커밋 변경은 건드리지 않습니다.
- SCSS·JS: 변경 없음(기존 `.u-sr-only` 사용)
- 의존성 추가 없음
