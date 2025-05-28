let introSwiper = null;

function initIntroSwiper() {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !introSwiper) {
        introSwiper = new Swiper('.intro__cards.swiper', {
            pagination: {
                el: '.intro__cards .swiper-pagination',
                clickable: true,
            },
            slidesPerView: 1.2,
            spaceBetween: 16,
        });
    }
    if (!isMobile && introSwiper) {
        introSwiper.destroy(true, true);
        introSwiper = null;
    }
}

window.addEventListener('load', initIntroSwiper);
window.addEventListener('resize', initIntroSwiper);