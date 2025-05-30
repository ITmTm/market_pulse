// берём сам элемент один раз
const header = document.querySelector('.header');

let lastScroll = 0;                   // предыдущее положение «колеса»

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;   // где мы сейчас

    // === 1. когда пользователь скроллит ВНИЗ — прячем шапку
    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add('header--hidden');

        // === 2. когда скроллит ВВЕРХ — показываем
    } else if (currentScroll < lastScroll) {
        header.classList.remove('header--hidden');
    }

    lastScroll = currentScroll;         // запоминаем позицию
});