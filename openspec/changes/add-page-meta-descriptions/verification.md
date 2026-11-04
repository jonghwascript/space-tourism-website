# 검증 기록

- 검증일: 2026-10-31 (Asia/Seoul)
- 변경: `add-page-meta-descriptions`
- 변경 파일: `src/partials/head.html`, `src/pages/*.html` 12개, 이 변경의 `tasks.md` 및 `verification.md`.

## 검증 완료

- 공통 head에 description 태그 하나를 추가하고 12개 페이지의 include 인자로 design.md에 지정한 영어 설명을 전달했다.
- 실제 destination·crew·technology partial의 본문과 홈의 본문·내비게이션을 읽어 설명의 근거를 대조했다. 목적지의 활동·거리·여행 시간, 승무원의 이름·경력, 기술의 명칭·특징은 기존 콘텐츠에 근거한다. 홈 설명은 내비게이션으로 연결된 사이트 콘텐츠를 요약한다.
- 임시 스크립트 `%TEMP%/space-meta-apply.cjs`를 `node`로 실행했다. 기존 Gulp와 같은 `gulp.src('src/pages/*.html')` 및 `gulp-file-include({ prefix: '@@', basepath: '@file' })`로 수정 전후 12개 페이지를 메모리에서 생성했다.
- 각 결과에서 추가한 description 한 줄만 제거한 뒤 변경 전 HTML과 문자열 전체를 비교했다. 12/12개가 동일하므로 기존 제목·공통 head·본문·ARIA·자산 참조가 보존됐다. 미처리 `@@` 템플릿도 없었다.
- 메모리 HTML을 로컬 HTTP 서버로 제공하고 Playwright의 `channel: 'chrome'`으로 설치된 Google Chrome 156.0.8078.74를 실행했다. `javaScriptEnabled: false`, viewport 1280×800에서 아래 12개 URL에 각각 직접 접속했다. 각 응답은 HTTP 200이며 메모리 생성 결과와 일치했다.
- Chrome HTML 파서로 각 head의 description 개수 1개, content의 정확한 일치·비어 있지 않음·12개 간 고유성, 속성이 name과 content 두 개뿐임을 확인했다. 초기 스크립트의 `has-js` 클래스가 없고, 각 하위 페이지의 선택 탭·숨김 해제 패널·제목이 해당 파일과 일치함도 확인했다.

| URL 경로 | 초기 항목 | 결과 |
| --- | --- | --- |
| /index.html | Home | 검증 완료 |
| /destination-moon.html | Moon | 검증 완료 |
| /destination-mars.html | Mars | 검증 완료 |
| /destination-europa.html | Europa | 검증 완료 |
| /destination-titan.html | Titan | 검증 완료 |
| /crew-commander.html | Douglas Hurley | 검증 완료 |
| /crew-specialist.html | Mark Shuttleworth | 검증 완료 |
| /crew-pilot.html | Victor Glover | 검증 완료 |
| /crew-engineer.html | Anousheh Ansari | 검증 완료 |
| /technology-vehicle.html | Launch vehicle | 검증 완료 |
| /technology-spaceport.html | Spaceport | 검증 완료 |
| /technology-capsule.html | Space capsule | 검증 완료 |

- `git diff --check`: 통과.
- `git diff --stat`, 소스 diff 및 `git status --short`: 소스 변경은 head partial과 12개 HTML에 한정된다. CSS·JS·Gulp 설정·dist의 변경은 없다. 기존 미추적 `.agents/`는 유지했다.
- `npm run build`와 `npm run dev`는 dist를 삭제하므로 실행하지 않았다. 검증 스크립트는 dist에 쓰거나 삭제하지 않았다.

## 미검증

- Lighthouse 실측: `require.resolve('lighthouse')`로 설치 여부를 확인했으나 패키지가 없어 실행하지 않았다. 위 DOM 검사는 Lighthouse 감사 통과를 의미하지 않는다.
- Firefox 및 반응형 화면의 시각 회귀·수동 키보드·스크린 리더 검사: 이번 메타데이터 변경에서는 수행하지 않았다.

## 해당 없음

- CSS·JavaScript 수정에 대한 컴파일·문법 검사: 해당 소스를 변경하지 않았다.
- 탭 전환 시 description 갱신: 명시된 범위 밖이다. 설명은 최초 접속 URL의 값으로 유지된다.
