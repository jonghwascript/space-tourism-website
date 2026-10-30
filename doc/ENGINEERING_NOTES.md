# Engineering Notes

구현하면서 내린 기술 결정과 그 이유를 기록합니다. 코드 주석만으로는 "왜 이렇게 했는지"를 다 설명하기 어려운 내용을 남깁니다.

---

## Destination 페이지: subgrid로 DOM 순서와 화면 순서 맞추기

- 관련 코드: [`src/scss/pages/_destination.scss`](../src/scss/pages/_destination.scss)의 `.c-destination`, `.c-destination__panel`
- 관련 change: `openspec/changes/archive/2026-10-29-style-destination-page/` (design.md 결정 3, report.md)

### 문제: 탭과 이미지가 서로 다른 부모 아래에 있다

마크업([`src/partials/destination-tabs.html`](../src/partials/destination-tabs.html)) 구조는 다음과 같습니다.

```text
main.c-destination
├─ h1 제목
├─ div.c-tabs              ← main의 자식
└─ div.c-destination__panel
   ├─ picture 이미지        ← panel의 자식
   ├─ div 이름·설명         ← panel의 자식
   └─ dl 통계               ← panel의 자식
```

Figma의 화면 순서는 다릅니다.

- 모바일·태블릿: 제목 → **이미지 → 탭** → 이름·설명 → 통계
- 데스크톱: 왼쪽 열에 이미지, 오른쪽 열에 탭 → 이름·설명 → 통계

탭(main의 자식)이 이미지와 텍스트(panel의 자식) **사이**에 와야 합니다. 그런데 그리드 배치(`grid-area`, `order`)는 **직계 자식에만** 적용됩니다. main을 그리드로 만들어도 main이 배치할 수 있는 것은 `h1`, `c-tabs`, `panel` 세 덩어리뿐입니다. panel 안의 이미지와 텍스트를 따로 떼어 그 사이에 탭을 끼워 넣을 수는 없습니다.

### 해결: panel이 main의 행·열을 물려받게 한다

```scss
.c-destination__panel {
  @supports (grid-template-rows: subgrid) {
    display: grid;
    grid-row: 2 / -1;
    grid-column: 1 / -1;
    grid-template-rows: subgrid;
    grid-template-columns: subgrid;
  }
}
```

`grid-template-rows/columns: subgrid`를 쓰면 panel이 자기 행·열을 새로 만들지 않고 **main의 행·열을 그대로 물려받습니다**. 그러면 panel의 자식(이미지·텍스트·통계)과 main의 자식(탭)이 같은 격자 위에 놓입니다. 그래서 `grid-area: image / tabs / text / stats`로 섞어서 배치할 수 있습니다. 데스크톱에서 탭과 텍스트의 왼쪽 끝이 맞고, 이미지가 왼쪽 열의 여러 행에 걸치는 것도 같은 격자를 쓰기 때문입니다.

### `grid-row: 2 / -1`과 `grid-column: 1 / -1`의 의미

subgrid는 panel이 **걸친 행·열만** 물려받습니다. 따라서 panel이 main 그리드에서 차지하는 범위가 곧 panel 자식들을 놓을 수 있는 공간이 됩니다.

숫자는 칸 번호가 아니라 **격자선 번호**입니다. `-1`은 명시적으로 정의한 격자의 마지막 선입니다.

- `grid-row: 2 / -1`: 2번 선부터 마지막 선까지, 즉 제목 행을 뺀 나머지 모든 행
- `grid-column: 1 / -1`: 첫 선부터 마지막 선까지, 즉 모든 열

모바일·태블릿(5행 × 1열):

```text
선1 ─────────
     title          ← panel 범위 밖(h1)
선2 ─────────  ┐
     image     │
선3 ─────────  │
     tabs      │ grid-row: 2 / -1
선4 ─────────  │ → panel이 4개 행에 걸침
     text      │
선5 ─────────  │
     stats     │
선6 ─────────  ┘ (= -1)
```

데스크톱(6행 × 2열):

```text
         열1        열2
선1 ───────────────────────
       title      title        ← 범위 밖
선2 ───────────────────────  ┐
       image      (빈 행)     │
선3 ───────────────────────  │
       image      tabs       │ 2 / -1 → 5개 행
선4 ───────────────────────  │ 1 / -1 → 2개 열 모두
       image      text       │
선5 ───────────────────────  │
       image      stats      │
선6 ───────────────────────  │
       image      (빈 행)     │
선7 ───────────────────────  ┘
```

