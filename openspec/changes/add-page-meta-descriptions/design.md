# Design

## Context

proposal.md의 Why를 따른다. 12개 HTML이 인자 없이 `../partials/head.html`을 include하고 제목은 각 파일에서 선언한다. head에는 charset·viewport와 공통 자산만 있다. Gulp는 파일별 include context를 전달할 수 있으며 기존 header·탭 partial이 이미 이 방식을 사용한다.

기존 site-layout의 공통 원본 요구사항은 페이지별 가변 값을 현재 표시·제목으로 제한하므로 이번 delta에서 설명도 허용한다. 모든 문서는 lang=en이다. `data.json` 및 실제 partial 본문은 내용 확인에 사용하며 새 데이터 파이프라인을 추가하지 않는다.

## Goals / Non-Goals

**Goals:** HTML 첫 응답에 페이지별 설명을 제공하고, 태그 구조는 공통 원본 한 곳에서 관리한다.

**Non-Goals:** JavaScript 탭 전환에 따른 description 갱신, 검색 결과 노출 문구 보장, 다른 SEO 항목 변경. 탭으로 화면을 바꿔도 설명은 최초 접속 URL의 값이며 새로고침하면 해당 파일의 설명을 받는다.

## Decisions

### 공통 태그와 페이지별 include 인자

head partial에 `@@description`을 content 값으로 사용하는 태그 하나를 추가하고, 12개 페이지의 include에 description 문자열을 명시한다. 모든 페이지에 같은 문구를 넣는 대안은 항목별 콘텐츠를 설명하지 못하며, 각 head에 태그를 직접 복사하면 공통 원본의 이점을 잃는다. 기본 문구 fallback으로 누락을 감추지 않고 전체 출력 검증으로 누락을 찾는다.

### 본문을 근거로 짧은 영어 요약 작성

아래 문구를 구현 기준으로 사용한다. 검색 순위·글자 수 기준에 관한 보장은 하지 않는다. 단순 키워드 목록이나 새 사실을 추가하지 않는다.

| 페이지 | description 초안 |
| --- | --- |
| index.html | Explore space tourism destinations, meet the crew, and discover the launch vehicles, spaceport, and capsule behind your journey beyond Earth. |
| destination-moon.html | Explore the Moon, discover historic landing sites, and find the distance and travel time for a relaxing journey beyond Earth. |
| destination-mars.html | Discover Mars and the towering Olympus Mons, with distance and travel time details to help you explore this space tourism destination. |
| destination-europa.html | Explore Europa, Jupiter's icy moon, and discover its winter activities, distance from Earth, and estimated travel time. |
| destination-titan.html | Discover Titan, Saturn's moon with a dense atmosphere, and explore its views, distance from Earth, and estimated travel time. |
| crew-commander.html | Meet commander Douglas Hurley and learn about the former NASA astronaut who commanded the Crew Dragon Demo-2 mission. |
| crew-specialist.html | Meet mission specialist Mark Shuttleworth and learn about his journey as the first South African space tourist. |
| crew-pilot.html | Meet pilot Victor Glover and learn about his Crew Dragon flight to the International Space Station and role in Expedition 64. |
| crew-engineer.html | Meet flight engineer Anousheh Ansari and learn about her journey as the first self-funded woman to fly to the International Space Station. |
| technology-vehicle.html | Discover the launch vehicle that carries a payload from Earth into space and learn about the WEB-X rocket featured in this journey. |
| technology-spaceport.html | Explore the Cape Canaveral spaceport and learn how its location takes advantage of Earth's rotation for spacecraft launches. |
| technology-capsule.html | Discover the space capsule for your journey, including its reentry design and onboard activities such as a space gym and cinema. |

include JSON의 따옴표와 HTML 속성의 따옴표를 구분한다. 설명에 큰따옴표나 ampersand가 필요하면 HTML 속성에 맞게 이스케이프하고 파서로 해석한 값을 확인한다. 위 초안에는 큰따옴표·ampersand를 쓰지 않는다.

### 생성 HTML을 검증 대상으로 사용

dist를 삭제하는 build/dev는 실행하지 않는다. gulp-file-include로 메모리 또는 별도 임시 폴더에 12개 페이지를 생성하고 브라우저 HTML 파서로 head의 태그 개수·비어 있지 않음·고유성·내용·미처리 템플릿 부재를 확인한다. 설명과 title을 제외한 head 구조와 본문·ARIA·스크립트·스타일 참조가 그대로인지 비교한다.

Chrome에서 JavaScript를 끈 직접 접속을 확인하고, 사용할 수 있으면 Lighthouse의 meta-description 감사를 12개 URL에 실행한다. 감사 도구가 없으면 미검증으로 기록하며 DOM 검사 결과를 Lighthouse 실측 통과로 보고하지 않는다. CSS·화면 배치를 변경하지 않으므로 전체 화면 시각 회귀 검사는 요구하지 않는다.

## Risks / Trade-offs

- [페이지별 인자 누락이나 복사 실수] → 12개 모두 파일명·title·초기 패널과 대조한다.
- [따옴표로 인한 속성 파손] → HTML 파서로 태그와 content를 검증한다.
- [탭 전환 후 설명이 초기값으로 남음] → 이번에는 정적 URL의 초기 HTML로 범위를 한정한다. 동적 갱신은 별도 변경에서 다룬다.

## Migration Plan

데이터 이관·의존성 추가는 없다. 공통 태그와 12개 include 인자를 같은 변경에서 반영한다. 문제가 있으면 이번 변경분만 복원한다.
