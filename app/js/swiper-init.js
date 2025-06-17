/** helper: слайдер, если контейнер есть в DOM
 *  mobileOnly = true  → на десктопе спит (enabled:false)
 *  mobileOnly = false → активен и на десктопе
 */
function makeSwiper(rootSel, pagSel, mobileOnly = false, desktopSlides = 4, loop = true) {
    const root = document.querySelector(rootSel);
    if (!root) return;                       // на этой странице блока нет

    new Swiper(root, {
        slidesPerView: 1.1,
        spaceBetween: 60,
        centeredSlides: true,

        loop: loop,		// бесконечный цикл (переключение слайдеров)
        pagination: { el: pagSel, clickable: true },

        breakpoints: {
            993: {
                enabled: !mobileOnly,              // главное условие
                slidesPerView: desktopSlides,
                centeredSlides: false,			   // Отвечает за центрирование
                spaceBetween: 20,
                allowTouchMove: !mobileOnly,
                keyboard: { enabled: !mobileOnly },
                a11y: { enabled: !mobileOnly },
            },
        },


    });
}

/* --- index.html --- mobile-only слайдеры */
makeSwiper('.intro__cards', '.swiper-pagination.intro__cards', true, 4, false);
makeSwiper('.trust__cards', '.swiper-pagination.trust__cards', true, 4, false);
makeSwiper('.conditions-tariffs__cards', '.swiper-pagination.conditions-tariffs__cards', true, 3);
makeSwiper('.conditions-intro__cards', '.swiper-pagination.conditions-info__cards', true);
makeSwiper('.platform-intro__cards', '.swiper-pagination.platform-info__cards', true);
makeSwiper('.forecasts-intro__cards', '.swiper-pagination.forecasts-intro__cards', true);
makeSwiper('.news-intro__cards', '.swiper-pagination.news-intro__cards', true);

/* --- documents.html (или другая страница) --- */
makeSwiper('.documents-intro__cards', '.swiper-pagination.documents-intro__cards', false, 3, false);


/* --- instruments.html --- */		// Универсальная обобщенная функция, подходит если используется связка в других местах
function makeLinkedSwipers(tabsSelector, contentSelector) {
    const section = document.querySelector('.instruments-tabs');
    const container = document.querySelector('.instruments-tabs__container');
    const tabs = document.querySelector(tabsSelector);
    const pages = document.querySelector(contentSelector);
    if (!tabs || !pages || !container || !pages) return;

    const bgList = [
        '../images/instruments-currency-bg.avif',
        '../images/instruments-stocks-bg.avif',
        '../images/instruments-crypto-bg.avif',
        '../images/instruments-commodities-bg.avif',
        '../images/instruments-indices-bg.avif'
    ];

    const isDesktop = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    // разрешение свайпа только на мобилках
    const allowTouch = !isDesktop;

    const swiperBtns = new Swiper(tabs, {
        slidesPerView: 5,
        spaceBetween: 10,
        watchSlidesProgress: true,
        slideToClickedSlide: true,		// Переключение по клику


        freeMode: allowTouch,			// только на мобилках - свободное листание списка
        allowTouchMove: allowTouch,		// полностью дизейбл перетаскивание
        simulateTouch: true,

        breakpoints: {
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
        }

    });

    const swiperPage = new Swiper(pages, {
        spaceBetween: 100,
        thumbs: {
            swiper: swiperBtns,
        },
        simulateTouch: true,
        allowTouchMove: allowTouch,

    });

    // удаление tabindex у оберток, чтобы Tab не мог зацепиться за них
    if (isDesktop) {
        swiperBtns.slides.forEach(s => s.removeAttribute('tabindex'));
        swiperPage.slides.forEach(s => s.removeAttribute('tabindex'));
    }

    // смена фона у контейнера при каждом слайде
    swiperPage.on('slideChange', () => {
        const idx = swiperPage.activeIndex;
        const url = bgList[idx] || bgList[0];
        container.style.transition = 'background-image .4s ease-in-out';
        container.style.backgroundImage = `url('${ url }')`;
    });
    // сразу запускает один раз чтобы установить стартовый фон
    swiperPage.emit('slideChange');
}

makeLinkedSwipers('.swiper-btns', '.swiper-page');