데스크톱의 위아래 빈 행은 `1fr`입니다. 남은 높이를 위아래로 나눠 가져 오른쪽 묶음(탭·텍스트·통계)을 이미지와 세로 가운데로 맞춥니다.

두 줄이 필요한 이유는 다음과 같습니다.

- 지정하지 않으면 panel은 자동 배치로 빈 칸 **하나**(1행 × 1열)만 차지합니다. 그러면 subgrid도 트랙 하나만 물려받아, 자식들이 `image`·`text`·`stats` 영역에 닿을 수 없습니다.
- 제목 행(1행)을 빼는 이유는 그 칸을 `h1`이 쓰기 때문입니다.
- `-1`을 쓰면 화면 크기마다 행 수가 달라도(모바일 5행, 데스크톱 6행) 같은 코드로 항상 끝까지 걸칩니다. 분기점마다 `2 / 6`, `2 / 7`처럼 따로 쓸 필요가 없습니다. 이 방식은 `grid-template-rows`로 행을 명시적으로 정의했기 때문에 동작합니다. 암묵적으로 생긴 행은 `-1`에 포함되지 않습니다.
- 숨긴 패널 3개는 `hidden` 속성(`display: none`)이라 격자에 놓이지 않습니다. 실제로 배치되는 panel은 항상 하나입니다. 리셋의 `[hidden] { display: none !important; }`가 panel의 `display: grid`보다 우선하도록 보장합니다.

### 검토했다가 버린 대안

| 대안 | 버린 이유 |
| --- | --- |
| panel에 `display: contents` | 상자를 없애 자식이 main 그리드에 바로 참여하게 하는 방식입니다. 하지만 panel은 `role="tabpanel"`과 `tabindex="0"`을 가진 요소라, 상자를 없애면 포커스와 접근성 트리 노출이 브라우저마다 불안정합니다. |
| 이미지를 panel 밖으로 옮기기 | `destination-page` spec("패널은 이미지·h2·설명·통계 순서")을 바꿔야 합니다. `content-tabs` spec에 탭 목록을 패널보다 앞에 둔다는 규칙도 있어, 탭을 panel 안으로 넣는 방법도 막혀 있습니다. |
| 탭을 `position: absolute`로 이미지 아래에 띄우기 | 이미지 높이나 글자 확대에 따라 겹침이 생깁니다. |

### 부작용과 대응

- **panel이 탭 클릭을 가로챔.** panel 상자가 2행부터 끝까지 덮으므로 main의 자식인 탭 행 위에도 겹칩니다. DOM에서 panel이 뒤에 있어 위에 그려지므로 탭의 hover·클릭을 panel이 받았습니다. `.c-destination__tabs`에 `z-index: 1`을 줘서 해결했습니다. 그리드 항목이라 `position` 없이도 `z-index`가 적용됩니다.
- **포커스 표시가 큼.** panel에 키보드 포커스가 가면 outline이 이미지와 탭 영역까지 감쌉니다. 포커스 표시로는 충분해서 그대로 둡니다.
- **subgrid 미지원 브라우저.** `@supports`로 감쌌습니다. 지원하지 않으면 main이 세로 flex가 되어 DOM 순서(탭 → 이미지 → 텍스트)대로 쌓입니다. 내용과 키보드 순서는 그대로입니다. 요소 사이 간격을 그리드 `gap`이 아니라 각 요소의 `margin`으로 둔 이유도 두 배치에서 간격을 같게 하기 위해서입니다.
- **포커스 순서.** 포커스를 받는 요소의 순서(탭 → 패널)는 DOM과 화면이 같습니다. 이미지는 포커스 대상이 아니므로 화면 순서만 바꿔도 키보드 탐색 순서 문제가 없습니다.

subgrid를 걷어내려면 마크업 구조를 바꿔야 하고, 그러면 `destination-page`·`content-tabs` spec도 함께 바꿔야 합니다. Crew·Technology 페이지도 같은 탭 마크업을 쓰므로, 같은 문제가 생기면 이 방식을 재사용합니다.

---

## Crew 점 탭: 클릭 영역과 점 사이 간격을 따로 맞추기

