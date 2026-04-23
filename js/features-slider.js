/* Features mobile slider — hide scroll hint when at end */
(function () {
    const slider = document.querySelector('.features-slider');
    if (!slider) return;
    const grid = slider.querySelector('.features-grid');
    if (!grid) return;

    function update() {
        const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
        slider.classList.toggle('is-at-end', atEnd);
    }

    grid.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
