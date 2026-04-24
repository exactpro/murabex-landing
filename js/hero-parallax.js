/* Hero dunes parallax — scroll only (desktop) */
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const img = document.querySelector('.hero-bg-image');
    const hero = document.getElementById('hero');
    if (!img || !hero) return;

    const SCROLL_SPEED = 0.35;
    let ticking = false;

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(render);
            ticking = true;
        }
    }

    function render() {
        ticking = false;
        if (window.innerWidth < 900) {
            img.style.transform = '';
            return;
        }
        const rect = hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = -rect.top * SCROLL_SPEED;
        img.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    render();
})();
