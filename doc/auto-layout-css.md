# Figma Auto Layout → CSS 대응표

Figma Auto Layout의 각 설정이 어떤 CSS 속성에 대응하는지 정리한 문서입니다. 이 프로젝트의 `l-` 클래스로 옮기는 방법은 [figma-guide.md](figma-guide.md) §5를, 클래스별 설명은 [layout-guide.md](layout-guide.md)를 참고하세요.

Auto Layout은 CSS Flexbox와 거의 같은 모델입니다. 다만 **Figma는 크기를 부모 기준으로 고정된 캔버스에서 계산하고, 브라우저는 화면 폭·글꼴 크기에 따라 다시 계산**합니다. 그래서 값을 그대로 옮기기보다 의도(내용에 맞춤인지, 부모를 채우는지)를 옮깁니다.

## 핵심 원칙 요약

1. Auto Layout 프레임은 `display: flex`, 방향은 `flex-direction`입니다.
2. 크기 설정(Hug·Fill·Fixed)은 **부모의 방향**에 따라 다른 CSS 속성으로 바뀝니다. 주축이냐 교차축이냐를 먼저 판단합니다.
3. Fixed 값은 웬만하면 그대로 쓰지 않습니다. 너비는 `max-inline-size`, 높이는 `min-block-size`나 내용 높이로 바꿉니다.
4. px 값은 단위 규칙에 따라 `rem` 등으로 바꾸고 토큰을 씁니다([scss-guide.md](scss-guide.md)).
5. 직접 flex를 쓰기 전에 맞는 `l-` 클래스가 있는지 먼저 찾습니다.

---

## 1. 프레임(부모) 설정

| Figma | CSS | 비고 |
| --- | --- | --- |
| Auto Layout 추가 | `display: flex` | 인라인 요소처럼 내용 폭만 차지해야 하면 `display: inline-flex` |
| 방향: 가로 (→) | `flex-direction: row` | 기본값이므로 생략 가능 |
| 방향: 세로 (↓) | `flex-direction: column` | |
| 방향: 줄바꿈 (Wrap) | `flex-wrap: wrap` | Figma는 가로 방향에서만 제공 |
| 방향: 그리드 (Grid) | `display: grid` + `grid-template-columns` / `grid-template-rows` | 열·행 개수가 정해진 레이아웃 |
| Spacing between items (숫자) | `gap` | |
| Spacing between items: **Auto** | `justify-content: space-between` | 이때 `gap`은 0으로 둠 |
| Wrap일 때 가로 간격 / 세로 간격 | `column-gap` / `row-gap` | 축약형 `gap: <row> <column>` 순서 주의 |
| 음수 간격 | 자식에 음수 `margin` (예: `> * + * { margin-inline-start: -8px }`) | `gap`은 음수를 허용하지 않음. 겹치는 아바타 목록 등 |
| Padding (가로·세로 / 개별) | `padding` / `padding-inline`, `padding-block` / 개별 방향 | Figma 순서(위·오른쪽·아래·왼쪽)는 CSS `padding` 축약형과 같음 |
| Clip content | `overflow: hidden` (또는 `overflow: clip`) | 둥근 모서리 안으로 이미지를 자를 때 주로 사용 |
| Strokes: Included in layout | `border` + `box-sizing: border-box` | 선 두께가 크기 안에 포함됨 |
| Strokes: Excluded from layout | `outline` 또는 `box-shadow: 0 0 0 1px` | 선이 크기·배치에 영향을 주지 않음 |
| Canvas stacking: Last on top (기본) | 별도 지정 없음 | DOM 순서상 뒤 요소가 위에 그려지는 것과 같음 |
| Canvas stacking: First on top | 자식에 `z-index` 지정 (또는 `flex-direction: row-reverse` 후 순서 조정) | 음수 간격으로 겹칠 때만 의미가 있음 |

### 정렬 (9칸 정렬 상자)

Figma 정렬 상자의 가로·세로는 **방향에 따라 `justify-content`·`align-items`가 바뀝니다.** `justify-content`는 주축(방향과 같은 축), `align-items`는 교차축입니다.

