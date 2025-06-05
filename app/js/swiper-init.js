// let introSwiper = null;
//
// function initIntroSwiper() {
//     const isMobile = window.innerWidth < 768;
//     if (isMobile && !introSwiper) {
//         introSwiper = new Swiper('.intro__cards.swiper', {
//             pagination: {
//                 el: '.intro__cards .swiper-pagination',
//                 clickable: true,
//             },
//             slidesPerView: 1.2,
//             spaceBetween: 16,
//         });
//     }
//     if (!isMobile && introSwiper) {
//         introSwiper.destroy(true, true);
//         introSwiper = null;
//     }
// }
//
// window.addEventListener('load', initIntroSwiper);
// window.addEventListener('resize', initIntroSwiper);




// const swiperElement = document.querySelector(".swiper");
// const swiperWrapper = swiperElement.querySelector(".swiper-wrapper");
// const swiperSlides = swiperElement.querySelectorAll(".swiper-slide");
// swiperSlides.forEach((slide,_) => {
//     const clonedSlide = slide.cloneNode(true);
//     swiperWrapper.appendChild(clonedSlide);
// });

const swiper = new Swiper('.swiper.intro__cards', {
    // Optional parameters
    // direction: 'vertical',
    loop: true,
    slidesPerView: 4, // 'auto'
    spaceBetween: 20,


    // If we need pagination
    pagination: {
        el: '.swiper-pagination.intro__cards',
    },
});