# Spec Delta

## ADDED Requirements

### Requirement: Explore 링크 이름
Explore 링크의 접근 가능한 이름은 목적지를 알 수 있도록 "Explore destinations"로 SHALL 제공된다. 화면에 보이는 글자는 "Explore"(대문자 표시) 그대로이며 이름의 맨 앞에 포함된다. 추가 단어는 화면에 보이지 않고 원의 크기·글자 위치에 영향을 주지 않는다.

#### Scenario: 접근 가능한 이름
- **WHEN** 접근성 트리에서 홈의 Explore 링크 이름을 확인한다
- **THEN** 이름이 "Explore destinations"이고 "Explore"로 시작한다

#### Scenario: 화면 표시 유지
- **WHEN** 375px, 768px, 1440px에서 Explore 링크를 측정한다
- **THEN** 링크 상자가 144×144, 272×272, 272×272px 그대로이고, 보이는 글자는 "EXPLORE"뿐이며 글자 중심이 원 중심과 1px 이내다

#### Scenario: 목적지 유지
- **WHEN** Explore 링크에 포커스를 두고 Enter를 누른다
- **THEN** `destination-moon.html`로 이동한다