| Figma 정렬 | 방향: 가로 (`row`) | 방향: 세로 (`column`) |
| --- | --- | --- |
| 왼쪽 | `justify-content: flex-start` | `align-items: flex-start` |
| 가로 가운데 | `justify-content: center` | `align-items: center` |
| 오른쪽 | `justify-content: flex-end` | `align-items: flex-end` |
| 위 | `align-items: flex-start` | `justify-content: flex-start` |
| 세로 가운데 | `align-items: center` | `justify-content: center` |
| 아래 | `align-items: flex-end` | `justify-content: flex-end` |
| 텍스트 기준선 (Baseline) | `align-items: baseline` | 해당 없음 |
| Wrap일 때 줄 정렬 | `align-content` | 해당 없음 |

> CSS의 `align-items` 기본값은 `stretch`입니다. Figma 기본 정렬(왼쪽 위)과 다르므로, 교차축 정렬을 명시하지 않으면 자식이 교차축을 꽉 채웁니다. 아래 2절의 Hug·Fill과 함께 확인합니다.

---

## 2. 자식 크기 설정 (Resizing)

크기 설정은 **부모의 방향과 같은 축(주축)인지, 다른 축(교차축)인지**에 따라 CSS가 달라집니다.

- 부모가 가로(`row`): 자식의 **너비 = 주축**, 높이 = 교차축
- 부모가 세로(`column`): 자식의 **높이 = 주축**, 너비 = 교차축

| Figma | 주축 | 교차축 | 비고 |
| --- | --- | --- | --- |
| Hug contents | `flex: 0 0 auto` (보통 생략) | `align-self: flex-start` 등 `stretch`가 아닌 값 | 부모가 `align-items: stretch`(기본값)면 교차축 Hug가 Fill처럼 늘어남 |
| Fill container | `flex: 1` + `min-inline-size: 0` (세로는 `min-block-size: 0`) | `align-self: stretch` (기본값이므로 보통 생략) 또는 `inline-size: 100%` | `min-*: 0`이 없으면 긴 텍스트·이미지 때문에 줄어들지 않고 넘침 |
| Fixed width / height | `flex: 0 0 <값>` 또는 `inline-size: <값>` + `flex-shrink: 0` | `inline-size` / `block-size: <값>` | 정말 고정이어야 할 때만 사용. 아래 "Fixed 처리" 참고 |
| Min width / Max width | `min-inline-size` / `max-inline-size` | 같음 | |
| Min height / Max height | `min-block-size` / `max-block-size` | 같음 | |
| Ignore auto layout (Absolute position) | `position: absolute` + `inset` 값 | | 부모에 `position: relative` 필요. 가능하면 `l-imposter` 등으로 대체 |

### Auto Layout 밖에 있는 프레임의 Hug·Fill

flex 자식이 아닌 일반 블록 요소(`div`, `section` 등)는 기본 너비가 부모를 채웁니다. 즉 **블록 요소는 기본이 Fill**입니다.

| Figma (부모가 Auto Layout이 아님) | CSS |
| --- | --- |
| Hug width | `inline-size: fit-content` 또는 `display: inline-flex` |
| Fill width | 지정하지 않음 (블록 기본값) |
| Hug height | 지정하지 않음 (내용 높이가 기본값) |

### Fixed 처리

Figma의 Fixed 값은 디자인 화면 폭에서만 맞는 값인 경우가 많습니다. 아래처럼 바꿉니다.

| Figma | 권장 CSS | 이유 |
| --- | --- | --- |
| 카드 `Fixed width 350` | `max-inline-size: 21.875rem` (또는 `inline-size: min(100%, 21.875rem)`) | 좁은 화면에서 줄어들 수 있어야 함 |
| 섹션 `Fixed height 600` | `min-block-size: 37.5rem` 또는 지정하지 않음 | 글꼴 확대·번역 시 내용이 넘치지 않아야 함 |
| 아이콘·아바타 `Fixed 24×24` | `inline-size: 1.5rem; block-size: 1.5rem; flex-shrink: 0` | 실제로 고정이어야 하는 크기. 줄어들지 않게 `flex-shrink: 0` |
| 정사각형·고정 비율 이미지 | `aspect-ratio: 1` (또는 `l-frame`) | 너비만 정하고 높이는 비율로 계산 |

