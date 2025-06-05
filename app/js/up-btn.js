// скролл для header
const header = document.querySelector('.header');

function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', onScroll);
onScroll();




// кнопка наверх

$(window).on('scroll', trackScroll);
$('.upButton').on('click', backToTop);

function trackScroll() {
    let scrolled = window.scrollY;

    if (scrolled > 100) {
        $('.upButton').addClass('show');
        $('.header').addClass('scrolled');
    }
    if (scrolled < 100) {
        $('.upButton').removeClass('show');
        $('.header').removeClass('scrolled');
    }
}

function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}