// Вращение заднего фона страницы
const bg = document.querySelector('.main-bg');
let latestScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const angle = latestScrollY * 0.08;
            bg.style.transform = `translate(-50%, -50%) rotate(${ angle }deg)`;
            ticking = false;
        });
        ticking = true;
    }
});

const base = {
    loop: false,
    spaceBetween: 20,

}
const introSwiper = new Swiper('.intro__cards', {
    // «десктоп»-режим
    ...base,
    slidesPerView: 4,

    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
        993: { centeredSlides: false, slidesPerView: 2.5 },
        1200: { centeredSlides: false, slidesPerView: 4 },
    },

    pagination: {
        el: '.intro__cards-pagination',
        clickable: true
    }
});

const trustSwiper = new Swiper('.trust__cards', {
    ...base,
    slidesPerView: 4,
    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
        993: { centeredSlides: false, slidesPerView: 2.5 },
        1200: { centeredSlides: false, slidesPerView: 4 },
    },
    pagination: {
        el: '.trust__cards-pagination',
        clickable: true
    }
});


const tariffsSwiper = new Swiper('.conditions-tariffs__cards', {
    ...base,
    slidesPerView: 3,           // desktopSlides = 3
    breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.conditions-tariffs__cards-pagination',
        clickable: true
    }
});

const conditionsIntroSwiper = new Swiper('.conditions-intro__cards', {
    ...base,
    slidesPerView: 4,
    breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.conditions-info__cards-pagination',
        clickable: true
    }
});


const platformSwiper = new Swiper('.platform-intro__cards', {
    ...base,
    slidesPerView: 4,
    breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.platform-info__cards-pagination',
        clickable: true
    }
});


const forecastsSwiper = new Swiper('.forecasts-intro__cards', {
    ...base,
    slidesPerView: 4,
    breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.forecasts-intro__cards-pagination',
        clickable: true
    }
});


const newsSwiper = new Swiper('.news-intro__cards', {
    ...base,
    slidesPerView: 4,
    breakpoints: {
        0: { slidesPerView: 1, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.news-intro__cards-pagination',
        clickable: true
    }
});

const documentsSwiper = new Swiper('.documents-intro__cards', {
    ...base,
    slidesPerView: 3,
    breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true },
        993: { centeredSlides: false }
    },
    pagination: {
        el: '.documents-intro__cards-pagination',
        clickable: true
    }
})


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


// Бургер
document.querySelector('svg')
        .addEventListener('click', function () {
            this.classList.toggle('active')
        });

