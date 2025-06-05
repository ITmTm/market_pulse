const swiper = new Swiper('.swiper.intro__cards', {
    // mobile
    slidesPerView: 1, // 'auto'
    spaceBetween: 20,
    loop: true,


    // If we need pagination
    pagination: {
        el: '.swiper-pagination.intro__cards',
        clickable: true,
    },

    breakpoints: {
        992: {
            /*  десктоп  */
            enabled: false,        // ← главный переключатель!
            slidesPerView: 4,
            loop: false,
            allowTouchMove: false,
            keyboard: { enabled: false },
            a11y: { enabled: false },
        },
    },
});