- 관련 코드
  - [`src/scss/components/_tabs.scss`](../src/scss/components/_tabs.scss)의 `.c-tabs--dots`
  - [`src/scss/pages/_crew.scss`](../src/scss/pages/_crew.scss)의 `.c-crew__tabs`
- 관련 change: `openspec/changes/archive/2026-10-30-style-crew-page/` (design.md 결정 5, report.md)

### 문제: 버튼과 점의 크기가 다르다

Figma의 점 지름은 10px(데스크톱 15px)입니다. 버튼을 이 크기로 만들면 손가락이나 마우스로 누르기 어렵습니다. 그래서 버튼은 24×24px 클릭 영역(WCAG 2.5.8 권장 크기)으로 만들고, 보이는 점은 `::before`로 버튼 가운데에 그립니다.

그런데 Figma가 정한 간격(16px, 데스크톱 40px)은 **버튼 사이가 아니라 점 사이** 간격입니다. 탭 묶음은 `.l-cluster`라서 `gap: var(--space)`가 버튼 상자 사이에 들어갑니다. 버튼이 점보다 크면 버튼 안 여백만큼 점 사이가 더 벌어집니다.

```text
점 사이 간격 = 버튼 gap + (버튼 − 점)
           = --space + (24px − --dot)
```

### 해결 1: 가로 간격, 버튼 gap을 거꾸로 계산한다

```scss
.c-tabs--dots {
  --dot: 0.625rem; // 10px
  --dot-gap: 1rem; // 16px
  --space: calc(var(--dot-gap) - (1.5rem - var(--dot)));

  @include mq('desktop') {
    --dot: 0.9375rem; // 15px
    --dot-gap: 2.5rem; // 40px
  }
}
```

원하는 점 간격(`--dot-gap`)에서 버튼과 점의 크기 차이를 빼면 버튼 gap이 나옵니다.

| 화면 | 점 지름 | 원하는 점 간격 | 크기 차이 | 버튼 gap(`--space`) | 측정한 점 간격 |
| --- | --- | --- | --- | --- | --- |
| 모바일·태블릿 | 10px | 16px | 14px | 2px | 16.0px |
| 데스크톱 | 15px | 40px | 9px | 31px | 40.0px |

고정값(`2px`, `31px`) 대신 계산식으로 둔 이유는 다음과 같습니다.

- 숫자가 어디서 왔는지 코드에 남습니다.
- 데스크톱 미디어 쿼리에서는 `--dot`과 `--dot-gap`만 바꿉니다. 사용자 정의 속성은 사용하는 요소에서 계산되므로, 같은 식이 바뀐 값으로 다시 계산되어 버튼 gap이 자동으로 31px가 됩니다.
- 나중에 점 크기나 간격이 바뀌어도 두 변수만 고치면 됩니다.

`.c-tabs--dots`의 `--space`가 `.l-cluster`의 기본값(`1rem`)을 이기는 이유도 있습니다. 두 선택자의 명시도가 같고, `style.scss`에서 컴포넌트를 레이아웃보다 뒤에 불러오기 때문입니다.

### 해결 2: 세로 간격, margin에서 여백의 절반을 뺀다

세로도 같은 문제가 있습니다. 처음 구현에서는 텍스트–점 간격이 Figma 24px이 아니라 31px였습니다. 버튼 위아래에 각각 `(24px − 점) / 2`만큼 여백이 있기 때문입니다.

```scss
.c-crew__tabs {
  --dot-inset: calc((1.5rem - var(--dot)) / 2); // --dot은 .c-tabs--dots가 정한다

  margin-block: calc(var(--s1) - var(--dot-inset)) calc(var(--dot-inset) * -1);

  @include mq('desktop') {
    margin-block: calc(2.5rem - var(--dot-inset)) calc(3rem - var(--dot-inset));
  }
}
```

- 모바일·태블릿: 점 기준으로 텍스트 아래 24px, 사진 위 32px(사진의 `margin-block-start: 2rem`과 합쳐짐)
- 데스크톱: 점 기준으로 위 40px 이상, 아래 48px
- `.c-crew__tabs`와 `.c-tabs--dots`는 같은 요소에 붙어 있어 `--dot`을 바로 읽을 수 있습니다.
- 아래 margin이 음수라도 버튼 클릭 영역이 사진과 겹치지 않습니다. 사진 위 여백(32px)이 버튼이 넘어온 거리(7px)보다 크기 때문입니다.

