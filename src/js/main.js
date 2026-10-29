// ------------------------------------------
// 모바일 메뉴
// ------------------------------------------
// 관계: 헤더 루트의 상태 클래스(.is-enhanced, .is-menu-open)만 바꾸고, 표시는 _site-header.scss가 맡는다.
// 제한: 필요한 요소가 하나라도 없으면 활성화하지 않아 스크립트 없는 배치가 그대로 남는다.
// 전환: 768px(48em) 이상으로 넓어지면 닫힘으로 초기화한다. SCSS mq-below('tablet')과 같은 식을 쓴다.
{
  const header = document.querySelector('.c-site-header');
  const toggle = header?.querySelector('.c-nav-toggle');
  const label = toggle?.querySelector('.u-sr-only');
  const list = document.getElementById(toggle?.getAttribute('aria-controls'));

  if (header && toggle && label && list) {
    const mobile = window.matchMedia('(width < 48em)');

    // 상태 클래스·aria-expanded·버튼 이름을 항상 함께 바꾼다.
    const setOpen = (isOpen) => {
      header.classList.toggle('is-menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      label.textContent = isOpen ? 'Close menu' : 'Open menu';
    };

    const isOpen = () => header.classList.contains('is-menu-open');

    header.classList.add('is-enhanced');

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

    mobile.addEventListener('change', (event) => {
      if (!event.matches) setOpen(false);
    });
  }
}