---

## 3. 텍스트 레이어 크기

| Figma | CSS | 비고 |
| --- | --- | --- |
| Auto width | 지정하지 않음 (+ 줄바꿈 금지가 의도면 `white-space: nowrap`) | 버튼 라벨처럼 한 줄 유지가 의도일 때만 `nowrap` |
| Auto height | 너비만 지정(또는 Fill), 높이는 지정하지 않음 | 가장 일반적인 본문 텍스트 |
| Fixed size | 높이는 지정하지 않음 | 텍스트 높이 고정은 확대 시 넘침을 만듦 |
| Truncate text (한 줄) | `overflow: hidden; white-space: nowrap; text-overflow: ellipsis` | 부모가 flex면 `min-inline-size: 0` 필요 |
| Truncate text (Max lines N) | `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: N; overflow: hidden` | 표준 `line-clamp` 단독은 아직 지원이 제한적 |
| Line height | `line-height` | Figma의 `%` 값은 단위 없는 숫자로 (`150%` → `1.5`) |
| Letter spacing | `letter-spacing` | Figma의 `%` 값은 `em`으로 (`-2%` → `-0.02em`) |

---

## 4. 같이 자주 나오는 시각 속성

Auto Layout 설정은 아니지만 같은 패널에서 함께 옮기는 값입니다.

| Figma | CSS |
| --- | --- |
| Corner radius | `border-radius` |
| Fill (단색) | `background-color` |
| Fill (그라디언트) | `background-image: linear-gradient(...)` |
| Fill (이미지) | `<img>` + `object-fit`, 장식 이미지는 `background-image` |
| Drop shadow | `box-shadow` (x y blur spread color) |
| Inner shadow | `box-shadow: inset ...` |
| Layer blur | `filter: blur()` |
| Background blur | `backdrop-filter: blur()` |
| Opacity (레이어) | `opacity` |

---

## 5. 예시

Figma 설정:

- 카드 프레임: 세로, 간격 16, 패딩 24, 정렬 왼쪽 위, 너비 Fixed 327, 높이 Hug, Corner radius 12
- 안쪽 헤더: 가로, 간격 Auto, 세로 가운데, 너비 Fill
- 헤더 안 아이콘: Fixed 24×24

```scss
.c-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start; // Figma 기본 정렬(왼쪽 위). stretch 기본값을 덮어씀
  gap: 1rem; // 16px
  padding: 1.5rem; // 24px
  max-inline-size: 20.4375rem; // Fixed 327 → 최대 너비
  border-radius: 0.75rem; // 12px
}

.c-card__header {
  display: flex;
  justify-content: space-between; // 간격 Auto
  align-items: center; // 세로 가운데
  align-self: stretch; // 교차축 Fill
}

.c-card__icon {
  flex-shrink: 0;
  inline-size: 1.5rem;
  block-size: 1.5rem;
}
```

같은 구조를 `l-` 클래스로 옮기면 카드는 `l-stack`(+ `--space: 1rem`), 헤더는 `l-cluster`(+ `justify-content: space-between`)가 됩니다. 이때 `l-stack`은 `align-items`를 지정하지 않으므로 자식이 기본으로 Fill(stretch)된다는 점을 확인합니다.

---

## 6. 확인할 점

- **교차축 Hug가 늘어나지 않는가**: 세로 부모 안의 버튼이 Hug인데 화면에서 부모 폭만큼 늘어났다면 `align-items`·`align-self`를 확인합니다.
- **Fill 자식이 넘치지 않는가**: 긴 단어·URL·이미지가 있는 Fill 자식에는 `min-inline-size: 0`이 필요할 수 있습니다.
- **Fixed를 그대로 쓰지 않았는가**: 좁은 화면(320px)과 글꼴 200% 확대에서 가로 넘침이 없는지 확인합니다.
- **Wrap 간격 순서**: `gap: 8px 16px`는 세로(row) 8px, 가로(column) 16px입니다.
- **프레임마다 `div`를 만들지 않았는가**: 정렬만을 위한 Auto Layout 프레임은 부모의 `gap`·정렬로 대체할 수 있는지 먼저 봅니다([figma-guide.md](figma-guide.md) §5).