### 부작용과 주의

- **포커스 표시 겹침.** 모바일·태블릿 버튼 gap이 2px라, 포커스 outline(offset 4px)이 이웃 점 쪽으로 겹쳐 그려집니다. 가려지지는 않아서 그대로 둡니다.
- **측정 기준.** 점 탭 위치를 잴 때 탭 목록 상자가 아니라 점(`::before`)을 기준으로 재야 Figma 값과 비교할 수 있습니다. spec의 데스크톱 아래 여백 시나리오도 "점의 아래 끝" 기준입니다.
- **재사용.** 보이는 모양이 24px보다 작은 컨트롤에는 같은 방식(보이는 크기와 간격은 변수, 버튼 gap·margin은 계산)을 씁니다. Technology 숫자 탭은 원 지름이 40~80px로 이미 24px보다 커서 이 계산이 필요 없습니다.

---

## Crew 데스크톱 텍스트: 패널의 가운데 정렬을 `justify-self: stretch`로 덮어쓰기

- 관련 코드: [`src/scss/pages/_crew.scss`](../src/scss/pages/_crew.scss)의 `.c-crew__panel`, `.c-crew__text`(데스크톱 미디어 쿼리)
- 관련 change: `openspec/changes/archive/2026-10-30-style-crew-page/`

### 문제: 패널이 자식에게 가운데 정렬을 내려준다

보이는 패널(subgrid)에는 `justify-items: center`가 있습니다. 모바일·태블릿에서 텍스트와 사진을 가운데에 놓으려고 둔 값입니다. 패널의 자식인 `.c-crew__text`도 기본으로 이 값을 받습니다. `center`인 그리드 항목은 폭이 내용에 맞게 줄어들고(fit-content) 열 안에서 가운데에 놓입니다.

데스크톱 Figma에서 텍스트는 왼쪽 열(1440px에서 539px)을 채우고, 왼쪽 정렬로 제목·점과 같은 x(165px)에서 시작합니다. 그래서 데스크톱에서만 덮어씁니다.

```scss
.c-crew__text {
  @include mq('desktop') {
    align-self: center;
    justify-self: stretch;
    inline-size: auto;
    max-inline-size: 40rem; // 640px
  }
}
```

### 측정: 값을 바꿔 비교(1440px)

| `justify-self` | 실제 소개문 | 소개문이 짧을 때 |
| --- | --- | --- |
| `stretch`(현재) | x 165, 폭 539 | x 165, 폭 539 |
| `center`(지우면 이렇게 됨) | x 165, 폭 539 | x 191, 폭 487(점 x 165와 어긋남) |
| `start` | x 165, 폭 539 | x 165, 폭 487 |

- 지금 소개문은 길어서 줄어들 여지가 없으므로, `center`여도 결과가 같습니다. 그래서 이 줄을 지워도 당장은 화면 차이가 보이지 않습니다.
- 내용이 짧아지면(다른 데이터, 번역 등) `center`는 묶음이 가운데로 밀려 왼쪽 끝이 점·제목과 어긋납니다.
- `stretch`는 내용 길이와 상관없이 열 폭과 왼쪽 끝이 일정합니다. `start`도 왼쪽 끝은 맞지만 폭이 내용에 따라 달라집니다.

### 함께 있는 선언과의 관계

- `inline-size: auto`: 모바일·태블릿의 `min(514px/512px, 100%)` 고정 폭을 풉니다. `stretch`일 때 `auto` 폭은 열 폭이 됩니다.
- `max-inline-size: 40rem`: Figma 최대 폭(640px)입니다. 데스크톱 열 폭은 영역 최대 1110px 기준 539px라 지금은 닿지 않습니다. 닿는다면 `stretch` 항목은 640px에서 멈추고 열 왼쪽(시작 쪽)에 붙습니다.
- 점 탭(`.c-crew__tabs`)은 데스크톱에서 `justify-self: start`입니다. 점 묶음은 열 폭을 채울 필요가 없고 왼쪽 끝만 맞으면 되기 때문입니다.

Destination 데스크톱 텍스트 묶음은 고정 폭(445px)을 열 가운데에 두는 Figma 배치라 `justify-items: center`를 그대로 씁니다. 같은 subgrid 패턴이어도 열 안 정렬은 페이지마다 Figma를 따릅니다.
