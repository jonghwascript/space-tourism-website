// ------------------------------------------
// 모바일 메뉴
// ------------------------------------------
// 관계: 헤더 루트의 상태 클래스(.is-menu-open)와 토글의 aria-expanded만 바꾸고, 표시는 _site-header.scss가 맡는다.
// 제한: <html>의 .has-js는 head.html이 미리 붙인다. 필요한 요소가 하나라도 없으면 지워 스크립트 없는 배치로 돌린다.
// 전환: 768px(48em) 이상으로 넓어지면 닫힘으로 초기화한다. SCSS mq-below('tablet')과 같은 식을 쓴다.
{
  const header = document.querySelector('.c-site-header');
  const toggle = header?.querySelector('.c-nav-toggle');
  const list = document.getElementById(toggle?.getAttribute('aria-controls'));

  if (header && toggle && list) {
    const mobile = window.matchMedia('(width < 48em)');

    // 버튼 이름("Menu")은 고정하고 상태는 aria-expanded로만 전달한다.
    const setOpen = (isOpen) => {
      header.classList.toggle('is-menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    const isOpen = () => header.classList.contains('is-menu-open');

    toggle.addEventListener('click', () => {
      setOpen(!isOpen());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !isOpen()) return;
      setOpen(false);
      toggle.focus();
    });

    // 패널과 토글은 헤더 안에 있으므로 헤더 밖 클릭만 닫는다.
    document.addEventListener('click', (event) => {
      if (isOpen() && !header.contains(event.target)) setOpen(false);
    });

    // 포커스가 헤더 밖 요소로 옮겨 가면 닫아, 패널 뒤에 가려진 요소가 포커스를 받지 않게 한다.
    // relatedTarget이 없으면(패널 빈 곳 클릭, 창 전환) 열린 상태를 유지한다.
    header.addEventListener('focusout', (event) => {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });

    mobile.addEventListener('change', (event) => {
      if (!event.matches) setOpen(false);
    });
  } else {
    document.documentElement.classList.remove('has-js');
  }
}

// ------------------------------------------
// 탭 전환 (Destination·Crew·Technology)
// ------------------------------------------
// 관계: 마크업의 ARIA 탭 구조(aria-controls·aria-labelledby)를 그대로 쓰고, aria-selected·tabindex·hidden만 바꾼다.
//       선택 모양은 _tabs.scss의 [aria-selected='true'], 숨김은 리셋의 [hidden]이 맡는다.
// 제한: 탭 id(<그룹>-tab-<항목>)가 페이지 파일(<그룹>-<항목>.html)과, 패널 h2가 <title> 첫 부분과 같다는 규칙에 기댄다.
//       replaceState를 쓸 수 없는 환경(file:// 등)에서는 주소를 바꾸지 않고 화면만 전환한다.
// 전환: 방향은 탭 목록의 실제 flex-direction으로 정한다. 64em(SCSS mq('desktop'))에서 다시 계산한다.
{
  const desktop = window.matchMedia('(min-width: 64em)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

    // 연결된 패널이 하나라도 없으면 이 목록은 건너뛰어 빌드된 초기 상태를 그대로 둔다.
    if (!tabs.length || !tabs.every(panelOf)) return;

    const isVertical = () => getComputedStyle(tablist).flexDirection.startsWith('column');
    const setOrientation = () => {
      tablist.setAttribute('aria-orientation', isVertical() ? 'vertical' : 'horizontal');
    };

    // 주소를 그 항목의 페이지 파일로 바꾸고, 제목은 "<패널 h2> | <그룹> | …" 형식으로 맞춘다. 방문 기록은 늘리지 않는다.
    const updateLocation = (tab, panel) => {
      const name = panel.querySelector('h2')?.textContent.trim();
      const rest = document.title.slice(document.title.indexOf(' |'));
      if (name && document.title.includes(' |')) document.title = name + rest;

      try {
        const url = new URL(`${tab.id.replace('-tab-', '-')}.html`, window.location.href);
        window.history.replaceState(null, '', url);
      } catch {
        // 주소를 바꿀 수 없어도 전환은 이미 끝났다.
      }
    };

    const fadeIn = (panel) => {
      panel.getAnimations().forEach((animation) => animation.cancel());
      if (reducedMotion.matches) return;
      panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease' });
    };

    const select = (tab, { focus = false } = {}) => {
      if (focus) tab.focus();
      if (tab.getAttribute('aria-selected') === 'true') return;

      tabs.forEach((other) => {
        const selected = other === tab;
        other.setAttribute('aria-selected', String(selected));
        other.tabIndex = selected ? 0 : -1;
        panelOf(other).hidden = !selected;
      });

      const panel = panelOf(tab);
      fadeIn(panel);
      updateLocation(tab, panel);
    };

    // 버튼은 Enter·Space에서도 click을 보내므로 실행은 click 하나로 처리한다.
    tablist.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && tabs.includes(tab)) select(tab);
    });

    // 방향키·Home·End는 포커스를 옮기면서 바로 선택한다(자동 활성화). 양 끝에서는 반대쪽으로 순환한다.
    tablist.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(event.target.closest('[role="tab"]'));
      if (index < 0) return;

      const [prev, next] = isVertical() ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
      const last = tabs.length - 1;
      const target = {
        [prev]: index === 0 ? last : index - 1,
        [next]: index === last ? 0 : index + 1,
        Home: 0,
        End: last,
      }[event.key];

      if (target === undefined) return;
      event.preventDefault();
      select(tabs[target], { focus: true });
    });

    setOrientation();
    desktop.addEventListener('change', setOrientation);
  });
}
