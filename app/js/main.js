// Бургер
document.querySelector('svg')
    .addEventListener('click', function () {
      this.classList.toggle('active')
    });



// Вращение заднего фона страницы
const bg = document.querySelector('.main-bg');
let latestScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
  latestScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const angle = latestScrollY * 0.08;
      bg.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      ticking = false;
    });
    ticking = true;
  }
});