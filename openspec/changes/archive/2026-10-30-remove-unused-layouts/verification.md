# 검증 결과

## 변경 내용

- Every Layout 모듈에서 기본 `.l-stack`, `.l-stack > *`, `.l-cluster`만 유지했다. 페이지·partial·JS·Storybook을 검색해 제거한 레이아웃·옵션의 소비자가 없음을 확인했다.
- Box·Reel 전용 전역 토큰 5개를 제거했다. 모듈러 스케일과 body line-height 의존성은 유지했다.
- 소스 HTML·JS와 import 순서는 변경하지 않았다. 기존 미추적 `.agents/`는 보존했다. dist에 쓰거나 삭제하는 명령은 실행하지 않았다.

## 검증 완료

- `node -e "require('sass').compile('src/scss/style.scss')"`: 성공.
- CSS 기준본 대조: 미사용 규칙과 전용 토큰을 제외한 나머지 선언·순서 동일. 비압축 UTF-8 CSS 32,872 → 27,760바이트, 5,112바이트(약 15.6%) 감소.
- gulp-file-include 메모리 출력: HTML 12개 생성, 미처리 include 구문 없음, 로컬 src/href 자산 경로 확인.
- Chrome 156.0.8078.74 headless: 홈·Destination Moon·Crew Commander·Technology Vehicle의 변경 전후 요소 위치·크기·gap·margin·padding·display·font-size를 36개 조합에서 비교해 동일함을 확인.
- 화면 조건: 375×812, 768×1024, 1440×900, 767×812, 1023×900, 1024×900, 320×667, 667×375, 375×667(루트 글꼴 200%). 외부 웹폰트 요청은 두 버전 모두 차단해 동일한 fallback 조건으로 비교했다. 기존 넘침 유무와 별개로 이 변경의 기하·줄바꿈 회귀를 대조했다.
- 변경 전후 모두 메뉴 클릭·Enter·Space 열기/닫기, Escape 닫기 및 포커스 복원, 768→767px 전환 시 닫힘 확인. 전체 11개 탭 클릭·Enter·Space, 선택 ARIA, 보이는 패널 1개와 연결 ID, 키보드 outline 표시 확인.
- 초기 자동화 실행에서는 viewport 변경 직후 비동기 matchMedia 이벤트를 기다리지 않아 상태 단언이 실패했다. 상태 갱신을 기다리도록 검증 스크립트를 수정한 뒤 전체 비교와 상호작용 재실행이 통과했다. 제품 코드는 변경하지 않았다.
- `git diff --check`: 성공. 추적 파일 diff는 지정한 SCSS 두 파일에 한정된다.

## 미검증

- Firefox: Playwright 전용 실행 파일이 없고, 설치된 일반 Firefox를 Playwright로 실행하는 시도가 실패해 브라우저 검증을 수행하지 못했다.
- 실제 웹폰트가 로드된 화면의 시각 검토, 수동 키보드·스크린리더 검증, 완전한 접근성 준수 판정은 수행하지 않았다. 자동 비교는 이를 대신하지 않는다.

## 해당 없음

- 스펙 동작 변경과 delta spec: 순수 리팩터링으로 skip_specs 적용.
- build/dev 및 placeholder npm test: 실행하지 않음. dist 삭제 금지 지침에 따라 메모리 출력으로 검증했다.
