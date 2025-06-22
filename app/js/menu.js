// ---- Константы и кэш селекторов -----------------------------------------
const BREAKPOINT = 1200;
const $body = $('body');
const $header = $('.header');
const $burger = $('.header__burger');
const $nav = $('.header .nav');
const $overlay = $('.menu-overlay');

// ---- Хелперы -------------------------------------------------------------
/** Скрывает все подменю и сбрасывает у всех пунктов .active */
function closeAllSubmenus() {
  $nav
      .find('.menu-item.active').removeClass('active').end()
      .find('.sub-menu').stop(true, true).hide();
}

/** Закрыть главное меню */
function closeMenu() {
  closeAllSubmenus();
  $burger.removeClass('active');
  $header.removeClass('active');
  $nav.removeClass('active');
  $overlay.removeClass('active');
  $body.removeClass('lock-scroll');
}

/** Открыть главное меню */
function openMenu() {
  closeAllSubmenus();
  $burger.addClass('active');
  $header.addClass('active');
  $nav.addClass('active');
  $overlay.addClass('active');
  $body.addClass('lock-scroll');
}

// ---- Мобильная навигация -----------------------------------------------
function bindMobile() {
  // гарантированно скрываем все подменю
  closeAllSubmenus();

  // клик по бургеру и оверлею
  $burger.on('click.mobile', () => {
    $header.hasClass('active') ? closeMenu() : openMenu();
  });
  $overlay.on('click.mobile', closeMenu);

  // делегируем клик на пункты меню
  $nav.on('click.mobile', '.menu-item > a', function (e) {
    const $item = $(this).parent();
    const $submenu = $item.children('.sub-menu');
    if (!$submenu.length) return; // если нет подменю — обычная ссылка

    e.preventDefault();
    // свернём все соседи
    $item
        .siblings('.menu-item')
        .removeClass('active')
        .children('.sub-menu')
        .stop(true, true)
        .slideUp(200);

    // переключим текущее
    $item.toggleClass('active');
    $submenu.stop(true, true).slideToggle(200);
  });
}

function unbindMobile() {
  // снимаем только пространство имён .mobile
  $burger.off('.mobile');
  $overlay.off('.mobile');
  $nav.off('.mobile');
  // и закрываем меню
  closeMenu();

  // сбрасываем все инлайн-свойства, которые мешают десктоп-CSS
  $nav.find('.sub-menu').css({
    display: '',
    visibility: '',
    opacity: '',
    transform: ''
  });
}

// ---- breakpoint через matchMedia ----------------------------------------
const mq = window.matchMedia(`(max-width: ${ BREAKPOINT - 1 }px)`);

/** Вызывается при изменении ширины */
function handleBreakpoint(e) {
  if (e.matches) {
    bindMobile();
  } else {
    unbindMobile();
    // десктопный показ подменю идёт через CSS :hover,
    // поэтому JS ничего не делает
  }
}

// подписываемся на события (новые и старые браузеры)
if (mq.addEventListener) {
  mq.addEventListener('change', handleBreakpoint);
} else if (mq.addListener) {
  mq.addListener(handleBreakpoint);
}

// первичная инициализация
handleBreakpoint(mq);
