/** helper: слайдер, если контейнер есть в DOM
 *  mobileOnly = true  → на десктопе спит (enabled:false)
 *  mobileOnly = false → активен и на десктопе
 */
function makeSwiper(rootSel, pagSel, mobileOnly = false) {
	const root = document.querySelector(rootSel);
	if (!root) return;                       // на этой странице блока нет

	new Swiper(root, {
		slidesPerView: 'auto',
		spaceBetween: 20,
		loop: true,		// бесконечный цикл (переключение слайдеров)
		pagination: { el: pagSel, clickable: true },

		breakpoints: {
			992: {
				enabled: !mobileOnly,              // главное условие
				slidesPerView: 4,
				loop: true,
				allowTouchMove: !mobileOnly,
				keyboard:   { enabled: !mobileOnly },
				a11y:       { enabled: !mobileOnly },
			},
		},
	});
}

/* --- index.html --- mobile-only слайдеры */
makeSwiper('.intro__cards',    '.swiper-pagination.intro__cards', true);
makeSwiper('.trust__cards',    '.swiper-pagination.trust__cards', true);
makeSwiper('.conditions-tariffs__cards',    '.swiper-pagination.conditions-tariffs__cards', true);
makeSwiper('.conditions-intro__cards',    '.swiper-pagination.conditions-info__cards', true);

/* --- documents.html (или другая страница) --- */
makeSwiper('.documents-intro__cards','.swiper-pagination.documents-intro__cards', false);