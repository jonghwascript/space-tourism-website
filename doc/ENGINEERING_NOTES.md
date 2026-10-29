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
