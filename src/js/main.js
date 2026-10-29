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
