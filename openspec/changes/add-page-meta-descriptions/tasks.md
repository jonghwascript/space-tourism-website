# Tasks

## 1. 공통 메타 태그와 페이지별 설명

- [x] 1.1 `src/partials/head.html`에 description 인자를 출력하는 메타 태그를 추가하고, `src/pages/*.html` 12개의 head include에 design.md의 영어 설명을 전달한다. 생성 HTML에서 각 head에 완성된 태그가 정확히 하나인지 확인한다.
- [x] 1.2 12개 설명을 파일명·제목·실제 초기 콘텐츠와 대조하고 HTML 파서로 비어 있지 않음·고유성·속성 값 일치·미처리 템플릿 부재를 검증한다. 본문에 없는 정보를 추가하지 않았는지 확인한다.

## 2. 통합 검증과 기록

- [x] 2.1 dist를 건드리지 않는 메모리/별도 임시 출력으로 최신 12개 페이지를 생성한다. 메타 설명 외에 기존 제목·공통 head 구조·본문·ARIA·자산 참조가 유지됐는지 변경 전후 결과를 대조한다.
- [x] 2.2 Chrome에서 JavaScript를 끄고 12개 URL에 직접 접속해 설명이 초기 HTML에 있으며 최초 선택 항목과 일치하는지 확인한다. 가능하면 Lighthouse meta-description 감사를 12개 URL에 실행하고 결과를 기록하며, 도구가 없으면 Lighthouse 실측은 미검증으로 기록한다.
- [x] 2.3 `git diff --check`를 실행하고 `verification.md`에 변경 파일·실행한 검사·Lighthouse 실측 여부와 검증 완료/미검증 범위를 기록한다. CSS·JS와 dist에 변경이 없는지 최종 diff로 확인한다.
